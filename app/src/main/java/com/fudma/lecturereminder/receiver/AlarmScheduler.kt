package com.fudma.lecturereminder.receiver

import android.annotation.SuppressLint
import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import com.fudma.lecturereminder.data.entity.Lecture
import java.util.*

class AlarmScheduler(private val context: Context) {
    private val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    @SuppressLint("ScheduleExactAlarm")
    fun scheduleAlarmForLecture(lecture: Lecture) {
        val intent = Intent(context, AlarmReceiver::class.java).apply {
            putExtra("LECTURE_ID", lecture.id)
            putExtra("COURSE_CODE", lecture.courseCode)
            putExtra("COURSE_TITLE", lecture.courseTitle)
            putExtra("VENUE", lecture.venue)
            putExtra("LECTURER", lecture.lecturer)
            putExtra("REMINDER_MINUTES", lecture.reminderMinutes)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            lecture.id.toInt(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val triggerTime = calculateTriggerTime(lecture.dayOfWeek, lecture.startTime, lecture.reminderMinutes)
        
        if (triggerTime > System.currentTimeMillis()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    triggerTime,
                    pendingIntent
                )
            } else {
                alarmManager.setExact(
                    AlarmManager.RTC_WAKEUP,
                    triggerTime,
                    pendingIntent
                )
            }
        }
    }

    fun cancelAlarmForLecture(lecture: Lecture) {
        val intent = Intent(context, AlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            lecture.id.toInt(),
            intent,
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
        )
        if (pendingIntent != null) {
            alarmManager.cancel(pendingIntent)
        }
    }

    private fun calculateTriggerTime(dayOfWeek: String, startTime: String, reminderMinutes: Int): Long {
        val parts = startTime.split(":")
        val hour = parts[0].toInt()
        val minute = parts[1].toInt()

        val calendar = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
            add(Calendar.MINUTE, -reminderMinutes)
        }

        val targetDay = when (dayOfWeek.lowercase()) {
            "sunday" -> Calendar.SUNDAY
            "monday" -> Calendar.MONDAY
            "tuesday" -> Calendar.TUESDAY
            "wednesday" -> Calendar.WEDNESDAY
            "thursday" -> Calendar.THURSDAY
            "friday" -> Calendar.FRIDAY
            "saturday" -> Calendar.SATURDAY
            else -> Calendar.MONDAY
        }

        val currentDay = calendar.get(Calendar.DAY_OF_WEEK)
        var daysDiff = targetDay - currentDay
        if (daysDiff < 0 || (daysDiff == 0 && calendar.timeInMillis < System.currentTimeMillis())) {
            daysDiff += 7
        }
        calendar.add(Calendar.DAY_OF_YEAR, daysDiff)

        return calendar.timeInMillis
    }
}