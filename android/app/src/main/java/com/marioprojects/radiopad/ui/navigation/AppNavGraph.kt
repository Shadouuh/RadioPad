package com.marioprojects.radiopad.ui.navigation

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.LaunchedEffect
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.marioprojects.radiopad.ui.auth.screens.LoginScreen
import com.marioprojects.radiopad.ui.auth.viewmodel.LoginViewModel
import com.marioprojects.radiopad.ui.auth.viewmodel.AuthState
import com.marioprojects.radiopad.ui.programs.screens.ProgramsScreen
import com.marioprojects.radiopad.ui.programs.viewmodel.ProgramsViewModel

// Definición de rutas de la app (simple y coherente con las secciones)
sealed class Screen(val route: String) {
    data object Login : Screen("auth/login")
    data object Register : Screen("auth/register")
    data object Programs : Screen("programs")
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
            val vm: LoginViewModel = hiltViewModel()
            val state = vm.uiState.collectAsState().value
            LoginScreen(
                isLoading = state is AuthState.Loading,
                errorMessage = (state as? AuthState.Error)?.message,
                onLogin = { email, password, _ -> vm.login(email, password) },
                onNavigateToRegister = { navController.navigate(Screen.Register.route) }
            )

            if (state is AuthState.Success) {
                // Navegar a la lista de programas una vez logueado
                navController.navigate(Screen.Programs.route) {
                    popUpTo(Screen.Login.route) { inclusive = true }
                }
            }
        }

        composable(Screen.Register.route) {
            // TODO: Implementar RegisterScreen más adelante
            Text("Registro (próximamente)")
        }

        composable(Screen.Programs.route) {
            val vm: ProgramsViewModel = hiltViewModel()
            val programs = vm.programs.collectAsState().value
            val isLoading = vm.loading.collectAsState().value
            val errorMessage = vm.error.collectAsState().value

            // Cargar una sola vez al entrar en la pantalla
            LaunchedEffect(Unit) {
                vm.loadUserPrograms()
            }

            ProgramsScreen(
                programs = programs,
                isLoading = isLoading,
                errorMessage = errorMessage
            )
        }
    }
}