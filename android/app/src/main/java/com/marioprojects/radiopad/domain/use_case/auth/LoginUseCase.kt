package com.marioprojects.radiopad.domain.use_case.auth

import com.marioprojects.radiopad.domain.repository.auth.AuthRepository
import javax.inject.Inject

class LoginUseCase @Inject constructor(
    private val repository: AuthRepository
) {
    suspend operator fun invoke(email: String, password: String) =
        repository.login(email, password)
}
