package com.example.tmr24


import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.tmr24.databinding.ActivityUserInfoMyProjectBinding
import com.google.firebase.Timestamp
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.time.ZoneOffset


open class UserInfoMyProject : AppCompatActivity() {
    private lateinit var binding: ActivityUserInfoMyProjectBinding
    private var UserEmail: String? = null
    private val db = Firebase.firestore
    private val TAG: String? = null
    //
    var listOrganization_id: MutableList<String?> = mutableListOf()
    var listProject_timeStamp: MutableList<String?> = mutableListOf()
    var listProject_string: MutableList<String?> = mutableListOf()




    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityUserInfoMyProjectBinding.inflate(layoutInflater)
        setContentView(binding.root)



    }

    public override fun onStart() {
        super.onStart()
        val i = intent
        if (i != null) {
            //intentMain
            UserEmail = i.getStringExtra(Constant.USER_NAME_EMAIL)

            // получаем список организаций доступных данному пользователю
            db.collection("User")
                .whereEqualTo("UserEmail", UserEmail)
                .get()
                .addOnSuccessListener { documents ->
                    for (document in documents) {
                        Log.d(TAG, "${document.id} => ${document.data}")
                        //получаем список Организаций в которых пользователь зарегистрирован для получения списка коллег
                        val doc = document.data
                        val idOrganization = doc["idOrganization"]
                        listOrganization_id.add(idOrganization as String?)
                    }
                    //Функция отображает список организаций для выбора Основания
                    gettingListProjects()
                }
                .addOnFailureListener { exception ->
                    Log.w(TAG, "Error getting documents: ", exception)
                }

            // активируем кнопку Выход
            val buttonExitMyProject = binding.buttonExitMyProject
            buttonExitMyProject.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val b = Intent(this@UserInfoMyProject, UserInfoOperativActivity::class.java)
                b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                startActivity(b)
            }

            // активируем кнопку Добавить проект
            val buttonAddMyProject = binding.buttonAddMyProject
            buttonAddMyProject.setOnClickListener {
                Toast.makeText(applicationContext, "Button has been clicked", Toast.LENGTH_SHORT)
                    .show()
                val b = Intent(this@UserInfoMyProject, UserInfoProject::class.java)
                b.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
                startActivity(b)
            }
        }
    }

    // получаем список проектов доступных данному пользователю
    private fun gettingListProjects() {
        val listOrganization_id_size = listOrganization_id.size
        var number_of_cycles_listProject_id = 0
        listOrganization_id.forEach { element ->
            db.collection("Project")
                .whereEqualTo("idOrganization", element)
                .whereEqualTo("statusProject", "В работе")
                .get()
                .addOnSuccessListener { documents ->
                    for (document in documents) {
                        Log.d(TAG, "${document.id} => ${document.data}")
                        val doc = document.data
                        val nameProject = doc["nameProject"]
                        val nameOrganization = doc["nameOrganization"]
                        val dataProject_stop_plan = doc["dataProject_stop_plan"]
                        val idProject = document.id
                        if (dataProject_stop_plan is Timestamp){
                            val dataProject_stop_plan_date_fakt: Timestamp = dataProject_stop_plan
                            val dataProject_stop_plan_date = dataProject_stop_plan_date_fakt.toDate()
                            val dataProject_stop_plan_seconds = dataProject_stop_plan_date_fakt.seconds
                            val myFormat = "dd/MM/yyyy" // mention the format you need
                            val sdf = SimpleDateFormat(myFormat)
                            val dataProject_stop_plan_text = sdf.format(dataProject_stop_plan_date)
                            val colleague_project: String = ("$dataProject_stop_plan_seconds%$nameProject%$nameOrganization%$dataProject_stop_plan_text%$idProject")
                            listProject_timeStamp.add(colleague_project as String?)
                        }
                        if (dataProject_stop_plan is String){
                            val dataProject_stop_plan_date_fakt: String = dataProject_stop_plan
                            val colleague_project: String = ("$nameProject%$nameOrganization%$dataProject_stop_plan_date_fakt%$idProject")
                            listProject_string.add(colleague_project as String?)
                        }
                    }
                    number_of_cycles_listProject_id = number_of_cycles_listProject_id +1
                    if (listOrganization_id_size == number_of_cycles_listProject_id)   {
                        // функцияоткрывает диалоговое окно для выбора исполнителя
                        // активируем заполнение recyclerView_overdue
                        val recyclerView_overdue: RecyclerView = findViewById(R.id.recyclerView_overdue)
                        recyclerView_overdue.layoutManager = LinearLayoutManager(this)
                        recyclerView_overdue.adapter = CustomRecyclerAdapter(fillList_overdue())
                        // активируем заполнение recyclerView_current
                        val recyclerView_current: RecyclerView = findViewById(R.id.recyclerView_current)
                        recyclerView_current.layoutManager = LinearLayoutManager(this)
                        recyclerView_current.adapter = CustomRecyclerAdapter(fillList_current())
                        listOrganization_id = mutableListOf()
                        val titleDialogMyProgectTotal = binding.titleDialogMyProgectTotal
                        val listProject_timeStamp_size = listProject_timeStamp.size
                        val listProject_string_size = listProject_string.size
                        val listProject_total = listProject_timeStamp_size + listProject_string_size
                        titleDialogMyProgectTotal.text = listProject_total.toString()
                    }
                }
                .addOnFailureListener { exception ->
                    Log.w(TAG, "Error getting documents: ", exception)
                }
        }
    }

    // получаем список просроченных проектов доступных данному пользователю
    private fun fillList_overdue(): List<String> {
        val currentTime = LocalDateTime.now(ZoneOffset.UTC)
        val currentTime_miliseconds = currentTime.atZone(ZoneOffset.UTC)?.toInstant()?.toEpochMilli() as Long
        val currentTime_seconds = currentTime_miliseconds / 1000
        val data = mutableListOf<String>()
        listProject_timeStamp.forEach { element ->
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
        val titleDialogMyProgectOverdue = binding.titleDialogMyProgectOverdue
        titleDialogMyProgectOverdue.text = data_size.toString()
        return data
    }

    // получаем список текущех проектов доступных данному пользователю
    private fun fillList_current(): List<String> {
        val currentTime = LocalDateTime.now(ZoneOffset.UTC)
        val currentTime_miliseconds = currentTime.atZone(ZoneOffset.UTC)?.toInstant()?.toEpochMilli() as Long
        val currentTime_seconds = currentTime_miliseconds / 1000
        val data = mutableListOf<String>()
        listProject_timeStamp.forEach { element ->
            val listProject_element = element as String
            val delimeter = "%"
            val dataProject_stop_plan_seconds = listProject_element.split(delimeter.toRegex()).toTypedArray()[0]
            val nameProject = listProject_element.split(delimeter.toRegex()).toTypedArray()[1]
            val nameOrganization = listProject_element.split(delimeter.toRegex()).toTypedArray()[2]
            val dataProject_stop_plan_text = listProject_element.split(delimeter.toRegex()).toTypedArray()[3]
            val idProject = listProject_element.split(delimeter.toRegex()).toTypedArray()[4]
            val dataProject_stop_plan_seconds_1 = dataProject_stop_plan_seconds.toLong()
            if(dataProject_stop_plan_seconds_1 > currentTime_seconds) {
                data.add("$nameProject%$nameOrganization%$dataProject_stop_plan_text%$idProject")
            }
        }
        listProject_string.forEach { element ->
            val listProject_element = element as String
            data.add("$listProject_element")
        }
        val data_size = data.size
        val titleDialogMyProgectCurrent = binding.titleDialogMyProgectCurrent
        titleDialogMyProgectCurrent.text = data_size.toString()
        return data
    }

    // редактируем задачу при открытии Ответственным
    open fun onClick(view: View?) {
        //получаем параметры клика
        val view_Click = view as View
        val projectDocId = view_Click.transitionName
        //передаем параметры в UserInfoProject
        val f = Intent(this, UserInfoProject::class.java)
        f.putExtra(Constant.USER_NAME_EMAIL, UserEmail)
        f.putExtra(Constant.ID_DOC_PROJECT, projectDocId)
        startActivity(f)
    }
}

// активируем кнопку Добавить проект
class CustomRecyclerAdapter(private val names: List<String>) : RecyclerView
.Adapter<CustomRecyclerAdapter.MyViewHolder>() {

    class MyViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val title_recycler_my_progect_name: TextView = itemView.findViewById(R.id.title_recycler_my_progect_name)
        val title_recycler_my_progect_nameOrganization: TextView = itemView.findViewById(R.id.title_recycler_my_progect_nameOrganization)
        val title_recycler_my_progect_data_stop_plan: TextView = itemView.findViewById(R.id.title_recycler_my_progect_data_stop_plan)
        val title_recycler_my_progect_id: TextView = itemView.findViewById(R.id.title_recycler_my_progect_id)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        val itemView = LayoutInflater.from(parent.context)
            .inflate(R.layout.recycler_my_project, parent, false)
        return MyViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        val g = names[position]
        val delimeter = "%"
        val a = g.split(delimeter.toRegex()).toTypedArray()[0]
        val b = g.split(delimeter.toRegex()).toTypedArray()[1]
        val c = g.split(delimeter.toRegex()).toTypedArray()[2]
        val d = g.split(delimeter.toRegex()).toTypedArray()[3]

        holder.title_recycler_my_progect_name.text = a
        holder.title_recycler_my_progect_nameOrganization.text = b
        holder.title_recycler_my_progect_data_stop_plan.text = c
        holder.title_recycler_my_progect_id.text = d
        holder.title_recycler_my_progect_name.transitionName = d
    }

    override fun getItemCount() = names.size
}


