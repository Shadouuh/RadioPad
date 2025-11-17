package com.marioprojects.radiopad.ui.navigation

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.marioprojects.radiopad.ui.screens.auth.ui.LoginScreen

// Definición de rutas de la app (simple y coherente con las secciones)
sealed class Screen(val route: String) {
    data object Login : Screen("auth/login")
    data object Register : Screen("auth/register")
    data object Dashboard : Screen("dashboard")
}

/**
 * NavHost principal de la app: inicia en Login y navega a Dashboard o Register.
 * Por ahora las pantallas de Register/Dashboard son placeholders para facilitar el flujo.
 */
@Composable
fun AppNavHost(
    navController: NavHostController = rememberNavController(),
    startDestination: String = Screen.Login.route
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLogin = { _, _, _ ->
                    // TODO: Integrar con ViewModel y backend; de momento navega a dashboard
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                },
                onNavigateToRegister = {
                    navController.navigate(Screen.Register.route)
                }
            )
        }

        composable(Screen.Register.route) {
            // TODO: Implementar RegisterScreen más adelante
            Text("Registro (próximamente)")
        }

        composable(Screen.Dashboard.route) {
            // TODO: Reemplazar con pantalla real del dashboard (Home)
            Text("Dashboard (placeholder)")
        }
    }
}