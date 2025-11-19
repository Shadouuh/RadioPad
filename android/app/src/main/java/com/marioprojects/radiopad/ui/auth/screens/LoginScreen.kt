package com.marioprojects.radiopad.ui.auth.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.ui.draw.drawBehind
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
// keyboardOptions es opcional; se puede omitir si hay problemas de resolución
// import androidx.compose.ui.text.input.KeyboardOptions
// import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material.icons.filled.Wifi
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import android.graphics.Bitmap
import android.graphics.Canvas as AndroidCanvas
import android.graphics.Paint as AndroidPaint

@Composable
fun LoginScreen(
    modifier: Modifier = Modifier,
    isLoading: Boolean = false,
    errorMessage: String? = null,
    onLogin: (email: String, password: String, rememberMe: Boolean) -> Unit = { _, _, _ -> }
) {

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }
    var rememberMe by remember { mutableStateOf(false) }

    // Patrón de puntos dibujado una sola vez, cacheado en un Bitmap
    var containerSize by remember { mutableStateOf(androidx.compose.ui.unit.IntSize.Zero) }
    var patternBitmap by remember { mutableStateOf<Bitmap?>(null) }
    val density = LocalDensity.current

    LaunchedEffect(containerSize) {
        if (containerSize.width > 0 && containerSize.height > 0) {
            // Generar el bitmap del patrón sólo cuando cambia el tamaño del contenedor
            val width = containerSize.width
            val height = containerSize.height
            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
            val canvas = AndroidCanvas(bitmap)
            val paint = AndroidPaint().apply {
                isAntiAlias = true
                color = android.graphics.Color.parseColor("#E9ECEF")
            }
            val spacingPx = with(density) { 24.dp.toPx() }
            val radiusPx = with(density) { 1.5.dp.toPx() }
            var x = 0f
            while (x < width) {
                var y = 0f
                while (y < height) {
                    canvas.drawCircle(x, y, radiusPx, paint)
                    y += spacingPx
                }
                x += spacingPx
            }
            patternBitmap = bitmap
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFF5F7FA))
            .onSizeChanged { containerSize = it },
        contentAlignment = Alignment.Center
    ) {
        // Fondo cacheado
        patternBitmap?.let { bmp ->
            Image(
                bitmap = bmp.asImageBitmap(),
                contentDescription = null,
                modifier = Modifier.fillMaxSize()
            )
        }
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(
                modifier = Modifier
                    .padding(horizontal = 20.dp, vertical = 24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Ícono circular superior
                Box(
                    modifier = Modifier
                        .align(Alignment.CenterHorizontally)
                        .size(64.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF0F172A)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Filled.Wifi, contentDescription = null, tint = Color.White)
                }
                // Título y subtítulo
                Text(
                    text = "RadioPad",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                    color = Color(0xFF111827),
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                )
                Text(
                    text = "Ingresa tus credenciales para acceder al sistema",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color(0xFF6B7280),
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                )

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    placeholder = { Text("usuario@radiopad.com") },
                    singleLine = true,
                    leadingIcon = { Icon(Icons.Filled.Email, contentDescription = null, tint = Color(0xFF9CA3AF)) },
                    // keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    colors = TextFieldDefaults.colors(
                        focusedIndicatorColor = Color(0xFF3B82F6), // azul focus (Client)
                        unfocusedIndicatorColor = Color(0xFFD1D5DB), // gris borde
                        cursorColor = Color(0xFF3B82F6),
                        focusedTextColor = Color(0xFF6B7280), // gris texto
                        unfocusedTextColor = Color(0xFF6B7280),
                        focusedLabelColor = Color(0xFF374151),
                        unfocusedLabelColor = Color(0xFF374151),
                        focusedLeadingIconColor = Color(0xFF9CA3AF),
                        unfocusedLeadingIconColor = Color(0xFF9CA3AF),
                        focusedTrailingIconColor = Color(0xFF9CA3AF),
                        unfocusedTrailingIconColor = Color(0xFF9CA3AF),
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White,
                        focusedPlaceholderColor = Color(0xFF9CA3AF),
                        unfocusedPlaceholderColor = Color(0xFF9CA3AF)
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Contraseña") },
                    placeholder = { Text("••••••••") },
                    singleLine = true,
                    visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                    leadingIcon = { Icon(Icons.Filled.Lock, contentDescription = null, tint = Color(0xFF9CA3AF)) },
                    // keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    colors = TextFieldDefaults.colors(
                        focusedIndicatorColor = Color(0xFF3B82F6),
                        unfocusedIndicatorColor = Color(0xFFD1D5DB),
                        cursorColor = Color(0xFF3B82F6),
                        focusedTextColor = Color(0xFF6B7280),
                        unfocusedTextColor = Color(0xFF6B7280),
                        focusedLabelColor = Color(0xFF374151),
                        unfocusedLabelColor = Color(0xFF374151),
                        focusedLeadingIconColor = Color(0xFF9CA3AF),
                        unfocusedLeadingIconColor = Color(0xFF9CA3AF),
                        focusedTrailingIconColor = Color(0xFF9CA3AF),
                        unfocusedTrailingIconColor = Color(0xFF9CA3AF),
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White,
                        focusedPlaceholderColor = Color(0xFF9CA3AF),
                        unfocusedPlaceholderColor = Color(0xFF9CA3AF)
                    ),
                    trailingIcon = {
                        IconButton(onClick = { showPassword = !showPassword }) {
                            Icon(
                                imageVector = if (showPassword) Icons.Filled.VisibilityOff else Icons.Filled.Visibility,
                                contentDescription = if (showPassword) "Ocultar" else "Mostrar",
                                tint = Color(0xFF9CA3AF)
                            )
                        }
                    },
                    modifier = Modifier.fillMaxWidth()
                )

                // Eliminado botón "Recordarme" según solicitud del usuario

                if (!errorMessage.isNullOrBlank()) {
                    Text(
                        text = errorMessage,
                        color = Color(0xFFDC2626),
                        style = MaterialTheme.typography.bodyMedium
                    )
                }

                Button(
                    onClick = {
                        if (!isLoading) onLogin(email.trim(), password, rememberMe)
                    },
                    enabled = !isLoading,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF111827), // azul oscuro solicitado
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(if (isLoading) "Ingresando…" else "Iniciar Sesión", color = Color.White)
                }

                Spacer(modifier = Modifier.height(12.dp))
                Divider(color = Color(0xFFE5E7EB))
                Spacer(modifier = Modifier.height(12.dp))
                TextButton(onClick = { /* TODO: recuperar contraseña */ }, modifier = Modifier.align(Alignment.Start)) {
                    Text("¿Olvidaste tu contraseña?", color = Color(0xFF6B7280))
                }
            }
        }
    }
}
