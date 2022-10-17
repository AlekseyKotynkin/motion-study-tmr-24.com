package com.example.tmr24

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.tmr24.databinding.ActivityMainBinding
import com.example.tmr24.ui.login.LoginActivity
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.analytics.ktx.analytics
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase



class MainActivity : AppCompatActivity(), View.OnClickListener {

    private lateinit var analytics: FirebaseAnalytics
    private lateinit var auth: FirebaseAuth
    private lateinit var binding: ActivityMainBinding
    private var UserEmail: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        // Initialize Firebase Analytics
        analytics = Firebase.analytics
        // Initialize Firebase Auth
        auth = Firebase.auth
        //
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    public override fun onStart() {
        super.onStart()
        // Check if user is signed in (non-null) and update UI accordingly.
        // Проверьте, вошел ли пользователь в систему (ненулевой), и соответствующим образом обновите пользовательский интерфейс.
        val currentUser = auth.currentUser
        val buttonGo = binding.buttonGo
        val textLogIn = binding.textLogIn
        val textUserName = binding.textUserName
        val buttonExit = binding.buttonExit


        if(currentUser != null){

            buttonGo.visibility = View.VISIBLE
            textLogIn.visibility = View.VISIBLE
            textUserName.visibility = View.VISIBLE
            buttonExit.visibility = View.VISIBLE
            val UserEmail: String? = (currentUser.email)
            textUserName.text = UserEmail


            buttonGo.setOnClickListener {
               Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                   .show()
               val i = Intent(this@MainActivity, UserInfoOperativActivity::class.java)
               i.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
               startActivity(i)
            }
            buttonExit.setOnClickListener {
               Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                   .show()
               //Выходит из учетной записи
                  Firebase.auth.signOut()
               //переходим на LoginActivity
               val i = Intent(this@MainActivity, LoginActivity::class.java)
               startActivity(i)
            }

        }
        else
        {
            buttonGo.visibility = View.VISIBLE
            buttonGo.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val i = Intent(this@MainActivity, LoginActivity::class.java)
                startActivity(i)
            }
        }
    }

    override fun onClick(view: View?) {
      //  when (view) {
            //btnBlack -> Toast.makeText(this, "Black button click", Toast.LENGTH_LONG).show()
            //btnCustom -> Toast.makeText(this, "Custom button click", Toast.LENGTH_LONG).show()
    //    }
    }



}