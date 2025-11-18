package com.marioprojects.radiopad.di.network

import com.marioprojects.radiopad.data.local.auth.ApiService
import com.marioprojects.radiopad.data.remote.programs.ProgramApiService
import com.marioprojects.radiopad.data.remote.sounds.SoundApiService
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.JavaNetCookieJar
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton
import java.net.CookieManager
import java.net.CookiePolicy

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides @Singleton
    fun provideOkHttp(): OkHttpClient {
        val cookieManager = CookieManager()
        cookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ALL)
        return OkHttpClient.Builder()
            .cookieJar(JavaNetCookieJar(cookieManager))
            .build()
    }

    @Provides @Singleton
    fun provideRetrofit(okHttp: OkHttpClient): Retrofit =
        Retrofit.Builder()
            .baseUrl("http://192.168.0.70:5000/api/")
            .addConverterFactory(GsonConverterFactory.create())
            .client(okHttp)
            .build()

    @Provides
    @Singleton
    fun provideApiService(retrofit: Retrofit) =
        retrofit.create(ApiService::class.java)

    @Provides
    @Singleton
    fun provideProgramApiService(retrofit: Retrofit): ProgramApiService =
        retrofit.create(ProgramApiService::class.java)

    @Provides
    @Singleton
    fun provideSoundApiService(retrofit: Retrofit): SoundApiService =
        retrofit.create(SoundApiService::class.java)
}
