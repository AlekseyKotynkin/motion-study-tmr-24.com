package com.TMR24.MotionStudy

import android.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.firestore.FirebaseFirestore
import android.os.Bundle
import com.TMR24.MotionStudy.R
import android.content.Intent
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.firestore.QuerySnapshot
import com.google.firebase.firestore.QueryDocumentSnapshot
import android.widget.AdapterView.OnItemClickListener
import android.content.DialogInterface
import android.util.Log
import android.view.View
import android.widget.*
import com.TMR24.MotionStudy.UserShiftActivity
import com.google.firebase.Timestamp
import java.text.SimpleDateFormat
import java.util.ArrayList

class UserShiftHistory : AppCompatActivity() {
    private var db: FirebaseFirestore? = null
    private val TAG: String? = null
    private var userNameEmail: String? = null
    private var parentHierarchyPositionUser: String? = null
    private var nameOrganization: String? = null
    private var nameSubdivision: String? = null
    private var namePosition: String? = null
    private var idPosition: String? = null
    private var idOrganization: String? = null
    private var idSubdivision: String? = null
    private var idDocPositionUser: String? = null
    private var userСomment: String? = null
    private val textActivPositionHistori: TextView? = null
    private var buttonToReturnHistori: Button? = null
    private var listViewHistoriButton: ListView? = null
    private var adapterHistoriButton: ArrayAdapter<String>? = null
    private var listHistoriButton: MutableList<String>? = null
    private var listHistoriButtonItem: MutableList<String>? = null
    private var workShiftEndTime: Timestamp? = null
    private var workShiftStartTime: Timestamp? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_shift_history)
        init()
        setOnClickItemlistViewHistoriButton()
    }

    private fun init() {
        db = FirebaseFirestore.getInstance()
        //   mFunctions = FirebaseFunctions.getInstance();
        buttonToReturnHistori = findViewById(R.id.buttonToReturnHistori)
        listViewHistoriButton = findViewById(R.id.listViewHistori)
        listHistoriButton = ArrayList()
        listHistoriButtonItem = ArrayList()
        adapterHistoriButton =
            ArrayAdapter(this, android.R.layout.simple_list_item_1, listHistoriButton)
        listViewHistoriButton.setAdapter(adapterHistoriButton)
    }

    public override fun onStart() {
        super.onStart()
        val i = intent
        if (i != null) {   //очистили ArrayList
            listHistoriButton!!.clear()
            listHistoriButtonItem!!.clear()
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
            val textActivPosition = findViewById<TextView>(R.id.textActivPositionHistori)
            textActivPosition.text = "$nameOrganization > $nameSubdivision > $namePosition"
            //проверили нет ли активной смены
            db!!.collection("WorkShift")
                .whereEqualTo("EmailPositionUser", userNameEmail)
                .whereEqualTo("WorkShiftEnd", "false")
                .whereEqualTo("IdDocPosition", idPosition)
                .get()
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        for (document in task.result) {
                            //Имеется активная смена
                            Log.d(TAG, document.id + " => " + document.data)
                            val doc = document.data
                            workShiftStartTime = doc["WorkShiftStartTime"] as Timestamp?
                            val g = workShiftStartTime!!.toDate()
                            val x = workShiftStartTime!!.seconds
                            val formatForDateNow = SimpleDateFormat("dd.MM.yyyy ' time ' k:mm:ss")
                            workShiftEndTime = doc["WorkShiftEndTime"] as Timestamp?
                            val h = workShiftEndTime!!.toDate()
                            val a = workShiftEndTime!!.seconds
                            val seconds = a - x
                            // переводим секунды в дни-часы-минуты-секунды
                            // long sec = seconds % 60;
                            val minutes = seconds % 3600 / 60
                            val hours = seconds % 86400 / 3600
                            val days = seconds / 86400
                            listHistoriButton!!.add(
                                "Shift start " + formatForDateNow.format(g) + " > End of shift " + formatForDateNow.format(
                                    h
                                )
                            )
                            listHistoriButtonItem!!.add(document.id + ">" + "Day " + days + " Hour " + hours + " Minute " + minutes)
                            adapterHistoriButton!!.notifyDataSetChanged()
                        }
                    } else {
                        //отсутствует Активная смена
                        Log.d(TAG, "Error getting documents: ", task.exception)
                    }
                }
        }
    }

    private fun setOnClickItemlistViewHistoriButton() { //
        listViewHistoriButton!!.onItemClickListener =
            OnItemClickListener { parent, view, position, id ->
                val buttonHistori = listHistoriButtonItem!![position]
                val delimeter = ">"
                val idButtonHistori = buttonHistori.split(delimeter.toRegex()).toTypedArray()[0]
                val shiftDurationHistori =
                    buttonHistori.split(delimeter.toRegex()).toTypedArray()[1]
                // выводим диалоговое окно
                val builder = AlertDialog.Builder(this@UserShiftHistory)
                builder.setTitle("Histori Shift")
                    .setMessage("Apologize! This object is under construction! Shift duration $shiftDurationHistori") // .setIcon(R.drawable.ic_android_cat)
                    .setCancelable(false)
                    .setNegativeButton(
                        "ОК"
                    ) { dialog, id -> dialog.cancel() }
                val alert = builder.create()
                alert.show()
            }
    }

    fun buttonToReturnClik(view: View?) {
        val i = Intent(this@UserShiftHistory, UserShiftActivity::class.java)
        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
        i.putExtra(Constant.PARENT_HIERARCHY_POSITION_USER, parentHierarchyPositionUser)
        startActivity(i)
    }
}