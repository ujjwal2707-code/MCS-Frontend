package com.mcs

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.ConnectivityManager
import android.net.NetworkInfo
import android.net.wifi.ScanResult
import android.net.wifi.WifiInfo
import android.net.wifi.WifiManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap

class WifiModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val wifiManager: WifiManager =
        reactContext.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager

    override fun getName(): String = "WifiModule"

    // Uses a BroadcastReceiver to listen for scan results.
    @ReactMethod
    fun scanWifiNetworks(promise: Promise) {
        try {
            // Create and register the BroadcastReceiver
            val scanResultsReceiver = object : BroadcastReceiver() {
                override fun onReceive(context: Context, intent: Intent) {
                    try {
                        val results: List<ScanResult> = wifiManager.scanResults
                        val wifiArray: WritableArray = Arguments.createArray()
                        for (result in results) {
                            val map: WritableMap = Arguments.createMap()
                            map.putString("SSID", result.SSID)      // WiFi network name
                            map.putString("BSSID", result.BSSID)
                            map.putString("capabilities", result.capabilities)
                            map.putInt("frequency", result.frequency)
                            map.putInt("level", result.level)
                            // timestamp in microseconds (result.timestamp is already in microseconds)
                            map.putDouble("timestamp", result.timestamp.toDouble())

                            // Calculate security rating and secure flag.
                            val rating = calculateSecurityRating(result.capabilities)
                            map.putInt("securityRating", rating)
                            map.putBoolean("isSecure", rating > 1)

                            wifiArray.pushMap(map)
                        }
                        promise.resolve(wifiArray)
                    } catch (e: Exception) {
                        promise.reject("ERROR", e)
                    } finally {
                        // Always unregister the receiver to avoid leaks
                        reactContext.unregisterReceiver(this)
                    }
                }
            }
            val intentFilter = IntentFilter(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION)
            reactContext.registerReceiver(scanResultsReceiver, intentFilter)

            // Initiate a new WiFi scan.
            val scanStarted = wifiManager.startScan()
            if (!scanStarted) {
                reactContext.unregisterReceiver(scanResultsReceiver)
                promise.reject("ERROR", "Failed to start WiFi scan")
            }
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
