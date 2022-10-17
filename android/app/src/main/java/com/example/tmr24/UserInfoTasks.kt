package com.example.tmr24

import android.app.AlertDialog
import android.app.DatePickerDialog
import android.app.Dialog
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.*
import android.widget.Button
import android.widget.DatePicker
import android.widget.EditText
import android.widget.Toast
import com.example.tmr24.databinding.ActivityUserInfoTasksBinding
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import java.text.SimpleDateFormat
import java.util.*


class UserInfoTasks : AppCompatActivity() {
    private lateinit var binding: ActivityUserInfoTasksBinding
    private var UserEmail: String? = null
    private var taskTypeNames: String? = null
    private var tasksDocId: String? = null
    private val db = Firebase.firestore
    private val TAG: String? = null
    var cal = Calendar.getInstance()
    //
    var listColleague_Email_Name: MutableList<String?> = mutableListOf()
    var listColleague_Email: MutableList<String?> = mutableListOf()
    var listOrganization_name_id: MutableList<String?> = mutableListOf()
    var listOrganization_name: MutableList<String?> = mutableListOf()
    var listTasks_name_id: MutableList<String?> = mutableListOf()
    var listTasks_name: MutableList<String?> = mutableListOf()
    var listProject_name_id: MutableList<String?> = mutableListOf()
    var listProject_name: MutableList<String?> = mutableListOf()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityUserInfoTasksBinding.inflate(layoutInflater)
        setContentView(binding.root)

    }

    public override fun onStart() {
        super.onStart()
        val i = intent
        if (i != null) {
            //intentMain
            UserEmail = i.getStringExtra(Constant.USER_NAME_EMAIL)
            taskTypeNames = i.getStringExtra(Constant.TASKS_TYPE_NAMES)
            tasksDocId = i.getStringExtra(Constant.ID_DOC_TASKS)
            //
            val titleDialogTasksQuarantor = binding.titleDialogTasksQuarantor
            val titleDialogTasksExecutor = binding.titleDialogTasksExecutor
            val titleDialogTasksDataStart = binding.titleDialogTasksDataStart
            val titleDialogTasksDataStop = binding.titleDialogTasksDataStop
            val titleDialogTasksStatus = binding.titleDialogTasksStatus
            val titleDialogTasksProject = binding.titleDialogTasksProject
            val titleDialogTasksProjectId = binding.titleDialogTasksProjectId
            val titleDialogTasksTopic = binding.titleDialogTasksTopic
            val titleDialogTasksTopicView = binding.titleDialogTasksTopicView
            val titleDialogTasksTasks = binding.titleDialogTasksTasks
            val titleDialogTasksTasksView = binding.titleDialogTasksTasksView
            val titleDialogTasksTasksOpen = binding.titleDialogTasksTasksOpen
            val titleDialogTasksTasksOpenView = binding.titleDialogTasksTasksOpenView
            val titleDialogTasksDataStopPlan = binding.titleDialogTasksDataStopPlan
            val titleDialogTasksFooting = binding.titleDialogTasksFooting
            val titleDialogTasksFootingId = binding.titleDialogTasksFootingId
            val titleDialogTasksImportance = binding.titleDialogTasksImportance
            val titleDialogTasksAssessment = binding.titleDialogTasksAssessment
            val titleDialogTasksAssessmentComment = binding.titleDialogTasksAssessmentComment
            val titleDialogTasksAssessmentCommentView = binding.titleDialogTasksAssessmentCommentView
            val titleDialogTasksNameOrganization = binding.titleDialogTasksNameOrganization
            val titleDialogTasksIdOrganization = binding.titleDialogTasksIdOrganization
            if (tasksDocId == null) {
                // получить список Организаций доступных данному пользователю
                db.collection("User")
                    .whereEqualTo("UserEmail", UserEmail)
                    .get()
                    .addOnSuccessListener { documents ->
                        for (document in documents) {
                            Log.d(TAG, "${document.id} => ${document.data}")
                            //получаем список Организаций в которых пользователь зарегистрирован для получения списка коллег
                            val doc = document.data
                            val idOrganization = doc["idOrganization"]
                            val nameOrganization = doc["nameOrganization"]
                            val colleague_NameOrganization: String =
                                ("$nameOrganization%$idOrganization")
                            listOrganization_name_id.add(colleague_NameOrganization as String?)
                            listOrganization_name.add(nameOrganization as String?)
                        }
                    }
                    .addOnFailureListener { exception ->
                        Log.w(TAG, "Error getting documents: ", exception)
                    }

                // заполняю поле Поручитель - title_dialog_tasks_guarantor
                titleDialogTasksQuarantor.text = UserEmail

                // заполняю поле Исполнитель - title_dialog_tasks_executor
                titleDialogTasksExecutor.setOnClickListener {
                    Toast.makeText(
                        applicationContext,
                        "Button has been Executor",
                        Toast.LENGTH_SHORT
                    )
                        .show()
                    // убираем эконку о не заполненом поле Статус
                    titleDialogTasksExecutor.setError(null)

                    val nameOrganization = titleDialogTasksNameOrganization.text.toString()
                    val idOrganization = titleDialogTasksIdOrganization.text.toString()
                    if (nameOrganization == "/--/--/--/") {
                        titleDialogTasksNameOrganization.error = "Выберети организацию!"
                    } else {
                        //Функция выбирает список коллег из списка организаций
                        choosingTaskListIdOrganization()
                    }
                }

                // активируем Clik окна выбора Важности - title_dialog_tasks_importance
                titleDialogTasksImportance.setOnClickListener {
                    Toast.makeText(
                        applicationContext,
                        "Button has been Importance",
                        Toast.LENGTH_SHORT
                    )
                        .show()
                    // setup the alert builder
                    val builder_importance = AlertDialog.Builder(this@UserInfoTasks)
                    builder_importance.setTitle(R.string.title_dialog_tasks_text_importance)
                    var checkedItem_importance = 0 // cow
                    val animals_importance = arrayOf("Низкая", "Средняя", "Высокая")
                    val titleDialogTasksImportance_Aktual = titleDialogTasksImportance.text
                    val contains_importance =
                        titleDialogTasksImportance_Aktual in animals_importance
                    //
                    if (contains_importance == true) {
                        checkedItem_importance =
                            animals_importance.indexOf(titleDialogTasksImportance_Aktual)
                        titleDialogTasksImportance.text = animals_importance[checkedItem_importance]
                    } else {
                        titleDialogTasksImportance.text = animals_importance[checkedItem_importance]
                    }
                    // add a radio button list
                    builder_importance.setSingleChoiceItems(
                        animals_importance,
                        checkedItem_importance
                    ) { dialog, which ->
                        // user checked an item
                        titleDialogTasksImportance.text = animals_importance[which]
                    }
                    // add OK and Cancel buttons
                    builder_importance.setPositiveButton("OK") { dialog, which ->
                        // user clicked OK
                        Toast.makeText(applicationContext, "Button OK", Toast.LENGTH_SHORT)
                            .show()
                    }
                    builder_importance.setNegativeButton("Cancel", null)
                    // create and show the alert dialog
                    val dialog = builder_importance.create()
                    dialog.show()
                }

                // активируем Clik окна выбора Основание  - title_dialog_tasks_footing
                titleDialogTasksFooting.setOnClickListener {
                    Toast.makeText(
                        applicationContext,
                        "Button has been Importance",
                        Toast.LENGTH_SHORT
                    )
                        .show()
                    // убираем эконку о не заполненом поле Статус
                    //titleDialogProgectStatus.setError(null)
                    val nameOrganization = titleDialogTasksNameOrganization.text.toString()
                    val idOrganization = titleDialogTasksIdOrganization.text.toString()
                    if (nameOrganization == "/--/--/--/") {
                        titleDialogTasksNameOrganization.error = "Выберети организацию!"
                    } else {
                        // setup the alert builder
                        db.collection("Tasks")
                            .whereEqualTo("idOrganization", idOrganization)
                            .whereEqualTo("statusTasks", "В работе")
                            .get()
                            .addOnSuccessListener { documents ->
                                for (document in documents) {
                                    Log.d(TAG, "${document.id} => ${document.data}")
                                    val doc = document.data
                                    val nameTasks = doc["nameTasks"]
                                    val idTasks = document.id
                                    val colleague_project: String = ("$nameTasks%$idTasks")
                                    listTasks_name_id.add(colleague_project as String?)
                                    listTasks_name.add(nameTasks as String?)
                                }
                                val listTasks_name_id_size = listTasks_name_id.size
                                if (listTasks_name_id_size == 0) {
                                    Toast.makeText(
                                        applicationContext,
                                        "Нет доступных задач!",
                                        Toast.LENGTH_SHORT
                                    )
                                        .show()
                                } else {
                                    fillTasksField()
                                }

                            }
                            .addOnFailureListener { exception ->
                                Log.w(TAG, "Error getting documents: ", exception)
                            }
                    }
                }

                // активируем Clik окна выбора Организация title_dialog_tasks_nameOrganization и title_dialog_tasks_idOrganization
                titleDialogTasksNameOrganization.setOnClickListener {
                    Toast.makeText(
                        applicationContext,
                        "Button has been Importance",
                        Toast.LENGTH_SHORT
                    )
                        .show()
                    // убираем эконку о не заполненом поле Название Организации
                    titleDialogTasksNameOrganization.setError(null)
                    //
                    val projectTasks = titleDialogTasksProject.text.toString()
                    val footingTasks = titleDialogTasksFooting.text.toString()
                    val executorTasks = titleDialogTasksExecutor.text.toString()
                    if (projectTasks != "/--/--/--/") {
                        titleDialogTasksProject.text = "/--/--/--/"
                        //titleDialogTasksProject.text = "/--/--/--/"
                    } else if (footingTasks != "/--/--/--/") {
                        titleDialogTasksFooting.text = "/--/--/--/"
                        titleDialogTasksFootingId.text = "/--/--/--/"
                    } else if (executorTasks != "/--/--/--/") {
                        titleDialogTasksExecutor.text = "/--/--/--/"
                    }
                    choosingTasksListNameIdOrganization()
                }

                // активируем Clik окна выбора Проект - title_dialog_tasks_project
                titleDialogTasksProject.setOnClickListener {
                    Toast.makeText(
                        applicationContext,
                        "Button has been Importance",
                        Toast.LENGTH_SHORT
                    )
                        .show()
                    val nameOrganization = titleDialogTasksNameOrganization.text.toString()
                    val idOrganization = titleDialogTasksIdOrganization.text.toString()
                    if (nameOrganization == "/--/--/--/") {
                        titleDialogTasksNameOrganization.error = "Выберети статус!"
                    } else {
                        // setup the alert builder
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
                                val listProject_name_id_size = listProject_name_id.size
                                if (listProject_name_id_size == 0) {
                                    Toast.makeText(
                                        applicationContext,
                                        "Нет доступных поектов!",
                                        Toast.LENGTH_SHORT
                                    )
                                        .show()
                                } else {
                                    fillProjectField()
                                }
                            }
                            .addOnFailureListener { exception ->
                                Log.w(TAG, "Error getting documents: ", exception)
                            }
                    }
                }

                // активируем Clik окна выбора Планируемой даты завершения - title_dialog_tasks_data_stop_plan
                // создаем обьект с текущей датой
                val dateSetListener = object : DatePickerDialog.OnDateSetListener {
                    override fun onDateSet(
                        view: DatePicker, year: Int, monthOfYear: Int,
                        dayOfMonth: Int
                    ) {
                        cal.set(Calendar.YEAR, year)
                        cal.set(Calendar.MONTH, monthOfYear)
                        cal.set(Calendar.DAY_OF_MONTH, dayOfMonth)
                        updateDateInView()
                    }
                }

                // создаем всплывающее окно для выбора даты
                titleDialogTasksDataStopPlan.setOnClickListener(object : View.OnClickListener {
                    override fun onClick(view: View) {
                        Toast.makeText(
                            applicationContext,
                            "Button has been clicked",
                            Toast.LENGTH_SHORT
                        )
                            .show()
                        DatePickerDialog(
                            this@UserInfoTasks,
                            dateSetListener,
                            // set DatePickerDialog to point to today's date when it loads up
                            cal.get(Calendar.YEAR),
                            cal.get(Calendar.MONTH),
                            cal.get(Calendar.DAY_OF_MONTH)
                        ).show()
                    }
                })

                // активируем текстовое поле Статус - title_dialog_tasks_status
                titleDialogTasksStatus.setOnClickListener {
                    Toast.makeText(applicationContext, "Button has been Status", Toast.LENGTH_SHORT)
                        .show()
                    // убираем эконку о не заполненом поле Название Организации
                    titleDialogTasksStatus.setError(null)
                    // setup the alert builder
                    val builder_status = AlertDialog.Builder(this@UserInfoTasks)
                    builder_status.setTitle(R.string.title_dialog_tasks_text_status)
                    var checkedItem_status = 0 // cow
                    val animals_status =
                        arrayOf("В работе", "Отменено", "Выполнено", "Проектируется", "Оценить")
                    val titleDialogTasksStatus_Aktual = titleDialogTasksStatus.text
                    val contains_status = titleDialogTasksStatus_Aktual in animals_status
                    //
                    if (contains_status == true) {
                        checkedItem_status = animals_status.indexOf(titleDialogTasksStatus_Aktual)
                        titleDialogTasksStatus.text = animals_status[checkedItem_status]
                    } else {
                        titleDialogTasksStatus.text = animals_status[checkedItem_status]
                    }
                    // add a radio button list
                    builder_status.setSingleChoiceItems(
                        animals_status,
                        checkedItem_status
                    ) { dialog, which ->
                        // user checked an item
                        titleDialogTasksStatus.text = animals_status[which]
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

                // активируем текстовое поле Оценка - title_dialog_tasks_assessment
                titleDialogTasksAssessment.setOnClickListener {
                    Toast.makeText(
                        applicationContext,
                        "Button has been Assessment",
                        Toast.LENGTH_SHORT
                    )
                        .show()
                    // setup the alert builder
                    val builder_assessment = AlertDialog.Builder(this@UserInfoTasks)
                    builder_assessment.setTitle(R.string.title_dialog_tasks_text_assessment)
                    var checkedItem_assessment = 0 // cow
                    val animals_assessment = arrayOf("1", "2", "3", "4", "5")
                    val titleDialogTasksAssessment_Aktual = titleDialogTasksAssessment.text
                    val contains_status = titleDialogTasksAssessment_Aktual in animals_assessment
                    //
                    if (contains_status == true) {
                        checkedItem_assessment =
                            animals_assessment.indexOf(titleDialogTasksAssessment_Aktual)
                        titleDialogTasksAssessment.text = animals_assessment[checkedItem_assessment]
                    } else {
                        titleDialogTasksAssessment.text = animals_assessment[checkedItem_assessment]
                    }
                    // add a radio button list
                    builder_assessment.setSingleChoiceItems(
                        animals_assessment,
                        checkedItem_assessment
                    ) { dialog, which ->
                        // user checked an item
                        titleDialogTasksAssessment.text = animals_assessment[which]
                    }
                    // add OK and Cancel buttons
                    builder_assessment.setPositiveButton("OK") { dialog, which ->
                        // user clicked OK
                        Toast.makeText(applicationContext, "Button OK", Toast.LENGTH_SHORT)
                            .show()
                    }
                    builder_assessment.setNegativeButton("Cancel", null)
                    // create and show the alert dialog
                    val dialog = builder_assessment.create()
                    dialog.show()
                }

                // активируем кнопку Старт добавление задачи
                val buttonDialogTasksStart = binding.buttonDialogTasksStart
                buttonDialogTasksStart.setOnClickListener {
                    Toast.makeText(
                        applicationContext,
                        "Button has been clicked",
                        Toast.LENGTH_SHORT
                    )
                        .show()
                    //// получаем данные с формы UserInfoProject
                    val executorTasks = titleDialogTasksExecutor.text.toString()
                    val quarantorTasks = titleDialogTasksQuarantor.text.toString()
                    //val dataTasks_start = titleDialogTasksDataStart.text.toString()
                    val dataTasks_stop = titleDialogTasksDataStop.text.toString()
                    val statusTasks = titleDialogTasksStatus.text.toString()
                    val projectTasks = titleDialogTasksProject.text.toString()
                    val projectTasksId = titleDialogTasksProjectId.text.toString()
                    val nameTasks = titleDialogTasksTopic.text.toString()
                    val commentTasks = titleDialogTasksTasks.text.toString()
                    val rezultTasks = titleDialogTasksTasksOpen.text.toString()
                    val dataTasks_stop_plan = titleDialogTasksDataStopPlan.text.toString()
                    val footingTasks = titleDialogTasksFooting.text.toString()
                    val footingTasksId = titleDialogTasksFootingId.text.toString()
                    val idOrganization = titleDialogTasksIdOrganization.text.toString()
                    val nameOrganization = titleDialogTasksNameOrganization.text.toString()
                    val importanceTasks = titleDialogTasksImportance.text.toString()
                    val assessmentTasks = titleDialogTasksAssessment.text.toString()
                    val assessmentTasks_comment = titleDialogTasksAssessmentComment.text.toString()
                    //// проверяем заполненость полей
                    if (statusTasks == "/--/--/--/") {
                        titleDialogTasksStatus.error = "Выберети статус!"
                    } else if (nameOrganization == "/--/--/--/") {
                        titleDialogTasksNameOrganization.error = "Выберети организацию!"
                    } else if (nameTasks == "") {
                        titleDialogTasksTopic.error = "Заполните поле!"
                    } else if (commentTasks == "") {
                        titleDialogTasksTasks.error = "Заполните поле!"
                    } else if (dataTasks_stop_plan == "/--/--/----/") {
                        // Add a new document with a generated id.
                        val data = hashMapOf(
                            "executorTasks" to executorTasks,
                            "quarantorTasks" to quarantorTasks,
                            "dataTasks_start" to FieldValue.serverTimestamp(),
                            "dataTasks_stop" to dataTasks_stop,
                            "statusTasks" to statusTasks,
                            "projectTasks" to projectTasks,
                            "projectTasksId" to projectTasksId,
                            "nameTasks" to nameTasks,
                            "commentTasks" to commentTasks,
                            "rezultTasks" to rezultTasks,
                            "dataTasks_stop_plan" to dataTasks_stop_plan,
                            "footingTasks" to footingTasks,
                            "footingTasksId" to footingTasksId,
                            "idOrganization" to idOrganization,
                            "nameOrganization" to nameOrganization,
                            "importanceTasks" to importanceTasks,
                            "assessmentTasks" to assessmentTasks,
                            "assessmentTasks_comment" to assessmentTasks_comment,
                        )
                        db.collection("Tasks")
                            .add(data)
                            .addOnSuccessListener { documentReference ->
                                Log.d(
                                    TAG,
                                    "DocumentSnapshot written with ID: ${documentReference.id}"
                                )
                                val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                                b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                                b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                                startActivity(b)
                            }
                            .addOnFailureListener { e ->
                                Log.w(TAG, "Error adding document", e)
                            }
                    } else {
                        val dataProject_stop_plan_1 = cal.getTime()
                        // Add a new document with a generated id.
                        val data = hashMapOf(
                            "executorTasks" to executorTasks,
                            "quarantorTasks" to quarantorTasks,
                            "dataTasks_start" to FieldValue.serverTimestamp(),
                            "dataTasks_stop" to dataTasks_stop,
                            "statusTasks" to statusTasks,
                            "projectTasks" to projectTasks,
                            "projectTasksId" to projectTasksId,
                            "nameTasks" to nameTasks,
                            "commentTasks" to commentTasks,
                            "rezultTasks" to rezultTasks,
                            "dataTasks_stop_plan" to dataProject_stop_plan_1,
                            "footingTasks" to footingTasks,
                            "footingTasksId" to footingTasksId,
                            "idOrganization" to idOrganization,
                            "nameOrganization" to nameOrganization,
                            "importanceTasks" to importanceTasks,
                            "assessmentTasks" to assessmentTasks,
                            "assessmentTasks_comment" to assessmentTasks_comment,
                        )
                        db.collection("Tasks")
                            .add(data)
                            .addOnSuccessListener { documentReference ->
                                Log.d(
                                    TAG,
                                    "DocumentSnapshot written with ID: ${documentReference.id}"
                                )
                                val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                                b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                                b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                                startActivity(b)
                            }
                            .addOnFailureListener { e ->
                                Log.w(TAG, "Error adding document", e)
                            }
                    }
                }
            } else {
                //скрываем кнопку Старт buttonDialogTasksStart
                val buttonDialogTasksStart = binding.buttonDialogTasksStart
                buttonDialogTasksStart.visibility = View.GONE
                //получаем документ с tasksDocId
                val docRef = db.collection("Tasks").document(tasksDocId!!)
                docRef.get()
                    .addOnSuccessListener { document ->
                        if (document != null) {
                            Log.d(TAG, "DocumentSnapshot data: ${document.data}")
                            val doc = document.data
                            val nameTasks = doc!!["nameTasks"] as String
                            val commentTasks = doc["commentTasks"] as String
                            val footingTasks = doc["footingTasks"] as String
                            val footingTasksId = doc["footingTasksId"] as String
                            val idOrganization = doc["idOrganization"] as String
                            val nameOrganization = doc["nameOrganization"] as String
                            val statusTasks = doc["statusTasks"] as String
                            val dataTasks_start = doc["dataTasks_start"]
                            val dataTasks_stop = doc["dataTasks_stop"]
                            val dataTasks_stop_plan = doc["dataTasks_stop_plan"]
                            val assessmentTasks = doc["assessmentTasks"] as String
                            val assessmentTasks_comment = doc["assessmentTasks_comment"] as String
                            val executorTasks = doc["executorTasks"] as String
                            val quarantorTasks = doc["quarantorTasks"] as String
                            val projectTasks = doc["projectTasks"] as String
                            val projectTasksId = doc["projectTasksId"] as String
                            val rezultTasks = doc["rezultTasks"] as String
                            val importanceTasks = doc["importanceTasks"] as String

                            // получаем данные с формы UserInfoProject
                            //titleDialogTasksTopic.setText(nameTasks)
                            titleDialogTasksTasks.setText(commentTasks)
                            titleDialogTasksFooting.text = footingTasks
                            titleDialogTasksFootingId.text = footingTasksId
                            titleDialogTasksIdOrganization.text = idOrganization
                            titleDialogTasksNameOrganization.text = nameOrganization
                            titleDialogTasksStatus.text = statusTasks
                            //titleDialogTasksDataStart.text = dataTasks_start
                            //titleDialogTasksDataStop.text = dataTasks_stop
                            //titleDialogTasksDataStopPlan.text = dataTasks_stop_plan
                            titleDialogTasksAssessment.setText(assessmentTasks)
                            titleDialogTasksAssessmentComment.setText(assessmentTasks_comment)
                            titleDialogTasksExecutor.text = executorTasks
                            titleDialogTasksQuarantor.text = quarantorTasks
                            titleDialogTasksProject.text = projectTasks
                            titleDialogTasksProjectId.text = projectTasksId
                            titleDialogTasksTasksOpen.setText(rezultTasks)
                            titleDialogTasksImportance.text = importanceTasks

                            //скрываем окно ввода, открываем и заполняем View
                            //val buttonDialogTasksEdit = binding.buttonDialogTasksEdit
                            titleDialogTasksTopic.visibility = View.GONE
                            titleDialogTasksTopicView.visibility = View.VISIBLE
                            titleDialogTasksTopicView.text = nameTasks
                            //if(originatorProject == UserEmail && dataProject_stop == "--/--/----"){
                            //    val buttonEditProject = binding.buttonEditProject
                            //    buttonEditProject.visibility = View.VISIBLE
                            //}
                            if (dataTasks_start == "/--/--/----/"){
                                val dataProject_start_String = dataTasks_start as String
                                titleDialogTasksDataStart.text = dataProject_start_String
                            } else {
                                val dataProject_start_Firebase = dataTasks_start as com.google.firebase.Timestamp
                                val dataProject_start_Date = dataProject_start_Firebase.toDate()
                                val sdf = SimpleDateFormat("dd/MM/yyyy")
                                val dataProject_start_Text = sdf.format(dataProject_start_Date)
                                titleDialogTasksDataStart.text = dataProject_start_Text
                            }
                            if (dataTasks_stop == "/--/--/----/"){
                                val dataProject_stop_String = dataTasks_stop as String
                                titleDialogTasksDataStop.text = dataProject_stop_String
                            } else {
                                val dataProject_stop_Firebase = dataTasks_stop as com.google.firebase.Timestamp
                                val dataProject_stop_Date = dataProject_stop_Firebase.toDate()
                                val sdf = SimpleDateFormat("dd/MM/yyyy")
                                val dataProject_stop_Text = sdf.format(dataProject_stop_Date)
                                titleDialogTasksDataStop.text = dataProject_stop_Text
                            }
                            if (dataTasks_stop_plan == "/--/--/----/"){
                                val dataProject_stop_plan_String = dataTasks_stop_plan as String
                                titleDialogTasksDataStopPlan.text = dataProject_stop_plan_String
                            } else {
                                val dataProject_stop_plan_Firebase = dataTasks_stop_plan as com.google.firebase.Timestamp
                                val dataProject_stop_plan_Date = dataProject_stop_plan_Firebase.toDate()
                                val sdf = SimpleDateFormat("dd/MM/yyyy")
                                val dataProject_stop_plan_Text = sdf.format(dataProject_stop_plan_Date)
                                titleDialogTasksDataStopPlan.text = dataProject_stop_plan_Text
                            }
                            //определяем какую кнопку активировать
                            if (statusTasks == "В работе" || statusTasks == "Проектируется" ){
                                // активируем Clik окна выбора Важности - title_dialog_tasks_importance
                                titleDialogTasksImportance.setOnClickListener {
                                    Toast.makeText(
                                        applicationContext,
                                        "Button has been Importance",
                                        Toast.LENGTH_SHORT
                                    )
                                        .show()
                                    // setup the alert builder
                                    val builder_importance = AlertDialog.Builder(this@UserInfoTasks)
                                    builder_importance.setTitle(R.string.title_dialog_tasks_text_importance)
                                    var checkedItem_importance = 0 // cow
                                    val animals_importance = arrayOf("Низкая", "Средняя", "Высокая")
                                    val titleDialogTasksImportance_Aktual = titleDialogTasksImportance.text
                                    val contains_importance =
                                        titleDialogTasksImportance_Aktual in animals_importance
                                    //
                                    if (contains_importance == true) {
                                        checkedItem_importance =
                                            animals_importance.indexOf(titleDialogTasksImportance_Aktual)
                                        titleDialogTasksImportance.text = animals_importance[checkedItem_importance]
                                    } else {
                                        titleDialogTasksImportance.text = animals_importance[checkedItem_importance]
                                    }
                                    // add a radio button list
                                    builder_importance.setSingleChoiceItems(
                                        animals_importance,
                                        checkedItem_importance
                                    ) { dialog, which ->
                                        // user checked an item
                                        titleDialogTasksImportance.text = animals_importance[which]
                                    }
                                    // add OK and Cancel buttons
                                    builder_importance.setPositiveButton("OK") { dialog, which ->
                                        // user clicked OK
                                        Toast.makeText(applicationContext, "Button OK", Toast.LENGTH_SHORT)
                                            .show()
                                    }
                                    builder_importance.setNegativeButton("Cancel", null)
                                    // create and show the alert dialog
                                    val dialog = builder_importance.create()
                                    dialog.show()
                                }
                                // активируем текстовое поле Оценка - title_dialog_tasks_assessment
                                titleDialogTasksAssessment.setOnClickListener {
                                    Toast.makeText(
                                        applicationContext,
                                        "Button has been Assessment",
                                        Toast.LENGTH_SHORT
                                    )
                                        .show()
                                    // setup the alert builder
                                    val builder_assessment = AlertDialog.Builder(this@UserInfoTasks)
                                    builder_assessment.setTitle(R.string.title_dialog_tasks_text_assessment)
                                    var checkedItem_assessment = 0 // cow
                                    val animals_assessment = arrayOf("1", "2", "3", "4", "5")
                                    val titleDialogTasksAssessment_Aktual = titleDialogTasksAssessment.text
                                    val contains_status = titleDialogTasksAssessment_Aktual in animals_assessment
                                    //
                                    if (contains_status == true) {
                                        checkedItem_assessment =
                                            animals_assessment.indexOf(titleDialogTasksAssessment_Aktual)
                                        titleDialogTasksAssessment.text = animals_assessment[checkedItem_assessment]
                                    } else {
                                        titleDialogTasksAssessment.text = animals_assessment[checkedItem_assessment]
                                    }
                                    // add a radio button list
                                    builder_assessment.setSingleChoiceItems(
                                        animals_assessment,
                                        checkedItem_assessment
                                    ) { dialog, which ->
                                        // user checked an item
                                        titleDialogTasksAssessment.text = animals_assessment[which]
                                    }
                                    // add OK and Cancel buttons
                                    builder_assessment.setPositiveButton("OK") { dialog, which ->
                                        // user clicked OK
                                        Toast.makeText(applicationContext, "Button OK", Toast.LENGTH_SHORT)
                                            .show()
                                    }
                                    builder_assessment.setNegativeButton("Cancel", null)
                                    // create and show the alert dialog
                                    val dialog = builder_assessment.create()
                                    dialog.show()
                                }
                                //проверяем кто автор сообщения
                                if (quarantorTasks == UserEmail){
                                    // активируем текстовое поле Статус - title_dialog_tasks_status
                                    titleDialogTasksStatus.setOnClickListener {
                                        Toast.makeText(applicationContext, "Button has been Status", Toast.LENGTH_SHORT)
                                            .show()
                                        // убираем эконку о не заполненом поле Название Организации
                                        titleDialogTasksStatus.setError(null)
                                        // setup the alert builder
                                        val builder_status = AlertDialog.Builder(this@UserInfoTasks)
                                        builder_status.setTitle(R.string.title_dialog_tasks_text_status)
                                        var checkedItem_status = 0 // cow
                                        val animals_status =
                                            arrayOf("В работе", "Отменено", "Проектируется", "Оценить")
                                        val titleDialogTasksStatus_Aktual = titleDialogTasksStatus.text
                                        val contains_status = titleDialogTasksStatus_Aktual in animals_status
                                        //
                                        if (contains_status == true) {
                                            checkedItem_status = animals_status.indexOf(titleDialogTasksStatus_Aktual)
                                            titleDialogTasksStatus.text = animals_status[checkedItem_status]
                                        } else {
                                            titleDialogTasksStatus.text = animals_status[checkedItem_status]
                                        }
                                        // add a radio button list
                                        builder_status.setSingleChoiceItems(
                                            animals_status,
                                            checkedItem_status
                                        ) { dialog, which ->
                                            // user checked an item
                                            titleDialogTasksStatus.text = animals_status[which]
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
                                    //открываем кнопку Редактировать
                                    val buttonDialogTasksEdit = binding.buttonDialogTasksEdit
                                    buttonDialogTasksEdit.visibility = View.VISIBLE
                                } else if (executorTasks == UserEmail) {
                                    // активируем текстовое поле Статус - title_dialog_tasks_status
                                    titleDialogTasksStatus.setOnClickListener {
                                        Toast.makeText(applicationContext, "Button has been Status", Toast.LENGTH_SHORT)
                                            .show()
                                        // убираем эконку о не заполненом поле Название Организации
                                        titleDialogTasksStatus.setError(null)
                                        // setup the alert builder
                                        val builder_status = AlertDialog.Builder(this@UserInfoTasks)
                                        builder_status.setTitle(R.string.title_dialog_tasks_text_status)
                                        var checkedItem_status = 0 // cow
                                        val animals_status = arrayOf("В работе", "Оценить")
                                        val titleDialogTasksStatus_Aktual = titleDialogTasksStatus.text
                                        val contains_status = titleDialogTasksStatus_Aktual in animals_status
                                        //
                                        if (contains_status == true) {
                                            checkedItem_status = animals_status.indexOf(titleDialogTasksStatus_Aktual)
                                            titleDialogTasksStatus.text = animals_status[checkedItem_status]
                                        } else {
                                            titleDialogTasksStatus.text = animals_status[checkedItem_status]
                                        }
                                        // add a radio button list
                                        builder_status.setSingleChoiceItems(
                                            animals_status,
                                            checkedItem_status
                                        ) { dialog, which ->
                                            // user checked an item
                                            titleDialogTasksStatus.text = animals_status[which]
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
                                    //закрываем окно Tema задачи от редактирования
                                    titleDialogTasksTasks.visibility = View.GONE
                                    titleDialogTasksTasksView.visibility = View.VISIBLE
                                    titleDialogTasksTasksView.text = commentTasks
                                    val buttonDialogTasksDone = binding.buttonDialogTasksDone
                                    buttonDialogTasksDone.visibility = View.VISIBLE
                                }
                            } else if (statusTasks == "Оценить"){
                                // активируем текстовое поле Статус - title_dialog_tasks_status
                                titleDialogTasksStatus.setOnClickListener {
                                    Toast.makeText(applicationContext, "Button has been Status", Toast.LENGTH_SHORT)
                                        .show()
                                    // убираем эконку о не заполненом поле Название Организации
                                    titleDialogTasksStatus.setError(null)
                                    // setup the alert builder
                                    val builder_status = AlertDialog.Builder(this@UserInfoTasks)
                                    builder_status.setTitle(R.string.title_dialog_tasks_text_status)
                                    var checkedItem_status = 0 // cow
                                    val animals_status =
                                        arrayOf("Отменено", "Выполнено")
                                    val titleDialogTasksStatus_Aktual = titleDialogTasksStatus.text
                                    val contains_status = titleDialogTasksStatus_Aktual in animals_status
                                    //
                                    if (contains_status == true) {
                                        checkedItem_status = animals_status.indexOf(titleDialogTasksStatus_Aktual)
                                        titleDialogTasksStatus.text = animals_status[checkedItem_status]
                                    } else {
                                        titleDialogTasksStatus.text = animals_status[checkedItem_status]
                                    }
                                    // add a radio button list
                                    builder_status.setSingleChoiceItems(
                                        animals_status,
                                        checkedItem_status
                                    ) { dialog, which ->
                                        // user checked an item
                                        titleDialogTasksStatus.text = animals_status[which]
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
                                // активируем текстовое поле Оценка - title_dialog_tasks_assessment
                                titleDialogTasksAssessment.setOnClickListener {
                                    Toast.makeText(
                                        applicationContext,
                                        "Button has been Assessment",
                                        Toast.LENGTH_SHORT
                                    )
                                        .show()
                                    // setup the alert builder
                                    val builder_assessment = AlertDialog.Builder(this@UserInfoTasks)
                                    builder_assessment.setTitle(R.string.title_dialog_tasks_text_assessment)
                                    var checkedItem_assessment = 0 // cow
                                    val animals_assessment = arrayOf("1", "2", "3", "4", "5")
                                    val titleDialogTasksAssessment_Aktual = titleDialogTasksAssessment.text
                                    val contains_status = titleDialogTasksAssessment_Aktual in animals_assessment
                                    //
                                    if (contains_status == true) {
                                        checkedItem_assessment =
                                            animals_assessment.indexOf(titleDialogTasksAssessment_Aktual)
                                        titleDialogTasksAssessment.text = animals_assessment[checkedItem_assessment]
                                    } else {
                                        titleDialogTasksAssessment.text = animals_assessment[checkedItem_assessment]
                                    }
                                    // add a radio button list
                                    builder_assessment.setSingleChoiceItems(
                                        animals_assessment,
                                        checkedItem_assessment
                                    ) { dialog, which ->
                                        // user checked an item
                                        titleDialogTasksAssessment.text = animals_assessment[which]
                                    }
                                    // add OK and Cancel buttons
                                    builder_assessment.setPositiveButton("OK") { dialog, which ->
                                        // user clicked OK
                                        Toast.makeText(applicationContext, "Button OK", Toast.LENGTH_SHORT)
                                            .show()
                                    }
                                    builder_assessment.setNegativeButton("Cancel", null)
                                    // create and show the alert dialog
                                    val dialog = builder_assessment.create()
                                    dialog.show()
                                }
                                //закрываем окно Результат задачи от редактирования
                                titleDialogTasksTasksOpen.visibility = View.GONE
                                titleDialogTasksTasksOpenView.visibility = View.VISIBLE
                                titleDialogTasksTasksOpenView.text = rezultTasks
                                //открываем кнопку Оценить
                                val buttonEditProject = binding.buttonDialogTasksAssessment
                                buttonEditProject.visibility = View.VISIBLE
                            } else if (statusTasks == "Отменено" || statusTasks == "Выполнено") {
                                //закрываем окно для редактирования assessmentTasks_comment
                                titleDialogTasksAssessmentComment.visibility = View.GONE
                                titleDialogTasksAssessmentCommentView.visibility = View.VISIBLE
                                titleDialogTasksAssessmentCommentView.text = assessmentTasks_comment
                            }
                        } else {
                            Log.d(TAG, "No such document")
                        }
                    }
                    .addOnFailureListener { exception ->
                        Log.d(TAG, "get failed with ", exception)
                    }
            }

            // активируем кнопку Редактировать задачу
            val buttonDialogTasksEdit = binding.buttonDialogTasksEdit
            buttonDialogTasksEdit.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                //// получаем данные с формы UserInfoTasks
                val executorTasks = titleDialogTasksExecutor.text.toString()
                val quarantorTasks = titleDialogTasksQuarantor.text.toString()
                val statusTasks_edit = titleDialogTasksStatus.text.toString()
                val commentTasks_edit = titleDialogTasksTasks.text.toString()
                val rezultTasks_edit = titleDialogTasksTasksOpen.text.toString()
                val importanceTasks_edit = titleDialogTasksImportance.text.toString()
                val assessmentTasks_edit = titleDialogTasksAssessment.text.toString()
                val assessmentTasks_comment_edit = titleDialogTasksAssessmentComment.text.toString()
                val dataTasks_stop_edit = titleDialogTasksDataStop.text.toString()
                //
                if(statusTasks_edit == "В работе" || statusTasks_edit == "Проектируется"){
                    // Обновляем Задачу
                    val washingtonRef = db.collection("Tasks").document(tasksDocId!!)
                    // Set the "isCapital" field of the city 'DC'
                    washingtonRef
                        .update("commentTasks",commentTasks_edit,
                            "statusTasks", statusTasks_edit,
                            "importanceTasks", importanceTasks_edit,
                            "assessmentTasks", assessmentTasks_edit,
                            "assessmentTasks_comment", assessmentTasks_comment_edit,
                            "rezultTasks", rezultTasks_edit,
                        )
                        .addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully updated!") }
                        .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
                    val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                    b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                    b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                    startActivity(b)
                } else if (statusTasks_edit == "Оценить") {
                    if(quarantorTasks == executorTasks) {
                        if (dataTasks_stop_edit == "/--/--/----/"){
                            // Обновляем Задачу
                            val washingtonRef = db.collection("Tasks").document(tasksDocId!!)
                            // Set the "isCapital" field of the city 'DC'
                            washingtonRef
                                .update("statusTasks", statusTasks_edit,
                                    "importanceTasks", importanceTasks_edit,
                                    "dataTasks_stop", FieldValue.serverTimestamp(),
                                    "rezultTasks", rezultTasks_edit,
                                )
                                .addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully updated!") }
                                .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
                            val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                            b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                            b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                            startActivity(b)
                        } else {
                            val washingtonRef = db.collection("Tasks").document(tasksDocId!!)
                            // Set the "isCapital" field of the city 'DC'
                            washingtonRef
                                .update("statusTasks", statusTasks_edit,
                                    "importanceTasks", importanceTasks_edit,
                                    "rezultTasks", rezultTasks_edit,
                                )
                                .addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully updated!") }
                                .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
                            val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                            b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                            b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                            startActivity(b)
                        }
                    }
                    Toast.makeText(applicationContext, "Измените статус!", Toast.LENGTH_SHORT)
                        .show()
                    titleDialogTasksStatus.error = "Измените статус!"
                } else if (statusTasks_edit == "Отменено" || statusTasks_edit == "Выполнено") {
                    if (dataTasks_stop_edit == "/--/--/----/"){
                        // Обновляем Задачу
                        val washingtonRef = db.collection("Tasks").document(tasksDocId!!)
                        // Set the "isCapital" field of the city 'DC'
                        washingtonRef
                            .update("commentTasks",commentTasks_edit,
                                "statusTasks", statusTasks_edit,
                                "importanceTasks", importanceTasks_edit,
                                "dataTasks_stop", FieldValue.serverTimestamp(),
                                "assessmentTasks", assessmentTasks_edit,
                                "assessmentTasks_comment", assessmentTasks_comment_edit,
                                "rezultTasks", rezultTasks_edit,
                            )
                            .addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully updated!") }
                            .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
                        val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                        b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                        b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                        startActivity(b)
                    } else {
                        val washingtonRef = db.collection("Tasks").document(tasksDocId!!)
                        // Set the "isCapital" field of the city 'DC'
                        washingtonRef
                            .update("commentTasks",commentTasks_edit,
                                "statusTasks", statusTasks_edit,
                                "importanceTasks", importanceTasks_edit,
                                "assessmentTasks", assessmentTasks_edit,
                                "assessmentTasks_comment", assessmentTasks_comment_edit,
                                "rezultTasks", rezultTasks_edit,
                            )
                            .addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully updated!") }
                            .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
                        val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                        b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                        b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                        startActivity(b)
                    }
                }
            }

            // активируем кнопку Выполнено задача
            val buttonDialogTasksDone = binding.buttonDialogTasksDone
            buttonDialogTasksDone.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                //// получаем данные с формы UserInfoTasks
                val statusTasks_done = titleDialogTasksStatus.text.toString()
                val rezultTasks_edit = titleDialogTasksTasksOpen.text.toString()
                val importanceTasks_edit = titleDialogTasksImportance.text.toString()
                val dataTasks_stop_edit = titleDialogTasksDataStop.text.toString()
                //
                if(statusTasks_done == "В работе"){
                    // Обновляем Задачу
                    val washingtonRef = db.collection("Tasks").document(tasksDocId!!)
                    // Set the "isCapital" field of the city 'DC'
                    washingtonRef
                        .update("statusTasks", statusTasks_done,
                            "importanceTasks", importanceTasks_edit,
                            "rezultTasks", rezultTasks_edit,
                        )
                        .addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully updated!") }
                        .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
                    val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                    b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                    b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                    startActivity(b)
                } else if (statusTasks_done == "Оценить") {
                    if (dataTasks_stop_edit == "/--/--/----/"){
                        // Обновляем Задачу
                        val washingtonRef = db.collection("Tasks").document(tasksDocId!!)
                        // Set the "isCapital" field of the city 'DC'
                        washingtonRef
                            .update("statusTasks", statusTasks_done,
                                "importanceTasks", importanceTasks_edit,
                                "dataTasks_stop", FieldValue.serverTimestamp(),
                                "rezultTasks", rezultTasks_edit,
                            )
                            .addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully updated!") }
                            .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
                        val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                        b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                        b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                        startActivity(b)
                    } else {
                        val washingtonRef = db.collection("Tasks").document(tasksDocId!!)
                        // Set the "isCapital" field of the city 'DC'
                        washingtonRef
                            .update("statusTasks", statusTasks_done,
                                "importanceTasks", importanceTasks_edit,
                                "rezultTasks", rezultTasks_edit,
                            )
                            .addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully updated!") }
                            .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
                        val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                        b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                        b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                        startActivity(b)
                    }
                } else if (statusTasks_done == "Отменено" || statusTasks_done == "Выполнено" || statusTasks_done == "Проектируется") {
                    Toast.makeText(applicationContext, "Измените статус!", Toast.LENGTH_SHORT)
                        .show()
                    titleDialogTasksStatus.error = "Измените статус!"
                }
            }

            // активируем кнопку Оценить задача
            val buttonDialogTasksAssessment = binding.buttonDialogTasksAssessment
            buttonDialogTasksAssessment.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                //// получаем данные с формы UserInfoTasks
                val statusTasks_assessment = titleDialogTasksStatus.text.toString()
                val importanceTasks_assessment = titleDialogTasksImportance.text.toString()
                val assessmentTasks_assessment = titleDialogTasksAssessment.text.toString()
                val assessmentTasks_comment_assessment = titleDialogTasksAssessmentComment.text.toString()
                val dataTasks_stop_assessment = titleDialogTasksDataStop.text.toString()
                //
                if(statusTasks_assessment == "В работе" || statusTasks_assessment == "Проектируется"){
                    Toast.makeText(applicationContext, "Измените статус!", Toast.LENGTH_SHORT)
                        .show()
                    titleDialogTasksStatus.error = "Измените статус!"
                } else if (statusTasks_assessment == "Оценить") {
                    Toast.makeText(applicationContext, "Измените статус!", Toast.LENGTH_SHORT)
                        .show()
                    titleDialogTasksStatus.error = "Измените статус!"
                } else if (statusTasks_assessment == "Отменено" || statusTasks_assessment == "Выполнено") {
                    if (dataTasks_stop_assessment == "/--/--/----/"){
                        // Обновляем Задачу
                        val washingtonRef = db.collection("Tasks").document(tasksDocId!!)
                        // Set the "isCapital" field of the city 'DC'
                        washingtonRef
                            .update("statusTasks", statusTasks_assessment,
                                "importanceTasks", importanceTasks_assessment,
                                "dataTasks_stop", FieldValue.serverTimestamp(),
                                "assessmentTasks", assessmentTasks_assessment,
                                "assessmentTasks_comment", assessmentTasks_comment_assessment,
                            )
                            .addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully updated!") }
                            .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
                        val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                        b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                        b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                        startActivity(b)
                    } else {
                        val washingtonRef = db.collection("Tasks").document(tasksDocId!!)
                        // Set the "isCapital" field of the city 'DC'
                        washingtonRef
                            .update("statusTasks", statusTasks_assessment,
                                "importanceTasks", importanceTasks_assessment,
                                "assessmentTasks", assessmentTasks_assessment,
                                "assessmentTasks_comment", assessmentTasks_comment_assessment,
                            )
                            .addOnSuccessListener { Log.d(TAG, "DocumentSnapshot successfully updated!") }
                            .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
                        val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                        b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                        b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                        startActivity(b)
                    }
                }
            }

            // активируем кнопку Выход добавление задачи
            val buttonDialogTasksExit = binding.buttonDialogTasksExit
            buttonDialogTasksExit.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val b = Intent(this@UserInfoTasks, UserInfoMyTasks::class.java)
                b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                startActivity(b)
            }

            // активируем кнопку Еще добавление задачи
            val buttonDialogTasksMore = binding.buttonDialogTasksMore
            buttonDialogTasksMore.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                //
                val dialog = Dialog(this@UserInfoTasks)
                dialog.requestWindowFeature(Window.FEATURE_NO_TITLE)
                dialog.setCancelable(false)
                dialog.setContentView(R.layout.dialog_tasks_button)
                //val body = dialog.findViewById(R.id.body) as TextView
                //body.text = title
                // активируем кнопку Ввести задачу на основание задачи button_dialog_tasks_add_tasks
                val buttonDialogTasksAddTasks = dialog.findViewById(R.id.button_dialog_tasks_add_tasks) as Button
                buttonDialogTasksAddTasks.setOnClickListener {






                    //
                    val b = Intent(this@UserInfoTasks, UserInfoTasks::class.java)
                    b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                    b.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                    startActivity(b)


                    //
                    dialog.dismiss()
                }
                // активируем кнопку Ввести событие на основание задачи button_dialog_tasks_add_event
                val buttonDialogTasksAddEvent = dialog.findViewById(R.id.button_dialog_tasks_add_event) as Button
                buttonDialogTasksAddEvent.setOnClickListener {





                    dialog.dismiss()
                }
                // активируем кнопку Ввести напоминание на основание задачи button_dialog_tasks_add_reminder
                val buttonDialogTasksAddReminder = dialog.findViewById(R.id.button_dialog_tasks_add_reminder) as Button
                buttonDialogTasksAddReminder.setOnClickListener {





                    dialog.dismiss()
                }
                // активируем кнопку Ввести заметку на основание задачи button_dialog_tasks_add_note_text
                val buttonDialogTasksAddNote = dialog.findViewById(R.id.button_dialog_tasks_add_note_text) as Button
                buttonDialogTasksAddNote.setOnClickListener {
                    noteText()

                    dialog.dismiss()
                }
                // активируем кнопку Заметка Фото заметку на основание задачи button_dialog_tasks_add_note_foto
                val buttonDialogTasksDialogBoxFoto = dialog.findViewById(R.id.button_dialog_tasks_add_note_foto) as Button
                buttonDialogTasksDialogBoxFoto.setOnClickListener {


                    dialog.dismiss()
                }
                // активируем кнопку Заметка Audio заметку на основание задачи button_dialog_tasks_add_note_audio
                val buttonDialogTasksDialogBoxAudio = dialog.findViewById(R.id.button_dialog_tasks_add_note_audio) as Button
                buttonDialogTasksDialogBoxAudio.setOnClickListener {


                    dialog.dismiss()
                }
                // активируем кнопку Заметка GEO заметку на основание задачи button_dialog_tasks_add_note_geo
                val buttonDialogTasksDialogBoxGEO = dialog.findViewById(R.id.button_dialog_tasks_add_note_geo) as Button
                buttonDialogTasksDialogBoxGEO.setOnClickListener {


                    dialog.dismiss()
                }
                // активируем кнопку Выход button_dialog_tasks_dialog_box_exit
                val buttonDialogTasksDialogBoxExit = dialog.findViewById(R.id.button_dialog_tasks_dialog_box_exit) as Button
                buttonDialogTasksDialogBoxExit.setOnClickListener {


                    dialog.dismiss()
                }

                dialog.show()
            }
        }
    }

    //Функция отображает список документов задач для выбора Основания
    private fun fillTasksField(){
        val titleDialogTasksFooting = binding.titleDialogTasksFooting
        val titleDialogTasksFootingId = binding.titleDialogTasksFootingId
        val distinct_name_id = listTasks_name_id.distinct().toList()
        val distinct_name = listTasks_name.distinct().toList()
        // setup the alert builder
        val builder_TasksFooting = AlertDialog.Builder(this@UserInfoTasks)
        builder_TasksFooting.setTitle(R.string.title_dialog_progect_text_footing)
        var checkedItem_TasksFooting = 0 // cow
        val animals_Name_Id_Tasks = distinct_name_id.toTypedArray()
        val animals_NameTasks = distinct_name.toTypedArray()
        val titleDialogTasksFooting_Aktual = titleDialogTasksFooting.text
        val contains_TasksFooting = titleDialogTasksFooting_Aktual in animals_NameTasks
        //
        if (contains_TasksFooting == true){
            checkedItem_TasksFooting = animals_NameTasks.indexOf(titleDialogTasksFooting_Aktual)
            val fff = animals_Name_Id_Tasks[checkedItem_TasksFooting] as String
            val delimeter = "%"
            val nameTasks = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idTasks = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogTasksFooting.text = nameTasks
            titleDialogTasksFootingId.text = idTasks
        }else{
            val fff = animals_Name_Id_Tasks[checkedItem_TasksFooting] as String
            val delimeter = "%"
            val nameTasks = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idTasks = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogTasksFooting.text = nameTasks
            titleDialogTasksFootingId.text = idTasks
        }
        // add a radio button list
        builder_TasksFooting.setSingleChoiceItems(animals_Name_Id_Tasks, checkedItem_TasksFooting) { dialog, which ->
            // user checked an item
            val fff = animals_Name_Id_Tasks[which] as String
            val delimeter = "%"
            val nameProgect = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idProgect = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogTasksFooting.text = nameProgect
            titleDialogTasksFootingId.text = idProgect
        }
        // add OK and Cancel buttons
        builder_TasksFooting.setPositiveButton("OK") { dialog, which ->
            // user clicked OK
            Toast.makeText(applicationContext, "Button OK", Toast.LENGTH_SHORT)
                .show()
        }
        builder_TasksFooting.setNegativeButton("Cancel", null)
        // create and show the alert dialog
        val dialog = builder_TasksFooting.create()
        dialog.show()
        listTasks_name_id = mutableListOf()
        listTasks_name = mutableListOf()
    }

    //Функция отображает список организаций для выбора Проекта
    private fun fillProjectField(){
        val titleDialogTasksProject = binding.titleDialogTasksProject
        val titleDialogTasksProjectId = binding.titleDialogTasksProjectId
        val distinct_name_id = listProject_name_id.distinct().toList()
        val distinct_name = listProject_name.distinct().toList()
        // setup the alert builder
        val builder_TasksProject = AlertDialog.Builder(this@UserInfoTasks)
        builder_TasksProject.setTitle(R.string.title_dialog_tasks_text_project)
        var checkedItem_TasksProject = 0 // cow
        val animals_Name_Id_Project = distinct_name_id.toTypedArray()
        val animals_NameProject = distinct_name.toTypedArray()
        val titleDialogTasksProject_Aktual = titleDialogTasksProject.text
        val contains_TasksProject = titleDialogTasksProject_Aktual in animals_NameProject
        //
        if (contains_TasksProject == true){
            checkedItem_TasksProject = animals_NameProject.indexOf(titleDialogTasksProject_Aktual)
            val fff = animals_Name_Id_Project[checkedItem_TasksProject] as String
            val delimeter = "%"
            val nameProgect = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idProgect = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogTasksProject.text = nameProgect
            titleDialogTasksProjectId.text = idProgect
        }else{
            val fff = animals_Name_Id_Project[checkedItem_TasksProject] as String
            val delimeter = "%"
            val nameProgect = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idProgect = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogTasksProject.text = nameProgect
            titleDialogTasksProjectId.text = idProgect
        }
        // add a radio button list
        builder_TasksProject.setSingleChoiceItems(animals_Name_Id_Project, checkedItem_TasksProject) { dialog, which ->
            // user checked an item
            val fff = animals_Name_Id_Project[which] as String
            val delimeter = "%"
            val nameProgect = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idProgect = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogTasksProject.text = nameProgect
            titleDialogTasksProjectId.text = idProgect
        }
        // add OK and Cancel buttons
        builder_TasksProject.setPositiveButton("OK") { dialog, which ->
            // user clicked OK
            Toast.makeText(applicationContext, "Button OK", Toast.LENGTH_SHORT)
                .show()
        }
        builder_TasksProject.setNegativeButton("Cancel", null)
        // create and show the alert dialog
        val dialog = builder_TasksProject.create()
        dialog.show()
        listProject_name_id = mutableListOf()
        listProject_name = mutableListOf()
    }

    //Обновляем текст в окне "Завершить к" Планируемой даты завершения title_dialog_tasks_data_stop_plan
    private fun updateDateInView() {
        val myFormat = "MM/dd/yyyy" // mention the format you need
        val sdf = SimpleDateFormat(myFormat, Locale.US)
        val titleDialogTasksDataStopPlan = binding.titleDialogTasksDataStopPlan
        titleDialogTasksDataStopPlan.text = sdf.format(cal.getTime())
    }

    //Функция открывает диалоговое окно для выбора исполнителя
    private fun choosingTaskPerformer() {
        //
        val titleDialogTasksExecutor = binding.titleDialogTasksExecutor
        val distinct_email_name = listColleague_Email_Name.distinct().toList()
        val distinct_email = listColleague_Email.distinct().toList()
        // setup the alert builder
        val builder_executor = AlertDialog.Builder(this@UserInfoTasks)
        builder_executor.setTitle(R.string.title_dialog_tasks_text_executor)
        var checkedItem_executor = 0 // cow
        val animals_executor_E_N = distinct_email_name.toTypedArray()
        val animals_executor_E = distinct_email.toTypedArray()
        //val animals_executor = arrayOf("Вася", "Петя", "Маша")
        val titleDialogTasksExecutor_Aktual = titleDialogTasksExecutor.text
        val contains_executor_E = titleDialogTasksExecutor_Aktual in animals_executor_E
        //
        if (contains_executor_E == true){
            checkedItem_executor = animals_executor_E.indexOf(titleDialogTasksExecutor_Aktual)
            val fff = animals_executor_E_N[checkedItem_executor] as String
            val delimeter = "%"
            val UserEmail_colleague = fff.split(delimeter.toRegex()).toTypedArray()[0]
            titleDialogTasksExecutor.text = UserEmail_colleague
        }else{
            val fff = animals_executor_E_N[checkedItem_executor] as String
            val delimeter = "%"
            val UserEmail_colleague = fff.split(delimeter.toRegex()).toTypedArray()[0]
            titleDialogTasksExecutor.text = UserEmail_colleague
        }
        // add a radio button list
        builder_executor.setSingleChoiceItems(animals_executor_E_N, checkedItem_executor) { dialog, which ->
            // user checked an item
            val fff = animals_executor_E_N[which] as String
            val delimeter = "%"
            val UserEmail_colleague = fff.split(delimeter.toRegex()).toTypedArray()[0]
            titleDialogTasksExecutor.text = UserEmail_colleague
        }
        // add OK and Cancel buttons
        builder_executor.setPositiveButton("OK") { dialog, which ->
            // user clicked OK
            Toast.makeText(applicationContext, "Button OK", Toast.LENGTH_SHORT)
                .show()
        }
        builder_executor.setNegativeButton("Cancel", null)
        // create and show the alert dialog
        val dialog = builder_executor.create()
        dialog.show()
        listColleague_Email_Name = mutableListOf()
        listColleague_Email = mutableListOf()
    }

    //Функция выбирает список коллег из списка организаций
    private fun choosingTaskListIdOrganization() {
        // получаем информацию о заполнение полей
        val titleDialogTasksIdOrganization = binding.titleDialogTasksIdOrganization
        val idOrganization = titleDialogTasksIdOrganization.text.toString()
        //
            db.collection("User")
                .whereEqualTo("idOrganization", idOrganization)
                .get()
                .addOnSuccessListener { documents ->
                    for (document in documents) {
                        Log.d(TAG, "${document.id} => ${document.data}")
                        val doc = document.data
                        val UserEmail_colleague = doc["UserEmail"]
                        val userName_colleague = doc["userName"]
                        val colleague: String = ("$UserEmail_colleague%$userName_colleague")
                        listColleague_Email.add(UserEmail_colleague as String?)
                        listColleague_Email_Name.add(colleague as String?)
                    }
                    choosingTaskPerformer()
                }
                .addOnFailureListener { exception ->
                    Log.w(TAG, "Error getting documents: ", exception)
                }
    }

    //Функция отображает список организаций для выбора названия и id организации
    private fun choosingTasksListNameIdOrganization(){
        val titleDialogProgectNameOrganization = binding.titleDialogTasksNameOrganization
        val titleDialogProgectIdOrganization = binding.titleDialogTasksIdOrganization
        val distinct_name_id = listOrganization_name_id.distinct().toList()
        val distinct_name = listOrganization_name.distinct().toList()
        val builder_NameOrganization = AlertDialog.Builder(this@UserInfoTasks)
        builder_NameOrganization.setTitle(R.string.title_dialog_progect_text_idOrganization)
        var checkedItem_NameOrganization = 0 // cow
        val animals_Name_Id_Organization = distinct_name_id.toTypedArray()
        val animals_NameOrganization = distinct_name.toTypedArray()
        val titleDialogProgectNameOrganization_Aktual = titleDialogProgectNameOrganization.text
        val contains_NameOrganization =
            titleDialogProgectNameOrganization_Aktual in animals_NameOrganization
        //
        if (contains_NameOrganization == true) {
            checkedItem_NameOrganization = animals_NameOrganization.indexOf(titleDialogProgectNameOrganization_Aktual)
            val fff = animals_Name_Id_Organization[checkedItem_NameOrganization] as String
            val delimeter = "%"
            val nameOrganization = fff.split(delimeter.toRegex()).toTypedArray()[0]
            val idOrganization = fff.split(delimeter.toRegex()).toTypedArray()[1]
            titleDialogProgectNameOrganization.text = nameOrganization
            titleDialogProgectIdOrganization.text = idOrganization
        } else {
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
        //listOrganization_name_id = mutableListOf()
        //listOrganization_name = mutableListOf()
    }

    //диалоговое окно для текстовой заметки
    private fun noteText() {
        //открываем окно для заметки
        val li = LayoutInflater.from(this@UserInfoTasks)
        val promptsView = li.inflate(R.layout.prompt, null)
        val builder = AlertDialog.Builder(this@UserInfoTasks)
        builder.setView(promptsView)
        val userInput = promptsView.findViewById<View>(R.id.input_text) as EditText
        builder.setTitle("Заметка")
            .setCancelable(false)
            .setPositiveButton(
                "OK"
            ) { dialog, id -> //получаем текст комментария
                val noteText = userInput.text.toString()
                //создаем документ
                // Add a new document with a generated id.
                val data: MutableMap<String, Any?> = HashMap()
                data["NoteSource"] = "note_text"
                data["NoteParent"] = "Tasks"
                data["NoteTime"] = FieldValue.serverTimestamp()
                data["NoteText"] = noteText
                data["NoteUser"] = UserEmail
                data["NoteStatus"] = ""
                data["NoteComment"] = ""
                data["NoteParentName"] = "Tasks"
                data["NoteIdDocPosition"] = tasksDocId
                db.collection("Note")
                    .add(data)
                    .addOnSuccessListener { documentReference ->
                        Log.d(
                            TAG,
                            "DocumentSnapshot written with ID: " + documentReference.id
                        )
                    }
                    .addOnFailureListener { e -> Log.w(TAG, "Error adding document", e) }
            }
            .setNegativeButton(
                "Cansel"
            ) { dialog, id -> dialog.cancel() }
        val alert = builder.create()
        alert.show()
    }


}

