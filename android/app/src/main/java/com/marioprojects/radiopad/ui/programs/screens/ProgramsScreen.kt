package com.marioprojects.radiopad.ui.programs.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.marioprojects.radiopad.domain.model.auth.Programs

@Composable
fun ProgramsScreen(
    programs: List<Programs>,
    isLoading: Boolean,
    errorMessage: String?,
    soundsCountByProgram: Map<Long, Int> = emptyMap(),
    onRequestProgramSounds: (Long) -> Unit = {},
    onProgramClick: (Programs) -> Unit = {}
) {
    when {
        isLoading -> {
            // Indicador de carga simple
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
                    .padding(20.dp)
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
        onClick = onClick
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
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
                text = if (program.status) "Estado: Activo" else "Estado: Inactivo",
                style = MaterialTheme.typography.bodySmall,
                color = if (program.status) MaterialTheme.colorScheme.tertiary else MaterialTheme.colorScheme.outline
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Efectos: $effectsCount",
                style = MaterialTheme.typography.bodySmall
            )

            Text(
                text = "ID: ${program.id}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.outline
            )
        }
    }
}