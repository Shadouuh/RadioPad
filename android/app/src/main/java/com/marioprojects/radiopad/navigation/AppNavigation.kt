package com.marioprojects.radiopad.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.marioprojects.radiopad.ui.screens.auth.ui.LoginScreen
import com.marioprojects.radiopad.ui.screens.programs.ui.ProgramsScreen
import com.marioprojects.radiopad.ui.screens.auth.domain.model.User

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    val currentUserState = remember { mutableStateOf<User?>(null) }

    NavHost(
        navController = navController,
        startDestination = "login"
    ) {
        composable("login") {
            LoginScreen(
                onLoginSuccess = { user ->
                    currentUserState.value = user
                    navController.navigate("programs") {
                        popUpTo("login") { inclusive = true }
                    }
                }
            )
        }
        composable("programs") {
            ProgramsScreen(programs = currentUserState.value?.programs ?: emptyList())
        }
    }
}
