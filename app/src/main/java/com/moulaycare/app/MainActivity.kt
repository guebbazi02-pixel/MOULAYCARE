package com.moulaycare.app

import android.Manifest
import android.annotation.SuppressLint
import android.app.AlarmManager
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.provider.MediaStore
import android.provider.Settings
import android.util.Base64
import android.view.View
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.widget.FrameLayout
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import java.io.File

class MainActivity : AppCompatActivity() {

    private lateinit var web: WebView
    private var fileCallback: ValueCallback<Array<Uri>>? = null
    private var cameraUri: Uri? = null
    private var pendingBackup: String? = null
    private var pendingApptId: String? = null
    private var pageReady = false

    companion object {
        const val HOST = "appassets.androidplatform.net"
        const val START_URL = "https://$HOST/assets/www/index.html"
        const val EXTRA_APPT = "apptId"
    }

    // اختيار ملف أو التقاط صورة بالكاميرا
    private val pickFile = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { res ->
        var uris = WebChromeClient.FileChooserParams.parseResult(res.resultCode, res.data)
        if ((uris == null || uris.isEmpty()) && res.resultCode == RESULT_OK && cameraUri != null) {
            uris = arrayOf(cameraUri!!)
        }
        fileCallback?.onReceiveValue(uris)
        fileCallback = null
    }

    private val notifPermission = registerForActivityResult(ActivityResultContracts.RequestPermission()) { }

    private val saveBackupDoc = registerForActivityResult(ActivityResultContracts.CreateDocument("application/json")) { uri ->
        val data = pendingBackup
        pendingBackup = null
        if (uri != null && data != null) {
            try {
                contentResolver.openOutputStream(uri)?.use { it.write(data.toByteArray()) }
                Toast.makeText(this, "تم حفظ النسخة الاحتياطية", Toast.LENGTH_LONG).show()
            } catch (e: Exception) {
                Toast.makeText(this, "تعذّر حفظ الملف", Toast.LENGTH_LONG).show()
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // واجهة من الحافة للحافة مع شريط حالة بلون التطبيق
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val root = FrameLayout(this).apply { setBackgroundColor(Color.WHITE) }
        val statusBg = View(this).apply { setBackgroundColor(ContextCompat.getColor(this@MainActivity, R.color.primary_dark)) }
        web = WebView(this)
        root.addView(web, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        root.addView(statusBg, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0))
        setContentView(root)

        WindowInsetsControllerCompat(window, root).apply {
            isAppearanceLightStatusBars = false
            isAppearanceLightNavigationBars = true
        }
        ViewCompat.setOnApplyWindowInsetsListener(root) { _, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
            statusBg.layoutParams = (statusBg.layoutParams as FrameLayout.LayoutParams).apply { height = bars.top }
            (web.layoutParams as FrameLayout.LayoutParams).apply {
                topMargin = bars.top
                bottomMargin = maxOf(bars.bottom, ime.bottom)
                leftMargin = bars.left
                rightMargin = bars.right
            }
            web.requestLayout()
            WindowInsetsCompat.CONSUMED
        }

        // تحميل الواجهة من ملفات التطبيق (يعمل بدون إنترنت)
        val loader = WebViewAssetLoader.Builder()
            .setDomain(HOST)
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = false
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false
            textZoom = 100
        }
        web.overScrollMode = View.OVER_SCROLL_NEVER
        web.setBackgroundColor(Color.parseColor("#F3F7F8"))

        web.webViewClient = object : WebViewClientCompat() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                loader.shouldInterceptRequest(request.url)

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                if (request.url.host == HOST) return false
                openExternal(request.url.toString())
                return true
            }

            override fun onPageFinished(view: WebView, url: String?) {
                pageReady = true
                pendingApptId?.let { openApptInPage(it) }
            }
        }

        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(view: WebView, callback: ValueCallback<Array<Uri>>, params: FileChooserParams): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                val accept = params.acceptTypes.filter { it.isNotBlank() }.flatMap { it.split(",") }.map { it.trim() }
                val isJson = accept.any { it.contains("json") }
                val content = Intent(Intent.ACTION_GET_CONTENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                    if (!isJson) putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("image/*", "application/pdf"))
                }
                val extras = mutableListOf<Intent>()
                cameraUri = null
                if (!isJson) {
                    try {
                        val dir = File(cacheDir, "camera").apply { mkdirs() }
                        val f = File(dir, "photo_${System.currentTimeMillis()}.jpg")
                        val uri = FileProvider.getUriForFile(this@MainActivity, "$packageName.files", f)
                        cameraUri = uri
                        extras += Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
                            putExtra(MediaStore.EXTRA_OUTPUT, uri)
                            addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION or Intent.FLAG_GRANT_READ_URI_PERMISSION)
                        }
                    } catch (_: Exception) { }
                }
                val chooser = Intent.createChooser(content, "إرفاق ملف").apply {
                    if (extras.isNotEmpty()) putExtra(Intent.EXTRA_INITIAL_INTENTS, extras.toTypedArray())
                }
                return try {
                    pickFile.launch(chooser); true
                } catch (e: ActivityNotFoundException) {
                    fileCallback = null; false
                }
            }
        }

        web.addJavascriptInterface(Bridge(), "Android")

        // زر الرجوع: يُغلق النوافذ أو يرجع للشاشة السابقة داخل التطبيق
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                web.evaluateJavascript("(window.mcBack && window.mcBack()) ? 'y' : 'n'") { r ->
                    if (r == null || !r.contains("y")) moveTaskToBack(true)
                }
            }
        })

        pendingApptId = intent?.getStringExtra(EXTRA_APPT)
        if (savedInstanceState != null) web.restoreState(savedInstanceState) else web.loadUrl(START_URL)

        askNotificationPermission()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        intent.getStringExtra(EXTRA_APPT)?.let { if (pageReady) openApptInPage(it) else pendingApptId = it }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        web.saveState(outState)
    }

    private fun openApptInPage(id: String) {
        pendingApptId = null
        val safe = id.replace(Regex("[^A-Za-z0-9_]"), "")
        web.postDelayed({ web.evaluateJavascript("window.mcOpenAppt && window.mcOpenAppt('$safe')", null) }, 900)
    }

    private fun askNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33 &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) notifPermission.launch(Manifest.permission.POST_NOTIFICATIONS)
    }

    private fun openExternal(url: String) {
        try {
            val i = if (url.startsWith("tel:")) Intent(Intent.ACTION_DIAL, Uri.parse(url))
            else Intent(Intent.ACTION_VIEW, Uri.parse(url))
            startActivity(i)
        } catch (e: ActivityNotFoundException) {
            Toast.makeText(this, "لا يوجد تطبيق لفتح هذا الرابط", Toast.LENGTH_SHORT).show()
        }
    }

    /** الجسر بين واجهة التطبيق (JavaScript) ونظام أندرويد */
    inner class Bridge {
        @JavascriptInterface
        fun setReminders(json: String) {
            ReminderScheduler.replaceAll(applicationContext, json)
        }

        @JavascriptInterface
        fun openUrl(url: String) = runOnUiThread { openExternal(url) }

        @JavascriptInterface
        fun vibrate() {
            try {
                val v = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
                v.vibrate(VibrationEffect.createOneShot(35, VibrationEffect.DEFAULT_AMPLITUDE))
            } catch (_: Exception) { }
        }

        @JavascriptInterface
        fun requestPermissions() = runOnUiThread {
            askNotificationPermission()
            if (Build.VERSION.SDK_INT >= 31) {
                val am = getSystemService(Context.ALARM_SERVICE) as AlarmManager
                if (!am.canScheduleExactAlarms()) {
                    try {
                        startActivity(Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM, Uri.parse("package:$packageName")))
                        return@runOnUiThread
                    } catch (_: Exception) { }
                }
            }
            try {
                startActivity(Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE, packageName))
            } catch (_: Exception) { }
        }

        @JavascriptInterface
        fun shareFile(dataUrl: String, name: String) {
            try {
                val comma = dataUrl.indexOf(',')
                val mime = dataUrl.substring(5, dataUrl.indexOf(';')).ifBlank { "application/octet-stream" }
                val bytes = Base64.decode(dataUrl.substring(comma + 1), Base64.DEFAULT)
                val dir = File(cacheDir, "shared").apply { mkdirs() }
                val safeName = name.replace(Regex("[\\\\/:*?\"<>|]"), "_")
                val f = File(dir, safeName).apply { writeBytes(bytes) }
                val uri = FileProvider.getUriForFile(this@MainActivity, "$packageName.files", f)
                val view = Intent(Intent.ACTION_VIEW).setDataAndType(uri, mime).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                val send = Intent(Intent.ACTION_SEND).setType(mime).putExtra(Intent.EXTRA_STREAM, uri).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                val chooser = Intent.createChooser(send, "مشاركة أو فتح الملف").putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(view))
                runOnUiThread { startActivity(chooser) }
            } catch (e: Exception) {
                runOnUiThread { Toast.makeText(this@MainActivity, "تعذّرت مشاركة الملف", Toast.LENGTH_SHORT).show() }
            }
        }

        @JavascriptInterface
        fun saveBackup(json: String, fileName: String) {
            pendingBackup = json
            runOnUiThread { saveBackupDoc.launch(fileName) }
        }
    }
}
