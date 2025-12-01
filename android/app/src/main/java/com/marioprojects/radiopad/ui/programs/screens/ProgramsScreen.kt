package com.marioprojects.radiopad.ui.programs.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
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
import androidx.compose.material.icons.filled.PowerSettingsNew
import androidx.compose.material.icons.filled.Logout
import androidx.compose.ui.unit.DpOffset
import androidx.compose.foundation.BorderStroke

@Composable
fun ProgramsScreen(
    programs: List<Programs>,
    isLoading: Boolean,
    errorMessage: String?,
    user: User? = null,
    soundsCountByProgram: Map<Long, Int> = emptyMap(),
    onRequestProgramSounds: (Long) -> Unit = {},
    onProgramClick: (Programs) -> Unit = {},
    onLogout: () -> Unit = {},
    onToggleProgramStatus: (programId: Long, newStatus: Boolean) -> Unit = { _, _ -> }
) {
    var showAccountSheet by remember { mutableStateOf(false) }
    Scaffold(
        topBar = { UserNavbarTopBar(user = user, onLogout = onLogout, onOpenSheet = { showAccountSheet = true }) },
        containerColor = Color.White
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
                .padding(innerPadding)
        ) {
            // Contenido principal
            Column(modifier = Modifier.fillMaxSize()) {
            // Card superior con título y mensaje (sin botón)
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color.White
                ),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Icon(imageVector = Icons.Filled.MusicNote, contentDescription = null, tint = Color(0xFF111827))
                        Text(
                            text = "Gestión de Programas",
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                            color = Color(0xFF111827)
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Crea y administra programas con sus efectos de sonido",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color(0xFF111827)
                    )
                    // Separación con línea negra
                    Spacer(modifier = Modifier.height(12.dp))
                    Divider(color = Color.Black, thickness = 1.dp)
                    Spacer(modifier = Modifier.height(12.dp))

                    // Card interna con fondo blanco que contiene el listado
                    Card(
                        modifier = Modifier
                            .fillMaxWidth(),
                        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = Color.White
                        ),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Icon(imageVector = Icons.Filled.MusicNote, contentDescription = null, tint = Color(0xFF111827))
                                Text(
                                    text = "Programas",
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                                    color = Color(0xFF111827)
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Selecciona un programa para ver sus efectos",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color(0xFF111827)
                            )

                            // Lista de programas dentro del card
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
                                            .fillMaxWidth()
                                            .padding(top = 12.dp)
                                    ) {
                                        items(programs) { program ->
                                            // Solicitar los sonidos para poder mostrar el conteo
                                            androidx.compose.runtime.LaunchedEffect(program.id) {
                                                if (soundsCountByProgram[program.id] == null) {
                                                    onRequestProgramSounds(program.id)
                                                }
                                            }
                                            val effectsCount = soundsCountByProgram[program.id] ?: 0
                                            val isProducer = user?.role?.equals("Productor", ignoreCase = true) == true
                                            ProgramCard(
                                                program = program,
                                                effectsCount = effectsCount,
                                                onClick = { onProgramClick(program) },
                                                showToggleButton = !isProducer,
                                                onToggleStatus = { id, newStatus -> onToggleProgramStatus(id, newStatus) }
                                            )
                                            Spacer(modifier = Modifier.height(12.dp))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            } // FIN Contenido principal
            // Sheet inferior para cuenta
            if (showAccountSheet) {
                // Scrim de fondo para cerrar
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0x66000000))
                        .clickable { showAccountSheet = false }
                )
                // Contenido del sheet anclado al borde inferior de la pantalla
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.BottomCenter
                ) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 0.dp, vertical = 0.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 12.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp)
                    ) {
                        Column(modifier = Modifier.fillMaxWidth()) {
                            // Sección superior gris claro — cubrir todo el ancho
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0xFFF3F4F6))
                                    .padding(horizontal = 24.dp, vertical = 16.dp)
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

                            // Sección inferior blanca — botón de cerrar sesión
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color.White)
                                    .padding(horizontal = 24.dp, vertical = 16.dp)
                            ) {
                                Button(
                                    onClick = { showAccountSheet = false; onLogout() },
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
    }
}

@Composable
private fun UserNavbarTopBar(user: User?, onLogout: () -> Unit = {}, onOpenSheet: () -> Unit = {}) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        androidx.compose.foundation.layout.Box {
            // Empujar el contenido del navbar hacia la derecha
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Start
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Avatar redondo con inicial (más grande para una percepción más "redonda")
                    val initial = (user?.name?.firstOrNull() ?: 'U').uppercaseChar()
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF0F172A)),
                        contentAlignment = Alignment.Center
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
                            .clickable { onOpenSheet() },
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(
                            text = user?.name ?: "Usuario",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                            color = Color(0xFF111827)
                        )
                        Text(
                            text = user?.role ?: "Rol",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color(0xFF111827)
                        )
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
    onClick: () -> Unit = {},
    showToggleButton: Boolean = true,
    onToggleStatus: (programId: Long, newStatus: Boolean) -> Unit = { _, _ -> }
) {
    Card(
        modifier = modifier
            .fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White,
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
                    // Botón de activar/desactivar programa: solo visible si el usuario NO es productor
                    if (showToggleButton) {
                        val powerColor = if (program.status) Color(0xFF16A34A) else Color(0xFFDC2626) // verde si activo, rojo si inactivo
                        Icon(
                            imageVector = Icons.Filled.PowerSettingsNew,
                            contentDescription = if (program.status) "Desactivar programa" else "Activar programa",
                            tint = powerColor,
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .clickable { onToggleStatus(program.id, !program.status) }
                        )
                    }
                }
            }

            Text(
                text = program.name,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                color = Color(0xFF111827)
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = program.description,
                style = MaterialTheme.typography.bodyMedium,
                color = Color(0xFF111827)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Efectos: $effectsCount",
                style = MaterialTheme.typography.bodySmall,
                color = Color(0xFF111827)
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