package com.mcs

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
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
import android.util.Log

class WifiModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val wifiManager: WifiManager =
        reactContext.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager

    override fun getName(): String = "WifiModule"

    @ReactMethod
    fun scanWifiNetworks(promise: Promise) {
        try {
            val scanResultsReceiver = object : BroadcastReceiver() {
                override fun onReceive(context: Context, intent: Intent) {
                    try {
                        val results: List<ScanResult> = wifiManager.scanResults
                        val wifiArray: WritableArray = Arguments.createArray()
                        for (result in results) {
                            Log.d("WifiResult", result.toString())
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
                    } finally {
                        reactContext.unregisterReceiver(this)
                    }
                }
            }
            val intentFilter = IntentFilter(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION)
            reactContext.registerReceiver(scanResultsReceiver, intentFilter)

            val scanStarted = wifiManager.startScan()
            if (!scanStarted) {
                reactContext.unregisterReceiver(scanResultsReceiver)
                promise.reject("ERROR", "Failed to start WiFi scan")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    // New function: Get current connected WiFi network information
    @ReactMethod
    fun getCurrentWifiInfo(promise: Promise) {
        try {
            val wifiInfo: WifiInfo = wifiManager.connectionInfo
            if (wifiInfo.networkId == -1) {
                promise.reject("ERROR", "No WiFi connection")
                return
            }

            val currentSSID = wifiInfo.ssid.trim('"')
            val currentBSSID = wifiInfo.bssid

            // Try to match connected BSSID to ScanResults to get capabilities
            val scanResults = wifiManager.scanResults
            var capabilities = ""
            for (result in scanResults) {
                if (result.BSSID.equals(currentBSSID, ignoreCase = true)) {
                    capabilities = result.capabilities
                    break
                }
            }

            val securityRating = calculateSecurityRating(capabilities)

            val map: WritableMap = Arguments.createMap()
            map.putString("SSID", currentSSID)
            map.putString("BSSID", currentBSSID)
            map.putInt("rssi", wifiInfo.rssi)
            map.putInt("linkSpeedMbps", wifiInfo.linkSpeed)
            map.putInt("frequencyMHz", wifiInfo.frequency)
            map.putInt("networkId", wifiInfo.networkId)
            map.putString("ipAddress", formatIpAddress(wifiInfo.ipAddress))
            map.putString("capabilities", capabilities)
            map.putInt("securityRating", securityRating)
            map.putBoolean("isSecure", securityRating > 1)

            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }


    private fun calculateSecurityRating(capabilities: String): Int {
        val cap = capabilities.uppercase()
        return when {
            cap.contains("WPA3") -> 5
            cap.contains("WPA2") -> 4
            cap.contains("WPA") -> 3
            cap.contains("WEP") -> 2
            else -> 1
        }
    }

    private fun formatIpAddress(ip: Int): String {
        return String.format(
            "%d.%d.%d.%d",
            ip and 0xff,
            ip shr 8 and 0xff,
            ip shr 16 and 0xff,
            ip shr 24 and 0xff
        )
    }
}
