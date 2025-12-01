package com.marioprojects.radiopad.domain.use_case.sounds

import com.marioprojects.radiopad.domain.repository.sounds.SoundRepository
import javax.inject.Inject

class DeleteProgramSoundUseCase @Inject constructor(
    private val repository: SoundRepository
) {
    suspend operator fun invoke(soundId: Long) = repository.deleteProgramSound(soundId)
}