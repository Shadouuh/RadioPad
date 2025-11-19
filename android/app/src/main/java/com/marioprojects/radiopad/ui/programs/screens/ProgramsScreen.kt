package com.marioprojects.radiopad.ui.programs.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.clickable
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.marioprojects.radiopad.domain.model.auth.Programs
import com.marioprojects.radiopad.domain.model.auth.User
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.PowerSettingsNew
import androidx.compose.material.icons.filled.Logout

@Composable
fun ProgramsScreen(
    programs: List<Programs>,
    isLoading: Boolean,
    errorMessage: String?,
    user: User? = null,
    soundsCountByProgram: Map<Long, Int> = emptyMap(),
    onRequestProgramSounds: (Long) -> Unit = {},
    onProgramClick: (Programs) -> Unit = {},
    onLogout: () -> Unit = {}
) {
    Scaffold(
        topBar = { UserNavbarTopBar(user = user, onLogout = onLogout) },
        containerColor = Color.White
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
                .padding(innerPadding)
        ) {
            // Card superior con título y mensaje (sin botón)
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFFF3F4F6) // gris claro
                ),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Icon(imageVector = Icons.Filled.MusicNote, contentDescription = null, tint = MaterialTheme.colorScheme.onSurface)
                        Text(
                            text = "Gestión de Programas",
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Crea y administra programas con sus efectos de sonido",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Sección Programas + lista scrollable
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(imageVector = Icons.Filled.MusicNote, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(
                            text = "Programas",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold)
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Selecciona un programa para ver sus efectos",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Lista de programas
            when {
                isLoading -> {
                    CircularProgressIndicator(modifier = Modifier.padding(20.dp))
                }
                errorMessage != null -> {
                    Text(text = "Error: $errorMessage", modifier = Modifier.padding(20.dp))
                }
                programs.isEmpty() -> {
                    Text(text = "No tienes programas asignados", modifier = Modifier.padding(20.dp))
                }
                else -> {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        items(programs) { program ->
                            // Solicitar los sonidos para poder mostrar el conteo
                            androidx.compose.runtime.LaunchedEffect(program.id) {
                                if (soundsCountByProgram[program.id] == null) {
                                    onRequestProgramSounds(program.id)
                                }
                            }
                            val effectsCount = soundsCountByProgram[program.id] ?: 0
                            ProgramCard(
                                program = program,
                                effectsCount = effectsCount,
                                onClick = { onProgramClick(program) }
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun UserNavbarTopBar(user: User?, onLogout: () -> Unit = {}) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        var menuOpen by remember { mutableStateOf(false) }
        androidx.compose.foundation.layout.Box {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Avatar redondo con inicial
            val initial = (user?.name?.firstOrNull() ?: 'U').uppercaseChar()
            Column(
                modifier = Modifier
                    .clip(CircleShape)
                    .background(Color(0xFF0F172A))
                    .padding(12.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = initial.toString(),
                    color = Color.White,
                    style = MaterialTheme.typography.titleMedium
                )
            }

            Column(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .clickable { menuOpen = true }
            ) {
                Text(
                    text = user?.name ?: "Usuario",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = user?.role ?: "Rol",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        DropdownMenu(expanded = menuOpen, onDismissRequest = { menuOpen = false }) {
            Card(
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
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
                            Text(text = user?.name ?: "Usuario", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold), color = MaterialTheme.colorScheme.onSurface)
                            Text(text = user?.role ?: "Rol", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = { menuOpen = false; onLogout() },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFE4E6)),
                        modifier = Modifier.fillMaxWidth(),
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

        // Borde inferior negro para diferenciar del cuerpo
        Spacer(modifier = Modifier.height(8.dp))
        Divider(color = Color.Black, thickness = 1.dp)
    }
}

@Composable
private fun ProgramCard(
    program: Programs,
    effectsCount: Int,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {}
) {
    Card(
        modifier = modifier
            .fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface,
        ),
        shape = RoundedCornerShape(16.dp),
        onClick = onClick
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                StatusChip(isActive = program.status)
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Filled.Edit, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    Icon(imageVector = Icons.Filled.PowerSettingsNew, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }

            Text(
                text = program.name,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                color = MaterialTheme.colorScheme.primary
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = program.description,
                style = MaterialTheme.typography.bodyMedium
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Efectos: $effectsCount",
                style = MaterialTheme.typography.bodySmall
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "ID: ${program.id}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.outline
            )
        }
    }
}

@Composable
private fun StatusChip(isActive: Boolean) {
    val bg = if (isActive) Color(0xFFDCFCE7) else Color(0xFFFEE2E2)
    val fg = if (isActive) Color(0xFF16A34A) else Color(0xFFDC2626)
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