package com.marioprojects.radiopad.domain.use_case.sounds

import com.marioprojects.radiopad.domain.repository.sounds.SoundRepository
import javax.inject.Inject

class GetProgramSoundsUseCase @Inject constructor(
    private val repository: SoundRepository
) {
    suspend operator fun invoke(programId: Long) = repository.getProgramSounds(programId)
}