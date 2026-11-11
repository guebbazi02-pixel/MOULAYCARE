package com.moulaycare.app

import android.Manifest
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import org.json.JSONArray

/** جدولة تذكيرات المواعيد كإشعارات نظام تعمل حتى والتطبيق مغلق */
object ReminderScheduler {
    private const val PREFS = "moulaycare_reminders"
    private const val KEY = "list"
    const val CHANNEL = "appointments"

    fun replaceAll(ctx: Context, json: String) {
        val prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        // إلغاء التذكيرات السابقة
        prefs.getString(KEY, null)?.let { old ->
            try {
                val arr = JSONArray(old)
                for (i in 0 until arr.length()) cancel(ctx, arr.getJSONObject(i).getString("id"))
            } catch (_: Exception) { }
        }
        prefs.edit().putString(KEY, json).apply()
        scheduleFrom(ctx, json)
    }

    fun rescheduleSaved(ctx: Context) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, null)?.let { scheduleFrom(ctx, it) }
    }

    private fun scheduleFrom(ctx: Context, json: String) {
        val am = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val now = System.currentTimeMillis()
        try {
            val arr = JSONArray(json)
            for (i in 0 until arr.length()) {
                val o = arr.getJSONObject(i)
                val at = o.getDouble("at").toLong()
                if (at <= now) continue
                val pi = pending(ctx, o.getString("id"), o.optString("title"), o.optString("body"))
                val exact = Build.VERSION.SDK_INT < 31 || am.canScheduleExactAlarms()
                if (exact) am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
                else am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
            }
        } catch (_: Exception) { }
    }

    private fun cancel(ctx: Context, id: String) {
        val am = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        am.cancel(pending(ctx, id, "", ""))
    }

    private fun pending(ctx: Context, id: String, title: String, body: String): PendingIntent {
        val i = Intent(ctx, ReminderReceiver::class.java).apply {
            action = "com.moulaycare.REMINDER.$id"
            putExtra("id", id); putExtra("title", title); putExtra("body", body)
        }
        return PendingIntent.getBroadcast(ctx, id.hashCode(), i, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
    }

    fun ensureChannel(ctx: Context) {
        val nm = ctx.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (nm.getNotificationChannel(CHANNEL) == null) {
            nm.createNotificationChannel(NotificationChannel(CHANNEL, "تذكيرات المواعيد", NotificationManager.IMPORTANCE_HIGH).apply {
                description = "تنبيهات قبل مواعيد المرضى"
                enableVibration(true)
            })
        }
    }
}

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        val id = intent.getStringExtra("id") ?: return
        val title = intent.getStringExtra("title") ?: "MOULAYCARE"
        val body = intent.getStringExtra("body") ?: ""
        ReminderScheduler.ensureChannel(ctx)

        if (Build.VERSION.SDK_INT >= 33 &&
            ContextCompat.checkSelfPermission(ctx, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) return

        val apptId = if (id.length > 2 && (id.startsWith("r_") || id.startsWith("n_"))) id.substring(2) else null
        val open = Intent(ctx, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
            apptId?.let { putExtra(MainActivity.EXTRA_APPT, it) }
        }
        val pi = PendingIntent.getActivity(ctx, id.hashCode(), open, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)

        val n = NotificationCompat.Builder(ctx, ReminderScheduler.CHANNEL)
            .setSmallIcon(R.drawable.ic_notification)
            .setColor(ContextCompat.getColor(ctx, R.color.primary))
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setContentIntent(pi)
            .build()
        try { NotificationManagerCompat.from(ctx).notify(id.hashCode(), n) } catch (_: SecurityException) { }
    }
}

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        ReminderScheduler.rescheduleSaved(ctx)
    }
}
