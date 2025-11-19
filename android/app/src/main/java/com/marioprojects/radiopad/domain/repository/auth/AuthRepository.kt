package com.marioprojects.radiopad.domain.repository.auth

import com.marioprojects.radiopad.domain.model.auth.User

interface AuthRepository {
    suspend fun login(email: String, password: String): Result<User>
}
