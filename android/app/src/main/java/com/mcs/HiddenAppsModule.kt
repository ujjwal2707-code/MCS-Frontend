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

    /**
     * Retrieves a list of hidden user-installed apps.
     * Hidden apps here are defined as apps that do not have a launcher intent (i.e. no icon in the launcher)
     * and are not system apps.
     */
    @ReactMethod
   fun getHiddenApps(promise: Promise) {
        try {
            val pm: PackageManager = reactApplicationContext.packageManager
            // Retrieve all installed applications.
            val installedApps: List<ApplicationInfo> =
                pm.getInstalledApplications(PackageManager.GET_META_DATA)
            // Filter apps: Only include those with no launcher intent and that are user-installed.
            val hiddenApps = installedApps.filter { appInfo ->
                // Check that there is no launch intent for the package
                val noLauncher = pm.getLaunchIntentForPackage(appInfo.packageName) == null
                // Check that the app is NOT a system app. (FLAG_SYSTEM set means system app.)
                val isUserApp = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) == 0
                noLauncher && isUserApp
            }
            // Convert the filtered list into a WritableArray to return to JavaScript.
            val resultArray = Arguments.createArray()
            for (app in hiddenApps) {
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
