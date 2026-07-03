export const profileScreenCode = `package com.fudma.lecturereminder.ui.screens

import android.content.Context
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(navController: NavController) {
    val context = LocalContext.current
    val prefs = remember { context.getSharedPreferences("student_profile", Context.MODE_PRIVATE) }
    
    var fullName by remember { mutableStateOf(prefs.getString("profile_full_name", "Bashir Abba Yaroz") ?: "Bashir Abba Yaroz") }
    var matricNo by remember { mutableStateOf(prefs.getString("profile_matric_no", "FUDMA/CSC/22/0142") ?: "FUDMA/CSC/22/0142") }
    var department by remember { mutableStateOf(prefs.getString("profile_department", "Computer Science") ?: "Computer Science") }
    var faculty by remember { mutableStateOf(prefs.getString("profile_faculty", "Physical Sciences") ?: "Physical Sciences") }
    var level by remember { mutableStateOf(prefs.getString("profile_level", "300 Level") ?: "300 Level") }
    
    var isEditing by remember { mutableStateOf(false) }
    var message by remember { mutableStateOf<String?>(null) }
    
    var editFullName by remember { mutableStateOf(fullName) }
    var editMatricNo by remember { mutableStateOf(matricNo) }
    var editDepartment by remember { mutableStateOf(department) }
    var editFaculty by remember { mutableStateOf(faculty) }
    var editLevel by remember { mutableStateOf(level) }
    
    var levelDropdownExpanded by remember { mutableStateOf(false) }
    val levels = listOf("100 Level", "200 Level", "300 Level", "400 Level")
    
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
                    text = "Student Profile ID",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Manage your university student credential details",
                    fontSize = 12.sp,
                    color = Color.Gray
                )
            }
            
            Button(
                onClick = {
                    if (isEditing) {
                        editFullName = fullName
                        editMatricNo = matricNo
                        editDepartment = department
                        editFaculty = faculty
                        editLevel = level
                    }
                    isEditing = !isEditing
                    message = null
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    contentColor = MaterialTheme.colorScheme.onPrimaryContainer
                ),
                shape = RoundedCornerShape(12.dp),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)
            ) {
                Icon(
                    imageVector = if (isEditing) Icons.Default.Info else Icons.Default.Edit,
                    contentDescription = "Edit Profile",
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = if (isEditing) "View ID Card" else "Edit Info",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        AnimatedVisibility(visible = message != null) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xE7E8F5E9),
                    contentColor = Color(0xFF1B5E20)
                )
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = "Success",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = message ?: "", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
        
        if (!isEditing) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 220.dp),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            brush = Brush.linearGradient(
                                colors = listOf(Color(0xFF1B5E20), Color(0xFF0F3D1A), Color(0xFF051C0C)),
                                start = Offset(0f, 0f),
                                end = Offset(1000f, 1000f)
                            )
                        )
                        .padding(16.dp)
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "FEDERAL UNIVERSITY DUTSIN-MA",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color(0xFF81C784),
                                    letterSpacing = 0.5.sp
                                )
                                Text(
                                    text = "Katsina State, Nigeria • Official ID Card",
                                    fontSize = 7.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFFA5D6A7),
                                    letterSpacing = 0.3.sp
                                )
                            }
                            
                            Box(
                                modifier = Modifier
                                    .background(Color(0x33FFFFFF), RoundedCornerShape(8.dp))
                                    .padding(6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Star,
                                    contentDescription = "Crest",
                                    tint = Color(0xFF81C784),
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                        
                        Divider(color = Color(0x33FFFFFF), thickness = 1.dp)
                        
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(64.dp)
                                    .background(Color(0x19FFFFFF), RoundedCornerShape(12.dp))
                                    .background(
                                        brush = Brush.radialGradient(
                                            colors = listOf(Color(0x33FFFFFF), Color(0x00FFFFFF))
                                        )
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(
                                        imageVector = Icons.Default.Person,
                                        contentDescription = "Avatar",
                                        tint = Color.White,
                                        modifier = Modifier.size(36.dp)
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Box(
                                        modifier = Modifier
                                            .background(Color(0xFF81C784), RoundedCornerShape(4.dp))
                                            .padding(horizontal = 4.dp, vertical = 1.dp)
                                    ) {
                                        Text(
                                            "Active",
                                            fontSize = 6.sp,
                                            fontWeight = FontWeight.Black,
                                            color = Color(0xFF1B5E20)
                                        )
                                    }
                                }
                            }
                            
                            Spacer(modifier = Modifier.width(16.dp))
                            
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = fullName,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White,
                                    maxLines = 1
                                )
                                Text(
                                    text = matricNo,
                                    fontSize = 10.sp,
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF81C784)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Dept: \\\${department}",
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = Color(0xFFE8F5E9)
                                )
                                Text(
                                    text = "Faculty: \\\${faculty}",
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = Color(0xFFE8F5E9)
                                )
                            }
                        }
                        
                        Divider(color = Color(0x33FFFFFF), thickness = 1.dp)
                        
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Bottom
                        ) {
                            Column {
                                Text(
                                    text = "ACADEMIC STANDING",
                                    fontSize = 6.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF81C784),
                                    letterSpacing = 0.5.sp
                                )
                                Text(
                                    text = level,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White
                                )
                            }
                            
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Canvas(
                                    modifier = Modifier
                                        .width(60.dp)
                                        .height(16.dp)
                                        .background(Color(0xE6FFFFFF), RoundedCornerShape(2.dp))
                                ) {
                                    val barWidths = listOf(1f, 3f, 1f, 1f, 4f, 1f, 2f, 1f, 1f, 3f, 1f, 2f, 1f)
                                    var currentX = 4f
                                    barWidths.forEach { width ->
                                        drawRect(
                                            color = Color.Black,
                                            topLeft = Offset(currentX, 2f),
                                            size = androidx.compose.ui.geometry.Size(width, size.height - 4f)
                                        )
                                        currentX += width + 2f
                                    }
                                }
                                Spacer(modifier = Modifier.height(2.dp))
                                val matricSuffix = if (matricNo.contains("/")) matricNo.split("/").last() else "FUDMA"
                                Text(
                                    text = "FUDMA-\\\${matricSuffix}",
                                    color = Color(0xFFA5D6A7),
                                    fontSize = 6.sp,
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        } else {
            Card(
                modifier = Modifier.fillMaxWidth(),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(bottom = 4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Check,
                            contentDescription = "Edit Form",
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "EDIT CREDENTIALS FORM",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text("Full Student Name", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(bottom = 4.dp))
                        OutlinedTextField(
                            value = editFullName,
                            onValueChange = { editFullName = it },
                            placeholder = { Text("Bashir Abba Yaroz") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true
                        )
                    }
                    
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text("Matriculation Number", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(bottom = 4.dp))
                        OutlinedTextField(
                            value = editMatricNo,
                            onValueChange = { editMatricNo = it.uppercase() },
                            placeholder = { Text("FUDMA/CSC/22/0142") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true,
                            textStyle = MaterialTheme.typography.bodyMedium.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                        )
                    }
                    
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text("Department", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(bottom = 4.dp))
                        OutlinedTextField(
                            value = editDepartment,
                            onValueChange = { editDepartment = it },
                            placeholder = { Text("Computer Science") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true
                        )
                    }
                    
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text("Faculty", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(bottom = 4.dp))
                        OutlinedTextField(
                            value = editFaculty,
                            onValueChange = { editFaculty = it },
                            placeholder = { Text("Physical Sciences") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true
                        )
                    }
                    
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text("Academic Level Standing", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(bottom = 4.dp))
                        ExposedDropdownMenuBox(
                            expanded = levelDropdownExpanded,
                            onExpandedChange = { levelDropdownExpanded = !levelDropdownExpanded }
                        ) {
                            OutlinedTextField(
                                readOnly = true,
                                value = editLevel,
                                onValueChange = {},
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .menuAnchor(),
                                shape = RoundedCornerShape(12.dp),
                                trailingIcon = {
                                    ExposedDropdownMenuDefaults.TrailingIcon(expanded = levelDropdownExpanded)
                                }
                            )
                            ExposedDropdownMenu(
                                expanded = levelDropdownExpanded,
                                onDismissRequest = { levelDropdownExpanded = false }
                            ) {
                                levels.forEach { lvl ->
                                    DropdownMenuItem(
                                        text = { Text(lvl, fontWeight = FontWeight.Bold) },
                                        onClick = {
                                            editLevel = lvl
                                            levelDropdownExpanded = false
                                        }
                                    )
                                }
                            }
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Button(
                        onClick = {
                            if (editFullName.trim().isEmpty() || editMatricNo.trim().isEmpty() || editDepartment.trim().isEmpty() || editFaculty.trim().isEmpty()) {
                                message = "All profile fields are required!"
                                return@Button
                            }
                            
                            fullName = editFullName.trim()
                            matricNo = editMatricNo.trim().uppercase()
                            department = editDepartment.trim()
                            faculty = editFaculty.trim()
                            level = editLevel
                            
                            prefs.edit().apply {
                                putString("profile_full_name", fullName)
                                putString("profile_matric_no", matricNo)
                                putString("profile_department", department)
                                putString("profile_faculty", faculty)
                                putString("profile_level", level)
                                apply()
                            }
                            
                            isEditing = false
                            message = "Profile updated successfully!"
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        contentPadding = PaddingValues(vertical = 12.dp)
                    ) {
                        Icon(imageVector = Icons.Default.CheckCircle, contentDescription = "Save Profile")
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Save Updated Credentials", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(bottom = 8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Info,
                        contentDescription = "Policy",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "FUDMA ATTENDANCE POLICY",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                Text(
                    text = "Federal University Dutsin-Ma requires all students to attain a minimum of 75% lecture attendance to be eligible to sit for departmental and faculty final examinations. Keep your timetable updated to maintain consistency!",
                    fontSize = 10.sp,
                    color = Color.DarkGray,
                    lineHeight = 14.sp
                )
            }
        }
    }
}
`;
