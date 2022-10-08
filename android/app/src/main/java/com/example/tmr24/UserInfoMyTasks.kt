package com.example.tmr24

import android.app.AlertDialog
import android.app.DatePickerDialog
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.DatePicker
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.tmr24.databinding.ActivityUserInfoMyTasksBinding
import com.google.firebase.Timestamp
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.*


open class UserInfoMyTasks : AppCompatActivity() {
    private lateinit var binding: ActivityUserInfoMyTasksBinding
    private var userNameEmail: String? = null
    private var taskTypeNames: String? = null
    private var tasksDocId: String? = null
    private val db = Firebase.firestore
    private val TAG: String? = null
    var cal = Calendar.getInstance()

    var listOrganization_id: MutableList<String?> = mutableListOf()
    var listTasks_string: MutableList<String?> = mutableListOf()
    var listTasks_timeStamp: MutableList<String?> = mutableListOf()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityUserInfoMyTasksBinding.inflate(layoutInflater)
        setContentView(binding.root)

    }

    public override fun onStart() {
        super.onStart()
        val i = intent
        if (i != null) {
            //получаем параметры userNameEmail и taskTypeNames "MyTasks" "IncomingTasks" "OutgoingTasks"
            userNameEmail = i.getStringExtra(Constant.USER_NAME_EMAIL)
            taskTypeNames = i.getStringExtra(Constant.TASKS_TYPE_NAMES)
            //запускаем цепочку функций для заполнения активити
            listOfOrganizationsAvailableToTheUser()
            // активируем окно добавления Задача
            val buttonAddTasksColleague = binding.buttonAddTasksColleague
            buttonAddTasksColleague.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val w = Intent(this@UserInfoMyTasks, UserInfoTasks::class.java)
                w.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                w.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
                w.putExtra(Constant.ID_DOC_TASKS, tasksDocId)
                startActivity(w)
            }

            // активируем окно Выход
            val buttonExitMyTasks = binding.buttonExitMyTasks
            buttonExitMyTasks.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val b = Intent(this@UserInfoMyTasks, UserInfoOperativActivity::class.java)
                b.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
                startActivity(b)
            }
        }
    }

    // редактируем задачу при открытии
    open fun onClick(view: View?) {
        //получаем параметры клика
        val view_Click = view as View
        tasksDocId = view_Click.transitionName
        //передаем параметры в UserInfoProject
        val f = Intent(this, UserInfoTasks::class.java)
        f.putExtra(Constant.TASKS_TYPE_NAMES, taskTypeNames)
        f.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
        f.putExtra(Constant.ID_DOC_TASKS, tasksDocId)
        startActivity(f)
    }

    // список организаций доступных пользователю
    private fun listOfOrganizationsAvailableToTheUser(){
        // получаем список организаций доступных данному пользователю
        listOrganization_id = mutableListOf()
        db.collection("User")
            .whereEqualTo("userNameEmail", userNameEmail)
            .get()
            .addOnSuccessListener { documents ->
                for (document in documents) {
                    Log.d(TAG, "${document.id} => ${document.data}")
                    //получаем список Организаций в которых пользователь зарегистрирован для получения списка коллег
                    val doc = document.data
                    val idOrganization = doc["idOrganization"]
                    listOrganization_id.add(idOrganization as String?)
                }
                //запускаем функцию выбираем каким типов данных будем заполнять активити
                startComand()
            }
            .addOnFailureListener { exception ->
                Log.w(TAG, "Error getting documents: ", exception)
            }
    }

    // выбираем каким типов данных будем заполнять активити
    private fun startComand(){
        // получаем список организаций доступных данному пользователю
        val titleDialogMyTasksTypeNames = binding.titleDialogMyTasksTypeNames
        if (taskTypeNames == "MyTasks"){
            titleDialogMyTasksTypeNames.text = "Мои задачи"
            gettingListTasks(userNameEmail!!,userNameEmail!!)
        } else if (taskTypeNames == "IncomingTasks"){
            titleDialogMyTasksTypeNames.text = "Входящие задачи"
            gettingListTasks("",userNameEmail!!)
        } else if (taskTypeNames == "OutgoingTasks"){
            titleDialogMyTasksTypeNames.text = "Исходящие задачи"
            gettingListTasks(userNameEmail!!,"")
        }
    }

    // получаем список задач доступных данному пользователю
    private fun gettingListTasks(quarantorTasks: String, executorTasks: String) {
        //запускаем отбор мои задачи
        if (executorTasks != "" && quarantorTasks != ""){
            val listOrganization_id_size = listOrganization_id.size
            var number_of_cycles_listTasks_id = 0
            listOrganization_id.forEach { element ->
                db.collection("Tasks")
                    .whereEqualTo("idOrganization", element)
                    .whereEqualTo("statusTasks", "В работе")
                    .whereEqualTo("executorTasks", executorTasks)
                    .whereEqualTo("quarantorTasks", quarantorTasks)
                    .get()
                    .addOnSuccessListener { documents ->
                        for (document in documents) {
                            Log.d(TAG, "${document.id} => ${document.data}")
                            val doc = document.data
                            val nameTasks = doc["nameTasks"]
                            val nameOrganization = doc["nameOrganization"]
                            val dataTasks_stop_plan = doc["dataTasks_stop_plan"]
                            val idTasks = document.id
                            if (dataTasks_stop_plan is Timestamp){
                                val dataTasks_stop_plan_date_fakt: Timestamp = dataTasks_stop_plan
                                val dataTasks_stop_plan_date = dataTasks_stop_plan_date_fakt.toDate()
                                val dataTasks_stop_plan_seconds = dataTasks_stop_plan_date_fakt.seconds
                                val myFormat = "dd/MM/yyyy" // mention the format you need
                                val sdf = SimpleDateFormat(myFormat)
                                val dataTasks_stop_plan_text = sdf.format(dataTasks_stop_plan_date)
                                val colleague_project: String = ("$dataTasks_stop_plan_seconds%$nameTasks%$nameOrganization%$dataTasks_stop_plan_text%$idTasks")
                                listTasks_timeStamp.add(colleague_project as String?)
                            }
                            if (dataTasks_stop_plan is String){
                                val dataTasks_stop_plan_date_fakt: String = dataTasks_stop_plan
                                val colleague_project: String = ("$nameTasks%$nameOrganization%$dataTasks_stop_plan_date_fakt%$idTasks")
                                listTasks_string.add(colleague_project as String?)
                            }
                        }
                        number_of_cycles_listTasks_id = number_of_cycles_listTasks_id +1
                        if (listOrganization_id_size == number_of_cycles_listTasks_id)   {
                            // функцияоткрывает диалоговое окно для выбора исполнителя
                            // активируем заполнение recyclerViewTasks_overdue
                            val recyclerViewTasks_overdue: RecyclerView = findViewById(R.id.recyclerViewTasks_overdue)
                            recyclerViewTasks_overdue.layoutManager = LinearLayoutManager(this)
                            recyclerViewTasks_overdue.adapter = CustomRecyclerAdapterTasks(fillListTasks_overdue())

                            // активируем заполнение recyclerViewTasks_current
                            val recyclerViewTasks_current: RecyclerView = findViewById(R.id.recyclerViewTasks_current)
                            recyclerViewTasks_current.layoutManager = LinearLayoutManager(this)
                            recyclerViewTasks_current.adapter = CustomRecyclerAdapterTasks(fillListTasks_current())

                            //listOrganization_id = mutableListOf()
                            val titleDialogMyTasksTotal = binding.titleDialogMyTasksTotal
                            val listTasks_timeStamp_size = listTasks_timeStamp.size
                            val listTasks_string_size = listTasks_string.size
                            val listTasks_total = listTasks_timeStamp_size + listTasks_string_size
                            titleDialogMyTasksTotal.text = listTasks_total.toString()
                        }
                    }
                    .addOnFailureListener { exception ->
                        Log.w(TAG, "Error getting documents: ", exception)
                    }
            }

        }
        //запускаем отбор Исходящие задачи
        if (executorTasks == "" && quarantorTasks == userNameEmail){
            val listOrganization_id_size = listOrganization_id.size
            var number_of_cycles_listTasks_id = 0
            listOrganization_id.forEach { element ->
                db.collection("Tasks")
                    .whereEqualTo("idOrganization", element)
                    .whereEqualTo("statusTasks", "В работе")
                    .whereEqualTo("quarantorTasks", quarantorTasks)
                    //.whereNotEqualTo("executorTasks", executorTasks)
                    .get()
                    .addOnSuccessListener { documents ->
                        for (document in documents) {
                            Log.d(TAG, "${document.id} => ${document.data}")
                            val doc = document.data
                            val nameTasks = doc["nameTasks"]
                            val nameOrganization = doc["nameOrganization"]
                            val dataTasks_stop_plan = doc["dataTasks_stop_plan"]
                            val executorTasks_doc = doc["executorTasks"]
                            val idTasks = document.id
                            if (dataTasks_stop_plan is Timestamp){
                                val dataTasks_stop_plan_date_fakt: Timestamp = dataTasks_stop_plan
                                val dataTasks_stop_plan_date = dataTasks_stop_plan_date_fakt.toDate()
                                val dataTasks_stop_plan_seconds = dataTasks_stop_plan_date_fakt.seconds
                                val myFormat = "dd/MM/yyyy" // mention the format you need
                                val sdf = SimpleDateFormat(myFormat)
                                val dataTasks_stop_plan_text = sdf.format(dataTasks_stop_plan_date)
                                val colleague_project: String = ("$dataTasks_stop_plan_seconds%$nameTasks%$nameOrganization%$dataTasks_stop_plan_text%$idTasks")
                                if (executorTasks_doc!! != quarantorTasks) {
                                    listTasks_timeStamp.add(colleague_project as String?)
                                }
                            }
                            if (dataTasks_stop_plan is String){
                                val dataTasks_stop_plan_date_fakt: String = dataTasks_stop_plan
                                val colleague_project: String = ("$nameTasks%$nameOrganization%$dataTasks_stop_plan_date_fakt%$idTasks")
                                if (executorTasks_doc!! != quarantorTasks) {
                                    listTasks_string.add(colleague_project as String?)
                                }

                            }
                        }
                        number_of_cycles_listTasks_id = number_of_cycles_listTasks_id +1
                        if (listOrganization_id_size == number_of_cycles_listTasks_id)   {
                            // функцияоткрывает диалоговое окно для выбора исполнителя
                            // активируем заполнение recyclerViewTasks_overdue
                            val recyclerViewTasks_overdue: RecyclerView = findViewById(R.id.recyclerViewTasks_overdue)
                            recyclerViewTasks_overdue.layoutManager = LinearLayoutManager(this)
                            recyclerViewTasks_overdue.adapter = CustomRecyclerAdapterTasks(fillListTasks_overdue())

                            // активируем заполнение recyclerViewTasks_current
                            val recyclerViewTasks_current: RecyclerView = findViewById(R.id.recyclerViewTasks_current)
                            recyclerViewTasks_current.layoutManager = LinearLayoutManager(this)
                            recyclerViewTasks_current.adapter = CustomRecyclerAdapterTasks(fillListTasks_current())

                            //listOrganization_id = mutableListOf()
                            val titleDialogMyTasksTotal = binding.titleDialogMyTasksTotal
                            val listTasks_timeStamp_size = listTasks_timeStamp.size
                            val listTasks_string_size = listTasks_string.size
                            val listTasks_total = listTasks_timeStamp_size + listTasks_string_size
                            titleDialogMyTasksTotal.text = listTasks_total.toString()
                        }
                    }
                    .addOnFailureListener { exception ->
                        Log.w(TAG, "Error getting documents: ", exception)
                    }
            }
        }
        //запускаем отбор Входящие задачи
        if (executorTasks == userNameEmail && quarantorTasks == ""){
            //скрываем кнопку добавления задачи
            val buttonAddTasksColleague = binding.buttonAddTasksColleague
            buttonAddTasksColleague.visibility = View.GONE
            //
            val listOrganization_id_size = listOrganization_id.size
            var number_of_cycles_listTasks_id = 0
            listOrganization_id.forEach { element ->
                db.collection("Tasks")
                    .whereEqualTo("idOrganization", element)
                    .whereEqualTo("statusTasks", "В работе")
                    .whereEqualTo("executorTasks", executorTasks)
                    //.whereNotEqualTo("quarantorTasks", quarantorTasks)
                    .get()
                    .addOnSuccessListener { documents ->
                        for (document in documents) {
                            Log.d(TAG, "${document.id} => ${document.data}")
                            val doc = document.data
                            val nameTasks = doc["nameTasks"]
                            val nameOrganization = doc["nameOrganization"]
                            val dataTasks_stop_plan = doc["dataTasks_stop_plan"]
                            val quarantorTasks_doc = doc["quarantorTasks"]
                            val idTasks = document.id
                            if (dataTasks_stop_plan is Timestamp){
                                val dataTasks_stop_plan_date_fakt: Timestamp = dataTasks_stop_plan
                                val dataTasks_stop_plan_date = dataTasks_stop_plan_date_fakt.toDate()
                                val dataTasks_stop_plan_seconds = dataTasks_stop_plan_date_fakt.seconds
                                val myFormat = "dd/MM/yyyy" // mention the format you need
                                val sdf = SimpleDateFormat(myFormat)
                                val dataTasks_stop_plan_text = sdf.format(dataTasks_stop_plan_date)
                                val colleague_project: String = ("$dataTasks_stop_plan_seconds%$nameTasks%$nameOrganization%$dataTasks_stop_plan_text%$idTasks")
                                if (quarantorTasks_doc != executorTasks) {
                                    listTasks_timeStamp.add(colleague_project as String?)
                                }
                            }
                            if (dataTasks_stop_plan is String){
                                val dataTasks_stop_plan_date_fakt: String = dataTasks_stop_plan
                                val colleague_project: String = ("$nameTasks%$nameOrganization%$dataTasks_stop_plan_date_fakt%$idTasks")
                                if (quarantorTasks_doc != executorTasks) {
                                    listTasks_string.add(colleague_project as String?)
                                }

                            }
                        }
                        number_of_cycles_listTasks_id = number_of_cycles_listTasks_id +1
                        if (listOrganization_id_size == number_of_cycles_listTasks_id)   {
                            // функцияоткрывает диалоговое окно для выбора исполнителя
                            // активируем заполнение recyclerViewTasks_overdue
                            val recyclerViewTasks_overdue: RecyclerView = findViewById(R.id.recyclerViewTasks_overdue)
                            recyclerViewTasks_overdue.layoutManager = LinearLayoutManager(this)
                            recyclerViewTasks_overdue.adapter = CustomRecyclerAdapterTasks(fillListTasks_overdue())

                            // активируем заполнение recyclerViewTasks_current
                            val recyclerViewTasks_current: RecyclerView = findViewById(R.id.recyclerViewTasks_current)
                            recyclerViewTasks_current.layoutManager = LinearLayoutManager(this)
                            recyclerViewTasks_current.adapter = CustomRecyclerAdapterTasks(fillListTasks_current())

                            //listOrganization_id = mutableListOf()
                            val titleDialogMyTasksTotal = binding.titleDialogMyTasksTotal
                            val listTasks_timeStamp_size = listTasks_timeStamp.size
                            val listTasks_string_size = listTasks_string.size
                            val listTasks_total = listTasks_timeStamp_size + listTasks_string_size
                            titleDialogMyTasksTotal.text = listTasks_total.toString()
                        }
                    }
                    .addOnFailureListener { exception ->
                        Log.w(TAG, "Error getting documents: ", exception)
                    }
            }
        }
    }

    // получаем список просроченных проектов доступных данному пользователю
    private fun fillListTasks_overdue(): List<String> {
        val currentTime = LocalDateTime.now(ZoneOffset.UTC)
        val currentTime_miliseconds = currentTime.atZone(ZoneOffset.UTC)?.toInstant()?.toEpochMilli() as Long
        val currentTime_seconds = currentTime_miliseconds / 1000
        val data = mutableListOf<String>()
        listTasks_timeStamp.forEach { element ->
            val listProject_element = element as String
            val delimeter = "%"
            val dataProject_stop_plan_seconds = listProject_element.split(delimeter.toRegex()).toTypedArray()[0]
            val nameProject = listProject_element.split(delimeter.toRegex()).toTypedArray()[1]
            val nameOrganization = listProject_element.split(delimeter.toRegex()).toTypedArray()[2]
            val dataProject_stop_plan_text = listProject_element.split(delimeter.toRegex()).toTypedArray()[3]
            val idProject = listProject_element.split(delimeter.toRegex()).toTypedArray()[4]
            val dataProject_stop_plan_seconds_1 = dataProject_stop_plan_seconds.toLong()
            if(dataProject_stop_plan_seconds_1 <= currentTime_seconds) {
                data.add("$nameProject%$nameOrganization%$dataProject_stop_plan_text%$idProject")
            }
        }
        val data_size = data.size
        val titleDialogMyTasksOverdue = binding.titleDialogMyTasksOverdue
        titleDialogMyTasksOverdue.text = data_size.toString()
        return data

    }

    // получаем список текущех проектов доступных данному пользователю
    private fun fillListTasks_current(): List<String> {
        val currentTime = LocalDateTime.now(ZoneOffset.UTC)
        val currentTime_miliseconds = currentTime.atZone(ZoneOffset.UTC)?.toInstant()?.toEpochMilli() as Long
        val currentTime_seconds = currentTime_miliseconds / 1000
        val data = mutableListOf<String>()
        listTasks_timeStamp.forEach { element ->
            val listProject_element = element as String
            val delimeter = "%"
            val dataProject_stop_plan_seconds = listProject_element.split(delimeter.toRegex()).toTypedArray()[0]
            val nameProject = listProject_element.split(delimeter.toRegex()).toTypedArray()[1]
            val nameOrganization = listProject_element.split(delimeter.toRegex()).toTypedArray()[2]
            val dataProjectStopPlanText = listProject_element.split(delimeter.toRegex()).toTypedArray()[3]
            val idProject = listProject_element.split(delimeter.toRegex()).toTypedArray()[4]
            val dataProject_stop_plan_seconds_1 = dataProject_stop_plan_seconds.toLong()
            if(dataProject_stop_plan_seconds_1 > currentTime_seconds) {
                data.add("$nameProject%$nameOrganization%$dataProjectStopPlanText%$idProject")
            }
        }
        listTasks_string.forEach { element ->
            val listProject_element = element as String
            data.add("$listProject_element")
        }
        val data_size = data.size
        val titleDialogMyTasksCurrent = binding.titleDialogMyTasksCurrent
        titleDialogMyTasksCurrent.text = data_size.toString()
        return data
    }

}

// активируем кнопку Добавить проект
class CustomRecyclerAdapterTasks(private val namesTasks: List<String>) : RecyclerView
.Adapter<CustomRecyclerAdapterTasks.TasksViewHolder>() {

    class TasksViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val title_recycler_my_tasks_name: TextView = itemView.findViewById(R.id.title_recycler_my_tasks_name)
        val title_recycler_my_tasks_nameOrganization: TextView = itemView.findViewById(R.id.title_recycler_my_tasks_nameOrganization)
        val title_recycler_my_tasks_data_stop_plan: TextView = itemView.findViewById(R.id.title_recycler_my_tasks_data_stop_plan)
        val title_recycler_my_tasks_id: TextView = itemView.findViewById(R.id.title_recycler_my_tasks_id)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TasksViewHolder {
        val itemView = LayoutInflater.from(parent.context)
            .inflate(R.layout.recycler_my_tasks, parent, false)
        return TasksViewHolder(itemView)
    }

    override fun onBindViewHolder(holderTask: TasksViewHolder, position: Int) {
        val g = namesTasks[position]
        val delimeter = "%"
        val a = g.split(delimeter.toRegex()).toTypedArray()[0]
        val b = g.split(delimeter.toRegex()).toTypedArray()[1]
        val c = g.split(delimeter.toRegex()).toTypedArray()[2]
        val d = g.split(delimeter.toRegex()).toTypedArray()[3]

        holderTask.title_recycler_my_tasks_name.text = a
        holderTask.title_recycler_my_tasks_nameOrganization.text = b
        holderTask.title_recycler_my_tasks_data_stop_plan.text = c
        holderTask.title_recycler_my_tasks_id.text = d
        holderTask.title_recycler_my_tasks_name.transitionName = d
    }

    override fun getItemCount() = namesTasks.size
}


