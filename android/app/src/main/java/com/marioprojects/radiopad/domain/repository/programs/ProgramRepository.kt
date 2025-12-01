package com.marioprojects.radiopad.domain.repository.programs

import com.marioprojects.radiopad.domain.model.auth.Programs

interface ProgramRepository {
    suspend fun getUserPrograms(): Result<List<Programs>>
    suspend fun toggleProgramStatus(programId: Long): Result<Programs>
}