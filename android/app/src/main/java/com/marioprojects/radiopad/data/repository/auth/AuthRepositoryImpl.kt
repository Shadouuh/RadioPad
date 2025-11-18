package com.marioprojects.radiopad.data.repository.auth

import com.marioprojects.radiopad.data.mappers.auth.toDomain
import com.marioprojects.radiopad.data.local.auth.ApiService
import com.marioprojects.radiopad.domain.model.auth.User
import com.marioprojects.radiopad.domain.repository.auth.AuthRepository
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
