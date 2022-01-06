package com.TMR24.MotionStudy

import androidx.appcompat.app.AppCompatActivity
import android.widget.EditText
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.functions.FirebaseFunctions
import com.google.android.gms.common.SignInButton
import android.widget.TextView
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import android.os.Bundle
import com.TMR24.MotionStudy.R
import com.google.android.gms.auth.api.signin.GoogleSignIn
import android.widget.Toast
import android.text.TextUtils
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.auth.AuthResult
import android.content.Intent
import android.util.Log
import android.view.View
import android.widget.Button
import com.TMR24.MotionStudy.UserInfoActivity
import com.TMR24.MotionStudy.MainActivity
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.AuthCredential
import com.google.firebase.auth.GoogleAuthProvider

class MainActivity : AppCompatActivity(), View.OnClickListener {
    private var editTextLogin: EditText? = null
    private var editTextPassword: EditText? = null
    private var mAuth: FirebaseAuth? = null
    private val currentUser: FirebaseUser? = null
    private var mFunctions: FirebaseFunctions? = null
    private var buttonToBegin: Button? = null
    private var buttonComeIn: Button? = null
    private var buttonExit: Button? = null
    private var signInButton: SignInButton? = null
    private var textHello: TextView? = null
    private var userNameEmail: String? = null
    private var gso: GoogleSignInOptions? = null
    private var mGoogleSignInClient: GoogleSignInClient? = null
    private var account: GoogleSignInAccount? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        // Configure sign-in to request the user's ID, email address, and basic
        // Настройте вход для запроса идентификатора пользователя, адреса электронной почты и базового
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
        // профиль. ID и базовый профиль включены в DEFAULT_SIGN_IN.
        init()
        gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build()
        // Build a GoogleSignInClient with the options specified by gso.
        // Создайте GoogleSignInClient с параметрами, указанными в gso.
        mGoogleSignInClient = GoogleSignIn.getClient(this@MainActivity, gso)
        findViewById<View>(R.id.sign_in_button).setOnClickListener(this@MainActivity as View.OnClickListener)
    }

    public override fun onStart() {
        super.onStart()
        // Check if user is signed in (non-null) and update UI accordingly.
        // Проверьте, вошел ли пользователь (не ноль) и обновите ли пользовательский интерфейс соответствующим образом.
        val currentUser = mAuth!!.currentUser
        // Check for existing Google Sign In account, if the user is already signed in
        // the GoogleSignInAccount will be non-null.
        account = GoogleSignIn.getLastSignedInAccount(this)
        //  updateUI(account);
        if (currentUser != null) {
            buttonToBegin!!.visibility = View.VISIBLE
            textHello!!.visibility = View.VISIBLE
            buttonExit!!.visibility = View.VISIBLE
            editTextLogin!!.visibility = View.GONE
            editTextPassword!!.visibility = View.GONE
            buttonComeIn!!.visibility = View.GONE
            signInButton!!.visibility = View.GONE
            userNameEmail = currentUser.email
            val userEmail = "You are logged in as - " + currentUser.email
            textHello!!.text = userEmail
            Toast.makeText(this, "User not null", Toast.LENGTH_SHORT).show()
        } else {
            buttonToBegin!!.visibility = View.GONE
            buttonExit!!.visibility = View.GONE
            textHello!!.visibility = View.GONE
            editTextLogin!!.visibility = View.VISIBLE
            editTextPassword!!.visibility = View.VISIBLE
            buttonComeIn!!.visibility = View.VISIBLE
            signInButton!!.visibility = View.VISIBLE
            Toast.makeText(this, "User null", Toast.LENGTH_SHORT).show()
        }
    }

    fun toComeIn(view: View?) {
        if (!TextUtils.isEmpty(editTextLogin!!.text.toString()) && !TextUtils.isEmpty(editTextPassword!!.text.toString())) {
            mAuth!!.signInWithEmailAndPassword(editTextLogin!!.text.toString(), editTextPassword!!.text.toString())
                    .addOnCompleteListener(this) { task ->
                        // Если войти не удается, отобразите сообщение для пользователя.
                        if (task.isSuccessful) {
                            // Успешный вход в систему, обновление пользовательского интерфейса информацией о вошедшем в систему пользователе.
                            Toast.makeText(applicationContext, "User logged in successfully", Toast.LENGTH_SHORT).show()
                            startActivity(intent)
                            finish()
                            overridePendingTransition(0, 0)
                        } else {
                            Toast.makeText(applicationContext, "Login failed", Toast.LENGTH_SHORT).show()
                        }

                        // ...
                    }
        } else {
            Toast.makeText(applicationContext, "Please tnter Email end Password", Toast.LENGTH_SHORT).show()
        }
    }

    private fun init() {
        buttonComeIn = findViewById(R.id.buttonComeIn)
        signInButton = findViewById(R.id.sign_in_button)
        textHello = findViewById(R.id.textHello)
        buttonExit = findViewById(R.id.buttonExit)
        buttonToBegin = findViewById(R.id.buttonToBegin)
        editTextLogin = findViewById(R.id.editTextLogin)
        editTextPassword = findViewById(R.id.editTextPassword)
        mAuth = FirebaseAuth.getInstance()
        mFunctions = FirebaseFunctions.getInstance()
    }

    fun buttonToBegin(view: View?) {
        val i = Intent(this@MainActivity, UserInfoActivity::class.java)
        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
        startActivity(i)
    }

    fun buttonExit(view: View?) {
        FirebaseAuth.getInstance().signOut()
        buttonToBegin!!.visibility = View.GONE
        buttonExit!!.visibility = View.GONE
        textHello!!.visibility = View.GONE
        editTextLogin!!.visibility = View.VISIBLE
        editTextPassword!!.visibility = View.VISIBLE
        buttonComeIn!!.visibility = View.VISIBLE
        signInButton!!.visibility = View.VISIBLE
    }

    private fun signIn() {
        val signInIntent = mGoogleSignInClient!!.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    override fun onClick(v: View) {
        when (v.id) {
            R.id.sign_in_button -> signIn()
        }
    }

    public override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        // Result returned from launching the Intent from GoogleSignInApi.getSignInIntent(...);
        // Результат, возвращенный при запуске Intent из GoogleSignInApi.getSignInIntent (...);
        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                // Google Sign In was successful, authenticate with Firebase
                // Вход в Google прошел успешно, аутентифицируемся с помощью Firebase
                val account = task.getResult<ApiException>(ApiException::class.java)
                Log.d(TAG, "firebaseAuthWithGoogle:" + account.id)
                firebaseAuthWithGoogle(account.idToken)
            } catch (e: ApiException) {

                // Ошибка входа в Google, обновите интерфейс соответствующим образом
                Log.w(TAG, "Google sign in failed", e)
                // ...
            }
        }
    }

    private fun firebaseAuthWithGoogle(idToken: String) {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        mAuth!!.signInWithCredential(credential)
                .addOnCompleteListener(this) { task ->
                    if (task.isSuccessful) {
                        // Sign in success, update UI with the signed-in user's information
                        // Успешный вход, обновление пользовательского интерфейса информацией о вошедшем пользователе
                        Log.d(TAG, "signInWithCredential:success")
                        val user = mAuth!!.currentUser

                        //     updateUI(user);
                    } else {
                        // If sign in fails, display a message to the user.
                        // Если войти не удалось, отобразить сообщение пользователю.
                        Log.w(TAG, "signInWithCredential:failure", task.exception)
                        //    Snackbar.make(mBinding.mainLayout, "Authentication Failed.", Snackbar.LENGTH_SHORT).show();
                        Toast.makeText(applicationContext, "Login failed", Toast.LENGTH_SHORT).show()
                        //     updateUI(null);
                    }

                    // ...
                }
    }

    companion object {
        //   private ActivityGoogleBinding mBinding;
        private const val TAG = "EmailPassword"
        private const val RC_SIGN_IN = 9001
    }
}