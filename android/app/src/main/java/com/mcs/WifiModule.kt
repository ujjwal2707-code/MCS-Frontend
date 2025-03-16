package com.mcs

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkInfo
import android.net.wifi.ScanResult
import android.net.wifi.WifiManager
import android.net.wifi.WifiInfo
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap

class WifiModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val wifiManager: WifiManager = reactContext.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager

    override fun getName(): String = "WifiModule"

    // Returns a list of nearby WiFi networks.
    // Each network includes: SSID, BSSID, capabilities, frequency, level, timestamp,
    // isSecure: Boolean, and securityRating: Int (1-5).
    @ReactMethod
    fun scanWifiNetworks(promise: Promise) {
    try {
        // Start a new WiFi scan
        wifiManager.startScan()
        // Delay for a short period to allow the scan to complete.
        // Note: In production, consider using a BroadcastReceiver.
        Thread.sleep(2000) // 2 seconds delay (not recommended for production use)
        
        val results: List<ScanResult> = wifiManager.scanResults
        val wifiArray: WritableArray = Arguments.createArray()
        for (result in results) {
            val map: WritableMap = Arguments.createMap()
            map.putString("SSID", result.SSID)
            map.putString("BSSID", result.BSSID)
            map.putString("capabilities", result.capabilities)
            map.putInt("frequency", result.frequency)
            map.putInt("level", result.level)
            map.putDouble("timestamp", result.timestamp.toDouble())
            
            val rating = calculateSecurityRating(result.capabilities)
            map.putInt("securityRating", rating)
            map.putBoolean("isSecure", rating > 1)
            
            wifiArray.pushMap(map)
        }
        promise.resolve(wifiArray)
    } catch (e: Exception) {
        promise.reject("ERROR", e)
    }
}

    // Returns the IP (as an integer) of the currently connected WiFi network.
    @ReactMethod
    fun getIP(promise: Promise) {
        try {
            val wifiInfo: WifiInfo = wifiManager.connectionInfo
            val ipInt: Int = wifiInfo.ipAddress
            promise.resolve(ipInt)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    // Returns whether the device is connected to a WiFi network.
    @ReactMethod
    fun connectionStatus(promise: Promise) {
        try {
            val cm = reactContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            val activeNetwork: NetworkInfo? = cm.activeNetworkInfo
            val isConnected = activeNetwork != null && activeNetwork.isConnected &&
                              activeNetwork.type == ConnectivityManager.TYPE_WIFI
            promise.resolve(isConnected)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    // Disconnects from the currently connected WiFi network.
    @ReactMethod
    fun disconnect(promise: Promise) {
        try {
            val result = wifiManager.disconnect()
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    // Helper function to calculate security rating based on capabilities.
    // Returns a rating from 1 (open network) to 5 (most secure).
    private fun calculateSecurityRating(capabilities: String): Int {
        val cap = capabilities.uppercase()
        return when {
            cap.contains("WPA3") -> 5
            cap.contains("WPA2") -> 4
            cap.contains("WPA") -> 3
            cap.contains("WEP") -> 2
            else -> 1  // Open network
        }
    }
}
