export const addEditLectureScreenCode = `package com.fudma.lecturereminder.ui.screens

import android.app.TimePickerDialog
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.fudma.lecturereminder.data.database.AppDatabase
import com.fudma.lecturereminder.data.entity.Lecture
import com.fudma.lecturereminder.receiver.AlarmScheduler
import kotlinx.coroutines.launch
import java.util.Calendar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditLectureScreen(navController: NavController, lectureId: Long?) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val database = remember { AppDatabase.getDatabase(context) }
    val lectureDao = remember { database.lectureDao() }
    
    val savedStateLectureId = navController.previousBackStackEntry?.savedStateHandle?.get<Long>("lectureId")
    val resolvedLectureId = lectureId ?: savedStateLectureId
    
    var isEditMode by remember { mutableStateOf(resolvedLectureId != null) }
    
    var courseCode by remember { mutableStateOf("") }
    var courseTitle by remember { mutableStateOf("") }
    var lecturer by remember { mutableStateOf("") }
    var selectedDay by remember { mutableStateOf("Monday") }
    var startTime by remember { mutableStateOf("10:00") }
    var endTime by remember { mutableStateOf("12:00") }
    var venue by remember { mutableStateOf("") }
    var reminderMinutes by remember { mutableStateOf(15) }
    
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var isSubmitting by remember { mutableStateOf(false) }
    
    val days = listOf("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
    val reminders = listOf(
        Pair("5 minutes before", 5),
        Pair("15 minutes before", 15),
        Pair("30 minutes before", 30),
        Pair("60 minutes before", 60)
    )
    
    var daysDropdownExpanded by remember { mutableStateOf(false) }
    var remindersDropdownExpanded by remember { mutableStateOf(false) }
    
    LaunchedEffect(resolvedLectureId) {
        if (resolvedLectureId != null) {
            val lecture = lectureDao.getLectureById(resolvedLectureId)
            if (lecture != null) {
                isEditMode = true
                courseCode = lecture.courseCode
                courseTitle = lecture.courseTitle
                lecturer = lecture.lecturer
                selectedDay = lecture.dayOfWeek
                startTime = lecture.startTime
                endTime = lecture.endTime
                venue = lecture.venue
                reminderMinutes = lecture.reminderMinutes
            }
        }
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = if (isEditMode) "Edit Lecture" else "Add New Lecture",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = if (isEditMode) "Modify existing course schedule" else "Register a class in your weekly schedule",
                    fontSize = 12.sp,
                    color = Color.Gray
                )
            }
            
            if (isEditMode) {
                Button(
                    onClick = {
                        navController.previousBackStackEntry?.savedStateHandle?.remove<Long>("lectureId")
                        navController.navigate("timetable")
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Cancel",
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.onErrorContainer
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        "Cancel",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onErrorContainer
                    )
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        errorMessage?.let { error ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.errorContainer,
                    contentColor = MaterialTheme.colorScheme.onErrorContainer
                )
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Warning,
                        contentDescription = "Error",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = error, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }
        
        Text(
            text = "Course Code & Title",
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 4.dp)
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = courseCode,
                onValueChange = { courseCode = it.uppercase() },
                label = { Text("CSC 205") },
                placeholder = { Text("CSC 205") },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(12.dp),
                singleLine = true,
                textStyle = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
            )
            OutlinedTextField(
                value = courseTitle,
                onValueChange = { courseTitle = it },
                label = { Text("Course Title") },
                placeholder = { Text("Operations Research...") },
                modifier = Modifier.weight(2f),
                shape = RoundedCornerShape(12.dp),
                singleLine = true
            )
        }
        
        Spacer(modifier = Modifier.height(12.dp))
        
        Text(
            text = "Lecturer's Name",
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 4.dp)
        )
        OutlinedTextField(
            value = lecturer,
            onValueChange = { lecturer = it },
            placeholder = { Text("Mr. Sulaiman Muhammad Garba") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            leadingIcon = {
                Icon(imageVector = Icons.Default.Person, contentDescription = "Lecturer Icon")
            },
            singleLine = true
        )
        
        Spacer(modifier = Modifier.height(12.dp))
        
        Text(
            text = "Day of the Week",
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 4.dp)
        )
        ExposedDropdownMenuBox(
            expanded = daysDropdownExpanded,
            onExpandedChange = { daysDropdownExpanded = !daysDropdownExpanded }
        ) {
            OutlinedTextField(
                readOnly = true,
                value = selectedDay,
                onValueChange = {},
                modifier = Modifier
                    .fillMaxWidth()
                    .menuAnchor(),
                shape = RoundedCornerShape(12.dp),
                leadingIcon = {
                    Icon(imageVector = Icons.Default.DateRange, contentDescription = "Calendar Icon")
                },
                trailingIcon = {
                    ExposedDropdownMenuDefaults.TrailingIcon(expanded = daysDropdownExpanded)
                }
            )
            ExposedDropdownMenu(
                expanded = daysDropdownExpanded,
                onDismissRequest = { daysDropdownExpanded = false }
            ) {
                days.forEach { day ->
                    DropdownMenuItem(
                        text = { Text(day, fontWeight = FontWeight.Bold) },
                        onClick = {
                            selectedDay = day
                            daysDropdownExpanded = false
                        }
                    )
                }
            }
        }
        
        Spacer(modifier = Modifier.height(12.dp))
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Start Time",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.padding(bottom = 4.dp)
                )
                OutlinedTextField(
                    readOnly = true,
                    value = startTime,
                    onValueChange = {},
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            val parts = startTime.split(":")
                            TimePickerDialog(
                                context,
                                { _, hour, minute ->
                                    startTime = String.format("%02d:%02d", hour, minute)
                                },
                                parts[0].toInt(),
                                parts[1].toInt(),
                                true
                            ).show()
                        },
                    enabled = false,
                    colors = OutlinedTextFieldDefaults.colors(
                        disabledTextColor = MaterialTheme.colorScheme.onSurface,
                        disabledBorderColor = MaterialTheme.colorScheme.outline,
                        disabledLeadingIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                        disabledPlaceholderColor = MaterialTheme.colorScheme.onSurfaceVariant
                    ),
                    shape = RoundedCornerShape(12.dp),
                    leadingIcon = {
                        Icon(imageVector = Icons.Default.PlayArrow, contentDescription = "Time Start Icon")
                    }
                )
            }
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "End Time",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.padding(bottom = 4.dp)
                )
                OutlinedTextField(
                    readOnly = true,
                    value = endTime,
                    onValueChange = {},
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            val parts = endTime.split(":")
                            TimePickerDialog(
                                context,
                                { _, hour, minute ->
                                    endTime = String.format("%02d:%02d", hour, minute)
                                },
                                parts[0].toInt(),
                                parts[1].toInt(),
                                true
                            ).show()
                        },
                    enabled = false,
                    colors = OutlinedTextFieldDefaults.colors(
                        disabledTextColor = MaterialTheme.colorScheme.onSurface,
                        disabledBorderColor = MaterialTheme.colorScheme.outline,
                        disabledLeadingIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                        disabledPlaceholderColor = MaterialTheme.colorScheme.onSurfaceVariant
                    ),
                    shape = RoundedCornerShape(12.dp),
                    leadingIcon = {
                        Icon(imageVector = Icons.Default.PlayArrow, contentDescription = "Time End Icon")
                    }
                )
            }
        }
        
        Spacer(modifier = Modifier.height(12.dp))
        
        Text(
            text = "Venue / Classroom",
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 4.dp)
        )
        OutlinedTextField(
            value = venue,
            onValueChange = { venue = it },
            placeholder = { Text("Smart Lab, Computer Science Dept") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            leadingIcon = {
                Icon(imageVector = Icons.Default.LocationOn, contentDescription = "Venue Icon")
            },
            singleLine = true
        )
        
        Spacer(modifier = Modifier.height(12.dp))
        
        Text(
            text = "Reminder Alarm Time",
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 4.dp)
        )
        ExposedDropdownMenuBox(
            expanded = remindersDropdownExpanded,
            onExpandedChange = { remindersDropdownExpanded = !remindersDropdownExpanded }
        ) {
            OutlinedTextField(
                readOnly = true,
                value = reminders.find { it.second == reminderMinutes }?.first ?: "\\\\\${reminderMinutes} minutes before",
                onValueChange = {},
                modifier = Modifier
                    .fillMaxWidth()
                    .menuAnchor(),
                shape = RoundedCornerShape(12.dp),
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Notifications, contentDescription = "Reminder Alarm Icon")
                },
                trailingIcon = {
                    ExposedDropdownMenuDefaults.TrailingIcon(expanded = remindersDropdownExpanded)
                }
            )
            ExposedDropdownMenu(
                expanded = remindersDropdownExpanded,
                onDismissRequest = { remindersDropdownExpanded = false }
            ) {
                reminders.forEach { option ->
                    DropdownMenuItem(
                        text = { Text(option.first, fontWeight = FontWeight.Bold) },
                        onClick = {
                            reminderMinutes = option.second
                            remindersDropdownExpanded = false
                        }
                    )
                }
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Button(
            onClick = {
                errorMessage = null
                
                if (courseCode.trim().isEmpty()) {
                    errorMessage = "Course code is required (e.g. CSC 205)."
                    return@Button
                }
                if (courseTitle.trim().isEmpty()) {
                    errorMessage = "Course title is required."
                    return@Button
                }
                if (lecturer.trim().isEmpty()) {
                    errorMessage = "Lecturer name is required."
                    return@Button
                }
                if (venue.trim().isEmpty()) {
                    errorMessage = "Lecture venue is required (e.g. Smart Lab)."
                    return@Button
                }
                
                val startParts = startTime.split(":")
                val endParts = endTime.split(":")
                val startTotal = startParts[0].toInt() * 60 + startParts[1].toInt()
                val endTotal = endParts[0].toInt() * 60 + endParts[1].toInt()
                
                if (endTotal <= startTotal) {
                    errorMessage = "End time must be after the start time."
                    return@Button
                }
                
                isSubmitting = true
                
                coroutineScope.launch {
                    val duplicate = lectureDao.getDuplicateEntry(selectedDay, startTime)
                    if (duplicate != null && (!isEditMode || duplicate.id != resolvedLectureId)) {
                        errorMessage = "Conflict: Another class is already scheduled on \\\\\$selectedDay at \\\\\$startTime. Please select a different time."
                        isSubmitting = false
                        return@launch
                    }
                    
                    val scheduler = AlarmScheduler(context)
                    
                    if (isEditMode && resolvedLectureId != null) {
                        val existingLecture = lectureDao.getLectureById(resolvedLectureId)
                        if (existingLecture != null) {
                            scheduler.cancelAlarmForLecture(existingLecture)
                        }
                        
                        val updatedLecture = Lecture(
                            id = resolvedLectureId,
                            courseCode = courseCode.trim().uppercase(),
                            courseTitle = courseTitle.trim(),
                            lecturer = lecturer.trim(),
                            dayOfWeek = selectedDay,
                            startTime = startTime,
                            endTime = endTime,
                            venue = venue.trim(),
                            reminderMinutes = reminderMinutes
                        )
                        
                        lectureDao.updateLecture(updatedLecture)
                        scheduler.scheduleAlarmForLecture(updatedLecture)
                    } else {
                        val newLecture = Lecture(
                            courseCode = courseCode.trim().uppercase(),
                            courseTitle = courseTitle.trim(),
                            lecturer = lecturer.trim(),
                            dayOfWeek = selectedDay,
                            startTime = startTime,
                            endTime = endTime,
                            venue = venue.trim(),
                            reminderMinutes = reminderMinutes
                        )
                        
                        val newId = lectureDao.insertLecture(newLecture)
                        val insertedLecture = newLecture.copy(id = newId)
                        scheduler.scheduleAlarmForLecture(insertedLecture)
                    }
                    
                    isSubmitting = false
                    navController.previousBackStackEntry?.savedStateHandle?.remove<Long>("lectureId")
                    navController.navigate("timetable")
                }
            },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            contentPadding = PaddingValues(vertical = 12.dp),
            enabled = !isSubmitting
        ) {
            Icon(
                imageVector = Icons.Default.Check,
                contentDescription = "Save Icon"
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = if (isEditMode) "Update Lecture Entry" else "Save Lecture Schedule",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}
`;
