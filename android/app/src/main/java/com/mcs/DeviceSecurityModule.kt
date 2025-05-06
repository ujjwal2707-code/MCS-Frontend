package com.mcs

import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.NetworkInfo
import android.net.wifi.WifiConfiguration
import android.net.wifi.WifiManager
import android.os.Bundle
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.concurrent.TimeUnit

class DeviceSecurityModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private val DANGEROUS_PERMS = listOf(
            android.Manifest.permission.READ_SMS,
            android.Manifest.permission.ACCESS_FINE_LOCATION,
            android.Manifest.permission.CAMERA,
            android.Manifest.permission.RECORD_AUDIO
        )
        
        private const val OUTDATED_THRESHOLD_DAYS = 730L // 2 years
    }

    override fun getName() = "DeviceSecurityModule"

    @ReactMethod
    fun checkRiskyConnection(promise: Promise) {
        try {
            val context = reactApplicationContext
            val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
                ?: throw Exception("Connectivity service not available")
            
            val networkInfo = connectivityManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI)
                ?: throw Exception("Wifi network info not available")

            val isRisky = when {
                networkInfo.isConnected -> {
                    val wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as? WifiManager
                        ?: throw Exception("Wifi service not available")
                    
                    wifiManager.connectionInfo?.networkId?.let { networkId ->
                        isNetworkOpen(wifiManager, networkId)
                    } ?: false
                }
                else -> false
            }
            
            promise.resolve(isRisky)
        } catch (e: Exception) {
            promise.reject("CONNECTION_ERROR", e.message ?: "Unknown connection error", e)
        }
    }

    private fun isNetworkOpen(wifiManager: WifiManager, networkId: Int): Boolean {
        return wifiManager.configuredNetworks
            ?.firstOrNull { it.networkId == networkId }
            ?.let { config ->
                config.allowedKeyManagement.get(WifiConfiguration.KeyMgmt.NONE) &&
                !config.allowedAuthAlgorithms.get(WifiConfiguration.AuthAlgorithm.OPEN)
            } ?: false
    }

    @ReactMethod
    fun getPermissionMisuseList(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            
            val result = mutableListOf<Bundle>().apply {
                apps.forEach { app ->
                    val dangerousPerms = try {
                        pm.getPackageInfo(app.packageName, PackageManager.GET_PERMISSIONS)
                            .requestedPermissions
                            ?.filter { DANGEROUS_PERMS.contains(it) }
                            ?.toList() ?: emptyList()
                    } catch (e: Exception) {
                        emptyList()
                    }

                    if (dangerousPerms.isNotEmpty()) {
                        add(Bundle().apply {
                            putString("appName", app.loadLabel(pm).toString())
                            putString("packageName", app.packageName)
                            putStringArrayList("permissions", ArrayList(dangerousPerms))
                        })
                    }
                }
            }
            
            promise.resolve(Arguments.fromList(result))
        } catch (e: Exception) {
            promise.reject("PERMISSION_ERROR", e.message ?: "Unknown error", e)
        }
    }

    @ReactMethod
    fun getPermissionMisuseCount(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            
            val count = apps.count { app ->
                try {
                    pm.getPackageInfo(app.packageName, PackageManager.GET_PERMISSIONS)
                        .requestedPermissions
                        ?.any { DANGEROUS_PERMS.contains(it) } ?: false
                } catch (e: Exception) {
                    false
                }
            }
            
            promise.resolve(count)
        } catch (e: Exception) {
            promise.reject("PERMISSION_COUNT_ERROR", e.message ?: "Unknown error", e)
        }
    }

    @ReactMethod
    fun getOutdatedAppsCount(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val threshold = System.currentTimeMillis() - TimeUnit.DAYS.toMillis(OUTDATED_THRESHOLD_DAYS)
            
            val count = pm.getInstalledApplications(PackageManager.GET_META_DATA)
                .count { app ->
                    try {
                        val pkgInfo = pm.getPackageInfo(app.packageName, 0)
                        pkgInfo.lastUpdateTime < threshold
                    } catch (e: PackageManager.NameNotFoundException) {
                        false
                    }
                }
            
            promise.resolve(count)
        } catch (e: Exception) {
            promise.reject("OUTDATED_APPS_ERROR", e.message ?: "Unknown outdated apps error", e)
        }
    }
}