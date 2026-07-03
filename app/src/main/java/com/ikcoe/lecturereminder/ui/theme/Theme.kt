package com.ikcoe.lecturereminder.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = IkcoeGreenSecondary,
    secondary = IkcoeGreenLight,
    background = IkcoeCharcoal,
    surface = Color(0xFF111827),
    onPrimary = IkcoeWhite,
    onBackground = IkcoeWhite,
    onSurface = IkcoeWhite
)

private val LightColorScheme = lightColorScheme(
    primary = IkcoeGreenPrimary,
    secondary = IkcoeGreenSecondary,
    background = IkcoeLightBg,
    surface = IkcoeWhite,
    onPrimary = IkcoeWhite,
    onBackground = IkcoeCharcoal,
    onSurface = IkcoeCharcoal
)

@Composable
fun IKCOELectureReminderTheme(
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