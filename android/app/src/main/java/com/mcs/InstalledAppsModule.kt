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

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm: PackageManager = reactContext.packageManager
            val apps: List<ApplicationInfo> = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            val resultArray: WritableArray = Arguments.createArray()

            for (appInfo in apps) {
                val appMap: WritableMap = Arguments.createMap()
                val packageName = appInfo.packageName
                appMap.putString("packageName", packageName)

                // Get the application label (name)
                val label = pm.getApplicationLabel(appInfo)
                appMap.putString("name", label?.toString() ?: "")

                // Convert the app icon to a Base64 string using the helper function
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

                // Get permissions for the app
                try {
                    val pkgInfo = pm.getPackageInfo(packageName, PackageManager.GET_PERMISSIONS)
                    val permissionsArray: WritableArray = Arguments.createArray()
                    pkgInfo.requestedPermissions?.forEach { permission ->
                        permissionsArray.pushString(permission)
                    }
                    appMap.putArray("permissions", permissionsArray)
                } catch (e: PackageManager.NameNotFoundException) {
                    appMap.putArray("permissions", Arguments.createArray())
                }

                resultArray.pushMap(appMap)
            }

            promise.resolve(resultArray)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}
