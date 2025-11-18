package com.marioprojects.radiopad.data.remote.programs

import com.marioprojects.radiopad.data.local.auth.dto.ProgramsDto
import retrofit2.Response
import retrofit2.http.GET

interface ProgramApiService {
    // Obtiene los programas del usuario autenticado
    @GET("programs/user/my-programs")
    suspend fun getUserPrograms(): Response<ApiListResponse<ProgramsDto>>
}

// Estructura genérica para respuestas con lista desde el backend
data class ApiListResponse<T>(
    val success: Boolean,
    val message: String?,
    val data: List<T>
)