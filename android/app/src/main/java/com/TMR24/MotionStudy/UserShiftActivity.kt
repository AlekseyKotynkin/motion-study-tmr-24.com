package com.TMR24.MotionStudy

import android.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.functions.FirebaseFunctions
import android.os.Bundle
import com.TMR24.MotionStudy.R
import android.content.Intent
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.firestore.QuerySnapshot
import com.google.firebase.firestore.QueryDocumentSnapshot
import com.TMR24.MotionStudy.UserProcessActivity
import com.google.firebase.firestore.FieldValue
import com.google.android.gms.tasks.OnSuccessListener
import com.google.android.gms.tasks.OnFailureListener
import com.TMR24.MotionStudy.UserInfoActivity
import com.TMR24.MotionStudy.UserShiftHistory
import android.widget.AdapterView.OnItemClickListener
import android.content.DialogInterface
import android.util.Log
import android.view.View
import android.widget.*
import java.util.ArrayList
import java.util.HashMap

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
            idOrganization =
                parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[0]
            nameOrganization =
                parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[1]
            idSubdivision =
                parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[2]
            nameSubdivision =
                parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[3]
            idPosition = parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[4]
            namePosition =
                parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[5]
            idDocPositionUser =
                parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[6]
            userСomment = parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[7]
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
                            parentHierarchyPositionUserMap =
                                doc["ParentHierarchyPositionUser"] as MutableMap<String?, Any?>?
                            val nameOrganization =
                                parentHierarchyPositionUserMap!!["NameOrganization"] as String?
                            val idOrganization =
                                parentHierarchyPositionUserMap!!["idDocOrganization"] as String?
                            val nameSubdivision =
                                parentHierarchyPositionUserMap!!["NameSubdivision"] as String?
                            val idSubdivision =
                                parentHierarchyPositionUserMap!!["idDocSubdivision"] as String?
                            val namePosition =
                                parentHierarchyPositionUserMap!!["NamePosition"] as String?
                            val idPosition =
                                parentHierarchyPositionUserMap!!["idDocPosition"] as String?
                            val activShiftDocId = document.id
                            parentHierarchyShiftUser =
                                "$idOrganization>$nameOrganization>$idSubdivision>$nameSubdivision>$idPosition>$namePosition>$activShiftDocId"
                            val i = Intent(this@UserShiftActivity, UserProcessActivity::class.java)
                            i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                            i.putExtra(
                                Constant.PARENT_HIERARCHY_SHIFT_USER,
                                parentHierarchyShiftUser
                            )
                            startActivity(i)
                        }
                    } else {
                        //отсутствует Активная смена
                        Log.d(TAG, "Error getting documents: ", task.exception)
                    }
                }
        }
        //получаем список процессов для данной должности
        val docRefOrganization = db!!.collection("Organization").document(
            idOrganization!!
        )
        val docRefSubdivision = docRefOrganization.collection("Subdivision").document(
            idSubdivision!!
        )
        val docRefPosition = docRefSubdivision.collection("Position").document(
            idPosition!!
        )
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
        parentHierarchyPositionUserMap["NameOrganization"] = nameOrganization!!
        parentHierarchyPositionUserMap["NameSubdivision"] = nameSubdivision!!
        parentHierarchyPositionUserMap["NamePosition"] = namePosition!!
        parentHierarchyPositionUserMap["UserEmail"] = userNameEmail!!
        parentHierarchyPositionUserMap["UserСomment"] = userСomment!!
        parentHierarchyPositionUserMap["idDocOrganization"] = idOrganization!!
        parentHierarchyPositionUserMap["idDocPosition"] = idPosition!!
        parentHierarchyPositionUserMap["idDocPositionUser"] = idDocPositionUser!!
        parentHierarchyPositionUserMap["idDocSubdivision"] = idSubdivision!!
        // Открываем новую смену при нажатии кнопки
        val data: MutableMap<String, Any?> = HashMap()
        data["EmailPositionUser"] = userNameEmail
        data["IdDocPosition"] = idPosition
        data["ParentHierarchyPositionUser"] = parentHierarchyPositionUserMap
        data["WorkShiftEnd"] = ""
        data["WorkShiftStartTime"] = FieldValue.serverTimestamp()
        db!!.collection("WorkShift")
            .add(data)
            .addOnSuccessListener { documentReference ->
                Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.id)
                //активизируем процесс Expect
                val data: MutableMap<String, Any?> = HashMap()
                data["EmailPositionUser"] = userNameEmail
                data["IdDocPosition"] = idPosition
                data["IdDocProcessButton"] = "buttonExpect"
                data["NameDocProcessButton"] = "Expect"
                data["ParentHierarchyPositionUser"] = parentHierarchyPositionUserMap
                data["ProcessUserEnd"] = ""
                data["ProcessUserStartTime"] = FieldValue.serverTimestamp()
                val activShiftDocId = documentReference.id
                val docRef = db!!.collection("WorkShift").document(activShiftDocId)
                docRef.collection("ProcessUser")
                    .add(data)
                    .addOnSuccessListener { documentReference ->
                        Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.id)
                        // idDocActivButtonUser = documentReference.getId();
                    }
                    .addOnFailureListener { e -> Log.w(TAG, "Error adding document", e) }
                parentHierarchyShiftUser =
                    "$idOrganization>$nameOrganization>$idSubdivision>$nameSubdivision>$idPosition>$namePosition>$activShiftDocId"
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
        listViewInfoButton!!.onItemClickListener =
            OnItemClickListener { parent, view, position, id ->
                val commentButtonItem = listInfoButtonItem!![position]
                val delimeter = ">"
                val commentTitle = commentButtonItem.split(delimeter.toRegex()).toTypedArray()[0]
                val commentText = commentButtonItem.split(delimeter.toRegex()).toTypedArray()[1]
                val builder = AlertDialog.Builder(this@UserShiftActivity)
                builder.setTitle(commentTitle)
                    .setMessage(commentText) // .setIcon(R.drawable.ic_android_cat)
                    .setCancelable(false)
                    .setNegativeButton(
                        "ОК"
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