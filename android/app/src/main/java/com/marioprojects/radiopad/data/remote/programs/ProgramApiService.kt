package com.marioprojects.radiopad.data.remote.programs

import com.marioprojects.radiopad.data.local.auth.dto.ProgramsDto
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.Path

interface ProgramApiService {
    // Obtiene los programas del usuario autenticado
    @GET("programs/user/my-programs")
    suspend fun getUserPrograms(): Response<ApiListResponse<ProgramsDto>>

    // Cambia el estado (Active/Inactive) de un programa
    @PATCH("programs/{id}/toggle-status")
    suspend fun toggleProgramStatus(@Path("id") id: Long): Response<ApiItemResponse<ProgramsDto>>
}

// Estructura genérica para respuestas con lista desde el backend
data class ApiListResponse<T>(
    val success: Boolean,
    val message: String?,
    val data: List<T>
)

// Respuesta genérica para un solo item
data class ApiItemResponse<T>(
    val success: Boolean,
    val message: String?,
    val data: T
)