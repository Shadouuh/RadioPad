package com.marioprojects.radiopad.data.local.auth.dto

import com.google.gson.annotations.SerializedName

data class UserDto(
    @SerializedName("user_id") val userId: Long,
    val name: String,
    val email: String,
    val role: String,
    val programs: List<ProgramsDto>?,
    val config: ConfigDto?
)
