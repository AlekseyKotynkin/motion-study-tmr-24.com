package com.TMR24.MotionStudy

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.*
import android.widget.AdapterView.OnItemClickListener
import androidx.appcompat.app.AppCompatActivity
import com.TMR24.MotionStudy.UserShiftActivity
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.functions.FirebaseFunctions
import java.util.*

class UserShiftActivity : AppCompatActivity() {
    private val textActivPosition: TextView? = null
    private var db: FirebaseFirestore? = null
    private var mFunctions: FirebaseFunctions? = null
    private val TAG: String? = null
    private var nameOrganization: String? = null
    private var nameSubdivision: String? = null
    private var namePosition: String? = null
    private val activShiftDocId: String? = null
    private var userNameEmail: String? = null
    private var parentHierarchyShiftUser: String? = null
    private var parentHierarchyPositionUser: String? = null
    private var idPosition: String? = null
    private var idOrganization: String? = null
    private var idSubdivision: String? = null
    private var idDocPositionUser: String? = null
    private var userСomment: String? = null
    private var buttonAddShiftSession: Button? = null
    private var buttonToReturn: Button? = null
    private var parentHierarchyPositionUserMap: MutableMap<*, *>? = null
    private var listViewInfoButton: ListView? = null
    private var adapterInfoButton: ArrayAdapter<String?>? = null
    private var listInfoButton: MutableList<String?>? = null
    private var listInfoButtonItem: MutableList<String>? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_shift)
        init()
        setOnClickItemlistViewInfoButton()
    }

    private fun init() {
        db = FirebaseFirestore.getInstance()
        mFunctions = FirebaseFunctions.getInstance()
        buttonAddShiftSession = findViewById(R.id.buttonAddShiftSession)
        buttonToReturn = findViewById(R.id.buttonToReturn)
        listViewInfoButton = findViewById(R.id.listViewInfoButton)
        listInfoButton = ArrayList()
        listInfoButtonItem = ArrayList()
        adapterInfoButton = ArrayAdapter(this, android.R.layout.simple_list_item_1, listInfoButton)
        listViewInfoButton.setAdapter(adapterInfoButton)
    }

    public override fun onStart() {
        super.onStart()
        val i = intent
        if (i != null) {   //очистили ArrayList
            listInfoButton!!.clear()
            listInfoButtonItem!!.clear()
            // получили строку данных с предидущего Активити
            userNameEmail = i.getStringExtra(Constant.USER_NAME_EMAIL)
            parentHierarchyPositionUser = i.getStringExtra(Constant.PARENT_HIERARCHY_POSITION_USER)
            val delimeter = ">"
            idOrganization = parentHierarchyPositionUser.split(delimeter).toTypedArray().get(0)
            nameOrganization = parentHierarchyPositionUser.split(delimeter).toTypedArray().get(1)
            idSubdivision = parentHierarchyPositionUser.split(delimeter).toTypedArray().get(2)
            nameSubdivision = parentHierarchyPositionUser.split(delimeter).toTypedArray().get(3)
            idPosition = parentHierarchyPositionUser.split(delimeter).toTypedArray().get(4)
            namePosition = parentHierarchyPositionUser.split(delimeter).toTypedArray().get(5)
            idDocPositionUser = parentHierarchyPositionUser.split(delimeter).toTypedArray().get(6)
            userСomment = parentHierarchyPositionUser.split(delimeter).toTypedArray().get(7)
            //вывели на экран Должность Подразделение Организацию в которой планируем работать
            val textActivPosition = findViewById<TextView>(R.id.textActivPosition)
            textActivPosition.text = "$nameOrganization > $nameSubdivision > $namePosition"
            //проверили нет ли активной смены
            db!!.collection("WorkShift")
                    .whereEqualTo("EmailPositionUser", userNameEmail)
                    .whereEqualTo("WorkShiftEnd", "")
                    .whereEqualTo("IdDocPosition", idPosition)
                    .get()
                    .addOnCompleteListener { task ->
                        if (task.isSuccessful) {
                            for (document in task.result) {
                                //Имеется активная смена
                                Log.d(TAG, document.id + " => " + document.data)
                                val doc = document.data
                                parentHierarchyPositionUserMap = doc["ParentHierarchyPositionUser"] as MutableMap<String?, Any?>?
                                val nameOrganization = parentHierarchyPositionUserMap!!.get("NameOrganization") as String?
                                val idOrganization = parentHierarchyPositionUserMap!!.get("idDocOrganization") as String?
                                val nameSubdivision = parentHierarchyPositionUserMap!!.get("NameSubdivision") as String?
                                val idSubdivision = parentHierarchyPositionUserMap!!.get("idDocSubdivision") as String?
                                val namePosition = parentHierarchyPositionUserMap!!.get("NamePosition") as String?
                                val idPosition = parentHierarchyPositionUserMap!!.get("idDocPosition") as String?
                                val activShiftDocId = document.id
                                parentHierarchyShiftUser = "$idOrganization>$nameOrganization>$idSubdivision>$nameSubdivision>$idPosition>$namePosition>$activShiftDocId"
                                val i = Intent(this@UserShiftActivity, UserProcessActivity::class.java)
                                i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                                i.putExtra(Constant.PARENT_HIERARCHY_SHIFT_USER, parentHierarchyShiftUser)
                                startActivity(i)
                            }
                        } else {
                            //отсутствует Активная смена
                            Log.d(TAG, "Error getting documents: ", task.exception)
                        }
                    }
        }
        //получаем список процессов для данной должности
        val docRefOrganization = db!!.collection("Organization").document(idOrganization!!)
        val docRefSubdivision = docRefOrganization.collection("Subdivision").document(idSubdivision!!)
        val docRefPosition = docRefSubdivision.collection("Position").document(idPosition!!)
        docRefPosition.collection("PositionSettings")
                .get()
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        for (document in task.result) {
                            Log.d(TAG, document.id + " => " + document.data)
                            //достаем название и настройки
                            val doc = document.data
                            val buttonName = doc["SettingsTitle"] as String?
                            val buttonComment = doc["SettingsСomment"] as String?
                            listInfoButton!!.add(buttonName)
                            listInfoButtonItem!!.add("$buttonName>$buttonComment")
                            adapterInfoButton!!.notifyDataSetChanged()
                        }
                    } else {
                        Log.d(TAG, "Error getting documents: ", task.exception)
                    }
                }
    }

    fun buttonAddShiftSession(view: View?) {  //Сформировали массив с данными для истории и записи в документ Смены
        parentHierarchyPositionUserMap = HashMap<Any, Any>()
        parentHierarchyPositionUserMap.put("NameOrganization", nameOrganization!!)
        parentHierarchyPositionUserMap.put("NameSubdivision", nameSubdivision!!)
        parentHierarchyPositionUserMap.put("NamePosition", namePosition!!)
        parentHierarchyPositionUserMap.put("UserEmail", userNameEmail!!)
        parentHierarchyPositionUserMap.put("UserСomment", userСomment!!)
        parentHierarchyPositionUserMap.put("idDocOrganization", idOrganization!!)
        parentHierarchyPositionUserMap.put("idDocPosition", idPosition!!)
        parentHierarchyPositionUserMap.put("idDocPositionUser", idDocPositionUser!!)
        parentHierarchyPositionUserMap.put("idDocSubdivision", idSubdivision!!)
        // Открываем новую смену при нажатии кнопки
        val data: MutableMap<String, Any?> = HashMap()
        data.put("EmailPositionUser", userNameEmail)
        data.put("IdDocPosition", idPosition)
        data.put("ParentHierarchyPositionUser", parentHierarchyPositionUserMap)
        data.put("WorkShiftEnd", "")
        data.put("WorkShiftStartTime", FieldValue.serverTimestamp())
        db!!.collection("WorkShift")
                .add(data)
                .addOnSuccessListener { documentReference ->
                    Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.id)
                    //активизируем процесс Expect
                    val data: MutableMap<String, Any?> = HashMap()
                    data.put("EmailPositionUser", userNameEmail)
                    data.put("IdDocPosition", idPosition)
                    data.put("IdDocProcessButton", "buttonExpect")
                    data.put("NameDocProcessButton", "Expect")
                    data.put("ParentHierarchyPositionUser", parentHierarchyPositionUserMap)
                    data.put("ProcessUserEnd", "")
                    data.put("ProcessUserStartTime", FieldValue.serverTimestamp())
                    val activShiftDocId = documentReference.id
                    val docRef = db!!.collection("WorkShift").document(activShiftDocId)
                    docRef.collection("ProcessUser")
                            .add(data)
                            .addOnSuccessListener { documentReference ->
                                Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.id)
                                // idDocActivButtonUser = documentReference.getId();
                            }
                            .addOnFailureListener { e -> Log.w(TAG, "Error adding document", e) }
                    parentHierarchyShiftUser = "$idOrganization>$nameOrganization>$idSubdivision>$nameSubdivision>$idPosition>$namePosition>$activShiftDocId"
                    val i = Intent(this@UserShiftActivity, UserProcessActivity::class.java)
                    i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                    i.putExtra(Constant.PARENT_HIERARCHY_SHIFT_USER, parentHierarchyShiftUser)
                    startActivity(i)
                }
                .addOnFailureListener { e -> Log.w(TAG, "Error adding document", e) }
    }

    fun buttonToReturnClik(view: View?) {
        val i = Intent(this@UserShiftActivity, UserInfoActivity::class.java)
        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
        startActivity(i)
    }

    fun buttonToHistoriClik(view: View?) {
        val i = Intent(this@UserShiftActivity, UserShiftHistory::class.java)
        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
        i.putExtra(Constant.PARENT_HIERARCHY_POSITION_USER, parentHierarchyPositionUser)
        startActivity(i)
    }

    private fun setOnClickItemlistViewInfoButton() { //
        listViewInfoButton!!.onItemClickListener = OnItemClickListener { parent, view, position, id ->
            val commentButtonItem = listInfoButtonItem!![position]
            val delimeter = ">"
            val commentTitle: String = commentButtonItem.split(delimeter).toTypedArray().get(0)
            val commentText: String = commentButtonItem.split(delimeter).toTypedArray().get(1)
            val builder = AlertDialog.Builder(this@UserShiftActivity)
            builder.setTitle(commentTitle)
                    .setMessage(commentText) // .setIcon(R.drawable.ic_android_cat)
                    .setCancelable(false)
                    .setNegativeButton("ОК"
                    ) { dialog, id -> dialog.cancel() }
            val alert = builder.create()
            alert.show()
            //   }
        }
    }

    public override fun onPause() {
        super.onPause() // Always call the superclass method first
        // yourListView.setListAdapter(null); //This clears the listview items
        // listViewInfoButton.setAdapter(null);
    }
}