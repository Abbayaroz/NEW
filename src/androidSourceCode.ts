export interface AndroidFile {
  path: string;
  name: string;
  category: string;
  code: string;
}

export const ANDROID_SOURCE_CODE: AndroidFile[] = [
  {
    category: 'Configuration',
    name: 'android.yml (GitHub Actions)',
    path: '.github/workflows/android.yml',
    code: `name: Build Android APK

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch: # Allows manual trigger from the GitHub Actions tab

jobs:
  build:
    name: Build Debug APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
          cache: 'gradle'

      - name: Set up Gradle
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.2'

      - name: Build Debug APK with Gradle
        run: gradle assembleDebug --no-daemon

      - name: Upload Compiled Debug APK
        uses: actions/upload-artifact@v4
        with:
          name: FUDMA-Lecture-Reminder-Debug-APK
          path: app/build/outputs/apk/debug/app-debug.apk
          if-no-files-found: error
          retention-days: 14`
  },
  {
    category: 'Configuration',
    name: 'build.gradle.kts (Module:app)',
    path: 'app/build.gradle.kts',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    id("kotlin-kapt")
}

android {
    namespace = "com.fudma.lecturereminder"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.fudma.lecturereminder"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.1"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    
    // Compose
    implementation(platform("androidx.compose:compose-bom:2023.08.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.7.7")

    // Room Database
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    kapt("androidx.room:room-compiler:$roomVersion")

    // WorkManager
    implementation("androidx.work:work-runtime-ktx:2.9.0")
    
    // Test
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation(platform("androidx.compose:compose-bom:2023.08.00"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}`
  },
  {
    category: 'Configuration',
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.fudma.lecturereminder">

    <!-- Permissions required for Alarms and Reboot support -->
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="FUDMA Lecture Reminder"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.FUDMALectureReminder"
        tools:targetApi="31">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="FUDMA Lecture Reminder"
            android:theme="@style/Theme.FUDMALectureReminder">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- BroadcastReceiver for triggering the alarm notifications -->
        <receiver
            android:name=".receiver.AlarmReceiver"
            android:enabled="true"
            android:exported="false" />

        <!-- BroadcastReceiver for restoring reminders after phone reboot -->
        <receiver
            android:name=".receiver.BootReceiver"
            android:enabled="true"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </receiver>

    </application>

</manifest>`
  },
  {
    category: 'Database & Models',
    name: 'Lecture.kt (Entity)',
    path: 'app/src/main/java/com/fudma/lecturereminder/data/entity/Lecture.kt',
    code: `package com.fudma.lecturereminder.data.entity

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
)`
  },
  {
    category: 'Database & Models',
    name: 'LectureDao.kt (DAO)',
    path: 'app/src/main/java/com/fudma/lecturereminder/data/dao/LectureDao.kt',
    code: `package com.fudma.lecturereminder.data.dao

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
}`
  },
  {
    category: 'Database & Models',
    name: 'AppDatabase.kt',
    path: 'app/src/main/java/com/fudma/lecturereminder/data/database/AppDatabase.kt',
    code: `package com.fudma.lecturereminder.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.fudma.lecturereminder.data.dao.LectureDao
import com.fudma.lecturereminder.data.entity.Lecture

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
                    "fudma_lecture_reminder_db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}`
  },
  {
    category: 'Background Scheduling',
    name: 'AlarmScheduler.kt',
    path: 'app/src/main/java/com/fudma/lecturereminder/receiver/AlarmScheduler.kt',
    code: `package com.fudma.lecturereminder.receiver

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
}`
  },
  {
    category: 'Background Scheduling',
    name: 'AlarmReceiver.kt',
    path: 'app/src/main/java/com/fudma/lecturereminder/receiver/AlarmReceiver.kt',
    code: `package com.fudma.lecturereminder.receiver

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
}`
  },
  {
    category: 'Background Scheduling',
    name: 'BootReceiver.kt (Phone Restart)',
    path: 'app/src/main/java/com/fudma/lecturereminder/receiver/BootReceiver.kt',
    code: `package com.fudma.lecturereminder.receiver

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
}`
  },
  {
    category: 'Theme & Presentation',
    name: 'Color.kt',
    path: 'app/src/main/java/com/fudma/lecturereminder/ui/theme/Color.kt',
    code: `package com.fudma.lecturereminder.ui.theme

import androidx.compose.ui.graphics.Color

// University Style Palette: Greens, Whites, Charcoal
val FudmaGreenPrimary = Color(0xFF1E5631) // Deep Forest Green
val FudmaGreenSecondary = Color(0xFF4C9A2A) // Emerald Green Accent
val FudmaGreenLight = Color(0xFFD0F0C0) // Soft mint green background
val FudmaCharcoal = Color(0xFF1F2937) // Deep Dark Gray
val FudmaLightBg = Color(0xFFF9FAFB) // Warm white background
val FudmaWhite = Color(0xFFFFFFFF)
val FudmaGray = Color(0xFFE5E7EB)
val FudmaSubtext = Color(0xFF6B7280)`
  },
  {
    category: 'Theme & Presentation',
    name: 'Theme.kt',
    path: 'app/src/main/java/com/fudma/lecturereminder/ui/theme/Theme.kt',
    code: `package com.fudma.lecturereminder.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = FudmaGreenSecondary,
    secondary = FudmaGreenLight,
    background = FudmaCharcoal,
    surface = Color(0xFF111827),
    onPrimary = FudmaWhite,
    onBackground = FudmaWhite,
    onSurface = FudmaWhite
)

private val LightColorScheme = lightColorScheme(
    primary = FudmaGreenPrimary,
    secondary = FudmaGreenSecondary,
    background = FudmaLightBg,
    surface = FudmaWhite,
    onPrimary = FudmaWhite,
    onBackground = FudmaCharcoal,
    onSurface = FudmaCharcoal
)

@Composable
fun FUDMALectureReminderTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}`
  },
  {
    category: 'Screens & UI',
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/fudma/lecturereminder/MainActivity.kt',
    code: `package com.fudma.lecturereminder

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.fudma.lecturereminder.ui.screens.*
import com.fudma.lecturereminder.ui.theme.FUDMALectureReminderTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FUDMALectureReminderTheme {
                MainAppContainer()
            }
        }
    }
}

@Composable
fun MainAppContainer() {
    val navController = rememberNavController()
    var currentTab by remember { mutableStateOf("home") }

    Scaffold(
        bottomBar = {
            NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home") },
                    selected = currentTab == "home",
                    onClick = {
                        currentTab = "home"
                        navController.navigate("home")
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.DateRange, contentDescription = "Timetable") },
                    label = { Text("Timetable") },
                    selected = currentTab == "timetable",
                    onClick = {
                        currentTab = "timetable"
                        navController.navigate("timetable")
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.AddCircle, contentDescription = "Add") },
                    label = { Text("Add") },
                    selected = currentTab == "add_lecture",
                    onClick = {
                        currentTab = "add_lecture"
                        navController.navigate("add_lecture")
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Notifications, contentDescription = "Settings") },
                    label = { Text("Settings") },
                    selected = currentTab == "settings",
                    onClick = {
                        currentTab = "settings"
                        navController.navigate("settings")
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
                    label = { Text("Profile") },
                    selected = currentTab == "profile",
                    onClick = {
                        currentTab = "profile"
                        navController.navigate("profile")
                    }
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("home") { DashboardScreen(navController) }
            composable("timetable") { TimetableScreen(navController) }
            composable("add_lecture") { AddEditLectureScreen(navController, null) }
            composable("settings") { SettingsScreen(navController) }
            composable("profile") { ProfileScreen(navController) }
        }
    }
}`
  },
  {
    category: 'Screens & UI',
    name: 'DashboardScreen.kt',
    path: 'app/src/main/java/com/fudma/lecturereminder/ui/screens/DashboardScreen.kt',
    code: `package com.fudma.lecturereminder.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun DashboardScreen(navController: NavController) {
    val currentDate = SimpleDateFormat("EEEE, d MMMM yyyy", Locale.getDefault()).format(Date())
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Welcoming Greeting
        Text(
            text = "Hello, Bashir!",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "Never miss a class again.",
            fontSize = 14.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Today's Date Panel
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Today's Date", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                Text(currentDate, fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Next Upcoming Class & Countdown Timer
        Text("Next Lecture", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "CSC 205",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Box(
                        modifier = Modifier
                            .background(Color(0xFFFF9800), RoundedCornerShape(4.dp))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text("Starts in 15m", color = Color.White, fontSize = 12.sp)
                    }
                }
                Text("Operations Research & Optimisation", fontWeight = FontWeight.Medium)
                Spacer(modifier = Modifier.height(8.dp))
                Row {
                    Text("Venue: ", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                    Text("Smart Lab", fontSize = 13.sp)
                }
                Row {
                    Text("Time: ", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                    Text("10:00 AM - 12:00 PM", fontSize = 13.sp)
                }
                Row {
                    Text("Lecturer: ", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                    Text("Mr. Sulaiman Muhammad Garba", fontSize = 13.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Quick Stats Rows
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Card(
                modifier = Modifier.weight(1f),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Today's Classes", fontSize = 12.sp)
                    Text("3", fontSize = 28.sp, fontWeight = FontWeight.Bold)
                }
            }
            Card(
                modifier = Modifier.weight(1f),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Total Timetable", fontSize = 12.sp)
                    Text("12", fontSize = 28.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}`
  },
  {
    category: 'Resources',
    name: 'data_extraction_rules.xml',
    path: 'app/src/main/res/xml/data_extraction_rules.xml',
    code: `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <include domain="sharedpref" path="."/>
        <include domain="database" path="."/>
    </cloud-backup>
    <device-transfer>
        <include domain="sharedpref" path="."/>
        <include domain="database" path="."/>
    </device-transfer>
</data-extraction-rules>`
  },
  {
    category: 'Resources',
    name: 'backup_rules.xml',
    path: 'app/src/main/res/xml/backup_rules.xml',
    code: `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <include domain="sharedpref" path="."/>
    <include domain="database" path="."/>
</full-backup-content>`
  },
  {
    category: 'Resources',
    name: 'themes.xml',
    path: 'app/src/main/res/values/themes.xml',
    code: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.FUDMALectureReminder" parent="android:Theme.Material.Light.NoActionBar" />
</resources>`
  },
  {
    category: 'Resources',
    name: 'ic_launcher.xml',
    path: 'app/src/main/res/mipmap/ic_launcher.xml',
    code: `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <rect
        android:width="108"
        android:height="108"
        android:fillColor="#1E5631"/>
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M54,24C37.4,24 24,37.4 24,54C24,70.6 37.4,84 54,84C70.6,84 84,70.6 84,54C84,37.4 70.6,24 54,24ZM54,78C40.8,78 30,67.2 30,54C30,40.8 40.8,30 54,30C67.2,30 78,40.8 78,54C78,67.2 67.2,78 54,78Z"/>
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M52,36H56V54H68V58H52V36Z"/>
</vector>`
  },
  {
    category: 'Resources',
    name: 'ic_launcher_round.xml',
    path: 'app/src/main/res/mipmap/ic_launcher_round.xml',
    code: `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#1E5631"
        android:pathData="M54,54m-45,0a45,45 0,1 1,90 0a45,45 0,1 1,-90 0"/>
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M54,24C37.4,24 24,37.4 24,54C24,70.6 37.4,84 54,84C70.6,84 84,70.6 84,54C84,37.4 70.6,24 54,24ZM54,78C40.8,78 30,67.2 30,54C30,40.8 40.8,30 54,30C67.2,30 78,40.8 78,54C78,67.2 67.2,78 54,78Z"/>
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M52,36H56V54H68V58H52V36Z"/>
</vector>`
  }
];
