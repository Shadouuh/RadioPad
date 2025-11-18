package com.marioprojects.radiopad.domain.use_case.programs

import com.marioprojects.radiopad.domain.repository.programs.ProgramRepository
import javax.inject.Inject

class GetUserProgramsUseCase @Inject constructor(
    private val repository: ProgramRepository
) {
    suspend operator fun invoke() = repository.getUserPrograms()
}