package com.marioprojects.radiopad.data.mappers.programs

import com.marioprojects.radiopad.data.local.auth.dto.ProgramsDto
import com.marioprojects.radiopad.domain.model.auth.Programs

fun ProgramsDto.toDomain(): Programs = Programs(
    id = id,
    name = name,
    description = description,
    status = status.equals("active", ignoreCase = true) || status.equals("Active", ignoreCase = true)
)