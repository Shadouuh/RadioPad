package com.marioprojects.radiopad.ui.screens.auth.data.remote

import com.marioprojects.radiopad.ui.screens.auth.data.remote.dto.LoginResponseDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body request: Map<String, String>): Response<LoginResponseDto>
}


