plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt.android)
    // Migramos Hilt a KSP para evitar fallos de KAPT
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.marioprojects.radiopad"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.marioprojects.radiopad"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        // AGP 8.x recomienda JDK 17
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        // Alinear con JDK 17 y evitar forzar language-version antigua
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    // Provide text APIs like KeyboardOptions, VisualTransformation
    implementation("androidx.compose.ui:ui-text")
    // Compose Foundation (some text/input helpers are here depending on BOM)
    implementation("androidx.compose.foundation:foundation")
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    // Material Icons Extended pack (para disponer de íconos como Wifi, Logout, MusicNote, etc.)
    implementation(libs.androidx.compose.material.icons.extended)

    // Retrofit + OkHttp
    implementation(libs.retrofit)
    implementation(libs.retrofit.converter.moshi)
    implementation(libs.okhttp.logging.interceptor)
    implementation(libs.okhttp.core)
    implementation(libs.okhttp.urlconnection)

    // Lifecycle + ViewModel + StateFlow (Kotlin)
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.1")

    // Gson
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")

    // Hilt for dependency injection (usando KSP en lugar de KAPT)
    implementation(libs.hilt.android)
    implementation("androidx.hilt:hilt-navigation-compose:1.3.0")
    ksp(libs.hilt.compiler)

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")

    // Jetpack Navigation (Compose)
    implementation(libs.androidx.navigation.compose)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}

// KAPT eliminado: usamos KSP para la generación de código de Hilt