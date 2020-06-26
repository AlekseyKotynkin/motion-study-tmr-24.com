package com.TMR24.MotionStudy;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import static android.view.View.VISIBLE;


public class MainActivity extends AppCompatActivity {
private EditText editTextLogin, editTextPassword;
private FirebaseAuth mAuth;
private Button buttonToBegin, toComeIn, buttonExit;
private TextView textHello;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        init();
    }
    @Override
    public void onStart() {
        super.onStart();
        // Check if user is signed in (non-null) and update UI accordingly.
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser != null)
        {
            buttonToBegin.setVisibility(VISIBLE);
            textHello.setVisibility(VISIBLE);
            buttonExit.setVisibility(VISIBLE);
            editTextLogin.setVisibility(View.GONE);
            editTextPassword.setVisibility(View.GONE);
            toComeIn.setVisibility(View.GONE);
            String userName = "You are logged in as - "+ currentUser.getEmail();
            textHello.setText(userName);


            Toast.makeText(this, "User not null", Toast.LENGTH_SHORT).show();
        }
            else
            {
                buttonToBegin.setVisibility(View.GONE);
                buttonExit.setVisibility(View.GONE);
                textHello.setVisibility(View.GONE);
                editTextLogin.setVisibility(VISIBLE);
                editTextPassword.setVisibility(VISIBLE);
                toComeIn.setVisibility(VISIBLE);



                Toast.makeText(this, "User null", Toast.LENGTH_SHORT).show();
            };
        }



    public void toComeIn(View view)
    {
        if (!TextUtils.isEmpty(editTextLogin.getText().toString()) && !TextUtils.isEmpty(editTextPassword.getText().toString()))
        {
            mAuth.signInWithEmailAndPassword(editTextLogin.getText().toString(), editTextPassword.getText().toString())
                    .addOnCompleteListener(this, new OnCompleteListener<AuthResult>()
                    {
                        @Override
                        public void onComplete(@NonNull Task<AuthResult> task)
                        {
                            // Если войти не удается, отобразите сообщение для пользователя.
                            if (task.isSuccessful()) {
                                // Успешный вход в систему, обновление пользовательского интерфейса информацией о вошедшем в систему пользователе.
                                Toast.makeText(getApplicationContext(), "User logged in successfully", Toast.LENGTH_SHORT).show();
                            } else {
                                Toast.makeText(getApplicationContext(), "Login failed", Toast.LENGTH_SHORT).show();
                            }

                            // ...
                        }
                    });
        }
        else {
            Toast.makeText(getApplicationContext(), "Please tnter Email end Password", Toast.LENGTH_SHORT).show();
        }
    }

    private void init()
    {
        toComeIn = findViewById(R.id.toComeIn);
        textHello = findViewById(R.id.textHello);
        buttonExit = findViewById(R.id.buttonExit);
        buttonToBegin = findViewById(R.id.buttonToBegin);
        editTextLogin = findViewById(R.id.editTextLogin);
        editTextPassword = findViewById(R.id.editTextPassword);
        mAuth = FirebaseAuth.getInstance();

    }

    public void buttonToBegin(View view)
    {
        Intent i = new Intent(MainActivity.this, UserInfoActivity.class);
        startActivity(i);
    }

    public void buttonExit(View view)
    {
        FirebaseAuth.getInstance().signOut();
        buttonToBegin.setVisibility(View.GONE);
        buttonExit.setVisibility(View.GONE);
        textHello.setVisibility(View.GONE);
        editTextLogin.setVisibility(VISIBLE);
        editTextPassword.setVisibility(VISIBLE);
        toComeIn.setVisibility(VISIBLE);
    }
}