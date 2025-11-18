package com.marioprojects.radiopad.di.programs

import com.marioprojects.radiopad.domain.repository.programs.ProgramRepository
import com.marioprojects.radiopad.data.repository.programs.ProgramRepositoryImpl
import com.marioprojects.radiopad.domain.repository.sounds.SoundRepository
import com.marioprojects.radiopad.data.repository.sounds.SoundRepositoryImpl
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
    abstract fun bindProgramRepository(
        impl: ProgramRepositoryImpl
    ): ProgramRepository

    @Binds
    @Singleton
    abstract fun bindSoundRepository(
        impl: SoundRepositoryImpl
    ): SoundRepository
}