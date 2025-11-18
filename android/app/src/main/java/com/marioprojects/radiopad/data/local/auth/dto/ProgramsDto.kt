package com.marioprojects.radiopad.data.local.auth.dto

import com.google.gson.annotations.SerializedName

data class ProgramsDto(
    val id: Long,
    val name: String,
    val description: String,
    val status: String
)
