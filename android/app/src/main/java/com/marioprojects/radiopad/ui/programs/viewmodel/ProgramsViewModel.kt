package com.marioprojects.radiopad.ui.programs.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.marioprojects.radiopad.domain.model.auth.Programs
import com.marioprojects.radiopad.domain.model.sounds.ProgramSound
import com.marioprojects.radiopad.domain.use_case.programs.GetUserProgramsUseCase
import com.marioprojects.radiopad.domain.use_case.sounds.GetProgramSoundsUseCase
import com.marioprojects.radiopad.domain.use_case.sounds.DeleteProgramSoundUseCase
import com.marioprojects.radiopad.domain.usecase.programs.ToggleProgramStatusUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProgramsViewModel @Inject constructor(
    private val getUserPrograms: GetUserProgramsUseCase,
    private val getProgramSounds: GetProgramSoundsUseCase,
    private val toggleProgramStatusUseCase: ToggleProgramStatusUseCase,
    private val deleteProgramSoundUseCase: DeleteProgramSoundUseCase
) : ViewModel() {

    private val _programs = MutableStateFlow<List<Programs>>(emptyList())
    val programs: StateFlow<List<Programs>> = _programs

    private val _soundsByProgram = MutableStateFlow<Map<Long, List<ProgramSound>>>(emptyMap())
    val soundsByProgram: StateFlow<Map<Long, List<ProgramSound>>> = _soundsByProgram

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    fun loadUserPrograms() = viewModelScope.launch {
        // Evitar llamadas duplicadas si ya estamos cargando o ya cargamos datos
        if (_loading.value || _programs.value.isNotEmpty()) return@launch
        _loading.value = true
        _error.value = null
        val result = getUserPrograms()
        result.fold(
            onSuccess = { _programs.value = it },
            onFailure = { _error.value = it.message }
        )
        _loading.value = false
    }

    fun loadProgramSounds(programId: Long) = viewModelScope.launch {
        // Evitar recargar si ya tenemos los sonidos de este programa
        if (_soundsByProgram.value.containsKey(programId)) return@launch
        val result = getProgramSounds(programId)
        result.fold(
            onSuccess = { sounds ->
                val map = _soundsByProgram.value.toMutableMap()
                map[programId] = sounds
                _soundsByProgram.value = map
            },
            onFailure = { _error.value = it.message }
        )
    }

    fun toggleProgramStatus(programId: Long) = viewModelScope.launch {
        _error.value = null
        val result = toggleProgramStatusUseCase(programId)
        result.fold(
            onSuccess = { updatedProgram ->
                val current = _programs.value.toMutableList()
                val idx = current.indexOfFirst { it.id == programId }
                if (idx >= 0) {
                    current[idx] = updatedProgram
                    _programs.value = current
                } else {
                    // Si no se encuentra, recargar por seguridad
                    loadUserPrograms()
                }
            },
            onFailure = { _error.value = it.message }
        )
    }

    fun deleteProgramSound(programId: Long, soundId: Long) = viewModelScope.launch {
        _error.value = null
        val result = deleteProgramSoundUseCase(soundId)
        result.fold(
            onSuccess = {
                // Remover el sonido del estado local
                val currentMap = _soundsByProgram.value.toMutableMap()
                val list = currentMap[programId]?.toMutableList() ?: mutableListOf()
                val idx = list.indexOfFirst { it.id == soundId }
                if (idx >= 0) {
                    list.removeAt(idx)
                    currentMap[programId] = list
                    _soundsByProgram.value = currentMap
                } else {
                    // Si no estaba cargado, forzar recarga de sonidos
                    _soundsByProgram.value = currentMap
                    // Opcional: recargar
                    // loadProgramSounds(programId)
                }
            },
            onFailure = { _error.value = it.message }
        )
    }
}