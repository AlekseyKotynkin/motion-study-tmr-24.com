package com.example.tmr24

import android.content.Intent
import android.icu.util.Calendar
import android.os.Build
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.*
import androidx.annotation.RequiresApi
import com.example.tmr24.databinding.ActivityUserInfoBinding
import com.google.android.gms.tasks.Task
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.functions.ktx.functions
import com.google.firebase.ktx.Firebase
import java.text.DateFormat


class UserInfoActivity : AppCompatActivity() {

    private lateinit var binding: ActivityUserInfoBinding
    private val db = Firebase.firestore
    private val TAG: String? = null
    private var userNameEmail: String? = null
    private val listData = ArrayList<String>()
    private val listDataItem = ArrayList<String>()
    private val functions = Firebase.functions
    private val listDataPosts = ArrayList<String>()
    private val listDataPostsItem = ArrayList<String>()

    @RequiresApi(Build.VERSION_CODES.N)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_info)
        binding = ActivityUserInfoBinding.inflate(layoutInflater)
        setContentView(binding.root)
        //intentMain
        currentDate
    }
    //menu верхней правой части экрана
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        val inflater = menuInflater
        inflater.inflate(R.menu.menu_user_info_activity, menu)
        return super.onCreateOptionsMenu(menu)
    }
    //обработка выбора в верхнем меню

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Операции для выбранного пункта меню
        return when (item.itemId) {
            R.id.tasks_button_start -> {
                noteTasks()
                true
            }
            R.id.tasks_button_exit -> {
                noteCalendar()
                true
            }
            R.id.tasks_button_done -> {
                noteContacts()
                true
            }
            R.id.tasks_button_assessment -> {
                noteProducts()
                true
            }
            R.id.tasks_button_add_tasks -> {
                noteSettings()
                true
            }
            R.id.tasks_button_change -> {
                noteInfo()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
    //обработка выбора в верхнем меню кнопки Info
    private fun noteInfo() {
        TODO("Not yet implemented")
    }
    //обработка выбора в верхнем меню кнопки Settings
    private fun noteSettings() {
        TODO("Not yet implemented")
    }
    //обработка выбора в верхнем меню кнопки Products
    private fun noteProducts() {
        TODO("Not yet implemented")
    }
    //обработка выбора в верхнем меню кнопки Contacts
    private fun noteContacts() {
        TODO("Not yet implemented")
    }
    //обработка выбора в верхнем меню кнопки Calendar
    private fun noteCalendar() {
        TODO("Not yet implemented")
    }
    //обработка выбора в верхнем меню кнопки Tasks
    private fun noteTasks() {
        TODO("Not yet implemented")
    }
    //

    public override fun onStart() {
        super.onStart()
        val i = intent
        if (i != null) {
            //intentMain
            userNameEmail = i.getStringExtra(Constant.USER_NAME_EMAIL)
            listData.clear()
            listDataItem.clear()
            listDataPosts.clear()
            listDataPostsItem.clear()
            dataFromDB
            //addMessage(userNameEmail)
            addMessageHelp(userNameEmail)
            //currentDate
            // активируем кнопку Выход
            val buttonExitMyProject = binding.buttonToReturn
            buttonExitMyProject.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val b = Intent(this@UserInfoActivity, UserInfoOperativActivity::class.java)
                b.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                startActivity(b)
            }

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
            val currentDate = DateFormat.getDateInstance(DateFormat.FULL).format(calendar.time)
            val textViewDate = binding.textCurrentDate
            textViewDate.text = currentDate

        }

    // Заполняем табличную часть с Активными сменами
    private val dataFromDB: Unit
        get() {             // Заполняем табличную часть с Активными сменами
            db.collection("WorkShift")
                .whereEqualTo("EmailPositionUser", userNameEmail)
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
                            val nameAdapter = ArrayAdapter<String>(this@UserInfoActivity, android.R.layout.simple_list_item_1, listData )
                            val listSessions = binding.listSessions
                            listSessions.adapter = nameAdapter
                        }
                        setOnClickItemSesions()
                    } else {
                        Log.d(TAG, "Error getting documents: ", task.exception)
                    }
                }
        }

    // обход функции addMessage
    private fun addMessageHelp(text: String?) {
        db.collection("OrganizationTable")
            .whereEqualTo("userNameEmail", text)
            .get()
            .addOnSuccessListener { documents ->
                val h = documents.size()
                var k = 0
                for (document in documents) {
                    Log.d(TAG, "${document.id} => ${document.data}")
                    val doc = document.data
                    val idOrganization = doc["organizationDocId"]
                    val nameOrganization = doc["organizationDocName"]
                    val idSubdivision = doc["subdivisionDocId"]
                    val nameSubdivision = doc["subdivisionDocName"]
                    val idPosition = doc["positionDocId"]
                    val namePosition = doc["positionDocName"]
                    val idDocPositionUser = doc["positionUserDocId"]
                    val userСomment = doc["userСomment"]
                    val poleListDataPosts: String = ("$nameOrganization > $nameSubdivision > $namePosition")
                    val poleListDataPostsItem: String = ("$idOrganization>$nameOrganization>$idSubdivision>$nameSubdivision>$idPosition>$namePosition>$idDocPositionUser>$userСomment")
                    listDataPosts.add(poleListDataPosts)
                    listDataPostsItem.add(poleListDataPostsItem)
                    val nameAdapterPost = ArrayAdapter<String>(this@UserInfoActivity, android.R.layout.simple_list_item_1, listDataPosts )
                    val listPosts = binding.listPosts
                    listPosts.adapter = nameAdapterPost
                    k = k + 1
                    if (h == k){
                        setOnClickItemPosts()
                    }
                }
            }
            .addOnFailureListener { exception ->
                Log.w(TAG, "Error getting documents: ", exception)
            }
    }

   //Отправляем и получаем обработанные данные с сервера списком в каких должностях принимает участие пользователь
    private fun addMessage(text: String?): Task<String> {
        val loadingInfo = binding.loadingInfo
        loadingInfo.visibility = View.VISIBLE
        val data: MutableMap<String, Any?> = HashMap()
        data["text"] = text
        data["push"] = true
        return functions
            .getHttpsCallable("addDocListPosts")
            .call(data)
            .continueWith { task -> // This continuation runs on either success or failure, but if the task
                // has failed then getResult() will throw an Exception which will be
                // propagated down.
                // Это продолжение выполняется при успехе или неудаче, но если задача
                // не удалось, тогда getResult () выдаст исключение, которое будет
                // распространились вниз.
                val rezult = task.result.data as HashMap<*, *>?
                val idDocPosts = rezult!!["text"] as String?

                //val loadingInfo = binding.loadingInfo
                Thread.sleep(10000)
                val docRef = db.collection("messages").document(idDocPosts!!)
                docRef.get().addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        val document = task.result
                        if (document.exists()) {
                            Log.d(TAG, "DocumentSnapshot data: " + document.data)
                            val doc = document.data
                            val massivDocPosts = doc!!["gerDoc"] as ArrayList<*>?
                            for (i in massivDocPosts!!.indices) {
                                val stringDocPosts = massivDocPosts[i] as String
                                val delimeter = ">"
                                val idOrganization = stringDocPosts.split(delimeter.toRegex()).toTypedArray()[0]
                                val nameOrganization = stringDocPosts.split(delimeter.toRegex()).toTypedArray()[1]
                                val idSubdivision = stringDocPosts.split(delimeter.toRegex()).toTypedArray()[2]
                                val nameSubdivision = stringDocPosts.split(delimeter.toRegex()).toTypedArray()[3]
                                val idPosition = stringDocPosts.split(delimeter.toRegex()).toTypedArray()[4]
                                val namePosition = stringDocPosts.split(delimeter.toRegex()).toTypedArray()[5]
                                val idDocPositionUser = stringDocPosts.split(delimeter.toRegex()).toTypedArray()[6]
                                val userСomment = stringDocPosts.split(delimeter.toRegex()).toTypedArray()[7]
                                val poleListDataPosts: String = ("$nameOrganization > $nameSubdivision > $namePosition")
                                val poleListDataPostsItem: String = ("$idOrganization>$nameOrganization>$idSubdivision>$nameSubdivision>$idPosition>$namePosition>$idDocPositionUser>$userСomment")
                                listDataPosts.add(poleListDataPosts)
                                listDataPostsItem.add(poleListDataPostsItem)
                                val nameAdapterPost = ArrayAdapter<String>(this@UserInfoActivity, android.R.layout.simple_list_item_1, listDataPosts )
                                val listPosts = binding.listPosts
                                listPosts.adapter = nameAdapterPost
                            }
                            db.collection("messages").document(idDocPosts)
                                .delete()
                                //.addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully deleted!") }
                                //.addOnFailureListener { e -> Log.w(TAG, "Error deleting document", e) }
                                 println(idDocPosts)
                            setOnClickItemPosts()
                        } else {
                            Log.d(TAG, "No such document")
                        }
                    } else {
                        Log.d(TAG, "get failed with ", task.exception)
                    }
                }
                loadingInfo.visibility = View.GONE
                idDocPosts
            }
    }

    // активируем поле Шаблоны процессов для выбора
    private fun setOnClickItemPosts() { //
        val listPosts = binding.listPosts
        listPosts.onItemClickListener = AdapterView.OnItemClickListener { parent, view, position, id ->
                val parentHierarchyPositionUser = listDataPostsItem[position]
                val i = Intent(this@UserInfoActivity, UserShiftActivity::class.java)
                i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                i.putExtra(Constant.PARENT_HIERARCHY_POSITION_USER, parentHierarchyPositionUser)
                startActivity(i)
            }
    }

    // активируем поле Активные смены для выбора
    private fun setOnClickItemSesions() {
        val listSessions = binding.listSessions
        listSessions.onItemClickListener = AdapterView.OnItemClickListener { parent, view, position, id ->
                val parentHierarchyShiftUser = listDataItem[position]
                val i = Intent(this@UserInfoActivity, UserProcessActivity::class.java)
                i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                i.putExtra(Constant.PARENT_HIERARCHY_SHIFT_USER, parentHierarchyShiftUser)
                startActivity(i)
            }
    }

/*
    private val intentMain: Unit
        get() {
            val i = intent
            if (i != null) {
                userNameEmail = i.getStringExtra(Constant.USER_NAME_EMAIL)
                println(userNameEmail)
                dataFromDB
                addMessage(userNameEmail)

            }
        }
*/

}