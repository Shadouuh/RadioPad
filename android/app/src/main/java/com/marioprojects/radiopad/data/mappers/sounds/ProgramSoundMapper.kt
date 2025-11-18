package com.marioprojects.radiopad.data.mappers.sounds

import com.marioprojects.radiopad.data.remote.sounds.dto.ProgramSoundDto
import com.marioprojects.radiopad.domain.model.sounds.ProgramSound

fun ProgramSoundDto.toDomain(): ProgramSound = ProgramSound(
    id = id,
    name = name,
    description = description,
    duration = duration,
    category = category,
    fileUrl = fileUrl,
    programId = programId
)