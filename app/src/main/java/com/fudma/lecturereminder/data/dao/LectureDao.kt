package com.fudma.lecturereminder.data.dao

import androidx.room.*
import com.fudma.lecturereminder.data.entity.Lecture
import kotlinx.coroutines.flow.Flow

@Dao
interface LectureDao {
    @Query("SELECT * FROM lectures ORDER BY dayOfWeek, startTime ASC")
    fun getAllLectures(): Flow<List<Lecture>>

    @Query("SELECT * FROM lectures WHERE dayOfWeek = :day ORDER BY startTime ASC")
    fun getLecturesForDay(day: String): Flow<List<Lecture>>

    @Query("SELECT * FROM lectures WHERE id = :id")
    suspend fun getLectureById(id: Long): Lecture?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLecture(lecture: Lecture): Long

    @Update
    suspend fun updateLecture(lecture: Lecture)

    @Delete
    suspend fun deleteLecture(lecture: Lecture)

    @Query("SELECT * FROM lectures WHERE dayOfWeek = :day AND startTime = :startTime LIMIT 1")
    suspend fun getDuplicateEntry(day: String, startTime: String): Lecture?
}