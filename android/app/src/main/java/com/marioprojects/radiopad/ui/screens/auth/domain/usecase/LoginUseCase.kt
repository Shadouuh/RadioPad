package com.marioprojects.radiopad.ui.screens.auth.domain.usecase

import com.marioprojects.radiopad.ui.screens.auth.domain.repository.AuthRepository
import javax.inject.Inject

class LoginUseCase @Inject constructor(
    private val repository: AuthRepository
) {
    suspend operator fun invoke(email: String, password: String) =
        repository.login(email, password)
}
