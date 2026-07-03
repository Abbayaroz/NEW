package com.fudma.lecturereminder.data.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "lectures")
data class Lecture(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val courseCode: String,
    val courseTitle: String,
    val lecturer: String,
    val dayOfWeek: String, // "Monday", "Tuesday", etc.
    val startTime: String, // "HH:mm" (24-hour format)
    val endTime: String,   // "HH:mm" (24-hour format)
    val venue: String,
    val reminderMinutes: Int // 5, 15, 30, 60 minutes
)