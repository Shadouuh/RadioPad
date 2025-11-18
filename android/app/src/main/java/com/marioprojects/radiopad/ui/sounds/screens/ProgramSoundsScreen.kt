package com.marioprojects.radiopad.ui.sounds.screens

import android.media.AudioAttributes
import android.media.MediaPlayer
import kotlinx.coroutines.delay
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Slider
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.marioprojects.radiopad.domain.model.sounds.ProgramSound

@Composable
fun ProgramSoundsScreen(
    sounds: List<ProgramSound>,
    errorMessage: String?,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val mediaPlayer = remember { MediaPlayer() }
    var currentSoundId by remember { mutableStateOf<Long?>(null) }
    var isPlaying by remember { mutableStateOf(false) }
    var currentSound by remember { mutableStateOf<ProgramSound?>(null) }
    var durationMs by remember { mutableStateOf(0) }
    var positionMs by remember { mutableStateOf(0) }

    LaunchedEffect(Unit) {
        mediaPlayer.setAudioAttributes(
            AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build()
        )
        mediaPlayer.setOnCompletionListener {
            isPlaying = false
            positionMs = 0
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            try {
                mediaPlayer.reset()
                mediaPlayer.release()
            } catch (_: Exception) {}
        }
    }

    Column(modifier = Modifier.fillMaxSize()) {
        // Encabezado simple con botón de volver
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Button(onClick = onBack) { Text("Volver") }
            Text(
                text = "Sonidos del programa",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold)
            )
        }

        if (!errorMessage.isNullOrBlank()) {
            Text(
                text = "Error: $errorMessage",
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(horizontal = 16.dp)
            )
        }

        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .padding(16.dp)
        ) {
            items(sounds) { sound ->
                SoundCard(
                    sound = sound,
                    isPlaying = isPlaying && currentSoundId == sound.id,
                    onPlayPause = {
                        val url = sound.fileUrl
                        if (url.isNullOrBlank()) return@SoundCard

                        try {
                            if (currentSoundId == sound.id && isPlaying) {
                                mediaPlayer.pause()
                                isPlaying = false
                            } else {
                                mediaPlayer.reset()
                                mediaPlayer.setDataSource(url)
                                mediaPlayer.setOnPreparedListener {
                                    it.start()
                                    isPlaying = true
                                    currentSoundId = sound.id
                                    currentSound = sound
                                    durationMs = it.duration
                                    positionMs = 0
                                }
                                mediaPlayer.prepareAsync()
                            }
                        } catch (_: Exception) {}
                    }
                )
                Spacer(modifier = Modifier.height(12.dp))
            }
        }

        // Barra de reproducción inferior, similar al client
        if (currentSound != null) {
            PlaybackBar(
                sound = currentSound!!,
                isPlaying = isPlaying,
                positionMs = positionMs,
                durationMs = durationMs,
                onPlayPause = {
                    try {
                        if (isPlaying) {
                            mediaPlayer.pause()
                            isPlaying = false
                        } else {
                            mediaPlayer.start()
                            isPlaying = true
                        }
                    } catch (_: Exception) {}
                },
                onSeekTo = { newPositionMs ->
                    try {
                        mediaPlayer.seekTo(newPositionMs)
                        positionMs = mediaPlayer.currentPosition
                    } catch (_: Exception) {}
                }
            )
        }
    }

    // Actualizar el progreso mientras se reproduce
    LaunchedEffect(isPlaying, currentSoundId) {
        while (isPlaying) {
            try {
                positionMs = mediaPlayer.currentPosition
            } catch (_: Exception) {}
            delay(500)
        }
    }
}

@Composable
private fun SoundCard(
    sound: ProgramSound,
    isPlaying: Boolean,
    onPlayPause: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isPlaying)
                MaterialTheme.colorScheme.surface.copy(alpha = 0.98f)
            else MaterialTheme.colorScheme.surface
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Encabezado: título + duración estilo badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = sound.name,
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                    color = MaterialTheme.colorScheme.primary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = (sound.duration ?: "N/A"),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Descripción
            sound.description?.let {
                Text(
                    text = it,
                    style = MaterialTheme.typography.bodyMedium,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(8.dp))
            }

            // Fila inferior: categoría (badge) y botón play/pause con gradiente
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                CategoryBadge(category = sound.category)
                GradientPlayButton(isPlaying = isPlaying, onClick = onPlayPause)
            }
        }
    }
}

@Composable
private fun PlaybackBar(
    sound: ProgramSound,
    isPlaying: Boolean,
    positionMs: Int,
    durationMs: Int,
    onPlayPause: () -> Unit,
    onSeekTo: (Int) -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = sound.name,
                    style = MaterialTheme.typography.titleMedium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                GradientPlayButton(isPlaying = isPlaying, onClick = onPlayPause)
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Slider de progreso
            val safeDuration = if (durationMs > 0) durationMs else 1
            val progress = positionMs.toFloat() / safeDuration.toFloat()
            var sliderPos by remember { mutableStateOf(progress) }
            androidx.compose.runtime.LaunchedEffect(positionMs, durationMs) {
                sliderPos = progress
            }
            Slider(
                value = sliderPos,
                onValueChange = { sliderPos = it },
                onValueChangeFinished = {
                    val targetMs = (sliderPos * safeDuration).toInt()
                    onSeekTo(targetMs)
                }
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = formatMs(positionMs), style = MaterialTheme.typography.bodySmall)
                Text(text = formatMs(safeDuration), style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}

private fun formatMs(ms: Int): String {
    val totalSeconds = ms / 1000
    val minutes = totalSeconds / 60
    val seconds = totalSeconds % 60
    return "%d:%02d".format(minutes, seconds)
}

@Composable
private fun GradientPlayButton(
    isPlaying: Boolean,
    onClick: () -> Unit
) {
    val gradient = if (isPlaying) {
        Brush.linearGradient(colors = listOf(Color(0xFFEF4444), Color(0xFFDC2626)))
    } else {
        Brush.linearGradient(colors = listOf(Color(0xFF3B82F6), Color(0xFF1D4ED8)))
    }
    Row(
        modifier = Modifier
            .clip(CircleShape)
            .background(brush = gradient)
            .clickable { onClick() }
            .padding(14.dp)
    ) {
        Text(
            text = if (isPlaying) "⏸" else "▶",
            color = Color.White,
            style = MaterialTheme.typography.titleMedium
        )
    }
}

@Composable
private fun CategoryBadge(category: String?) {
    val (bg, fg) = when (category?.lowercase()) {
        "institucional" -> Color(0xFFDBEAFE) to Color(0xFF1E40AF)
        "música", "musica" -> Color(0xFFFCE7F3) to Color(0xFFBE185D)
        "efectos" -> Color(0xFFF0FDF4) to Color(0xFF166534)
        "jingles" -> Color(0xFFFEF3C7) to Color(0xFFD97706)
        "comerciales" -> Color(0xFFF3E8FF) to Color(0xFF7C3AED)
        else -> MaterialTheme.colorScheme.surfaceVariant to MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
    }
    Text(
        text = category ?: "Sin categoría",
        style = MaterialTheme.typography.bodySmall,
        color = fg,
        modifier = Modifier
            .clip(CircleShape)
            .background(bg)
            .padding(horizontal = 10.dp, vertical = 4.dp)
    )
}