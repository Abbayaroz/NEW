package com.fudma.lecturereminder

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
}