package com.mcs

import android.content.pm.ApplicationInfo
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
import java.io.ByteArrayOutputStream
import java.security.MessageDigest
import android.content.pm.PackageInfo
import android.content.pm.PermissionInfo

class InstalledAppsModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "InstalledApps"
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
                    val hex = Integer.toHexString(0xFF and b.toInt()).toUpperCase()
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

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm: PackageManager = reactContext.packageManager
            val apps: List<ApplicationInfo> = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            val resultArray: WritableArray = Arguments.createArray()

            for (appInfo in apps) {
                if (pm.getLaunchIntentForPackage(appInfo.packageName) == null) continue

                val appMap: WritableMap = Arguments.createMap().apply {
                    putString("packageName", appInfo.packageName)
                    putString("name", pm.getApplicationLabel(appInfo)?.toString() ?: "")
                }

                // App icon
                drawableToBitmap(pm.getApplicationIcon(appInfo))?.let { bitmap ->
                    ByteArrayOutputStream().use { baos ->
                        bitmap.compress(Bitmap.CompressFormat.PNG, 100, baos)
                        appMap.putString("icon", Base64.encodeToString(baos.toByteArray(), Base64.DEFAULT))
                    }
                } ?: appMap.putString("icon", "")

                // Permissions
                val controllablePermissions = Arguments.createArray().apply {
                    try {
                        val pkgInfo = pm.getPackageInfo(
                            appInfo.packageName,
                            PackageManager.GET_PERMISSIONS
                        )
                        pkgInfo.requestedPermissions?.forEach { permissionName: String ->
                            try {
                                val permissionInfo = pm.getPermissionInfo(permissionName, 0)
                                if (permissionInfo.protectionLevel and PermissionInfo.PROTECTION_DANGEROUS != 0) {
                                    val granted = pm.checkPermission(
                                        permissionName,
                                        appInfo.packageName
                                    ) == PackageManager.PERMISSION_GRANTED

                                    val permissionMap = Arguments.createMap().apply {
                                        putString("name", permissionName)
                                        putBoolean("granted", granted)
                                        putString("description", permissionInfo.loadDescription(pm)?.toString() ?: "")
                                        putBoolean("dangerous", true)
                                    }

                                    this.pushMap(permissionMap)
                                }
                            } catch (_: Exception) {
                                // Skip invalid permission
                            }
                        }
                    } catch (_: Exception) {
                        // Skip if package info not found
                    }
                }

                appMap.putArray("controllablePermissions", controllablePermissions)

                // SHA-256 fingerprint
                appMap.putString("sha256", getSHA256Signature(appInfo.packageName) ?: "")

                resultArray.pushMap(appMap)
            }

            promise.resolve(resultArray)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}
