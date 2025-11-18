package com.marioprojects.radiopad.data.repository.sounds

import com.marioprojects.radiopad.data.mappers.sounds.toDomain
import com.marioprojects.radiopad.data.remote.sounds.SoundApiService
import com.marioprojects.radiopad.domain.model.sounds.ProgramSound
import com.marioprojects.radiopad.domain.repository.sounds.SoundRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SoundRepositoryImpl @Inject constructor(
    private val api: SoundApiService
) : SoundRepository {

    override suspend fun getProgramSounds(programId: Long): Result<List<ProgramSound>> {
        return try {
            val response = api.getProgramSounds(programId)
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
}