package com.mcs

import android.content.pm.ApplicationInfo
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.content.pm.PermissionInfo
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

        // Define a set of high risk permissions.
        private val HIGH_RISK_PERMISSIONS = setOf(
            "android.permission.READ_CALL_LOG",
            "android.permission.RECORD_AUDIO",
            "android.permission.WRITE_CONTACTS",
            "android.permission.WRITE_EXTERNAL_STORAGE",
            "android.permission.ACCESS_COARSE_LOCATION"
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

    // Helper function to check if a permission is classified as dangerous.
    private fun isPermissionDangerous(pm: PackageManager, permission: String): Boolean {
        return try {
            val permissionInfo = pm.getPermissionInfo(permission, 0)
            permissionInfo.protectionLevel and PermissionInfo.PROTECTION_DANGEROUS != 0
        } catch (e: PackageManager.NameNotFoundException) {
            false
        }
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

    // Process apps with refined risk determination.
    private suspend fun processApps(includeIcons: Boolean): WritableArray {
        return withContext(Dispatchers.IO) {
            val pm = reactContext.packageManager
            val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            val resultArray = Arguments.createArray()

            apps.forEach { appInfo ->
                // Only process launchable apps.
                if (pm.getLaunchIntentForPackage(appInfo.packageName) == null) return@forEach

                val appMap: WritableMap = Arguments.createMap()
                appMap.putString("packageName", appInfo.packageName)
                appMap.putString("name", pm.getApplicationLabel(appInfo).toString())

                try {
                    val packageInfo: PackageInfo =
                        pm.getPackageInfo(appInfo.packageName, PackageManager.GET_PERMISSIONS)
                    val permissions: List<String> =
                        packageInfo.requestedPermissions?.toList() ?: emptyList()

                    // Count dangerous permissions using the dynamic check.
                    // val dangerousPermissionCount = permissions.count { isPermissionDangerous(pm, it) }
                    // val hasHighRiskPermission = permissions.any { HIGH_RISK_PERMISSIONS.contains(it) }

                    val hasHighRiskPermission = permissions.count { HIGH_RISK_PERMISSIONS.contains(it) }
                   // val isRisky = hasHighRiskPermission || dangerousPermissionCount > 5
                   
                    val isRisky = hasHighRiskPermission > 15
                    appMap.putBoolean("isRisky", isRisky)
                    appMap.putArray("permissions", Arguments.fromList(permissions))
                    // Placeholder for signature hash.
                    appMap.putString("sha256", "")

                    if (includeIcons) {
                        val icon: Bitmap? = drawableToBitmap(pm.getApplicationIcon(appInfo))
                        if (icon != null) {
                            ByteArrayOutputStream().use { baos ->
                                icon.compress(Bitmap.CompressFormat.WEBP, DEFAULT_ICON_QUALITY, baos)
                                appMap.putString(
                                    "icon",
                                    Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP)
                                )
                            }
                        } else {
                            appMap.putString("icon", "")
                        }
                    }
                } catch (e: PackageManager.NameNotFoundException) {
                    appMap.putBoolean("isRisky", false)
                    appMap.putArray("permissions", Arguments.createArray())
                    appMap.putString("sha256", "")
                }

                resultArray.pushMap(appMap)
            }

            resultArray
        }
    }
}
