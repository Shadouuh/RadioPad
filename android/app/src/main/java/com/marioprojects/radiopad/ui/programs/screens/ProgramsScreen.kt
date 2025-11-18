package com.marioprojects.radiopad.ui.programs.screens

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.marioprojects.radiopad.domain.model.auth.Programs

@Composable
fun ProgramsScreen(
    programs: List<Programs>,
    isLoading: Boolean,
    errorMessage: String?
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
                    Text(text = program.name)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = program.description)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = if (program.status) "Activo" else "Inactivo")
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = "ID: ${program.id}")
                    Spacer(modifier = Modifier.height(12.dp))
                    HorizontalDivider()
                    Spacer(modifier = Modifier.height(12.dp))
                }
            }
        }
    }
}