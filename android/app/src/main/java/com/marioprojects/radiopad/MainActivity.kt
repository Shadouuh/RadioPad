package com.marioprojects.radiopad

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
<<<<<<< HEAD
import com.marioprojects.radiopad.ui.theme.RadioPadTheme
import com.marioprojects.radiopad.ui.navigation.AppNavHost
=======
import androidx.compose.ui.tooling.preview.Preview
import com.marioprojects.radiopad.navigation.AppNavigation
import com.marioprojects.radiopad.ui.theme.RadioPadTheme
import dagger.hilt.android.AndroidEntryPoint
>>>>>>> 5519c967263b27a178bff92e91c9d70c3948df3f

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
<<<<<<< HEAD
            RadioPadTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    AppNavHost()
                }
            }
=======
            AppNavigation()
>>>>>>> 5519c967263b27a178bff92e91c9d70c3948df3f
        }
    }
}

