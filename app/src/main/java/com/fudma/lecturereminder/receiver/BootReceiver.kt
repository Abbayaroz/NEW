package com.fudma.lecturereminder.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.fudma.lecturereminder.data.database.AppDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            val scheduler = AlarmScheduler(context)
            val database = AppDatabase.getDatabase(context)

            // Query all scheduled lectures in IO Coroutine scope and reschedule them
            CoroutineScope(Dispatchers.IO).launch {
                val lecturesList = database.lectureDao().getAllLectures().first()
                for (lecture in lecturesList) {
                    scheduler.scheduleAlarmForLecture(lecture)
                }
            }
        }
    }
}