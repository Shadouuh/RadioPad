package com.marioprojects.radiopad.data.remote.sounds.dto

import com.google.gson.annotations.SerializedName

data class ProgramSoundDto(
    val id: Long,
    val name: String,
    val description: String?,
    val duration: String?,
    val category: String?,
    @SerializedName("file_url") val fileUrl: String?,
    @SerializedName("program_id") val programId: Long,
    @SerializedName("created_at") val createdAt: String?
)