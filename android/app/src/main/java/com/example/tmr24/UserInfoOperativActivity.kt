@file:Suppress("UNUSED_ANONYMOUS_PARAMETER")

package com.example.tmr24

import android.content.Intent
import android.icu.util.Calendar
import android.os.Build
import android.os.Bundle
import android.text.format.DateFormat.getTimeFormat
import android.util.Log
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.annotation.RequiresApi
import com.google.android.material.snackbar.Snackbar
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import com.example.tmr24.databinding.ActivityUserInfoOperativBinding
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.analytics.ktx.analytics
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.functions.ktx.functions
import com.google.firebase.ktx.Firebase
import java.text.DateFormat


class UserInfoOperativActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityUserInfoOperativBinding
    private var UserEmail: String? = null
    private val db = Firebase.firestore
    private val TAG: String? = null
    private val listData = ArrayList<String>()
    private val listDataItem = ArrayList<String>()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityUserInfoOperativBinding.inflate(layoutInflater)
        setContentView(binding.root)
        // Запускаем функции
        //currentDate



    }

    public override fun onStart() {
        super.onStart()
        val i = intent
        if (i != null) {
            //intentMain
            UserEmail = i.getStringExtra(Constant.USER_NAME_EMAIL)

            // активируем поле Событие Календаря для выбора
            val buttonVoqealarCalendar = binding.buttonVoqealarCalendar
            buttonVoqealarCalendar.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                //val a = Intent(this@UserInfoOperativActivity, UserInfoOperativActivity::class.java)
                //a.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                //startActivity(a)
            }

            // активируем поле Мои задачи для выбора
            val buttonMyTask = binding.buttonMyTasks
            buttonMyTask.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()


                val b = Intent(this@UserInfoOperativActivity, UserInfoMyTasks::class.java)
                b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                b.putExtra(Constant.TASKS_TYPE_NAMES, "MyTasks")
                startActivity(b)
            }

            // активируем поле Входящие задачи для выбора
            val buttonIncomingTasks = binding.buttonIncomingTasks
            buttonIncomingTasks.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val c = Intent(this@UserInfoOperativActivity, UserInfoMyTasks::class.java)
                c.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                c.putExtra(Constant.TASKS_TYPE_NAMES, "IncomingTasks")
                startActivity(c)
            }

            // активируем поле Исходящие задачи для выбора
            val buttonOutgoingTasks = binding.buttonOutgoingTasks
            buttonOutgoingTasks.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val d = Intent(this@UserInfoOperativActivity, UserInfoMyTasks::class.java)
                d.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                d.putExtra(Constant.TASKS_TYPE_NAMES, "OutgoingTasks")
                startActivity(d)
            }

            // активируем поле Проекты задачи для выбора
            val buttonProject = binding.buttonProject
            buttonProject.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val d = Intent(this@UserInfoOperativActivity, UserInfoMyProject::class.java)
                d.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                startActivity(d)
            }

            // активируем поле Шаблоны процессов для выбора
            val buttonProcessTemplates = binding.buttonProcessTemplates
            buttonProcessTemplates.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val f = Intent(this@UserInfoOperativActivity, UserInfoActivity::class.java)
                f.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                startActivity(f)
            }

            // Запускаем функции
            currentDate
            dataFromDB
        }
    }
    public override fun onPause() {
        super.onPause()
        //val i = intent
        //if (i != null) {
        //    intentMain
        //    //currentDate
        //}

    }




    // Формируем надпись с датой
    private val currentDate: Unit
        @RequiresApi(Build.VERSION_CODES.N)
        get() {
            // Формируем надпись с датой
            val calendar = Calendar.getInstance()
            val currentEditDate = DateFormat.getDateInstance(DateFormat.FULL).format(calendar.time)
            val textViewDate = binding.editDataText
            textViewDate.text = currentEditDate
        }

    // Заполняем табличную часть с Активными сменами
    private val dataFromDB: Unit
        get() {             // Заполняем табличную часть с Активными сменами
            db.collection("WorkShift")
                .whereEqualTo("EmailPositionUser", UserEmail)
                .whereEqualTo("WorkShiftEnd", "")
                .get()
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        for (document in task.result) {
                            Log.d(TAG, document.id + " => " + document.data)
                            val doc = document.data
                            val docy = doc["ParentHierarchyPositionUser"] as Map<*, *>?
                            val nameOrganization = docy!!["NameOrganization"] as String?
                            val idOrganization = docy["idDocOrganization"] as String?
                            val nameSubdivision = docy["NameSubdivision"] as String?
                            val idSubdivision = docy["idDocSubdivision"] as String?
                            val namePosition = docy["NamePosition"] as String?
                            val idPosition = docy["idDocPosition"] as String?
                            val activShiftDocId = document.id
                            val poleListData: String = ("$nameOrganization > $nameSubdivision > $namePosition")
                            listData.add(poleListData)
                            val poleListDataItem: String = ("$idOrganization>$nameOrganization>$idSubdivision>$nameSubdivision>$idPosition>$namePosition>$activShiftDocId")
                            listDataItem.add(poleListDataItem)
                            val nameAdapter = ArrayAdapter<String>(this@UserInfoOperativActivity, android.R.layout.simple_list_item_1, listData )
                            val listSessions = binding.listSessions
                            listSessions.adapter = nameAdapter
                        }
                        setOnClickItemSesions()
                    } else {
                        Log.d(TAG, "Error getting documents: ", task.exception)
                    }
                }
        }

    // активируем поле Активные смены для выбора
    private fun setOnClickItemSesions() {
        val listSessions = binding.listSessions
        listSessions.onItemClickListener = AdapterView.OnItemClickListener { parent, view, position, id ->
            val parentHierarchyShiftUser = listDataItem[position]
            val g = Intent(this@UserInfoOperativActivity, UserProcessActivity::class.java)
            g.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
            g.putExtra(Constant.PARENT_HIERARCHY_SHIFT_USER, parentHierarchyShiftUser)
            startActivity(g)
        }
    }






}