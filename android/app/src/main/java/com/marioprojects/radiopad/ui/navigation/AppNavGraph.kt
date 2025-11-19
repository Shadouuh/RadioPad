package com.marioprojects.radiopad.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
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
import com.marioprojects.radiopad.domain.model.auth.User

// Definición de rutas de la app (simple y coherente con las secciones)
sealed class Screen(val route: String) {
    data object Login : Screen("auth/login")
    data object Programs : Screen("programs")
    data object ProgramSounds : Screen("program/{programId}/sounds")
}

/**
 * NavHost principal de la app: inicia en Login y navega a Programs al autenticarse.
 */
@Composable
fun AppNavHost(
    navController: NavHostController = rememberNavController(),
    startDestination: String = Screen.Login.route
) {
    var currentUser by remember { mutableStateOf<User?>(null) }
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
                onLogin = { email, password, _ -> vm.login(email, password) }
            )

            // Navegar solo cuando el estado cambie a Success (evitar múltiples navegaciones)
            LaunchedEffect(state) {
                if (state is AuthState.Success) {
                    currentUser = state.user
                    navController.navigate(Screen.Programs.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            }
        }

        composable(Screen.Programs.route) {
            val vm: ProgramsViewModel = hiltViewModel()
            val programs = vm.programs.collectAsState().value
            val isLoading = vm.loading.collectAsState().value
            val errorMessage = vm.error.collectAsState().value
            val soundsByProgram = vm.soundsByProgram.collectAsState().value

            // Cargar una sola vez al entrar en la pantalla
            LaunchedEffect(Unit) {
                vm.loadUserPrograms()
            }

            ProgramsScreen(
                programs = programs,
                isLoading = isLoading,
                errorMessage = errorMessage,
                user = currentUser,
                soundsCountByProgram = soundsByProgram.mapValues { it.value.size },
                onRequestProgramSounds = { id -> vm.loadProgramSounds(id) },
                onProgramClick = { program ->
                    navController.navigate("program/${program.id}/sounds")
                },
                onToggleProgramStatus = { programId, _ ->
                    vm.toggleProgramStatus(programId)
                },
                onLogout = {
                    currentUser = null
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Programs.route) { inclusive = true }
                    }
                }
            )
        }

        composable(
            route = Screen.ProgramSounds.route,
            arguments = listOf(
                androidx.navigation.navArgument("programId") { type = androidx.navigation.NavType.LongType }
            )
        ) { backStackEntry ->
            val vm: ProgramsViewModel = hiltViewModel()
            val programId = backStackEntry.arguments?.getLong("programId") ?: 0L
            val soundsMap = vm.soundsByProgram.collectAsState().value
            val errorMessage = vm.error.collectAsState().value
            val programs = vm.programs.collectAsState().value
            val currentProgram = programs.firstOrNull { it.id == programId }

            LaunchedEffect(programId) {
                vm.loadProgramSounds(programId)
            }

            com.marioprojects.radiopad.ui.sounds.screens.ProgramSoundsScreen(
                sounds = soundsMap[programId] ?: emptyList(),
                errorMessage = errorMessage,
                onBack = { navController.popBackStack() },
                user = currentUser,
                program = currentProgram,
                onLogout = {
                    currentUser = null
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Programs.route) { inclusive = true }
                    }
                },
                onDeleteSound = { pid, soundId ->
                    vm.deleteProgramSound(pid, soundId)
                }
            )
        }
    }
}