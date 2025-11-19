package com.marioprojects.radiopad.domain.usecase.programs

import com.marioprojects.radiopad.domain.model.auth.Programs
import com.marioprojects.radiopad.domain.repository.programs.ProgramRepository
import javax.inject.Inject

class ToggleProgramStatusUseCase @Inject constructor(
    private val repository: ProgramRepository
) {
    suspend operator fun invoke(programId: Long): Result<Programs> {
        return repository.toggleProgramStatus(programId)
    }
}