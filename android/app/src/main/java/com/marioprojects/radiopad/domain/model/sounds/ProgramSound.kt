package com.marioprojects.radiopad.domain.model.sounds

data class ProgramSound(
    val id: Long,
    val name: String,
    val description: String?,
    val duration: String?,
    val category: String?,
    val fileUrl: String?,
    val programId: Long
)