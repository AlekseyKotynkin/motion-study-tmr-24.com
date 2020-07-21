package com.TMR24.MotionStudy;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class StartActivity extends AppCompatActivity {
    private Button buttonGo;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start);
    }
    public void buttonGo(View view)
    {
        Intent i = new Intent(StartActivity.this, MainActivity.class);
        startActivity(i);
    }
}