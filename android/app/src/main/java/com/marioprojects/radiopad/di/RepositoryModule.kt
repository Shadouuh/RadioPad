package com.marioprojects.radiopad.di

import com.marioprojects.radiopad.ui.screens.auth.domain.repository.AuthRepository
import com.marioprojects.radiopad.ui.screens.auth.domain.repository.AuthRepositoryImpl
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindAuthRepository(
        impl: AuthRepositoryImpl
    ): AuthRepository
}
