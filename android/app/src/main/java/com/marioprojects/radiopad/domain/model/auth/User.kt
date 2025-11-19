package com.marioprojects.radiopad.domain.model.auth

data class User(
    val userId: Long,
    val name: String?,
    val email: String?,
    val role: String?,
    val programs: List<Programs>,
    val config: Config?
)

data class Programs(
    val id: Long,
    val name: String,
    val description: String,
    val status: Boolean
)

data class Config(
    val configId: Long,
    val effectsSounds: Boolean,
    val notify: Boolean,
    val darkMode: Boolean
)
