package com.marioprojects.radiopad.ui.screens.auth.domain.repository

import com.marioprojects.radiopad.ui.screens.auth.data.mappers.toDomain
import com.marioprojects.radiopad.ui.screens.auth.data.remote.ApiService
import com.marioprojects.radiopad.ui.screens.auth.domain.model.User
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val api: ApiService
) : AuthRepository {

    override suspend fun login(email: String, password: String): Result<User> {
        return try {
            val response = api.login(mapOf("email" to email, "password" to password))
            if (response.isSuccessful) {
                response.body()?.let { dto ->
                    Result.success(dto.toDomain())
                } ?: Result.failure(Exception("Cuerpo de respuesta nulo"))
            } else {
                Result.failure(Exception("Error HTTP ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
