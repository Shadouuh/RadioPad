package com.marioprojects.radiopad.domain.repository.sounds

import com.marioprojects.radiopad.domain.model.sounds.ProgramSound

interface SoundRepository {
    suspend fun getProgramSounds(programId: Long): Result<List<ProgramSound>>
}