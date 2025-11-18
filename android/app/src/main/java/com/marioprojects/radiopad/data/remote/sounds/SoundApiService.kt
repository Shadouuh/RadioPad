package com.marioprojects.radiopad.data.remote.sounds

import com.marioprojects.radiopad.data.remote.programs.ApiListResponse
import com.marioprojects.radiopad.data.remote.sounds.dto.ProgramSoundDto
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path

interface SoundApiService {
    @GET("sounds/program/{programId}")
    suspend fun getProgramSounds(
        @Path("programId") programId: Long
    ): Response<ApiListResponse<ProgramSoundDto>>
}