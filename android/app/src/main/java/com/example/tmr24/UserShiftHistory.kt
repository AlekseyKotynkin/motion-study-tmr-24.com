package com.example.tmr24

import android.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.content.Intent
import android.util.Log
import android.widget.*
import com.example.tmr24.databinding.ActivityUserShiftHistoryBinding
import com.google.firebase.Timestamp
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import java.text.SimpleDateFormat

class UserShiftHistory : AppCompatActivity() {
    private val db = Firebase.firestore
    private val TAG: String? = null
    private var UserEmail: String? = null
    private var parentHierarchyPositionUser: String? = null
    private var nameOrganization: String? = null
    private var nameSubdivision: String? = null
    private var namePosition: String? = null
    private var idPosition: String? = null
    private var idOrganization: String? = null
    private var idSubdivision: String? = null
    private var idDocPositionUser: String? = null
    private var UserСomment: String? = null
    private var buttonToReturnHistori: Button? = null
    private var listHistoriButton = ArrayList<String>()
    private var listHistoriButtonItem = ArrayList<String>()
    private var workShiftEndTime: Timestamp? = null
    private var workShiftStartTime: Timestamp? = null
    private lateinit var binding: ActivityUserShiftHistoryBinding


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_shift_history)
        binding = ActivityUserShiftHistoryBinding.inflate(layoutInflater)
        setContentView(binding.root)
        buttonToReturnHistori = binding.buttonToReturnHistori
        buttonToReturnHistori!!.setOnClickListener {
            Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                .show()
            val i = Intent(this@UserShiftHistory, UserShiftActivity::class.java)
            i.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
            i.putExtra(Constant.PARENT_HIERARCHY_POSITION_USER, parentHierarchyPositionUser)
            startActivity(i)
        }
        setOnClickItemlistViewHistoriButton()
    }

    public override fun onStart() {
        super.onStart()
        val i = intent
        if (i != null) {   //очистили ArrayList
            listHistoriButton.clear()
            listHistoriButtonItem.clear()
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
            val textActivPosition = binding.textActivPositionHistori
            val poleTextActivPosition: String = ("$nameOrganization > $nameSubdivision > $namePosition")
            textActivPosition.text = poleTextActivPosition
            //проверили нет ли активной смены
            db.collection("WorkShift")
                .whereEqualTo("EmailPositionUser", UserEmail)
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
                            val polelistHistoriButton: String = ("Shift start " + formatForDateNow.format(g) + " > End of shift " + formatForDateNow.format(h))
                            listHistoriButton.add(polelistHistoriButton)
                            val polelistHistoriButtonItem: String = (document.id + ">" + "Day " + days + " Hour " + hours + " Minute " + minutes)
                            listHistoriButtonItem.add(polelistHistoriButtonItem)
                            val nameAdapterHistori = ArrayAdapter<String>(this@UserShiftHistory, android.R.layout.simple_list_item_1,
                                listHistoriButton
                            )
                            val listViewHistori = binding.listViewHistori
                            listViewHistori.adapter = nameAdapterHistori
                        }
                    } else {
                        //отсутствует Активная смена
                        Log.d(TAG, "Error getting documents: ", task.exception)
                    }
                }
        }
    }

//    private fun setOnClickItemlistViewHistoriButton() { //
//        listViewHistoriButton!!.onItemClickListener =
//            OnItemClickListener { parent, view, position, id ->
//                val buttonHistori = listHistoriButtonItem!![position]
//                val delimeter = ">"
//                val idButtonHistori = buttonHistori.split(delimeter.toRegex()).toTypedArray()[0]
//                val shiftDurationHistori = buttonHistori.split(delimeter.toRegex()).toTypedArray()[1]
//                // выводим диалоговое окно
//                val builder = AlertDialog.Builder(this@UserShiftHistory)
//                builder.setTitle("Histori Shift")
//                    .setMessage("Apologize! This object is under construction! Shift duration $shiftDurationHistori") // .setIcon(R.drawable.ic_android_cat)
//                    .setCancelable(false)
//                    .setNegativeButton(
//                        "ОК"
//                    ) { dialog, id -> dialog.cancel() }
//                val alert = builder.create()
//                alert.show()
//            }
//    }

    private fun setOnClickItemlistViewHistoriButton() {
        val listViewHistori = binding.listViewHistori
        listViewHistori.onItemClickListener = AdapterView.OnItemClickListener { parent, view, position, id ->
            val buttonHistori = listHistoriButtonItem[position]
            val delimeter = ">"
            val idButtonHistori = buttonHistori.split(delimeter.toRegex()).toTypedArray()[0]
            val shiftDurationHistori = buttonHistori.split(delimeter.toRegex()).toTypedArray()[1]
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


}