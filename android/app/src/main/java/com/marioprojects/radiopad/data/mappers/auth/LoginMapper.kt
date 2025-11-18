package com.marioprojects.radiopad.data.mappers.auth

import com.marioprojects.radiopad.data.local.auth.dto.LoginResponseDto
import com.marioprojects.radiopad.domain.model.auth.*

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
            configId = configDto.configId ?: 0L,
            effectsSounds = (configDto.effectsSounds == 1),
            notify = (configDto.notify == 1),
            darkMode = (configDto.darkMode == 1)
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
