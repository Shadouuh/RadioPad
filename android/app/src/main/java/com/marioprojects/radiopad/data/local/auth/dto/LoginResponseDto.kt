package com.marioprojects.radiopad.data.local.auth.dto

data class LoginResponseDto(
    val user: UserDto,
    val programs: List<ProgramsDto>?,
    val config: ConfigDto?
)
