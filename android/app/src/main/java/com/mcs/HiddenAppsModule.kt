package com.mcs

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager

class HiddenAppsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "HiddenAppsModule"
    }

    @ReactMethod
    fun getHiddenApps(promise: Promise) {
        try {
            val pm: PackageManager = reactApplicationContext.packageManager
            val installedApps: List<ApplicationInfo> = pm.getInstalledApplications(PackageManager.GET_META_DATA)

            val hiddenApps = installedApps.filter { appInfo ->
                // 1. App has no launcher intent
                val noLauncher = pm.getLaunchIntentForPackage(appInfo.packageName) == null

                // 2. Is not a system or updated system app
                val isSystemApp = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0
                val isUpdatedSystemApp = (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0
                val isUserApp = !isSystemApp && !isUpdatedSystemApp

                // 3. Exclude known system packages explicitly
                val systemPrefixes = listOf(
                    "com.android.", "com.google.android.", "android", "com.qualcomm.", "com.samsung.","com.samsung.android."
                )
                val isKnownSystemPackage = systemPrefixes.any { appInfo.packageName.startsWith(it) }

                // 4. Extra safeguard for system partition
                val isInSystemPartition = appInfo.sourceDir.startsWith("/system/") ||
                                        appInfo.sourceDir.startsWith("/vendor/") ||
                                        appInfo.sourceDir.startsWith("/product/")

                noLauncher && isUserApp && !isInSystemPartition && !isKnownSystemPackage
            }

            val resultArray = Arguments.createArray()
            hiddenApps.forEach { app ->
                val appMap = Arguments.createMap()
                appMap.putString("packageName", app.packageName)
                appMap.putString("appName", pm.getApplicationLabel(app).toString())
                resultArray.pushMap(appMap)
            }

            promise.resolve(resultArray)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}