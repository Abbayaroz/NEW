package com.fudma.lecturereminder.ui.screens

import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.fudma.lecturereminder.data.database.AppDatabase
import com.fudma.lecturereminder.receiver.AlarmReceiver
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(navController: NavController) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val database = remember { AppDatabase.getDatabase(context) }
    val lectureDao = remember { database.lectureDao() }
    
    val allLectures by lectureDao.getAllLectures().collectAsState(initial = emptyList())
    
    // Preferences Storage
    val prefs = remember { context.getSharedPreferences("notification_settings", Context.MODE_PRIVATE) }
    
    var remindersEnabled by remember { mutableStateOf(prefs.getBoolean("reminders_enabled", true)) }
    var vibrateEnabled by remember { mutableStateOf(prefs.getBoolean("vibrate_enabled", true)) }
    var soundEnabled by remember { mutableStateOf(prefs.getBoolean("sound_enabled", true)) }
    var priority by remember { mutableStateOf(prefs.getString("priority", "High") ?: "High") }
    
    var priorityDropdownExpanded by remember { mutableStateOf(false) }
    var rebooting by remember { mutableStateOf(false) }
    var rebootLogs by remember { mutableStateListOf<String>() }
    
    // Simulated alarm history logs inside the app session
    val alarmHistory = remember { mutableStateListOf<Pair<String, String>>() }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        // Tab Header
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Notification & System Settings",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Text(
                text = "Configure Android alerts, sound preferences, and simulation triggers",
                fontSize = 12.sp,
                color = Color.Gray
            )
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Alert Preferences Panel
        Card(
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(bottom = 12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Notifications,
                        contentDescription = "Alert Preferences Icon",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "ALERT PREFERENCES",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                
                // Reminders Toggle
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Lecture Reminders", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text("Receive automatic pre-lecture alerts", fontSize = 10.sp, color = Color.Gray)
                    }
                    Switch(
                        checked = remindersEnabled,
                        onCheckedChange = { value ->
                            remindersEnabled = value
                            prefs.edit().putBoolean("reminders_enabled", value).apply()
                        }
                    )
                }
                
                Divider(color = Color.LightGray, thickness = 0.5.dp)
                
                // Sound Toggle
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Sound Settings", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text("Play ringtone sound when alarm triggers", fontSize = 10.sp, color = Color.Gray)
                    }
                    Switch(
                        checked = soundEnabled,
                        onCheckedChange = { value ->
                            soundEnabled = value
                            prefs.edit().putBoolean("sound_enabled", value).apply()
                        }
                    )
                }
                
                Divider(color = Color.LightGray, thickness = 0.5.dp)
                
                // Vibration Toggle
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Vibration Pattern", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text("Vibrate device on receiving alerts", fontSize = 10.sp, color = Color.Gray)
                    }
                    Switch(
                        checked = vibrateEnabled,
                        onCheckedChange = { value ->
                            vibrateEnabled = value
                            prefs.edit().putBoolean("vibrate_enabled", value).apply()
                        }
                    )
                }
                
                Divider(color = Color.LightGray, thickness = 0.5.dp)
                
                // Heads-Up Priority Dropdown
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1.2f)) {
                        Text("Heads-Up Priority", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text("Manage alert display level on lockscreen", fontSize = 10.sp, color = Color.Gray)
                    }
                    
                    Box(modifier = Modifier.weight(0.8f)) {
                        ExposedDropdownMenuBox(
                            expanded = priorityDropdownExpanded,
                            onExpandedChange = { priorityDropdownExpanded = !priorityDropdownExpanded }
                        ) {
                            OutlinedTextField(
                                readOnly = true,
                                value = priority,
                                onValueChange = {},
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .menuAnchor(),
                                shape = RoundedCornerShape(8.dp),
                                textStyle = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                trailingIcon = {
                                    ExposedDropdownMenuDefaults.TrailingIcon(expanded = priorityDropdownExpanded)
                                },
                                colors = OutlinedTextFieldDefaults.colors(
                                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                                    focusedContainerColor = MaterialTheme.colorScheme.surface
                                )
                            )
                            ExposedDropdownMenu(
                                expanded = priorityDropdownExpanded,
                                onDismissRequest = { priorityDropdownExpanded = false }
                            ) {
                                listOf("Low", "Default", "High").forEach { level ->
                                    DropdownMenuItem(
                                        text = { Text(level, fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                                        onClick = {
                                            priority = level
                                            prefs.edit().putString("priority", level).apply()
                                            priorityDropdownExpanded = false
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Simulated Alarm History Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.List,
                            contentDescription = "History Icon",
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "SIMULATED ALARM HISTORY",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    
                    if (alarmHistory.isNotEmpty()) {
                        TextButton(
                            onClick = { alarmHistory.clear() },
                            colors = ButtonDefaults.textButtonColors(contentColor = MaterialTheme.colorScheme.error),
                            contentPadding = PaddingValues(0.dp)
                        ) {
                            Icon(imageVector = Icons.Default.Delete, contentDescription = "Clear", modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Clear History", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                
                if (alarmHistory.isNotEmpty()) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 160.dp)
                            .verticalScroll(rememberScrollState()),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        alarmHistory.asReversed().forEach { log ->
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                            ) {
                                Row(
                                    modifier = Modifier.padding(8.dp),
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Notifications,
                                        contentDescription = "Alarm Fired",
                                        tint = MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text("Lecture Reminder Fired", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                            Text(log.first, fontSize = 8.sp, color = Color.Gray)
                                        }
                                        Spacer(modifier = Modifier.height(2.dp))
                                        Text(log.second, fontSize = 10.sp, color = Color.DarkGray)
                                    }
                                }
                            }
                        }
                    }
                } else {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = Color.White)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Notifications,
                                contentDescription = "Bell Empty",
                                tint = Color.LightGray,
                                modifier = Modifier.size(32.dp)
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                "No notifications fired yet.",
                                fontSize = 11.sp,
                                color = Color.Gray,
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                "Use simulator tools to test triggers!",
                                fontSize = 9.sp,
                                color = Color.LightGray
                            )
                        }
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Android Hardware Simulator Tools Panel
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Build,
                        contentDescription = "Hardware Tools",
                        tint = MaterialTheme.colorScheme.onSecondaryContainer,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "ANDROID HARDWARE SIMULATOR TOOLS",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSecondaryContainer
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Test background services and boot recovery resilience directly in the web environment:",
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.8f)
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Simulate Reboot Button
                    Card(
                        modifier = Modifier
                            .weight(1f)
                            .clickable(enabled = !rebooting) {
                                rebooting = true
                                rebootLogs.clear()
                                coroutineScope.launch {
                                    rebootLogs.add("--- SYSTEM BOOT TRIGGERED ---")
                                    delay(300)
                                    rebootLogs.add("▶ Android OS restarting...")
                                    delay(400)
                                    rebootLogs.add("▶ BroadCastReceiver: [ACTION_BOOT_COMPLETED]")
                                    delay(400)
                                    rebootLogs.add("▶ BootReceiver.kt: Querying Room AppDatabase...")
                                    delay(400)
                                    rebootLogs.add("▶ AlarmScheduler: Restoring all saved class reminders...")
                                    delay(300)
                                    rebootLogs.add("✔ Restored ${allLectures.size} saved course reminders successfully!")
                                    
                                    val nowStr = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
                                    alarmHistory.add(Pair(nowStr, "System Restart: AlarmScheduler successfully restored all ${allLectures.size} reminders from Room DB."))
                                    
                                    rebooting = false
                                }
                            },
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(
                            modifier = Modifier.padding(12.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Reboot",
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text("Simulate Reboot", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Text("Test BootReceiver db restore", fontSize = 8.sp, color = Color.Gray)
                        }
                    }
                    
                    // Test Instant Alarm Button
                    Card(
                        modifier = Modifier
                            .weight(1f)
                            .clickable {
                                if (allLectures.isEmpty()) {
                                    Toast.makeText(context, "Please add at least one lecture first!", Toast.LENGTH_SHORT).show()
                                    return@clickable
                                }
                                
                                val randomLec = allLectures.random()
                                val intent = Intent(context, AlarmReceiver::class.java).apply {
                                    putExtra("COURSE_CODE", randomLec.courseCode)
                                    putExtra("COURSE_TITLE", randomLec.courseTitle)
                                    putExtra("VENUE", randomLec.venue)
                                    putExtra("LECTURER", randomLec.lecturer)
                                    putExtra("REMINDER_MINUTES", randomLec.reminderMinutes)
                                }
                                context.sendBroadcast(intent)
                                
                                val nowStr = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
                                val msg = "${randomLec.courseCode} – ${randomLec.courseTitle} starts in ${randomLec.reminderMinutes}m at ${randomLec.venue}. Lecturer: ${randomLec.lecturer}."
                                alarmHistory.add(Pair(nowStr, msg))
                            },
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(
                            modifier = Modifier.padding(12.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(
                                imageVector = Icons.Default.PlayArrow,
                                contentDescription = "Alarm Test",
                                tint = Color(0xFFFF9800),
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text("Test Instant Alarm", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Text("Fire heads-up alert now", fontSize = 8.sp, color = Color.Gray)
                        }
                    }
                }
                
                // Terminal output for rebooting
                AnimatedVisibility(visible = rebootLogs.isNotEmpty()) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 12.dp)
                            .background(Color.Black, RoundedCornerShape(8.dp))
                            .padding(12.dp)
                    ) {
                        rebootLogs.forEach { log ->
                            Text(
                                text = log,
                                color = if (log.startsWith("---") || log.startsWith("✔")) Color(0xFF4CAF50) else Color(0xFFAEEA00),
                                fontFamily = FontFamily.Monospace,
                                fontSize = 9.sp,
                                modifier = Modifier.padding(vertical = 1.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}
