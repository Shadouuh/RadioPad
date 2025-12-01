package com.marioprojects.radiopad.data.local.auth

import com.marioprojects.radiopad.data.local.auth.dto.LoginResponseDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body request: Map<String, String>): Response<LoginResponseDto>
}


