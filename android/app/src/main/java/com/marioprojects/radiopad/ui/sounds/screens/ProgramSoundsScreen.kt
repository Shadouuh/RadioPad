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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Button
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.TextButton
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
import android.widget.Toast
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.marioprojects.radiopad.domain.model.sounds.ProgramSound
import com.marioprojects.radiopad.domain.model.auth.User
import com.marioprojects.radiopad.domain.model.auth.Programs
import androidx.compose.ui.Alignment
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Headset
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Divider
import androidx.compose.ui.unit.DpOffset
import androidx.compose.foundation.BorderStroke
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.animation.Crossfade
import androidx.compose.animation.core.tween

@Composable
fun ProgramSoundsScreen(
    sounds: List<ProgramSound>,
    errorMessage: String?,
    onBack: () -> Unit,
    user: User? = null,
    program: Programs? = null,
    onLogout: () -> Unit = {},
    onDeleteSound: (programId: Long, soundId: Long) -> Unit = { _, _ -> }
) {
    val context = LocalContext.current
    var confirmDelete by remember { mutableStateOf<Pair<Long, ProgramSound>?>(null) }
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

    Column(modifier = Modifier.fillMaxSize().background(Color.White)) {
        // Solo botón de atrás al inicio
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.Start,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onBack,
                modifier = Modifier
                    .clip(CircleShape)
                    .background(Color(0xFFF3F4F6))
                    .border(androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5E7EB)))
            ) {
                Icon(
                    imageVector = Icons.Filled.ArrowBack,
                    contentDescription = "Volver",
                    tint = Color(0xFF111827)
                )
            }
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
            val isProducer = user?.role?.equals("Productor", ignoreCase = true) == true
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
                    },
                    showDeleteButton = !isProducer,
                    onDelete = {
                        // Usar siempre un programId válido: si el programa no está cargado aún, tomarlo del propio sonido
                        val pid = program?.id ?: sound.programId
                        confirmDelete = pid to sound
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
                },
                onClose = {
                    try {
                        mediaPlayer.pause()
                        mediaPlayer.reset()
                    } catch (_: Exception) {}
                    isPlaying = false
                    currentSound = null
                    currentSoundId = null
                    positionMs = 0
                    durationMs = 0
                }
            )
        }
    }

    // Diálogo de confirmación de borrado
    if (confirmDelete != null) {
        val (pid, snd) = confirmDelete!!
        AlertDialog(
            onDismissRequest = { confirmDelete = null },
            title = { Text(text = "Eliminar sonido") },
            text = {
                Text(text = "¿Seguro que deseas eliminar \"${snd.name}\"? Esta acción no se puede deshacer.")
            },
            confirmButton = {
                TextButton(onClick = {
                    onDeleteSound(pid, snd.id)
                    confirmDelete = null
                    Toast.makeText(context, "Sonido eliminado", Toast.LENGTH_SHORT).show()
                }) {
                    Text("Eliminar")
                }
            },
            dismissButton = {
                TextButton(onClick = { confirmDelete = null }) {
                    Text("Cancelar")
                }
            }
        )
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
private fun UserNavbarCompact(user: User?, onLogout: () -> Unit = {}) {
    var menuOpen by remember { mutableStateOf(false) }
    androidx.compose.foundation.layout.Box {
    Row(
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .clickable { menuOpen = true }
    ) {
        val initial = (user?.name?.firstOrNull() ?: 'U').uppercaseChar()
        Column(
            modifier = Modifier
                .clip(CircleShape)
                .background(Color(0xFF0F172A))
                .padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = initial.toString(), color = Color.White, style = MaterialTheme.typography.bodyMedium)
        }
        Column {
            Text(
                text = user?.name ?: "Usuario",
                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold),
                color = Color(0xFF111827)
            )
            Text(
                text = user?.role ?: "Rol",
                style = MaterialTheme.typography.bodySmall,
                color = Color(0xFF111827)
            )
        }
    }

    DropdownMenu(
        expanded = menuOpen,
        onDismissRequest = { menuOpen = false },
        offset = DpOffset(0.dp, 8.dp)
    ) {
        Card(
            elevation = CardDefaults.cardElevation(defaultElevation = 10.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column {
                Column(
                    modifier = Modifier
                        .clip(RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))
                        .background(Color(0xFFF3F4F6))
                        .padding(16.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Column(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(Color(0xFF0F172A))
                                .padding(12.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            val initial2 = (user?.name?.firstOrNull() ?: 'U').uppercaseChar()
                            Text(text = initial2.toString(), color = Color.White, style = MaterialTheme.typography.titleMedium)
                        }
                        Column {
                            Text(text = user?.name ?: "Usuario", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold), color = Color(0xFF111827))
                            Text(text = user?.role ?: "Rol", style = MaterialTheme.typography.bodySmall, color = Color(0xFF111827))
                        }
                    }
                }

                Divider(color = Color(0xFFF1F5F9))

                Column(
                    modifier = Modifier
                        .clip(RoundedCornerShape(bottomStart = 16.dp, bottomEnd = 16.dp))
                        .background(Color.White)
                        .padding(16.dp)
                ) {
                    Button(
                        onClick = { menuOpen = false; onLogout() },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFE4E6)),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        border = BorderStroke(1.dp, Color(0xFFFECACA))
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(imageVector = Icons.Filled.Logout, contentDescription = null, tint = Color(0xFFEF4444))
                            Text(text = "Cerrar Sesión", color = Color(0xFFEF4444))
                        }
                    }
                }
            }
        }
    }
    }
}

@Composable
private fun SoundCard(
    sound: ProgramSound,
    isPlaying: Boolean,
    onPlayPause: () -> Unit,
    modifier: Modifier = Modifier,
    showDeleteButton: Boolean = true,
    onDelete: () -> Unit = {}
) {
    Card(
        modifier = modifier
            .fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White
        ),
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5E7EB))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Encabezado con fondo gris claro, título + duración estilo badge
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFF3F4F6))
                    .padding(horizontal = 12.dp, vertical = 10.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = sound.name,
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                        color = Color(0xFF111827),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = (sound.duration ?: "—"),
                        style = MaterialTheme.typography.bodySmall,
                        color = Color(0xFF6B7280),
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(Color(0xFFE5E7EB))
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Descripción
            sound.description?.let {
                Text(
                    text = it,
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color(0xFF6B7280),
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(8.dp))
            }

            // divisor interior
            Spacer(modifier = Modifier.height(1.dp).fillMaxWidth().background(Color(0xFFE5E7EB)))
            Spacer(modifier = Modifier.height(8.dp))

            // Fila inferior: acciones con colores del client
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Play/Pause icono verde
                Row(
                    modifier = Modifier
                        .clip(CircleShape)
                        .clickable { onPlayPause() }
                        .padding(4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    val playTint = Color(0xFF22C55E)
                    Crossfade(targetState = isPlaying, animationSpec = tween(durationMillis = 200)) { playing ->
                        Icon(
                            imageVector = if (playing) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                            contentDescription = if (playing) "Pausar" else "Reproducir",
                            tint = playTint,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }

                // Basura roja (solo si no es productor)
                if (showDeleteButton) {
                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier
                            .size(36.dp) // aumentar área táctil para que sea más fácil de presionar
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Delete,
                            contentDescription = "Eliminar",
                            tint = Color(0xFFEF4444)
                        )
                    }
                }
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
    onSeekTo: (Int) -> Unit,
    onClose: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Fila principal: icono + textos, botón play/pause, tiempo y cerrar en una misma línea
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Bloque izquierdo (ocupa el espacio disponible)
                Row(
                    modifier = Modifier.weight(1f),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFFF3F4F6)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Filled.MusicNote,
                            contentDescription = null,
                            tint = Color(0xFF9CA3AF)
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(
                            text = sound.name,
                            style = MaterialTheme.typography.titleMedium,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            color = Color(0xFF111827)
                        )
                        val subtitle = sound.description ?: ""
                        if (subtitle.isNotBlank()) {
                            Text(
                                text = subtitle,
                                style = MaterialTheme.typography.bodySmall,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                                color = Color(0xFF6B7280)
                            )
                        }
                    }
                }

                // Botón circular azul con icono Play/Pause y anillos
                RingPlayPauseButton(isPlaying = isPlaying, onClick = onPlayPause)

                // Tiempo y botón cerrar (a la derecha)
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    val safeDuration = if (durationMs > 0) durationMs else 1
                    Text(
                        text = "${formatMs(positionMs)}/${formatMs(safeDuration)}",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color(0xFF6B7280)
                    )
                    Icon(
                        imageVector = Icons.Filled.Close,
                        contentDescription = "Cerrar",
                        tint = Color(0xFF111827),
                        modifier = Modifier
                            .size(18.dp)
                            .clip(CircleShape)
                            .clickable { onClose() }
                    )
                }
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
                },
                colors = SliderDefaults.colors(
                    thumbColor = Color(0xFF111827), // negro
                    activeTrackColor = Color(0xFF111827), // barra activa negra
                    inactiveTrackColor = Color(0xFFE5E7EB) // barra inactiva gris claro
                )
            )
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
    // Conservamos este botón para la barra de reproducción inferior, pero
    // ajustamos su gradiente para acercarlo al estilo del client.
    val gradient = if (isPlaying) {
        Brush.linearGradient(colors = listOf(Color(0xFFEF4444), Color(0xFFDC2626)))
    } else {
        Brush.linearGradient(colors = listOf(Color(0xFF111827), Color(0xFF0F172A)))
    }
    Row(
        modifier = Modifier
            .clip(CircleShape)
            .background(brush = gradient)
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Text(
            text = if (isPlaying) "Pausar" else "Reproducir",
            color = Color.White,
            style = MaterialTheme.typography.bodyMedium
        )
    }
}

@Composable
private fun RingPlayPauseButton(
    isPlaying: Boolean,
    onClick: () -> Unit
) {
    // Botón circular azul (#2563EB) con anillos sutiles, animando el ícono Play/Pause
    val blue = Color(0xFF2563EB)
    val ring = Color(0xFF93C5FD)
    Box(
        modifier = Modifier
            .size(44.dp)
            .clip(CircleShape)
            .border(BorderStroke(2.dp, ring), CircleShape)
            .padding(2.dp),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(blue)
                .clickable { onClick() },
            contentAlignment = Alignment.Center
        ) {
            Crossfade(targetState = isPlaying, animationSpec = tween(durationMillis = 200)) { playing ->
                Icon(
                    imageVector = if (playing) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                    contentDescription = if (playing) "Pausar" else "Reproducir",
                    tint = Color.White,
                )
            }
        }
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

@Composable
private fun StatusChip(isActive: Boolean) {
    val bg = if (isActive) Color(0xFFD1FAE5) else Color(0xFFFEE2E2)
    val fg = if (isActive) Color(0xFF10B981) else Color(0xFFDC2626)
    Text(
        text = if (isActive) "Activo" else "Inactivo",
        color = fg,
        style = MaterialTheme.typography.bodySmall,
        modifier = Modifier
            .clip(CircleShape)
            .background(bg)
            .padding(horizontal = 10.dp, vertical = 4.dp)
    )
}