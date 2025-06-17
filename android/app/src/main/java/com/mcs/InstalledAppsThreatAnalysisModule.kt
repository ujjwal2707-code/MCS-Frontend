package com.mcs

import android.content.pm.ApplicationInfo
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.AdaptiveIconDrawable
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.os.Build
import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream

class InstalledAppsThreatAnalysisModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val ICON_SIZE_DP = 64
        private const val DEFAULT_ICON_QUALITY = 75

        // Known safe app stores
        private val SAFE_INSTALLERS = setOf(
            "com.android.vending",           // Google Play Store
            "com.amazon.venezia",            // Amazon App Store
            "com.sec.android.app.samsungapps", // Samsung Galaxy Store
            "com.huawei.appmarket",         // Huawei App Gallery
            "com.xiaomi.market",            // Mi Store
            "com.oneplus.market",           // OnePlus Store
            "com.bbk.appstore",             // Vivo Store
            "com.oppo.market",              // OPPO Store
            "com.heytap.market"             // OPPO/Realme Store
        )

        // Whitelist of known legitimate apps
        private val LEGITIMATE_APPS = setOf(
            "com.whatsapp",                // WhatsApp
            "com.instagram.android",        // Instagram
            "com.facebook.katana",         // Facebook
            "com.facebook.orca",           // Facebook Messenger
            "com.google.android.youtube",   // YouTube
            "com.google.android.gm",       // Gmail
            "com.google.android.apps.maps", // Google Maps
            "com.spotify.music",           // Spotify
            "com.netflix.mediaclient",     // Netflix
            "com.amazon.mShop.android.shopping", // Amazon
            "com.microsoft.teams",         // Microsoft Teams
            "com.microsoft.office.outlook", // Microsoft Outlook
            "com.linkedin.android",        // LinkedIn
            "com.twitter.android",         // Twitter
            "com.snapchat.android",        // Snapchat
            "com.pinterest",               // Pinterest
            "com.zhiliaoapp.musically",    // TikTok
            "org.telegram.messenger",      // Telegram
            "com.discord"                  // Discord
        )
    }

    override fun getName() = "InstalledAppsThreatAnalysis"

    private fun dpToPx(dp: Int): Int {
        return (dp * reactContext.resources.displayMetrics.density).toInt()
    }

    private fun drawableToBitmap(drawable: Drawable): Bitmap? {
        return try {
            when {
                drawable is BitmapDrawable -> drawable.bitmap
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && drawable is AdaptiveIconDrawable -> {
                    val iconSize = dpToPx(ICON_SIZE_DP)
                    Bitmap.createBitmap(iconSize, iconSize, Bitmap.Config.ARGB_8888).also { bitmap ->
                        val canvas = Canvas(bitmap)
                        drawable.setBounds(0, 0, canvas.width, canvas.height)
                        drawable.draw(canvas)
                    }
                }
                else -> {
                    val iconSize = dpToPx(ICON_SIZE_DP)
                    Bitmap.createBitmap(iconSize, iconSize, Bitmap.Config.ARGB_8888).also { bitmap ->
                        val canvas = Canvas(bitmap)
                        drawable.setBounds(0, 0, canvas.width, canvas.height)
                        drawable.draw(canvas)
                    }
                }
            }
        } catch (e: Exception) {
            null
        }
    }

    private fun isSystemApp(appInfo: ApplicationInfo): Boolean {
        return (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0 ||
               (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0
    }

    private fun isFromUntrustedSource(pm: PackageManager, packageName: String): Boolean {
        // Don't check source for legitimate apps
        if (LEGITIMATE_APPS.contains(packageName)) {
            return false
        }

        return try {
            val installerPackage = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                pm.getInstallSourceInfo(packageName).initiatingPackageName
            } else {
                @Suppress("DEPRECATION")
                pm.getInstallerPackageName(packageName)
            }
            installerPackage == null || !SAFE_INSTALLERS.contains(installerPackage)
        } catch (e: Exception) {
            // For legitimate apps, don't consider installer check failure as untrusted
            LEGITIMATE_APPS.contains(packageName).not()
        }
    }

    private fun checkMaliciousIndicators(pm: PackageManager, packageInfo: PackageInfo, appInfo: ApplicationInfo): Pair<Boolean, List<String>> {
        val reasons = mutableListOf<String>()

        // Skip checks for legitimate apps
        if (LEGITIMATE_APPS.contains(packageInfo.packageName)) {
            return Pair(false, reasons)
        }

        // Check if app is from untrusted source
        if (isFromUntrustedSource(pm, packageInfo.packageName)) {
            reasons.add("App installed from unofficial source")
        }

        // Check if app has debug flag enabled
        if ((appInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
            reasons.add("App has debug mode enabled")
        }

        return Pair(reasons.isNotEmpty(), reasons)
    }

    @ReactMethod
    fun getInstalledApps(includeIcons: Boolean, promise: Promise) {
        CoroutineScope(Dispatchers.Default).launch {
            try {
                val result = processApps(includeIcons)
                withContext(Dispatchers.Main) {
                    promise.resolve(result)
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    promise.reject("ERROR", e)
                }
            }
        }
    }

    private suspend fun processApps(includeIcons: Boolean): WritableArray {
        return withContext(Dispatchers.IO) {
            val pm = reactContext.packageManager
            val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            val resultArray = Arguments.createArray()

            apps.forEach { appInfo ->
                // Skip system apps
                if (isSystemApp(appInfo)) return@forEach

                val appMap: WritableMap = Arguments.createMap()
                try {
                    val packageInfo = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                        pm.getPackageInfo(appInfo.packageName, PackageManager.GET_SIGNING_CERTIFICATES)
                    } else {
                        @Suppress("DEPRECATION")
                        pm.getPackageInfo(appInfo.packageName, PackageManager.GET_SIGNATURES)
                    }

                    val (isMalicious, reasons) = checkMaliciousIndicators(pm, packageInfo, appInfo)
                    
                    appMap.apply {
                        putString("packageName", appInfo.packageName)
                        putString("name", pm.getApplicationLabel(appInfo).toString())
                        putString("versionName", packageInfo.versionName)
                        putString("versionCode", packageInfo.longVersionCode.toString())
                        putBoolean("isMalicious", isMalicious)
                        putArray("reasons", Arguments.fromList(reasons))
                        
                        // Get installer package
                        val installer = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                            pm.getInstallSourceInfo(appInfo.packageName).initiatingPackageName ?: "unknown"
                        } else {
                            @Suppress("DEPRECATION")
                            pm.getInstallerPackageName(appInfo.packageName) ?: "unknown"
                        }
                        putString("installer", installer)

                        if (includeIcons) {
                            val icon: Bitmap? = drawableToBitmap(pm.getApplicationIcon(appInfo))
                            if (icon != null) {
                                ByteArrayOutputStream().use { baos ->
                                    icon.compress(Bitmap.CompressFormat.WEBP, DEFAULT_ICON_QUALITY, baos)
                                    putString(
                                        "icon",
                                        Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP)
                                    )
                                }
                            } else {
                                putString("icon", "")
                            }
                        }
                    }

                    resultArray.pushMap(appMap)
                } catch (e: Exception) {
                    // Skip apps that we can't analyze
                }
            }

            resultArray
        }
    }
}
