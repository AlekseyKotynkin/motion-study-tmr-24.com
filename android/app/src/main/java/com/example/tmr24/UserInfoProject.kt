package com.example.tmr24

import android.app.AlertDialog
import android.app.DatePickerDialog
import android.content.Intent
import android.os.Bundle
import android.provider.ContactsContract
import android.util.Log
import android.view.View
import android.widget.DatePicker
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.ui.AppBarConfiguration
import androidx.work.Data
import com.example.tmr24.databinding.ActivityUserInfoProjectBinding
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import java.security.Timestamp
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*

class UserInfoProject : AppCompatActivity() {

    private lateinit var binding: ActivityUserInfoProjectBinding
    private var userNameEmail: String? = null
    private var projectDocId: String? = null
    private val db = Firebase.firestore
    private val TAG: String? = null
    var cal = Calendar.getInstance()
    //
    var listOrganization_name_id: MutableList<String?> = mutableListOf()
    var listOrganization_name: MutableList<String?> = mutableListOf()
    var listProject_name_id: MutableList<String?> = mutableListOf()
    var listProject_name: MutableList<String?> = mutableListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityUserInfoProjectBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    public override fun onStart() {
        super.onStart()
        val i = intent
        userNameEmail = i.getStringExtra(Constant.USER_NAME_EMAIL)
        projectDocId = i.getStringExtra(Constant.ID_DOC_PROJECT)
        //
        val titleDialogProgectName = binding.titleDialogProgectName
        val titleDialogProgectComment = binding.titleDialogProgectComment
        val titleDialogProgectFootingId = binding.titleDialogProgectFootingId
        val titleDialogProgectIdOrganization = binding.titleDialogProgectIdOrganization
        val titleDialogProgectDataStart = binding.titleDialogProgectDataStart
        val titleDialogProgectDataStop = binding.titleDialogProgectDataStop
        val titleDialogProgectDataStopPlan = binding.titleDialogProgectDataStopPlan
        val titleDialogProgectAssessmentComment = binding.titleDialogProgectAssessmentComment
        val titleDialogProgectStatus = binding.titleDialogProgectStatus
        val titleDialogProgectOriginator = binding.titleDialogProgectOriginator
        val titleDialogProgectNameOrganization = binding.titleDialogProgectNameOrganization
        val titleDialogProgectFooting = binding.titleDialogProgectFooting
        //
        if (i != null && projectDocId == null ) {
            //intentMain
            titleDialogProgectOriginator.text = userNameEmail
            // заполняю поле Название и Id организации title_dialog_progect_nameOrganization и title_dialog_progect_idOrganization
            titleDialogProgectNameOrganization.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been Executor", Toast.LENGTH_SHORT)
                    .show()
                // убираем эконку о не заполненом поле Статус
                titleDialogProgectNameOrganization.setError(null)
                // получить список Организаций для поиска коллег
                db.collection("User")
                    .whereEqualTo("userNameEmail", userNameEmail)
                    .get()
                    .addOnSuccessListener { documents ->
                        for (document in documents) {
                            Log.d(TAG, "${document.id} => ${document.data}")
                            //получаем список Организаций в которых пользователь зарегистрирован для получения списка коллег
                            val doc = document.data
                            val idOrganization = doc["idOrganization"]
                            val nameOrganization = doc["nameOrganization"]
                            val colleague_NameOrganization: String = ("$nameOrganization%$idOrganization")
                            listOrganization_name_id.add(colleague_NameOrganization as String?)
                            listOrganization_name.add(nameOrganization as String?)
                        }
                        //Функция отображает список организаций для выбора Основания
                        choosingProjectListIdOrganization()
                    }
                    .addOnFailureListener { exception ->
                        Log.w(TAG, "Error getting documents: ", exception)
                    }
            }
            // активируем текстовое поле Статус title_dialog_tasks_status
            titleDialogProgectStatus.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been Status", Toast.LENGTH_SHORT)
                    .show()
                // убираем эконку о не заполненом поле Статус
                titleDialogProgectStatus.setError(null)
                // setup the alert builder
                val builder_status = AlertDialog.Builder(this@UserInfoProject)
                builder_status.setTitle(R.string.title_dialog_tasks_text_status)
                var checkedItem_status = 0 // cow
                //val animals_status = arrayOf("В работе", "Отменено", "Выполнено", "Проектируется")
                val animals_status = arrayOf("В работе", "Проектируется")
                val titleDialogTasksStatus_Aktual = titleDialogProgectStatus.text
                val contains_status = titleDialogTasksStatus_Aktual in animals_status
                //
                if (contains_status == true){
                    checkedItem_status = animals_status.indexOf(titleDialogTasksStatus_Aktual)
                    titleDialogProgectStatus.text = animals_status[checkedItem_status]
                }else{
                    titleDialogProgectStatus.text = animals_status[checkedItem_status]
                }
                // add a radio button list
                builder_status.setSingleChoiceItems(animals_status, checkedItem_status) { dialog, which ->
                    // user checked an item
                    titleDialogProgectStatus.text = animals_status[which]
                }
                // add OK and Cancel buttons
                builder_status.setPositiveButton("OK") { dialog, which ->
                    // user clicked OK
                    Toast.makeText(applicationContext, "Button OK", Toast.LENGTH_SHORT)
                        .show()
                }
                builder_status.setNegativeButton("Cancel", null)
                // create and show the alert dialog
                val dialog = builder_status.create()
                dialog.show()
            }
            // активируем поле Основание проект
            titleDialogProgectFooting.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                // получить список Организаций для поиска коллег
                db.collection("User")
                    .whereEqualTo("userNameEmail", userNameEmail)
                    .get()
                    .addOnSuccessListener { documents ->
                        for (document in documents) {
                            Log.d(TAG, "${document.id} => ${document.data}")
                            //получаем список Организаций в которых пользователь зарегистрирован для получения списка коллег
                            val doc = document.data
                            val idOrganization = doc["idOrganization"]
                            val nameOrganization = doc["nameOrganization"]
                            val colleague_NameOrganization: String = ("$nameOrganization%$idOrganization")
                            listOrganization_name_id.add(colleague_NameOrganization as String?)
                            listOrganization_name.add(nameOrganization as String?)
                        }
                        //Функция отображает список организаций для выбора Проекта
                        choosingProjectListIdNameProject()
                    }
                    .addOnFailureListener { exception ->
                        Log.w(TAG, "Error getting documents: ", exception)
                    }
            }
            // активируем кнопку Добавить проект
            val buttonAddProject = binding.buttonAddProject
            buttonAddProject.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                //// получаем данные с формы UserInfoProject
                val nameProject = titleDialogProgectName.text.toString()
                val commentProject = titleDialogProgectComment.text.toString()
                val footingProject = titleDialogProgectFooting.text.toString()
                val footingProjectId = titleDialogProgectFootingId.text.toString()
                val idOrganization = titleDialogProgectIdOrganization.text.toString()
                val nameOrganization = titleDialogProgectNameOrganization.text.toString()
                val statusProject = titleDialogProgectStatus.text.toString()
                val dataProject_stop = titleDialogProgectDataStop.text.toString()
                val originatorProject = titleDialogProgectOriginator.text.toString()
                val dataProject_stop_plan = titleDialogProgectDataStopPlan.text.toString()
                val assessmentProject_comment = titleDialogProgectAssessmentComment.text.toString()
                //// проверяем заполненость полей
                if (statusProject == "/--/--/--/"){
                    titleDialogProgectStatus.error = "Выберети статус!"
                }else if (nameOrganization == "/--/--/--/"){
                    titleDialogProgectNameOrganization.error = "Выберети организацию!"
                }else if (nameProject == ""){
                    titleDialogProgectName.error = "Заполните поле!"
                }else if (commentProject == ""){
                    titleDialogProgectComment.error = "Заполните поле!"
                }else if (dataProject_stop_plan == "/--/--/----/"){
                    // Add a new document with a generated id.
                    val data = hashMapOf(
                        "nameProject" to nameProject,
                        "commentProject" to commentProject,
                        "footingProject" to footingProject,
                        "footingProjectId" to footingProjectId,
                        "idOrganization" to idOrganization,
                        "nameOrganization" to nameOrganization,
                        "statusProject" to statusProject,
                        "dataProject_start" to FieldValue.serverTimestamp(),
                        "dataProject_stop" to dataProject_stop,
                        "originatorProject" to originatorProject,
                        "dataProject_stop_plan" to dataProject_stop_plan,
                        "assessmentProject_comment" to assessmentProject_comment,
                    )
                    db.collection("Project")
                        .add(data)
                        .addOnSuccessListener { documentReference ->
                            Log.d(TAG, "DocumentSnapshot written with ID: ${documentReference.id}")
                            val b = Intent(this@UserInfoProject, UserInfoMyProject::class.java)
                            b.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                            startActivity(b)
                        }
                        .addOnFailureListener { e ->
                            Log.w(TAG, "Error adding document", e)
                        }
                }else {
                    val dataProject_stop_plan_1 = cal.getTime()
                    // Add a new document with a generated id.
                    val data = hashMapOf(
                        "nameProject" to nameProject,
                        "commentProject" to commentProject,
                        "footingProject" to footingProject,
                        "footingProjectId" to footingProjectId,
                        "idOrganization" to idOrganization,
                        "nameOrganization" to nameOrganization,
                        "statusProject" to statusProject,
                        "dataProject_start" to FieldValue.serverTimestamp(),
                        "dataProject_stop" to dataProject_stop,
                        "originatorProject" to originatorProject,
                        "dataProject_stop_plan" to dataProject_stop_plan_1,
                        "assessmentProject_comment" to assessmentProject_comment,
                        )
                    db.collection("Project")
                        .add(data)
                        .addOnSuccessListener { documentReference ->
                            Log.d(TAG, "DocumentSnapshot written with ID: ${documentReference.id}")
                            val b = Intent(this@UserInfoProject, UserInfoMyProject::class.java)
                            b.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                            startActivity(b)
                        }
                        .addOnFailureListener { e ->
                            Log.w(TAG, "Error adding document", e)
                        }
                }
            }
            // активируем поле Выход проект
            val buttonExitProject = binding.buttonExitProject
            buttonExitProject.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val b = Intent(this@UserInfoProject, UserInfoMyProject::class.java)
                b.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                startActivity(b)
            }
            // активируем Clik окна выбора Планируемой даты завершения title_dialog_project_data_stop_plan
            // создаем обьект с текущей датой
            val dateSetListener = object : DatePickerDialog.OnDateSetListener {
                override fun onDateSet(view: DatePicker, year: Int, monthOfYear: Int,
                                       dayOfMonth: Int) {
                    cal.set(Calendar.YEAR, year)
                    cal.set(Calendar.MONTH, monthOfYear)
                    cal.set(Calendar.DAY_OF_MONTH, dayOfMonth)
                    updateDateInView()
                }
            }
            // создаем всплывающее окно для выбора даты
            titleDialogProgectDataStopPlan.setOnClickListener(object : View.OnClickListener {
                override fun onClick(view: View) {
                    Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                        .show()
                    DatePickerDialog(this@UserInfoProject,
                        dateSetListener,
                        // set DatePickerDialog to point to today's date when it loads up
                        cal.get(Calendar.YEAR),
                        cal.get(Calendar.MONTH),
                        cal.get(Calendar.DAY_OF_MONTH)).show()
                }
            })
        }
        if (i != null && projectDocId != null ){
            //
            val buttonAddProject = binding.buttonAddProject
            buttonAddProject.visibility = View.GONE
            //
            val docRef = db.collection("Project").document(projectDocId!!)
            docRef.get()
                .addOnSuccessListener { document ->
                    if (document != null) {
                        Log.d(TAG, "DocumentSnapshot data: ${document.data}")
                        val doc = document.data
                        val nameProject = doc!!["nameProject"] as String
                        val commentProject = doc["commentProject"] as String
                        val footingProject = doc["footingProject"] as String
                        val footingProjectId = doc["footingProjectId"] as String
                        val idOrganization = doc["idOrganization"] as String
                        val nameOrganization = doc["nameOrganization"] as String
                        val statusProject = doc["statusProject"] as String
                        val dataProject_start = doc["dataProject_start"]
                        val dataProject_stop = doc["dataProject_stop"]
                        val originatorProject = doc["originatorProject"] as String
                        val dataProject_stop_plan = doc["dataProject_stop_plan"]
                        val assessmentProject_comment = doc["assessmentProject_comment"] as String

                        // получаем данные с формы UserInfoProject
                        titleDialogProgectName.setText(nameProject)
                        titleDialogProgectComment.setText(commentProject)
                        titleDialogProgectFooting.text = footingProject
                        titleDialogProgectFootingId.text = footingProjectId
                        titleDialogProgectIdOrganization.text = idOrganization
                        titleDialogProgectNameOrganization.text = nameOrganization
                        titleDialogProgectStatus.text = statusProject
                        titleDialogProgectOriginator.text = originatorProject
                        titleDialogProgectAssessmentComment.setText(assessmentProject_comment)
                        //
                        if(originatorProject == userNameEmail && dataProject_stop == "/--/--/----/"){
                            val buttonEditProject = binding.buttonEditProject
                            buttonEditProject.visibility = View.VISIBLE
                        }
                        if (dataProject_start == "/--/--/----/"){
                            val dataProject_start_String = dataProject_start as String
                            titleDialogProgectDataStart.text = dataProject_start_String
                        } else {
                            val dataProject_start_Firebase = dataProject_start as com.google.firebase.Timestamp
                            val dataProject_start_Date = dataProject_start_Firebase.toDate()
                            val sdf = SimpleDateFormat("dd/MM/yyyy")
                            val dataProject_start_Text = sdf.format(dataProject_start_Date)
                            titleDialogProgectDataStart.text = dataProject_start_Text
                        }
                        if (dataProject_stop == "/--/--/----/"){
                            val dataProject_stop_String = dataProject_stop as String
                            titleDialogProgectDataStop.text = dataProject_stop_String
                        } else {
                            val dataProject_stop_Firebase = dataProject_stop as com.google.firebase.Timestamp
                            val dataProject_stop_Date = dataProject_stop_Firebase.toDate()
                            val sdf = SimpleDateFormat("dd/MM/yyyy")
                            val dataProject_stop_Text = sdf.format(dataProject_stop_Date)
                            titleDialogProgectDataStop.text = dataProject_stop_Text
                        }
                        if (dataProject_stop_plan == "/--/--/----/"){
                            val dataProject_stop_plan_String = dataProject_stop_plan as String
                            titleDialogProgectDataStopPlan.text = dataProject_stop_plan_String
                        } else {
                            val dataProject_stop_plan_Firebase = dataProject_stop_plan as com.google.firebase.Timestamp
                            val dataProject_stop_plan_Date = dataProject_stop_plan_Firebase.toDate()
                            val sdf = SimpleDateFormat("dd/MM/yyyy")
                            val dataProject_stop_plan_Text = sdf.format(dataProject_stop_plan_Date)
                            titleDialogProgectDataStopPlan.text = dataProject_stop_plan_Text
                        }
                    } else {
                        Log.d(TAG, "No such document")
                    }
                }
                .addOnFailureListener { exception ->
                    Log.d(TAG, "get failed with ", exception)
                }
            // активируем текстовое поле Статус title_dialog_tasks_status
            titleDialogProgectStatus.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been Status", Toast.LENGTH_SHORT)
                    .show()
                // убираем эконку о не заполненом поле Статус
                titleDialogProgectStatus.setError(null)
                // setup the alert builder
                val builder_status = AlertDialog.Builder(this@UserInfoProject)
                builder_status.setTitle(R.string.title_dialog_tasks_text_status)
                var checkedItem_status = 0 // cow
                val animals_status = arrayOf("В работе", "Отменено", "Выполнено", "Проектируется")
                val titleDialogTasksStatus_Aktual = titleDialogProgectStatus.text
                val contains_status = titleDialogTasksStatus_Aktual in animals_status
                //
                if (contains_status == true){
                    checkedItem_status = animals_status.indexOf(titleDialogTasksStatus_Aktual)
                    titleDialogProgectStatus.text = animals_status[checkedItem_status]
                }else{
                    titleDialogProgectStatus.text = animals_status[checkedItem_status]
                }
                // add a radio button list
                builder_status.setSingleChoiceItems(animals_status, checkedItem_status) { dialog, which ->
                    // user checked an item
                    titleDialogProgectStatus.text = animals_status[which]
                }
                // add OK and Cancel buttons
                builder_status.setPositiveButton("OK") { dialog, which ->
                    // user clicked OK
                    Toast.makeText(applicationContext, "Button OK", Toast.LENGTH_SHORT)
                        .show()
                }
                builder_status.setNegativeButton("Cancel", null)
                // create and show the alert dialog
                val dialog = builder_status.create()
                dialog.show()
            }
            // активируем поле Редактировать проект
            val buttonEditProject = binding.buttonEditProject
            buttonEditProject.setOnClickListener {
                //
                val b = Intent(this@UserInfoProject, UserInfoMyProject::class.java)
                b.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                startActivity(b)
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                //// получаем данные с формы UserInfoProject
                val nameProject = titleDialogProgectName.text.toString()
                val commentProject = titleDialogProgectComment.text.toString()
                val statusProject = titleDialogProgectStatus.text.toString()
                val assessmentProject_comment = titleDialogProgectAssessmentComment.text.toString()
                //// проверяем заполненость полей
                if (statusProject == "Отменено" || statusProject == "Выполнено"){
                    //
                    val washingtonRef = db.collection("Project").document(projectDocId!!)
                    // Set the "isCapital" field of the city 'DC'
                    washingtonRef
                        .update("dataProject_stop", FieldValue.serverTimestamp(),
                            "statusProject", statusProject,
                            "nameProject", nameProject,
                            "commentProject", commentProject,
                            "assessmentProject_comment", assessmentProject_comment,
                        )
                        .addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully updated!") }
                        .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
                    val b = Intent(this@UserInfoProject, UserInfoMyProject::class.java)
                    b.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                    startActivity(b)
                }else if (statusProject == "В работе" || statusProject == "Проектируется"){
                    //
                    val washingtonRef = db.collection("Project").document(projectDocId!!)
                    // Set the "isCapital" field of the city 'DC'
                    washingtonRef
                        .update("statusProject", statusProject,
                            "nameProject", nameProject,
                            "commentProject", commentProject,
                            "assessmentProject_comment", assessmentProject_comment
                        )
                        .addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully updated!") }
                        .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
                    val b = Intent(this@UserInfoProject, UserInfoMyProject::class.java)
                    b.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                    startActivity(b)
                }
            }
            // активируем поле Выход проект
            val buttonExitProject = binding.buttonExitProject
            buttonExitProject.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val b = Intent(this@UserInfoProject, UserInfoMyProject::class.java)
                b.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                startActivity(b)
            }
        }
    }
    //Функция отображает список организаций для выбора Основания
    private fun choosingProjectListIdOrganization(){
        val titleDialogProgectNameOrganization = binding.titleDialogProgectNameOrganization
        val titleDialogProgectIdOrganization = binding.titleDialogProgectIdOrganization
        val distinct_name_id = listOrganization_name_id.distinct().toList()
        val distinct_name = listOrganization_name.distinct().toList()
        // setup the alert builder
        val builder_NameOrganization = AlertDialog.Builder(this@UserInfoProject)
        builder_NameOrganization.setTitle(R.string.title_dialog_progect_text_idOrganization)
        var checkedItem_NameOrganization = 0 // cow
        val animals_Name_Id_Organization = distinct_name_id.toTypedArray()
        val animals_NameOrganization = distinct_name.toTypedArray()
        val titleDialogProgectNameOrganization_Aktual = titleDialogProgectNameOrganization.text
        val contains_NameOrganization = titleDialogProgectNameOrganization_Aktual in animals_NameOrganization
        //
        if (contains_NameOrganization == true){
            checkedItem_NameOrganization = animals_NameOrganization.indexOf(titleDialogProgectNameOrganization_Aktual)
            val fff = animals_Name_Id_Organization[checkedItem_NameOrganization] as String
            val delimeter = "%"
            val nameOrganization = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idOrganization = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogProgectNameOrganization.text = nameOrganization
            titleDialogProgectIdOrganization.text = idOrganization
        }else{
            val fff = animals_Name_Id_Organization[checkedItem_NameOrganization] as String
            val delimeter = "%"
            val nameOrganization = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idOrganization = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogProgectNameOrganization.text = nameOrganization
            titleDialogProgectIdOrganization.text = idOrganization
        }
        // add a radio button list
        builder_NameOrganization.setSingleChoiceItems(animals_Name_Id_Organization, checkedItem_NameOrganization) { dialog, which ->
            // user checked an item
            val fff = animals_Name_Id_Organization[which] as String
            val delimeter = "%"
            val nameOrganization = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idOrganization = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogProgectNameOrganization.text = nameOrganization
            titleDialogProgectIdOrganization.text = idOrganization
        }
        // add OK and Cancel buttons
        builder_NameOrganization.setPositiveButton("OK") { dialog, which ->
            // user clicked OK
            Toast.makeText(applicationContext, "Button OK", Toast.LENGTH_SHORT)
                .show()
        }
        builder_NameOrganization.setNegativeButton("Cancel", null)
        // create and show the alert dialog
        val dialog = builder_NameOrganization.create()
        dialog.show()
        listOrganization_name_id = mutableListOf()
        listOrganization_name = mutableListOf()
    }
    //Функция отображает список организаций для выбора Проекта
    private fun fillProjectField(){
        val titleDialogProgectFooting = binding.titleDialogProgectFooting
        val titleDialogProgectFootingId = binding.titleDialogProgectFootingId
        val distinct_name_id = listProject_name_id.distinct().toList()
        val distinct_name = listProject_name.distinct().toList()
        // setup the alert builder
        val builder_ProgectFooting = AlertDialog.Builder(this@UserInfoProject)
        builder_ProgectFooting.setTitle(R.string.title_dialog_progect_text_footing)
        var checkedItem_ProgectFooting = 0 // cow
        val animals_Name_Id_Project = distinct_name_id.toTypedArray()
        val animals_NameProject = distinct_name.toTypedArray()
        val titleDialogProgectFooting_Aktual = titleDialogProgectFooting.text
        val contains_ProgectFooting = titleDialogProgectFooting_Aktual in animals_NameProject
        //
        if (contains_ProgectFooting == true){
            checkedItem_ProgectFooting = animals_NameProject.indexOf(titleDialogProgectFooting_Aktual)
            val fff = animals_Name_Id_Project[checkedItem_ProgectFooting] as String
            val delimeter = "%"
            val nameProgect = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idProgect = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogProgectFooting.text = nameProgect
            titleDialogProgectFootingId.text = idProgect
        }else{
            val fff = animals_Name_Id_Project[checkedItem_ProgectFooting] as String
            val delimeter = "%"
            val nameProgect = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idProgect = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogProgectFooting.text = nameProgect
            titleDialogProgectFootingId.text = idProgect
        }
        // add a radio button list
        builder_ProgectFooting.setSingleChoiceItems(animals_Name_Id_Project, checkedItem_ProgectFooting) { dialog, which ->
            // user checked an item
            val fff = animals_Name_Id_Project[which] as String
            val delimeter = "%"
            val nameProgect = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idProgect = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogProgectFooting.text = nameProgect
            titleDialogProgectFootingId.text = idProgect
        }
        // add OK and Cancel buttons
        builder_ProgectFooting.setPositiveButton("OK") { dialog, which ->
            // user clicked OK
            Toast.makeText(applicationContext, "Button OK", Toast.LENGTH_SHORT)
                .show()
        }
        builder_ProgectFooting.setNegativeButton("Cancel", null)
        // create and show the alert dialog
        val dialog = builder_ProgectFooting.create()
        dialog.show()
        listProject_name_id = mutableListOf()
        listProject_name = mutableListOf()
    }
    //Функция формирует список проектов из списка организаций
    private fun choosingProjectListIdNameProject() {
        val listOrganization_name_id_size = listOrganization_name_id.size
        var number_of_cycles_listOrganization_name_id = 0
        listOrganization_name_id.forEach { element ->
            val fff = element as String
            val delimeter = "%"
            val idOrganization = fff.split(delimeter.toRegex()).toTypedArray()[1]
            db.collection("Project")
                .whereEqualTo("idOrganization", idOrganization)
                .whereEqualTo("statusProject", "В работе")
                .get()
                .addOnSuccessListener { documents ->
                    for (document in documents) {
                        Log.d(TAG, "${document.id} => ${document.data}")
                        val doc = document.data
                        val nameProject = doc["nameProject"]
                        val idProject = document.id
                        val colleague_project: String = ("$nameProject%$idProject")
                        listProject_name_id.add(colleague_project as String?)
                        listProject_name.add(nameProject as String?)
                    }
                    number_of_cycles_listOrganization_name_id = number_of_cycles_listOrganization_name_id +1
                    if (listOrganization_name_id_size == number_of_cycles_listOrganization_name_id)   {
                        ////// функцияоткрывает диалоговое окно для выбора исполнителя
                        fillProjectField()
                        listOrganization_name_id = mutableListOf()
                        listOrganization_name = mutableListOf()
                    }
                }
                .addOnFailureListener { exception ->
                    Log.w(TAG, "Error getting documents: ", exception)
                }
        }
    }
    //Обновляем текст в окне "Завершить к" Планируемой даты завершения title_dialog_tasks_data_stop_plan
    private fun updateDateInView() {
        val myFormat = "dd/MM/yyyy" // mention the format you need
        val sdf = SimpleDateFormat(myFormat, Locale.US)
        val titleDialogProgectDataStopPlan = binding.titleDialogProgectDataStopPlan
        titleDialogProgectDataStopPlan.text = sdf.format(cal.getTime())
    }
}