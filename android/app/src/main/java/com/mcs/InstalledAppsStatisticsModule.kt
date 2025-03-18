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
    fun getInstalledApps(promise: Promise) {
        try {
            // Check if the app has usage stats permission
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

                val now = System.currentTimeMillis()
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

                resultArray.pushMap(appMap)
            }

            promise.resolve(resultArray)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}