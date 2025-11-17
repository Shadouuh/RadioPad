package com.marioprojects.radiopad.ui.screens.auth.data.remote.dto

import com.google.gson.annotations.SerializedName

data class ConfigDto(
    @SerializedName("config_id") val configId?: Long,
    @SerializedName("effects_sounds") val effectsSounds: Int,
    val notify: Int,
    @SerializedName("dark_mode") val darkMode: Int
)
