package com.marioprojects.radiopad.ui.auth.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.marioprojects.radiopad.domain.model.auth.User
import com.marioprojects.radiopad.domain.use_case.auth.LoginUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val loginUseCase: LoginUseCase
) : ViewModel() {

    val uiState = MutableStateFlow<AuthState>(AuthState.Idle)

    fun login(email: String, password: String) = viewModelScope.launch {
        uiState.value = AuthState.Loading
        val result = loginUseCase(email, password)
        result.fold(
            onSuccess = { uiState.value = AuthState.Success(it) },
            onFailure = { uiState.value = AuthState.Error(it.message ?: "Error") }
        )
    }
}

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    data class Success(val user: User) : AuthState()
    data class Error(val message: String) : AuthState()
}
