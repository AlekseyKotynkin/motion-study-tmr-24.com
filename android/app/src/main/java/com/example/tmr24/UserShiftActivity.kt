package com.example.tmr24

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.app.AlertDialog
import android.content.Intent
import com.google.firebase.firestore.FieldValue
import android.widget.AdapterView.OnItemClickListener
import android.util.Log
import android.view.View
import android.widget.*
import com.example.tmr24.databinding.ActivityUserShiftBinding
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import java.util.ArrayList
import java.util.HashMap

class UserShiftActivity : AppCompatActivity() {
    private lateinit var binding: ActivityUserShiftBinding
    private val db = Firebase.firestore
    private val listInfoButton = ArrayList<String>()
    private val listInfoButtonItem = ArrayList<String>()
    private val textActivPosition: TextView? = null
    private val TAG: String? = null
    private var nameOrganization: String? = null
    private var nameSubdivision: String? = null
    private var namePosition: String? = null
    private var UserEmail: String? = null
    private var parentHierarchyShiftUser: String? = null
    private var parentHierarchyPositionUser: String? = null
    private var idPosition: String? = null
    private var idOrganization: String? = null
    private var idSubdivision: String? = null
    private var idDocPositionUser: String? = null
    private var idDocOrganization: String? = null
    private var idDocPosition: String? = null
    private var idDocSubdivision: String? = null
    private var UserСomment: String? = null
    private var parentHierarchyPositionUserMap: MutableMap<*, *>? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_shift)
        binding = ActivityUserShiftBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }


    public override fun onStart() {
        super.onStart()
        val i = intent
        if (i != null) {   //очистили ArrayList
            listInfoButton.clear()
            listInfoButtonItem.clear()
            // получили строку данных с предидущего Активити
            UserEmail = i.getStringExtra(Constant.USER_NAME_EMAIL)
            parentHierarchyPositionUser = i.getStringExtra(Constant.PARENT_HIERARCHY_POSITION_USER)
            val delimeter = ">"
            idOrganization = parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[0]
            nameOrganization = parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[1]
            idSubdivision = parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[2]
            nameSubdivision = parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[3]
            idPosition = parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[4]
            namePosition = parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[5]
            idDocPositionUser = parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[6]
            UserСomment = parentHierarchyPositionUser!!.split(delimeter.toRegex()).toTypedArray()[7]
            //вывели на экран Должность Подразделение Организацию в которой планируем работать
            //val textActivPosition = findViewById<TextView>(R.id.textActivPosition)
            val textActivPosition = binding.textActivPosition
            val poleActivPosition: String = ("$nameOrganization > $nameSubdivision > $namePosition")
            textActivPosition.text = poleActivPosition
            //проверили нет ли активной смены
            db.collection("WorkShift")
                .whereEqualTo("EmailPositionUser", UserEmail)
                .whereEqualTo("WorkShiftEnd", "")
                .whereEqualTo("IdDocPosition", idPosition)
                .get()
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        for (document in task.result) {
                            //Имеется активная смена
                            Log.d(TAG, document.id + " => " + document.data)
                            val doc = document.data
                            parentHierarchyPositionUserMap = doc["ParentHierarchyPositionUser"] as MutableMap<*, *>?
                            val nameOrganization = parentHierarchyPositionUserMap!!["NameOrganization"] as String?
                            val idOrganization = parentHierarchyPositionUserMap!!["idDocOrganization"] as String?
                            val nameSubdivision = parentHierarchyPositionUserMap!!["NameSubdivision"] as String?
                            val idSubdivision = parentHierarchyPositionUserMap!!["idDocSubdivision"] as String?
                            val namePosition = parentHierarchyPositionUserMap!!["NamePosition"] as String?
                            val idPosition = parentHierarchyPositionUserMap!!["idDocPosition"] as String?
                            val activShiftDocId = document.id
                            val poleParentHierarchyShiftUser: String = ("$idOrganization>$nameOrganization>$idSubdivision>$nameSubdivision>$idPosition>$namePosition>$activShiftDocId")
                            parentHierarchyShiftUser = poleParentHierarchyShiftUser
                            val iI = Intent(this@UserShiftActivity, UserProcessActivity::class.java)
                            iI.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                            iI.putExtra(Constant.PARENT_HIERARCHY_SHIFT_USER, parentHierarchyShiftUser)
                            startActivity(iI)
                        }
                    } else {
                        //отсутствует Активная смена
                        Log.d(TAG, "Error getting documents: ", task.exception)
                    }
                }
        }
        //получаем список процессов для данной должности
        val docRefOrganization = db.collection("Organization").document(idOrganization!!)
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
                        if (buttonName != null) {
                            listInfoButton.add(buttonName)
                        }
                        val poleListInfoButtonItem: String = ("$buttonName>$buttonComment")
                        listInfoButtonItem.add(poleListInfoButtonItem)
                        val nameAdapter = ArrayAdapter<String>(this@UserShiftActivity, android.R.layout.simple_list_item_1, listInfoButtonItem )
                        val listViewInfoButton = binding.listViewInfoButton
                        listViewInfoButton.adapter = nameAdapter
                    }
                } else {
                    Log.d(TAG, "Error getting documents: ", task.exception)
                }
            }

        val buttonAddShiftSession = binding.buttonAddShiftSession
        val buttonToReturn = binding.buttonToReturn
        val buttonShiftHistory = binding.buttonShiftHistory
        val listViewInfoButton = binding.listViewInfoButton

        buttonAddShiftSession.setOnClickListener {
            Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                .show()
            parentHierarchyPositionUserMap = HashMap<Any, Any>()
            parentHierarchyPositionUserMap = mutableMapOf(
                "NameOrganization" to nameOrganization,
                "NameSubdivision" to nameSubdivision,
                "NamePosition" to namePosition,
                "UserEmail" to UserEmail,
                "UserСomment" to UserСomment,
                "idDocOrganization" to idOrganization,
                "idDocPosition" to idPosition,
                "idDocPositionUser" to idDocPositionUser,
                "idDocSubdivision" to idSubdivision
            )
            println(parentHierarchyPositionUserMap)
            //parentHierarchyPositionUserMap["NameOrganization"] = nameOrganization!!
            //parentHierarchyPositionUserMap["NameSubdivision"] = nameSubdivision!!
            //parentHierarchyPositionUserMap["NamePosition"] = namePosition!!
            //parentHierarchyPositionUserMap["UserEmail"] = UserEmail!!
            //parentHierarchyPositionUserMap["UserСomment"] = UserСomment!!
            //parentHierarchyPositionUserMap["idDocOrganization"] = idOrganization!!
            //parentHierarchyPositionUserMap["idDocPosition"] = idPosition!!
            //parentHierarchyPositionUserMap["idDocPositionUser"] = idDocPositionUser!!
            //parentHierarchyPositionUserMap["idDocSubdivision"] = idSubdivision!!
            // Открываем новую смену при нажатии кнопки
            val data: MutableMap<String, Any?> = HashMap()
            data["EmailPositionUser"] = UserEmail
            data["IdDocPosition"] = idPosition
            data["ParentHierarchyPositionUser"] = parentHierarchyPositionUserMap
            data["WorkShiftEnd"] = ""
            data["WorkShiftStartTime"] = FieldValue.serverTimestamp()
            db.collection("WorkShift")
                .add(data)
                .addOnSuccessListener { documentReference ->
                    Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.id)
                    //активизируем процесс Expect
                    val data: MutableMap<String, Any?> = HashMap()
                    data["EmailPositionUser"] = UserEmail
                    data["IdDocPosition"] = idPosition
                    data["IdDocProcessButton"] = "buttonExpect"
                    data["NameDocProcessButton"] = "Expect"
                    data["ParentHierarchyPositionUser"] = parentHierarchyPositionUserMap
                    data["ProcessUserEnd"] = ""
                    data["ProcessUserStartTime"] = FieldValue.serverTimestamp()
                    val activShiftDocId = documentReference.id
                    val poleParentHierarchyShiftUser: String = ("$idOrganization>$nameOrganization>$idSubdivision>$nameSubdivision>$idPosition>$namePosition>$activShiftDocId")
                    parentHierarchyShiftUser = poleParentHierarchyShiftUser
                    val i = Intent(this@UserShiftActivity, UserProcessActivity::class.java)
                    i.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                    i.putExtra(Constant.PARENT_HIERARCHY_SHIFT_USER, parentHierarchyShiftUser)
                    startActivity(i)
                }
                .addOnFailureListener { e -> Log.w(TAG, "Error adding document", e) }
        }

        buttonToReturn.setOnClickListener {
            val i = Intent(this@UserShiftActivity, UserInfoActivity::class.java)
            i.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
            startActivity(i)
        }

        buttonShiftHistory.setOnClickListener {
            val i = Intent(this@UserShiftActivity, UserShiftHistory::class.java)
            i.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
            i.putExtra(Constant.PARENT_HIERARCHY_POSITION_USER, parentHierarchyPositionUser)
            startActivity(i)
        }

        listViewInfoButton.onItemClickListener =
            OnItemClickListener { parent, view, position, id ->
                val commentButtonItem = listInfoButtonItem[position]
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
            }

    }

    public override fun onPause() {
        super.onPause() // Always call the superclass method first
        // yourListView.setListAdapter(null); //This clears the listview items
        // listViewInfoButton.setAdapter(null);
    }

    fun onClick(view: View?) {
        //  when (view) {
        //btnBlack -> Toast.makeText(this, "Black button click", Toast.LENGTH_LONG).show()
        //btnCustom -> Toast.makeText(this, "Custom button click", Toast.LENGTH_LONG).show()
        //    }
    }

}


