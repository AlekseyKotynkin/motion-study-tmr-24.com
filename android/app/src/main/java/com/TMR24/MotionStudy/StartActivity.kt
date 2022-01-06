package com.TMR24.MotionStudy

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.TMR24.MotionStudy.MainActivity

class StartActivity : AppCompatActivity() {
    private val buttonGo: Button? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_start)
    }

    fun buttonGo(view: View?) {
        val i = Intent(this@StartActivity, MainActivity::class.java)
        startActivity(i)
    }
}