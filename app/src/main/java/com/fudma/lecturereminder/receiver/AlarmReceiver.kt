package com.fudma.lecturereminder.receiver

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import android.os.Vibrator
import android.os.VibrationEffect
import androidx.core.app.NotificationCompat
import com.fudma.lecturereminder.MainActivity
import com.fudma.lecturereminder.R

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val courseCode = intent.getStringExtra("COURSE_CODE") ?: "CSC 205"
        val courseTitle = intent.getStringExtra("COURSE_TITLE") ?: "Operations Research"
        val venue = intent.getStringExtra("VENUE") ?: "Smart Lab"
        val lecturer = intent.getStringExtra("LECTURER") ?: "Mr. Sulaiman Muhammad Garba"
        val reminderMinutes = intent.getIntExtra("REMINDER_MINUTES", 15)

        // Read dynamic preferences for sound/vibe (simulated in device SharedPreferences)
        val prefs = context.getSharedPreferences("notification_settings", Context.MODE_PRIVATE)
        val remindersEnabled = prefs.getBoolean("reminders_enabled", true)
        if (!remindersEnabled) return

        val vibeEnabled = prefs.getBoolean("vibrate_enabled", true)
        val soundEnabled = prefs.getBoolean("sound_enabled", true)

        val channelId = "fudma_lecture_reminders"
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Lecture Reminders",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Periodic reminders before university lectures start"
                enableVibration(vibeEnabled)
                if (!soundEnabled) {
                    setSound(null, null)
                }
            }
            notificationManager.createNotificationChannel(channel)
        }

        val mainActivityIntent = Intent(context, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            mainActivityIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val message = "$courseCode – $courseTitle starts in $reminderMinutes minutes at $venue. Lecturer: $lecturer."

        val builder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("Upcoming Lecture Reminder")
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)

        if (soundEnabled) {
            val alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            builder.setSound(alarmSound)
        }

        notificationManager.notify(System.currentTimeMillis().toInt(), builder.build())

        // Explicitly trigger a brief vibration if enabled and legacy OS
        if (vibeEnabled) {
            val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createOneShot(500, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator.vibrate(500)
            }
        }
    }
}