package com.fudma.lecturereminder.ui.theme

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
}