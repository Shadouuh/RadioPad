package com.marioprojects.radiopad.ui.screens.auth.data.remote.dto

import com.google.gson.annotations.SerializedName

data class UserDto(
    @SerializedName("user_id") val userId: Long,
    val name: String,
    val email: String,
    val role: String,
    val programs: List<ProgramsDto>?,
    val config: ConfigDto?
)
