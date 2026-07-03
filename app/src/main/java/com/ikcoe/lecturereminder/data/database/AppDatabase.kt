package com.ikcoe.lecturereminder.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.ikcoe.lecturereminder.data.dao.LectureDao
import com.ikcoe.lecturereminder.data.entity.Lecture

@Database(entities = [Lecture::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun lectureDao(): LectureDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "ikcoe_lecture_reminder_db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}