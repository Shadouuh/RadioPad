package com.marioprojects.radiopad.ui.screens.auth.domain.repository

import com.marioprojects.radiopad.ui.screens.auth.domain.model.User

interface AuthRepository {
    suspend fun login(email: String, password: String): Result<User>
}
