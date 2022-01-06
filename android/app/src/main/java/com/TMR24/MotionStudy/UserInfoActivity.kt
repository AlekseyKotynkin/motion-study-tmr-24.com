package com.TMR24.MotionStudy

import androidx.appcompat.app.AppCompatActivity
import android.widget.TextView
import android.widget.ArrayAdapter
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.functions.FirebaseFunctions
import android.os.Bundle
import com.TMR24.MotionStudy.R
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.firestore.QuerySnapshot
import com.google.firebase.firestore.QueryDocumentSnapshot
import com.google.firebase.functions.HttpsCallableResult
import kotlin.Throws
import com.google.firebase.firestore.DocumentSnapshot
import com.google.android.gms.tasks.OnSuccessListener
import com.google.android.gms.tasks.OnFailureListener
import android.widget.AdapterView.OnItemClickListener
import android.widget.AdapterView
import android.content.Intent
import android.util.Log
import android.widget.ListView
import com.TMR24.MotionStudy.UserShiftActivity
import com.TMR24.MotionStudy.UserProcessActivity
import com.google.android.gms.tasks.Task
import java.text.DateFormat
import java.util.*

class UserInfoActivity : AppCompatActivity() {
    private var listSessions: ListView? = null
    private var listPosts: ListView? = null
    private var adapter: ArrayAdapter<String>? = null
    private var adapterPosts: ArrayAdapter<String>? = null
    private var listData: MutableList<String>? = null
    private var listDataItem: MutableList<String>? = null
    private var listDataPosts: MutableList<String>? = null
    private var listDataPostsItem: MutableList<String>? = null
    private var db: FirebaseFirestore? = null
    private var mFunctions: FirebaseFunctions? = null
    private val TAG: String? = null
    private var userNameEmail: String? = null
    private val parentHierarchyPositionUser: String? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_info)
        init()
        intentMain
        currentDate
        dataFromDB
        addMessage(userNameEmail)
        setOnClickItemPosts()
        setOnClickItemSesions()
    }

    private fun init() {
        listPosts = findViewById(R.id.listPosts)
        listDataPosts = ArrayList()
        listDataPostsItem = ArrayList()
        adapterPosts = ArrayAdapter(this, android.R.layout.simple_list_item_1, listDataPosts)
        listPosts.setAdapter(adapterPosts)
        listSessions = findViewById(R.id.listSessions)
        listData = ArrayList()
        listDataItem = ArrayList()
        adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, listData)
        listSessions.setAdapter(adapter)
        db = FirebaseFirestore.getInstance()
        mFunctions = FirebaseFunctions.getInstance()
    }

    // Формируем надпись с датой
    private val currentDate: Unit
        private get() {      // Формируем надпись с датой
            val calendar = Calendar.getInstance()
            val currentDate = DateFormat.getDateInstance(DateFormat.FULL).format(calendar.time)
            val textViewDate = findViewById<TextView>(R.id.textCurrentDate)
            textViewDate.text = currentDate
        }

    // Заполняем табличную часть с Активными сменами
    private val dataFromDB: Unit
        private get() {             // Заполняем табличную часть с Активными сменами
            db!!.collection("WorkShift")
                .whereEqualTo("EmailPositionUser", userNameEmail)
                .whereEqualTo("WorkShiftEnd", "")
                .get()
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        for (document in task.result) {
                            Log.d(TAG, document.id + " => " + document.data)
                            val doc = document.data
                            val docy = doc["ParentHierarchyPositionUser"] as Map<String, Any>?
                            val nameOrganization = docy!!["NameOrganization"] as String?
                            val idOrganization = docy["idDocOrganization"] as String?
                            val nameSubdivision = docy["NameSubdivision"] as String?
                            val idSubdivision = docy["idDocSubdivision"] as String?
                            val namePosition = docy["NamePosition"] as String?
                            val idPosition = docy["idDocPosition"] as String?
                            val activShiftDocId = document.id
                            listData!!.add("$nameOrganization > $nameSubdivision > $namePosition")
                            listDataItem!!.add("$idOrganization>$nameOrganization>$idSubdivision>$nameSubdivision>$idPosition>$namePosition>$activShiftDocId")
                            adapter!!.notifyDataSetChanged()
                        }
                    } else {
                        Log.d(TAG, "Error getting documents: ", task.exception)
                    }
                }
        }

    private fun addMessage(text: String?): Task<String> {  //Отправляем и получаем обработанные данные с сервера списком в каких должностях принимает участие пользователь
        val data: MutableMap<String, Any?> = HashMap()
        data["text"] = text
        data["push"] = true
        return mFunctions
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
                Thread.sleep(10000)
                val docRef = db!!.collection("messages").document(
                    idDocPosts!!
                )
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
                                val idOrganization =
                                    stringDocPosts.split(delimeter.toRegex()).toTypedArray()[0]
                                val nameOrganization =
                                    stringDocPosts.split(delimeter.toRegex()).toTypedArray()[1]
                                val idSubdivision =
                                    stringDocPosts.split(delimeter.toRegex()).toTypedArray()[2]
                                val nameSubdivision =
                                    stringDocPosts.split(delimeter.toRegex()).toTypedArray()[3]
                                val idPosition =
                                    stringDocPosts.split(delimeter.toRegex()).toTypedArray()[4]
                                val namePosition =
                                    stringDocPosts.split(delimeter.toRegex()).toTypedArray()[5]
                                val idDocPositionUser =
                                    stringDocPosts.split(delimeter.toRegex()).toTypedArray()[6]
                                val userСomment =
                                    stringDocPosts.split(delimeter.toRegex()).toTypedArray()[7]
                                listDataPosts!!.add("$nameOrganization > $nameSubdivision > $namePosition")
                                listDataPostsItem!!.add("$idOrganization>$nameOrganization>$idSubdivision>$nameSubdivision>$idPosition>$namePosition>$idDocPositionUser>$userСomment")
                                adapterPosts!!.notifyDataSetChanged()
                            }
                            db!!.collection("messages").document(idDocPosts)
                                .delete()
                                .addOnSuccessListener(object : OnSuccessListener<Void?> {
                                    override fun onSuccess(aVoid: Void?) {
                                        Log.d(TAG, "DocumentSnapshot successfully deleted!")
                                    }
                                })
                                .addOnFailureListener { e ->
                                    Log.w(
                                        TAG,
                                        "Error deleting document",
                                        e
                                    )
                                }
                        } else {
                            Log.d(TAG, "No such document")
                        }
                    } else {
                        Log.d(TAG, "get failed with ", task.exception)
                    }
                }
                idDocPosts
            }
    }

    private fun setOnClickItemPosts() { //
        listPosts!!.onItemClickListener = OnItemClickListener { parent, view, position, id ->
            val parentHierarchyPositionUser = listDataPostsItem!![position]
            val i = Intent(this@UserInfoActivity, UserShiftActivity::class.java)
            i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
            i.putExtra(Constant.PARENT_HIERARCHY_POSITION_USER, parentHierarchyPositionUser)
            startActivity(i)
        }
    }

    private fun setOnClickItemSesions() {
        listSessions!!.onItemClickListener = OnItemClickListener { parent, view, position, id ->
            val parentHierarchyShiftUser = listDataItem!![position]
            val i = Intent(this@UserInfoActivity, UserProcessActivity::class.java)
            i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
            i.putExtra(Constant.PARENT_HIERARCHY_SHIFT_USER, parentHierarchyShiftUser)
            startActivity(i)
        }
    }

    private val intentMain: Unit
        private get() {
            val i = intent
            if (i != null) {
                userNameEmail = i.getStringExtra(Constant.USER_NAME_EMAIL)
                println(userNameEmail)
            }
        }
}