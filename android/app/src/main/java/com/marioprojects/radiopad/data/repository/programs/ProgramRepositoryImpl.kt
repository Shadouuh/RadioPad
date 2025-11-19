package com.marioprojects.radiopad.data.repository.programs

import com.marioprojects.radiopad.data.mappers.programs.toDomain
import com.marioprojects.radiopad.data.remote.programs.ProgramApiService
import com.marioprojects.radiopad.domain.model.auth.Programs
import com.marioprojects.radiopad.domain.repository.programs.ProgramRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ProgramRepositoryImpl @Inject constructor(
    private val api: ProgramApiService
) : ProgramRepository {

    override suspend fun getUserPrograms(): Result<List<Programs>> {
        return try {
            val response = api.getUserPrograms()
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success) {
                    Result.success(body.data.map { it.toDomain() })
                } else {
                    Result.failure(Exception(body?.message ?: "Respuesta inválida"))
                }
            } else {
                Result.failure(Exception("Error HTTP ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun toggleProgramStatus(programId: Long): Result<Programs> {
        return try {
            val response = api.toggleProgramStatus(programId)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success) {
                    Result.success(body.data.toDomain())
                } else {
                    Result.failure(Exception(body?.message ?: "Respuesta inválida"))
                }
            } else {
                Result.failure(Exception("Error HTTP ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}