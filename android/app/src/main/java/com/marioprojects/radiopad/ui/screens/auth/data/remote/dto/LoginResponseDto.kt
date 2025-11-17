package com.marioprojects.radiopad.ui.screens.auth.data.remote.dto

data class LoginResponseDto(
    val user: UserDto,
    val programs: List<ProgramsDto>?,
    val config: ConfigDto?
)
