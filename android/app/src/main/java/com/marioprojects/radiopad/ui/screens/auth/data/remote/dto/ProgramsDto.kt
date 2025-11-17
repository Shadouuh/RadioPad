package com.marioprojects.radiopad.ui.screens.auth.data.remote.dto

import com.google.gson.annotations.SerializedName

data class ProgramsDto(
    val id: Long,
    val name: String,
    val description: String,
    val status: String
)
