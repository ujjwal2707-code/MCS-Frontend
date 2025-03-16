package com.mcs

import android.app.KeyguardManager
import android.bluetooth.BluetoothAdapter
import android.content.Context
import android.content.pm.PackageManager
import android.nfc.NfcAdapter
import android.os.Build
import android.os.Environment
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File

class SecurityCheckModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val context: Context = reactContext

    override fun getName(): String {
        return "SecurityCheckModule"
    }

    // Check if the device is rooted
    @ReactMethod
    fun isRooted(promise: Promise) {
        try {
            val rootStatus = checkRootMethod1() || checkRootMethod2() || checkRootMethod3()
            promise.resolve(rootStatus)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    private fun checkRootMethod1(): Boolean {
        val paths = arrayOf(
            "/system/app/Superuser.apk", "/sbin/su", "/system/bin/su",
            "/system/xbin/su", "/data/local/xbin/su", "/data/local/bin/su",
            "/system/sd/xbin/su", "/system/bin/failsafe/su"
        )
        return paths.any { File(it).exists() }
    }

    private fun checkRootMethod2(): Boolean {
        return try {
            Runtime.getRuntime().exec(arrayOf("/system/xbin/which", "su"))
                .inputStream.bufferedReader().readLine() != null
        } catch (e: Exception) {
            false
        }
    }

    private fun checkRootMethod3(): Boolean {
        return Build.TAGS?.contains("test-keys") == true
    }

    // Check if USB Debugging is enabled
    @ReactMethod
    fun isUSBDebuggingEnabled(promise: Promise) {
        try {
            val adbStatus = Settings.Secure.getInt(context.contentResolver, Settings.Secure.ADB_ENABLED, 0) == 1
            promise.resolve(adbStatus)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    // Check if Bluetooth is enabled
    @ReactMethod
    fun isBluetoothEnabled(promise: Promise) {
        val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
        promise.resolve(bluetoothAdapter?.isEnabled == true)
    }

    // Check if NFC is enabled
    @ReactMethod
    fun isNFCEnabled(promise: Promise) {
        val nfcAdapter = NfcAdapter.getDefaultAdapter(context)
        promise.resolve(nfcAdapter?.isEnabled == true)
    }

    // Check if Play Protect is enabled
    @ReactMethod
    fun isPlayProtectEnabled(promise: Promise) {
        val playProtect = context.packageManager.hasSystemFeature(PackageManager.FEATURE_DEVICE_ADMIN)
        promise.resolve(playProtect)
    }

    // Check if Lock Screen is enabled
    @ReactMethod
    fun isLockScreenEnabled(promise: Promise) {
        val keyguardManager = context.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
        promise.resolve(keyguardManager.isKeyguardSecure)
    }

    // Check if device encryption is enabled
    @ReactMethod
    fun isDeviceEncrypted(promise: Promise) {
        val encrypted = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                Environment.isExternalStorageEmulated()
        promise.resolve(encrypted)
    }

    // Check if Developer Mode is enabled
    @ReactMethod
    fun isDeveloperModeEnabled(promise: Promise) {
        val devMode = Settings.Secure.getInt(context.contentResolver, Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 0) == 1
        promise.resolve(devMode)
    }

    // Check if "Show Password" is enabled
    @ReactMethod
    fun isShowPasswordEnabled(promise: Promise) {
        val showPass = Settings.System.getInt(context.contentResolver, Settings.System.TEXT_SHOW_PASSWORD, 1) == 1
        promise.resolve(showPass)
    }

    // Check if Lock Screen Notifications are enabled
    @ReactMethod
    fun isLockScreenNotificationsEnabled(promise: Promise) {
        val lockScreenNotifications = Settings.Secure.getInt(context.contentResolver, "lock_screen_show_notifications", 1) == 1
        promise.resolve(lockScreenNotifications)
    }
}
