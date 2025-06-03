package com.mcs

import android.app.AppOpsManager
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.AdaptiveIconDrawable
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.os.Build
import android.text.format.DateFormat
import android.util.Base64
import android.content.Intent
import android.provider.Settings
import android.net.TrafficStats
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import java.io.ByteArrayOutputStream
import java.security.MessageDigest
import java.util.Locale
import android.os.SystemClock
import android.app.usage.NetworkStatsManager
import android.app.usage.NetworkStats
import android.net.ConnectivityManager
import android.telephony.TelephonyManager

class InstalledAppsStatisticsModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "InstalledAppsStatistics"
    }

    // Helper function to check if the app has usage stats permission
    private fun hasUsageStatsPermission(context: Context): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            android.os.Process.myUid(),
            context.packageName
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }

    // Helper function to convert a Drawable to a Bitmap.
    private fun drawableToBitmap(drawable: Drawable): Bitmap? {
        return when {
            drawable is BitmapDrawable -> drawable.bitmap
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && drawable is AdaptiveIconDrawable -> {
                val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 1
                val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 1
                val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(bitmap)
                drawable.setBounds(0, 0, canvas.width, canvas.height)
                drawable.draw(canvas)
                bitmap
            }
            else -> {
                val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 1
                val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 1
                val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(bitmap)
                drawable.setBounds(0, 0, canvas.width, canvas.height)
                drawable.draw(canvas)
                bitmap
            }
        }
    }

    // Helper function to get the SHA-256 fingerprint of an app's signing certificate.
    private fun getSHA256Signature(packageName: String): String? {
        return try {
            val pm = reactContext.packageManager
            val packageInfo = pm.getPackageInfo(
                packageName,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
                    PackageManager.GET_SIGNING_CERTIFICATES
                else
                    PackageManager.GET_SIGNATURES
            )
            val signatures = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                packageInfo.signingInfo?.apkContentsSigners ?: emptyArray()
            } else {
                packageInfo.signatures ?: emptyArray()
            }
            if (signatures.isNotEmpty()) {
                val cert = signatures[0].toByteArray()
                val md = MessageDigest.getInstance("SHA-256")
                val digest = md.digest(cert)
                val hexString = StringBuilder()
                for (b in digest) {
                    val hex = Integer.toHexString(0xFF and b.toInt()).uppercase(Locale.ROOT)
                    if (hex.length == 1) hexString.append("0")
                    hexString.append(hex)
                }
                hexString.toString()
            } else {
                null
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    // Helper function to format time in milliseconds to a readable string.
    private fun formatTime(millis: Long): String {
        return if (millis > 0) DateFormat.format("yyyy-MM-dd HH:mm:ss", millis).toString() else ""
    }

    // Helper function to query usage stats and sum the foreground time for a given package.
    private fun getUsageTimeForPackage(packageName: String, startTime: Long, endTime: Long): Long {
        val usageStatsManager =
            reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
            // Aggregate the usage stats over the given period to avoid overlapping intervals.
            val aggregatedStats = usageStatsManager.queryAndAggregateUsageStats(startTime, endTime)
            aggregatedStats[packageName]?.totalTimeInForeground ?: 0L
        } else {
            // Fallback for older devices: sum the daily stats.
            val usageStatsList: List<UsageStats> = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY, startTime, endTime
            )
            usageStatsList.filter { it.packageName == packageName }
                .sumOf { it.totalTimeInForeground }
        }
    }

    // Helper function to get the last time the app was used within a given period.
    private fun getLastUsageForPackage(packageName: String, startTime: Long, endTime: Long): Long {
        val usageStatsManager =
            reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val usageStatsList: List<UsageStats> = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY, startTime, endTime
        )
        var lastTimeUsed = 0L
        usageStatsList.forEach { stats ->
            if (stats.packageName == packageName && stats.lastTimeUsed > lastTimeUsed) {
                lastTimeUsed = stats.lastTimeUsed
            }
        }
        return lastTimeUsed
    }

    // Helper function to get data usage (in MB) for a UID for a specific time period
    private fun getDataUsageForUid(context: Context, uid: Int, startTime: Long, endTime: Long): Pair<Double, Double> {
        var txBytes = 0L
        var rxBytes = 0L

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                val networkStatsManager =
                    context.getSystemService(Context.NETWORK_STATS_SERVICE) as NetworkStatsManager
                val bucket = NetworkStats.Bucket()

                // Query Wi-Fi data usage
                val wifiStats = networkStatsManager.queryDetailsForUid(
                    ConnectivityManager.TYPE_WIFI,
                    "", // subscriberId not needed for Wi-Fi
                    startTime,
                    endTime,
                    uid
                )
                while (wifiStats.hasNextBucket()) {
                    wifiStats.getNextBucket(bucket)
                    txBytes += bucket.txBytes
                    rxBytes += bucket.rxBytes
                }
                wifiStats.close()

                // Query Mobile data usage
                val telephonyManager =
                    context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
                val networkOperator = telephonyManager.networkOperator ?: ""
                val mobileStats = networkStatsManager.queryDetailsForUid(
                    ConnectivityManager.TYPE_MOBILE,
                    networkOperator,
                    startTime,
                    endTime,
                    uid
                )
                while (mobileStats.hasNextBucket()) {
                    mobileStats.getNextBucket(bucket)
                    txBytes += bucket.txBytes
                    rxBytes += bucket.rxBytes
                }
                mobileStats.close()
            } catch (ex: Exception) {
                ex.printStackTrace()
            }
        } else {
            // For older devices, fallback to TrafficStats (less accurate as it's since device boot)
            txBytes = TrafficStats.getUidTxBytes(uid)
            rxBytes = TrafficStats.getUidRxBytes(uid)
        }
        // Convert to megabytes
        val txMB = if (txBytes < 0) 0.0 else txBytes.toDouble() / (1024 * 1024)
        val rxMB = if (rxBytes < 0) 0.0 else rxBytes.toDouble() / (1024 * 1024)
        return Pair(txMB, rxMB)
    }

    // Helper function to get data usage for different time periods
    private fun getPeriodicDataUsage(context: Context, uid: Int): Map<String, Pair<Double, Double>> {
        val now = System.currentTimeMillis()
        val oneDayAgo = now - 24 * 60 * 60 * 1000L
        val sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000L
        val thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000L

        return mapOf(
            "daily" to getDataUsageForUid(context, uid, oneDayAgo, now),
            "weekly" to getDataUsageForUid(context, uid, sevenDaysAgo, now),
            "monthly" to getDataUsageForUid(context, uid, thirtyDaysAgo, now)
        )
    }

    @ReactMethod
    fun checkUsageStatsPermission(promise: Promise) {
        try {
            val granted = hasUsageStatsPermission(reactContext)
            promise.resolve(granted)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    @ReactMethod
    fun openUsageAccessSettings() {
        try {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            reactContext.startActivity(intent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun getAppUpdates(promise: Promise) {
        try {
            val pm: PackageManager = reactContext.packageManager
            val apps: List<ApplicationInfo> = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            
            val past1Month: WritableArray = Arguments.createArray()
            val past3Month: WritableArray = Arguments.createArray()
            val past6Month: WritableArray = Arguments.createArray()
            
            val currentTime = System.currentTimeMillis()
            val oneMonthMillis = 30L * 24 * 60 * 60 * 1000
            val threeMonthMillis = 90L * 24 * 60 * 60 * 1000
            val sixMonthMillis = 180L * 24 * 60 * 60 * 1000

            for (appInfo in apps) {
                if (pm.getLaunchIntentForPackage(appInfo.packageName) == null) continue

                try {
                    val pkgInfo = pm.getPackageInfo(appInfo.packageName, 0)
                    val lastUpdateTime = pkgInfo.lastUpdateTime
                    val diff = currentTime - lastUpdateTime

                    val appMap: WritableMap = Arguments.createMap()
                    appMap.putString("packageName", appInfo.packageName)
                    val label = pm.getApplicationLabel(appInfo)
                    appMap.putString("name", label?.toString() ?: "")
                    appMap.putDouble("lastUpdateTime", lastUpdateTime.toDouble())

                    when {
                        diff > sixMonthMillis -> past6Month.pushMap(appMap)
                        diff > threeMonthMillis -> past3Month.pushMap(appMap)
                        diff > oneMonthMillis -> past1Month.pushMap(appMap)
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }

            val resultMap: WritableMap = Arguments.createMap()
            resultMap.putArray("past1Month", past1Month)
            resultMap.putArray("past3Month", past3Month)
            resultMap.putArray("past6Month", past6Month)

            promise.resolve(resultMap)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            if (!hasUsageStatsPermission(reactContext)) {
                promise.reject("PERMISSION_DENIED", "Usage stats permission not granted. Please enable it in settings.")
                return
            }

            val pm: PackageManager = reactContext.packageManager
            val apps: List<ApplicationInfo> = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            val resultArray: WritableArray = Arguments.createArray()

            for (appInfo in apps) {
                if (pm.getLaunchIntentForPackage(appInfo.packageName) == null) {
                    continue
                }

                val appMap: WritableMap = Arguments.createMap()
                val packageName = appInfo.packageName
                appMap.putString("packageName", packageName)

                val label = pm.getApplicationLabel(appInfo)
                appMap.putString("name", label?.toString() ?: "")

                val iconDrawable = pm.getApplicationIcon(appInfo)
                val bitmap: Bitmap? = drawableToBitmap(iconDrawable)
                if (bitmap != null) {
                    val baos = ByteArrayOutputStream()
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, baos)
                    val encodedIcon = Base64.encodeToString(baos.toByteArray(), Base64.DEFAULT)
                    appMap.putString("icon", encodedIcon)
                } else {
                    appMap.putString("icon", "")
                }

                try {
                    val pkgInfo = pm.getPackageInfo(packageName, PackageManager.GET_PERMISSIONS)
                    val permissionsArray: WritableArray = Arguments.createArray()
                    val permissionsList = pkgInfo.requestedPermissions?.toList() ?: emptyList()
                    permissionsList.forEach { permission ->
                        permissionsArray.pushString(permission)
                    }
                    appMap.putArray("permissions", permissionsArray)
                } catch (e: PackageManager.NameNotFoundException) {
                    appMap.putArray("permissions", Arguments.createArray())
                }

                val sha256 = getSHA256Signature(packageName)
                appMap.putString("sha256", sha256 ?: "")

                val installerSource = pm.getInstallerPackageName(packageName) ?: ""
                appMap.putString("installerSource", installerSource)

                val pkgInfo = pm.getPackageInfo(packageName, PackageManager.GET_META_DATA)
                val installedOn = pkgInfo.firstInstallTime
                appMap.putString("installedOn", formatTime(installedOn))

                appMap.putString("lastUpdateDate", formatTime(pkgInfo.lastUpdateTime))
                appMap.putString("version", pkgInfo.versionName)

                val now = System.currentTimeMillis()
                val oneMonthMillis = 30L * 24 * 60 * 60 * 1000
                val isUpToDate = (now - pkgInfo.lastUpdateTime) < oneMonthMillis
                appMap.putBoolean("isUpToDate", isUpToDate)

                val oneDayAgo = now - 24 * 60 * 60 * 1000L
                val sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000L
                val thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000L

                val lastUsage = getLastUsageForPackage(packageName, thirtyDaysAgo, now)
                appMap.putString("lastUsageDate", formatTime(lastUsage))

                val dailyUsage = getUsageTimeForPackage(packageName, oneDayAgo, now)
                val weeklyUsage = getUsageTimeForPackage(packageName, sevenDaysAgo, now)
                val monthlyUsage = getUsageTimeForPackage(packageName, thirtyDaysAgo, now)
                appMap.putDouble("dailyUsage", dailyUsage.toDouble())
                appMap.putDouble("weeklyUsage", weeklyUsage.toDouble())
                appMap.putDouble("monthlyUsage", monthlyUsage.toDouble())

                // Get periodic data usage (daily, weekly, monthly)
                val dataUsage = getPeriodicDataUsage(reactContext, appInfo.uid)
                
                // Create maps for each period's data usage
                val dailyDataMap = Arguments.createMap().apply {
                    putDouble("transmitted", dataUsage["daily"]?.first ?: 0.0)
                    putDouble("received", dataUsage["daily"]?.second ?: 0.0)
                }
                
                val weeklyDataMap = Arguments.createMap().apply {
                    putDouble("transmitted", dataUsage["weekly"]?.first ?: 0.0)
                    putDouble("received", dataUsage["weekly"]?.second ?: 0.0)
                }
                
                val monthlyDataMap = Arguments.createMap().apply {
                    putDouble("transmitted", dataUsage["monthly"]?.first ?: 0.0)
                    putDouble("received", dataUsage["monthly"]?.second ?: 0.0)
                }
                
                // Add the data usage maps to the app map
                appMap.putMap("dailyDataUsage", dailyDataMap)
                appMap.putMap("weeklyDataUsage", weeklyDataMap)
                appMap.putMap("monthlyDataUsage", monthlyDataMap)

                resultArray.pushMap(appMap)
            }

            promise.resolve(resultArray)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}