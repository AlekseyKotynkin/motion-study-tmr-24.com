package com.TMR24.MotionStudy;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.snackbar.Snackbar;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.GoogleAuthProvider;
import com.google.firebase.functions.FirebaseFunctions;


import static android.view.View.VISIBLE;

public class MainActivity extends AppCompatActivity implements
        View.OnClickListener
{
    private EditText editTextLogin, editTextPassword;
    private FirebaseAuth mAuth;
    private FirebaseUser currentUser;
    private FirebaseFunctions mFunctions;
    private Button buttonToBegin, buttonComeIn, buttonExit;
    private SignInButton signInButton;
    private TextView textHello;
    private String userNameEmail;
    private GoogleSignInOptions gso;
    private GoogleSignInClient mGoogleSignInClient;
    private GoogleSignInAccount account;
 //   private ActivityGoogleBinding mBinding;

    private static final String TAG = "EmailPassword";
    private static final int RC_SIGN_IN = 9001;


    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // Configure sign-in to request the user's ID, email address, and basic
        // Настройте вход для запроса идентификатора пользователя, адреса электронной почты и базового
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
        // профиль. ID и базовый профиль включены в DEFAULT_SIGN_IN.
        init();

        gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();
        // Build a GoogleSignInClient with the options specified by gso.
        // Создайте GoogleSignInClient с параметрами, указанными в gso.

        mGoogleSignInClient = GoogleSignIn.getClient(MainActivity.this, gso);
        findViewById(R.id.sign_in_button).setOnClickListener((View.OnClickListener) MainActivity.this);

    }
    public void onStart()
    {
        super.onStart();
         // Check if user is signed in (non-null) and update UI accordingly.
         // Проверьте, вошел ли пользователь (не ноль) и обновите ли пользовательский интерфейс соответствующим образом.
        FirebaseUser currentUser = mAuth.getCurrentUser();
        // Check for existing Google Sign In account, if the user is already signed in
        // the GoogleSignInAccount will be non-null.
        account = GoogleSignIn.getLastSignedInAccount(this);
      //  updateUI(account);
        if (currentUser != null)
       {
            buttonToBegin.setVisibility(View.VISIBLE);
            textHello.setVisibility(View.VISIBLE);
            buttonExit.setVisibility(View.VISIBLE);
            editTextLogin.setVisibility(View.GONE);
            editTextPassword.setVisibility(View.GONE);
            buttonComeIn.setVisibility(View.GONE);
            signInButton.setVisibility(View.GONE);
            userNameEmail = currentUser.getEmail() ;
            String userEmail = "You are logged in as - "+ currentUser.getEmail();
            textHello.setText(userEmail);


            Toast.makeText(this, "User not null", Toast.LENGTH_SHORT).show();
       }
        else
        {
            buttonToBegin.setVisibility(View.GONE);
            buttonExit.setVisibility(View.GONE);
            textHello.setVisibility(View.GONE);
            editTextLogin.setVisibility(View.VISIBLE);
            editTextPassword.setVisibility(View.VISIBLE);
            buttonComeIn.setVisibility(View.VISIBLE);
            signInButton.setVisibility(View.VISIBLE);
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
                                startActivity(getIntent());
                                finish();
                                overridePendingTransition(0, 0);
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
        buttonComeIn = findViewById(R.id.buttonComeIn);
        signInButton = findViewById (R.id.sign_in_button);
        textHello = findViewById(R.id.textHello);
        buttonExit = findViewById(R.id.buttonExit);
        buttonToBegin = findViewById(R.id.buttonToBegin);
        editTextLogin = findViewById(R.id.editTextLogin);
        editTextPassword = findViewById(R.id.editTextPassword);
        mAuth = FirebaseAuth.getInstance();
        mFunctions = FirebaseFunctions.getInstance();

    }

    public void buttonToBegin(View view)
    {
        Intent i = new Intent(MainActivity.this, UserInfoActivity.class);
        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail);
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
        buttonComeIn.setVisibility(VISIBLE);
        signInButton.setVisibility(View.VISIBLE);
    }
    private void signIn()
    {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.sign_in_button:
                signIn();
                break;
            // ...
        }
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // Result returned from launching the Intent from GoogleSignInApi.getSignInIntent(...);
        // Результат, возвращенный при запуске Intent из GoogleSignInApi.getSignInIntent (...);
        if (requestCode == RC_SIGN_IN) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            try {
                // Google Sign In was successful, authenticate with Firebase
                // Вход в Google прошел успешно, аутентифицируемся с помощью Firebase
                GoogleSignInAccount account = task.getResult(ApiException.class);
                Log.d(TAG, "firebaseAuthWithGoogle:" + account.getId());
                firebaseAuthWithGoogle(account.getIdToken());
            } catch (ApiException e) {

                // Ошибка входа в Google, обновите интерфейс соответствующим образом
                Log.w(TAG, "Google sign in failed", e);
                // ...
            }
        }
    }

    private void firebaseAuthWithGoogle(String idToken) {
        AuthCredential credential = GoogleAuthProvider.getCredential(idToken, null);
        mAuth.signInWithCredential(credential)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            // Sign in success, update UI with the signed-in user's information
                            // Успешный вход, обновление пользовательского интерфейса информацией о вошедшем пользователе
                            Log.d(TAG, "signInWithCredential:success");
                            FirebaseUser user = mAuth.getCurrentUser();

                       //     updateUI(user);
                        } else {
                            // If sign in fails, display a message to the user.
                            // Если войти не удалось, отобразить сообщение пользователю.
                            Log.w(TAG, "signInWithCredential:failure", task.getException());
                       //    Snackbar.make(mBinding.mainLayout, "Authentication Failed.", Snackbar.LENGTH_SHORT).show();
                            Toast.makeText(getApplicationContext(), "Login failed", Toast.LENGTH_SHORT).show();
                       //     updateUI(null);
                        }

                        // ...
                    }
                });
    }
}