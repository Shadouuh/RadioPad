package com.marioprojects.radiopad.ui.screens.auth.data.mappers

import com.marioprojects.radiopad.ui.screens.auth.data.remote.dto.LoginResponseDto
import com.marioprojects.radiopad.ui.screens.auth.domain.model.*

fun LoginResponseDto.toDomain(): User {
    val programsDomain = this.user.programs?.map { programDto ->
        Programs(
            id = programDto.id,
            name = programDto.name,
            description = programDto.description,
            status = programDto.status.equals("Active", ignoreCase = true)
        )
    }

    val configDomain = this.user.config?.let { configDto ->
        Config(
            configId = configDto.configId,
            effectsSounds = configDto.effectsSounds,
            notify = configDto.notify,
            darkMode = configDto.darkMode
        )
    }

    return User(
        userId = user.userId,
        name = user.name,
        email = user.email,
        role = user.role,
        programs = programsDomain ?: emptyList(),
        config = configDomain
    )
}
