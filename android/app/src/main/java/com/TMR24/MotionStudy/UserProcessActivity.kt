package com.TMR24.MotionStudy

import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.LifecycleOwner
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.functions.FirebaseFunctions
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import androidx.work.OneTimeWorkRequest
import androidx.work.WorkManager
import android.media.SoundPool
import android.media.AudioManager
import android.media.MediaRecorder
import android.app.Presentation
import androidx.lifecycle.Lifecycle
import com.TMR24.MotionStudy.UserProcessActivityObserver
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageCapture
import androidx.camera.view.PreviewView
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.core.Preview
import androidx.camera.core.CameraSelector
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.firebase.firestore.GeoPoint
import com.TMR24.MotionStudy.PositionSettingObjectMap
import com.TMR24.MotionStudy.R
import androidx.core.content.ContextCompat
import android.annotation.SuppressLint
import android.content.Intent
import com.google.firebase.firestore.DocumentSnapshot
import com.google.firebase.firestore.QuerySnapshot
import com.google.firebase.firestore.QueryDocumentSnapshot
import com.google.firebase.firestore.FieldValue
import com.TMR24.MotionStudy.UserInfoActivity
import android.content.DialogInterface
import com.TMR24.MotionStudy.NotificationWorker
import androidx.work.WorkInfo
import androidx.core.app.ActivityCompat
import android.Manifest.permission
import android.app.AlertDialog
import android.content.Context
import com.TMR24.MotionStudy.UserProcessActivity
import android.content.pm.PackageManager
import android.location.Location
import android.net.Uri
import android.os.*
import android.util.Log
import android.util.Size
import android.view.*
import android.widget.*
import com.google.firebase.storage.StorageMetadata
import com.google.firebase.storage.UploadTask
import com.google.firebase.storage.OnPausedListener
import com.google.android.gms.location.LocationServices
import kotlin.Throws
import androidx.camera.core.ImageCaptureException
import androidx.work.Data
import com.google.android.gms.tasks.*
import com.google.common.util.concurrent.ListenableFuture
import com.google.firebase.functions.HttpsCallableResult
import java.io.File
import java.io.IOException
import java.lang.IllegalStateException
import java.lang.StringBuilder
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.ExecutionException

class UserProcessActivity : AppCompatActivity(), LifecycleOwner {
    private var textActivPosition: TextView? = null
    private var db: FirebaseFirestore? = null
    private var mFunctions: FirebaseFunctions? = null
    private var storage: FirebaseStorage? = null
    private var storageRef: StorageReference? = null

    // ID активного документа в данный момент в коллекции ProcessUser
    private var idDocActivButtonUser: String? = null

    // ID активной кнопки в данный момент времени
    private var activButtonId = 0

    // активная кнопка в данный момент времени
    private var activeButton: Button? = null

    // ID активного документа смены в данный момент
    private var activShiftDocId: String? = null

    // ID фонового задания
    private var mRequest: OneTimeWorkRequest? = null

    // список фоновых заданий
    private var mWorkManager: WorkManager? = null

    // переменные для звукового сигнала
    private var soundId = 0
    private var soundPool: SoundPool? = null
    private var amg: AudioManager? = null

    //переменная для организации активного контроля
    private var settingsActiveIntervalMinutesFigure: String? = null
    private var NameDocProcessButton: String? = null
    private var settingsActiveTransition: String? = null
    private var settingsActiveSignal = false
    private var settingsActiveDurationSecondsLong1000: Long = 0

    //переменная для организации активного контроля, активация кнопки программно
    private var settingsActiveTransitionControl: String? = null

    //переменные для аудио записи
    private val AudioSavePathInDevice: String? = null
    private var recorder: MediaRecorder? = null
    private val random: Random? = null
    private val RandomAudioFileName = "ABCDEFGHIJKLMNOP"

    // Requesting permission to RECORD_AUDIO
    private val permissionToRecordAccepted = false
    private val permissions = arrayOf(permission.RECORD_AUDIO)

    //переменные для Фото фиксации CameraX
    private val view: Presentation? = null
    private val lifecycleOwner: LifecycleOwner? = null
    private val lifecycle: Lifecycle? = null
    private var locationListener: UserProcessActivityObserver? = null
    private var imageAnalysis: ImageAnalysis? = null
    private var imageCapture: ImageCapture? = null
    private var previewView: PreviewView? = null
    private var cameraProvider: ProcessCameraProvider? = null
    private var preview: Preview? = null
    private var cameraSelector: CameraSelector? = null
    private var cameraProviderFuture: ListenableFuture<*>? = null
    private val currentPhotoPath: String? = null
    private var settingsPassivePhotoIntervalSecondsFigure: String? = null
    private var mRequestPassivePhotoInterval: OneTimeWorkRequest? = null

    //переменные для геолокации
    private var fusedLocationClient: FusedLocationProviderClient? = null
    private var mRequestPassiveGeolocationInterval: OneTimeWorkRequest? = null
    private var settingsPassiveGeolocationIntervalSecondsFigure: String? = null
    private val locationCoordinates: GeoPoint? = null

    ////
    private val TAG: String? = null
    private var userNameEmail: String? = null
    private var parentHierarchyShiftUser: String? = null
    private var idPosition: String? = null
    private var buttonCloseShift: Button? = null
    private var buttonExpect: Button? = null
    private var buttonOther: Button? = null
    private var buttonGone: Button? = null
    private var button: Button? = null
    private var buttonFoto: Button? = null
    private var buttonFotoCansel: Button? = null
    private var parentHierarchyPositionUserMap: Map<*, *>? = null
    private val PositionSettingsMap: MutableList<PositionSettingObjectMap?> = ArrayList<Any?>()
    private val ButtonMap: MutableList<Button?> = ArrayList<Any?>()
    private var linearLayoutButton: LinearLayout? = null
    private var containerPreviewView: FrameLayout? = null
    private final var window: Window? = null
    val context: Context = this

    //переменные для списка заметок List
    private var PositionSettingsNoteListMap: Map<String, Any>? = HashMap()
    private var PositionSettingsNoteTrafficMap: Map<String, Any>? = HashMap()

    //@OnLifecycleEvent(ON_CREATE)
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_process)
        locationListener = UserProcessActivityObserver(this@UserProcessActivity, getLifecycle())
        init()
    }

    //menu верхней правой части экрана
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        val inflater = menuInflater
        inflater.inflate(R.menu.menu_user_process_activity, menu)
        return super.onCreateOptionsMenu(menu)
    }

    private fun init() {
        db = FirebaseFirestore.getInstance()
        storage = FirebaseStorage.getInstance()
        storageRef = storage!!.reference
        mFunctions = FirebaseFunctions.getInstance()
        textActivPosition = findViewById(R.id.textActivPosition)
        buttonCloseShift = findViewById(R.id.buttonCloseShift)
        linearLayoutButton = findViewById(R.id.linearLayoutButton)
        buttonExpect = findViewById(R.id.buttonExpect)
        buttonOther = findViewById(R.id.buttonOther)
        buttonGone = findViewById(R.id.buttonGone)
        buttonFoto = findViewById(R.id.buttonFoto)
        buttonFotoCansel = findViewById(R.id.buttonFotoCansel)
        containerPreviewView = findViewById(R.id.container)
        window = getWindow()
        // переменная для фоновых задач
        mWorkManager = WorkManager.getInstance()
        //переменные для звукового сигнала
        soundPool = SoundPool(1, AudioManager.STREAM_MUSIC, 0)
        soundId = soundPool!!.load(this@UserProcessActivity, R.raw.return_tone, 1)
        amg = getSystemService(AUDIO_SERVICE) as AudioManager
        //переменная для CameraX
        previewView = findViewById(R.id.previewView)
        activateTheCamera()
    }

    private fun activateTheCamera() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            cameraProviderFuture = null
            cameraProvider = null
            preview = null
            imageCapture = null
            cameraSelector = null
            imageAnalysis = null
            cameraProviderFuture = ProcessCameraProvider.getInstance(this@UserProcessActivity)
            imageAnalysis = ImageAnalysis.Builder()
                .setTargetResolution(Size(1280, 720))
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .build()
            (cameraProviderFuture as ListenableFuture<ProcessCameraProvider>).addListener(
                Runnable {
                    try {
                        // Camera provider is now guaranteed to be available
                        // Поставщик камеры теперь гарантированно доступен
                        cameraProvider = (cameraProviderFuture as ListenableFuture<ProcessCameraProvider>).get() as ProcessCameraProvider
                        // Set up the view finder use case to display camera preview
                        // Настраиваем вариант использования видоискателя для отображения предварительного просмотра камеры
                        preview = Preview.Builder().build()
                        // Set up the capture use case to allow users to take photos
                        // Настройка сценария использования захвата, чтобы пользователи могли делать фотографии
                        imageCapture = ImageCapture.Builder()
                            .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                            .build()
                        // Choose the camera by requiring a lens facing
                        // Выбираем камеру, требуя, чтобы объектив смотрел
                        cameraSelector = CameraSelector.Builder()
                            .requireLensFacing(CameraSelector.LENS_FACING_BACK)
                            .build()
                        // Connect the preview use case to the previewView
                        // Подключите вариант использования предварительного просмотра к previewView
                        preview!!.setSurfaceProvider(previewView!!.surfaceProvider)
                        ////
                        cameraProvider!!.bindToLifecycle(
                            (this as LifecycleOwner),
                            cameraSelector!!,
                            imageCapture,
                            imageAnalysis,
                            preview
                        )
                    } catch (e: InterruptedException) {
                        // Currently no exceptions thrown. cameraProviderFuture.get()
                        // shouldn't block since the listener is being called, so no need to
                        // handle InterruptedException.
                        // В настоящее время исключений нет. cameraProviderFuture.get ()
                        // не должен блокироваться, так как слушатель вызывается, поэтому нет необходимости
                        // обрабатываем InterruptedException.
                    } catch (e: ExecutionException) {
                    }
                },
                ContextCompat.getMainExecutor(this@UserProcessActivity)
            )
        } else {
            // Use Camera1
            Toast.makeText(
                this@UserProcessActivity,
                "This device does not support CameraX operation.",
                Toast.LENGTH_SHORT
            ).show()
        }


        /////////////////
    }

    @SuppressLint("ResourceType")
    public override fun onStart() {
        super.onStart()
        UserProcessActivityObserver.connect()
        val i = intent
        if (i != null) {   //window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            //очистили ArrayList
            PositionSettingsMap.clear()
            ButtonMap.clear()
            linearLayoutButton!!.removeAllViews()
            //
            val idButtonExpect = 9
            buttonExpect!!.id = idButtonExpect
            buttonExpect!!.setOnClickListener(mCorkyListener)
            ButtonMap.add(buttonExpect)
            //
            val idButtonOther = 10
            buttonOther!!.id = idButtonOther
            buttonOther!!.setOnClickListener(mCorkyListener)
            ButtonMap.add(buttonOther)
            //
            val idButtonGone = 11
            buttonGone!!.id = idButtonGone
            buttonGone!!.setOnClickListener(mCorkyListener)
            ButtonMap.add(buttonGone)
            // получили строку данных с предидущего Активити
            userNameEmail = i.getStringExtra(Constant.USER_NAME_EMAIL)
            parentHierarchyShiftUser = i.getStringExtra(Constant.PARENT_HIERARCHY_SHIFT_USER)
            val delimeter = ">"
            val idOrganization =
                parentHierarchyShiftUser!!.split(delimeter.toRegex()).toTypedArray()[0]
            val nameOrganization =
                parentHierarchyShiftUser!!.split(delimeter.toRegex()).toTypedArray()[1]
            val idSubdivision =
                parentHierarchyShiftUser!!.split(delimeter.toRegex()).toTypedArray()[2]
            val nameSubdivision =
                parentHierarchyShiftUser!!.split(delimeter.toRegex()).toTypedArray()[3]
            idPosition = parentHierarchyShiftUser!!.split(delimeter.toRegex()).toTypedArray()[4]
            val namePosition =
                parentHierarchyShiftUser!!.split(delimeter.toRegex()).toTypedArray()[5]
            activShiftDocId =
                parentHierarchyShiftUser!!.split(delimeter.toRegex()).toTypedArray()[6]
            //вывели на экран Должность Подразделение Организацию в которой планируем работать
            textActivPosition!!.text = "$nameOrganization > $nameSubdivision > $namePosition"
            //получаем parentHierarchyPositionUserMap из документа Активной смены
            val docRef = db!!.collection("WorkShift").document(
                activShiftDocId!!
            )
            docRef.get().addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val document = task.result
                    if (document.exists()) {
                        Log.d(TAG, "DocumentSnapshot data: " + document.data)
                        val doc = document.data
                        parentHierarchyPositionUserMap =
                            doc!!["ParentHierarchyPositionUser"] as Map<String?, Any?>?
                        buttonCloseShift!!.visibility = View.VISIBLE
                    } else {
                        Log.d(TAG, "No such document")
                    }
                } else {
                    Log.d(TAG, "get failed with ", task.exception)
                }
            }
            // устанавливаем настройки кнопок buttonExpect, buttonOther, buttonGone в PositionSettingsMap
            val idSettingsButtonExpect = "buttonExpect"
            val settingsTitleExpect = "Expect"
            val settingsCommitDescription = false
            val settingsResultCapture = false
            val settingsActiveControl = false
            val settingsPassiveControl = false
            val settingsCommitDescriptionExpect = true
            val dataSettingsButtonExpect: MutableMap<String, Any> = HashMap()
            dataSettingsButtonExpect["SettingsTitle"] = settingsTitleExpect
            dataSettingsButtonExpect["SettingsActiveControl"] = settingsActiveControl
            dataSettingsButtonExpect["SettingsPassiveControl"] = settingsPassiveControl
            dataSettingsButtonExpect["SettingsCommitDescription"] = settingsCommitDescriptionExpect
            dataSettingsButtonExpect["SettingsResultCapture"] = settingsResultCapture
            val positionSettingsObjectExpect = PositionSettingObjectMap(
                idButtonExpect,
                idSettingsButtonExpect,
                dataSettingsButtonExpect
            )
            PositionSettingsMap.add(positionSettingsObjectExpect)
            buttonExpect!!.id = idButtonExpect
            val idSettingsButtonOther = "buttonOther"
            val SettingsTitleOther = "Other"
            val settingsCommitDescriptionOther = true
            val dataSettingsButtonOther: MutableMap<String, Any> = HashMap()
            dataSettingsButtonOther["SettingsTitle"] = SettingsTitleOther
            dataSettingsButtonOther["SettingsActiveControl"] = settingsActiveControl
            dataSettingsButtonOther["SettingsPassiveControl"] = settingsPassiveControl
            dataSettingsButtonOther["SettingsCommitDescription"] = settingsCommitDescriptionOther
            dataSettingsButtonOther["SettingsResultCapture"] = settingsResultCapture
            val positionSettingsObjectOther = PositionSettingObjectMap(
                idButtonOther,
                idSettingsButtonOther,
                dataSettingsButtonOther
            )
            PositionSettingsMap.add(positionSettingsObjectOther)
            buttonOther!!.id = idButtonOther
            val idSettingsButtonGone = "buttonGone"
            val SettingsTitleGone = "Gone"
            val dataSettingsButtonGone: MutableMap<String, Any> = HashMap()
            dataSettingsButtonGone["SettingsTitle"] = SettingsTitleGone
            dataSettingsButtonGone["SettingsActiveControl"] = settingsActiveControl
            dataSettingsButtonGone["SettingsPassiveControl"] = settingsPassiveControl
            dataSettingsButtonGone["SettingsCommitDescription"] = settingsCommitDescription
            dataSettingsButtonGone["SettingsResultCapture"] = settingsResultCapture
            val positionSettingsObjectGone =
                PositionSettingObjectMap(idButtonGone, idSettingsButtonGone, dataSettingsButtonGone)
            PositionSettingsMap.add(positionSettingsObjectGone)
            buttonGone!!.id = idButtonGone
            //получаем настройки для данной должности
            val docRefOrganization = db!!.collection("Organization").document(idOrganization)
            val docRefSubdivision =
                docRefOrganization.collection("Subdivision").document(idSubdivision)
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
                            button = Button(this@UserProcessActivity)
                            button!!.layoutParams = LinearLayout.LayoutParams(
                                LinearLayout.LayoutParams.MATCH_PARENT,
                                LinearLayout.LayoutParams.WRAP_CONTENT
                            )
                            button!!.text = buttonName
                            val id = View.generateViewId()
                            button!!.id = id
                            button!!.setOnClickListener(mCorkyListener)
                            ButtonMap.add(button)
                            // устанавливаем настройки созданных кнопок в PositionSettingsMap
                            val idSettingsButton = document.id
                            val dataSettingsButton = document.data
                            val positionSettingsObject =
                                PositionSettingObjectMap(id, idSettingsButton, dataSettingsButton)
                            PositionSettingsMap.add(positionSettingsObject)
                            //публикуем
                            linearLayoutButton!!.addView(button)
                        }
                    } else {
                        Log.d(TAG, "Error getting documents: ", task.exception)
                    }
                }
            //получаем настройки заметок List для текущей должности PositionSettingsNoteList
            docRefPosition.collection("PositionSettingsNoteList")
                .get()
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        for (document in task.result) {
                            Log.d(TAG, document.id + " => " + document.data)
                            //достаем название и настройки
                            PositionSettingsNoteListMap = document.data
                        }
                    } else {
                        Log.d(TAG, "Error getting documents: ", task.exception)
                    }
                }
            //получаем настройки заметок Traffic для текущей должности PositionSettingsNoteTrafficMap
            docRefPosition.collection("PositionSettingsNoteTrafic")
                .get()
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        for (document in task.result) {
                            Log.d(TAG, document.id + " => " + document.data)
                            //достаем название и настройки
                            PositionSettingsNoteTrafficMap = document.data
                        }
                    } else {
                        Log.d(TAG, "Error getting documents: ", task.exception)
                    }
                }
            //получаем открытый документ процесса и устанавливаем активность
            docRef.collection("ProcessUser")
                .whereEqualTo("ProcessUserEnd", "")
                .get()
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        for (document in task.result) {
                            Log.d(TAG, document.id + " => " + document.data)
                            idDocActivButtonUser = document.id
                            val dataSettingsButton = document.data
                            //String IdDocProcessButton = (String) dataSettingsButton.get("IdDocProcessButton");
                            NameDocProcessButton =
                                dataSettingsButton["NameDocProcessButton"] as String?
                            ButtonActivationByBackgroundTask(NameDocProcessButton)
                        }
                    } else {
                        Log.d(TAG, "Error getting documents: ", task.exception)
                    }
                }
        }
    }

    //---Операция закрытия рабочей смены и крайнего сдокумента событие смены.---
    fun buttonCloseShift(view: View?) { //Закрываем рабочую смену
        val washingtonRef = db!!.collection("WorkShift").document(
            activShiftDocId!!
        )
        washingtonRef
            .update("WorkShiftEnd", "false")
            .addOnSuccessListener(object : OnSuccessListener<Void?> {
                override fun onSuccess(aVoid: Void?) {
                    Log.d(TAG, "DocumentSnapshot successfully updated!")
                }
            })
            .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
        val docRef = db!!.collection("WorkShift").document(
            activShiftDocId!!
        )
        // Обновляем поле отметки времени значением с сервера
        // Update the timestamp field with the value from the server
        val updates: MutableMap<String, Any> = HashMap()
        updates["WorkShiftEndTime"] = FieldValue.serverTimestamp()
        docRef.update(updates).addOnCompleteListener // [START_EXCLUDE]
        // [START_EXCLUDE]
        { }
        // Закрываем документ активного процесса
        val washingtonRefProcessUser = washingtonRef.collection("ProcessUser").document(
            idDocActivButtonUser!!
        )
        washingtonRefProcessUser
            .update("ProcessUserEnd", "false")
            .addOnSuccessListener(object : OnSuccessListener<Void?> {
                override fun onSuccess(aVoid: Void?) {
                    Log.d(TAG, "DocumentSnapshot successfully updated!")
                }
            })
            .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
        val docRefProcessUser = docRef.collection("ProcessUser").document(
            idDocActivButtonUser!!
        )
        val updatesProcessUser: MutableMap<String, Any> = HashMap()
        updatesProcessUser["ProcessUserEndTime"] = FieldValue.serverTimestamp()
        docRefProcessUser.update(updatesProcessUser).addOnCompleteListener // [START_EXCLUDE]
        // [START_EXCLUDE]
        { }
        val i = Intent(this@UserProcessActivity, UserInfoActivity::class.java)
        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail)
        startActivity(i)
    }

    //--- Основная операция данной активити---
    // Операция слушатель нажатия кнопок процессов
    private val mCorkyListener = View.OnClickListener { v ->
        //получаем текущую активную кнопку и закрываем активный докумен
        val idDocActivButtonUserFinal = idDocActivButtonUser
        //изменяем цвет текущей активной кнопки
        activeButton!!.setBackgroundColor(resources.getColor(R.color.colorFonButton))
        for (h in PositionSettingsMap) {
            val idButton = h!!.idButton
            if (activButtonId == idButton) {
                val idSettingsButton = h.idSettingsButton
                val dataSettingsButton: Map<*, *>? = h.dataSettingsButton
                NameDocProcessButton = dataSettingsButton!!["SettingsTitle"] as String?
                // закрываем задачи активного контроля
                val settingsActiveControl = dataSettingsButton["SettingsActiveControl"] as Boolean
                if (settingsActiveControl == true) {
                    // очищаем список фоновых задач с тегом "workmng"
                    if (mRequest != null) {
                        mWorkManager!!.enqueue(mRequest!!)
                        mWorkManager!!.cancelWorkById(mRequest!!.id)
                    }
                }
                //
                val settingsPassiveControl = dataSettingsButton["SettingsPassiveControl"] as Boolean
                if (settingsPassiveControl == true) {
                    val settingsPassiveAudio = dataSettingsButton["SettingsPassiveAudio"] as Boolean
                    if (settingsPassiveAudio == true) {
                        stopRecordingAudio()
                    }
                    val settingsPassivePhoto = dataSettingsButton["SettingsPassivePhoto"] as Boolean
                    if (settingsPassivePhoto == true) {
                        // очищаем список фоновых задач с тегом "workmng"
                        if (mRequestPassivePhotoInterval != null) {
                            mWorkManager!!.enqueue(mRequestPassivePhotoInterval!!)
                            mWorkManager!!.cancelWorkById(mRequestPassivePhotoInterval!!.id)
                        }
                    }
                    val settingsPassiveVideo = dataSettingsButton["SettingsPassiveVideo"] as Boolean
                    if (settingsPassiveAudio == true) {
                        //
                    }
                    val settingsPassiveGeolocation =
                        dataSettingsButton["SettingsPassiveGeolocation"] as Boolean
                    if (settingsPassiveGeolocation == true) {
                        // очищаем список фоновых задач с тегом "workmng"
                        if (mRequestPassiveGeolocationInterval != null) {
                            mWorkManager!!.enqueue(mRequestPassiveGeolocationInterval!!)
                            mWorkManager!!.cancelWorkById(mRequestPassiveGeolocationInterval!!.id)
                        }
                    }
                }
                // проверяем необходимость личного комментария при закрытии документа
                val settingsCommitDescription =
                    dataSettingsButton["SettingsCommitDescription"] as Boolean
                if (settingsCommitDescription == true) { // создаем всплывающее окно
                    val li = LayoutInflater.from(context)
                    val promptsView = li.inflate(R.layout.prompt, null)
                    val builder = AlertDialog.Builder(this@UserProcessActivity)
                    builder.setView(promptsView)
                    val userInput = promptsView.findViewById<View>(R.id.input_text) as EditText
                    builder.setTitle("Comment Result")
                        .setCancelable(false)
                        .setPositiveButton(
                            "OK"
                        ) { dialog, id -> //получаем текст комментария
                            val commitDescriptioText = userInput.text.toString()
                            val docRef = db!!.collection("WorkShift").document(
                                activShiftDocId!!
                            )
                            val washingtonRef = docRef.collection("ProcessUser").document(
                                idDocActivButtonUserFinal!!
                            )
                            // Set the "isCapital" field of the city 'DC'
                            washingtonRef
                                .update("CommitDescriptioText", commitDescriptioText)
                                .addOnSuccessListener(object : OnSuccessListener<Void?> {
                                    override fun onSuccess(aVoid: Void?) {
                                        Log.d(TAG, "DocumentSnapshot successfully updated!")
                                    }
                                })
                                .addOnFailureListener { e ->
                                    Log.w(
                                        TAG,
                                        "Error updating document",
                                        e
                                    )
                                }
                        }
                        .setNegativeButton(
                            "Cansel"
                        ) { dialog, id -> dialog.cancel() }
                    val alert = builder.create()
                    alert.show()
                }
                // проверяем необходимость типового комментария при закрытии документа
                val settingsResultCapture = dataSettingsButton["SettingsResultCapture"] as Boolean
                if (settingsResultCapture == true) {  //фиксируем результат исполнения процесса из предложенного варианта
                    val builder = AlertDialog.Builder(this@UserProcessActivity)
                    builder.setTitle("Select result")
                    val settings_array: MutableList<String?> = ArrayList()
                    val settingsResultControlOption1 =
                        dataSettingsButton["SettingsResultControlOption1"] as String?
                    if (settingsResultControlOption1 !== "") {
                        settings_array.add(settingsResultControlOption1)
                    }
                    val settingsResultControlOption2 =
                        dataSettingsButton["SettingsResultControlOption2"] as String?
                    if (settingsResultControlOption2 !== "") {
                        settings_array.add(settingsResultControlOption2)
                    }
                    val settingsResultControlOption3 =
                        dataSettingsButton["SettingsResultControlOption3"] as String?
                    if (settingsResultControlOption3 !== "") {
                        settings_array.add(settingsResultControlOption3)
                    }
                    val settingsResultControlOption4 =
                        dataSettingsButton["SettingsResultControlOption4"] as String?
                    if (settingsResultControlOption4 !== "") {
                        settings_array.add(settingsResultControlOption4)
                    }
                    val settingsResultControlOption5 =
                        dataSettingsButton["SettingsResultControlOption5"] as String?
                    if (settingsResultControlOption5 !== "") {
                        settings_array.add(settingsResultControlOption5)
                    }
                    val settingsResultControlOption6 =
                        dataSettingsButton["SettingsResultControlOption6"] as String?
                    if (settingsResultControlOption6 !== "") {
                        settings_array.add(settingsResultControlOption6)
                    }
                    val settingsResultControlOption7 =
                        dataSettingsButton["SettingsResultControlOption7"] as String?
                    if (settingsResultControlOption7 !== "") {
                        settings_array.add(settingsResultControlOption7)
                    }
                    val settingsResultControlOption8 =
                        dataSettingsButton["SettingsResultControlOption8"] as String?
                    if (settingsResultControlOption8 !== "") {
                        settings_array.add(settingsResultControlOption8)
                    }
                    if (settings_array.size != 0) {
                        val dataAdapter = ArrayAdapter(
                            this@UserProcessActivity,
                            android.R.layout.simple_dropdown_item_1line, settings_array
                        )
                        builder.setAdapter(dataAdapter) { dialog, which ->
                            Toast.makeText(
                                this@UserProcessActivity,
                                "You have selected " + settings_array[which],
                                Toast.LENGTH_LONG
                            ).show()
                            val resultControlButton = settings_array[which]
                            val docRef = db!!.collection("WorkShift").document(
                                activShiftDocId!!
                            )
                            val washingtonRef = docRef.collection("ProcessUser").document(
                                idDocActivButtonUserFinal!!
                            )
                            // Set the "isCapital" field of the city 'DC'
                            washingtonRef
                                .update("ResultControlButton", resultControlButton)
                                .addOnSuccessListener(object : OnSuccessListener<Void?> {
                                    override fun onSuccess(aVoid: Void?) {
                                        Log.d(TAG, "DocumentSnapshot successfully updated!")
                                    }
                                })
                                .addOnFailureListener { e ->
                                    Log.w(
                                        TAG,
                                        "Error updating document",
                                        e
                                    )
                                }
                        }
                        val dialog = builder.create()
                        dialog.show()
                    }
                }
            }
        }
        // Закрываем документ активного процесса
        val washingtonRef = db!!.collection("WorkShift").document(
            activShiftDocId!!
        )
        val docRef = db!!.collection("WorkShift").document(
            activShiftDocId!!
        )
        val washingtonRefProcessUser = washingtonRef.collection("ProcessUser").document(
            idDocActivButtonUser!!
        )
        washingtonRefProcessUser
            .update("ProcessUserEnd", "false")
            .addOnSuccessListener(object : OnSuccessListener<Void?> {
                override fun onSuccess(aVoid: Void?) {
                    Log.d(TAG, "DocumentSnapshot successfully updated!")
                }
            })
            .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
        val docRefProcessUser = docRef.collection("ProcessUser").document(
            idDocActivButtonUser!!
        )
        val updatesProcessUser: MutableMap<String, Any> = HashMap()
        updatesProcessUser["ProcessUserEndTime"] = FieldValue.serverTimestamp()
        docRefProcessUser.update(updatesProcessUser).addOnCompleteListener // [START_EXCLUDE]
        // [START_EXCLUDE]
        { }
        // устанавливаем агресивный цвет фона активной кнопки
        v.setBackgroundColor(resources.getColor(R.color.colorFonActiviButton))
        activeButton = v as Button
        activButtonId = v.getId()
        //получам данные для документа процесса
        for (h in PositionSettingsMap) {
            val idButton = h!!.idButton
            if (activButtonId == idButton) {
                val idSettingsButton = h.idSettingsButton
                val dataSettingsButton: Map<*, *>? = h.dataSettingsButton
                NameDocProcessButton = dataSettingsButton!!["SettingsTitle"] as String?
                //активизируем процесс по нажатию кнопки
                val dataProcessUser: MutableMap<String, Any?> = HashMap()
                dataProcessUser["EmailPositionUser"] = userNameEmail
                dataProcessUser["IdDocPosition"] = idPosition
                dataProcessUser["IdDocProcessButton"] = idSettingsButton
                dataProcessUser["NameDocProcessButton"] = NameDocProcessButton
                dataProcessUser["ParentHierarchyPositionUser"] = parentHierarchyPositionUserMap
                dataProcessUser["ProcessUserEnd"] = ""
                dataProcessUser["ProcessUserStartTime"] = FieldValue.serverTimestamp()
                washingtonRef.collection("ProcessUser")
                    .add(dataProcessUser)
                    .addOnSuccessListener { documentReference ->
                        Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.id)
                        idDocActivButtonUser = documentReference.id
                    }
                    .addOnFailureListener { e -> Log.w(TAG, "Error adding document", e) }
                // получаем настройки для новой активной кнопки
                val settingsActiveControl = dataSettingsButton["SettingsActiveControl"] as Boolean
                if (settingsActiveControl == true) {
                    //получаем настройки параметров активного контроля
                    val settingsActiveDurationSeconds =
                        dataSettingsButton["SettingsActiveDurationSeconds"] as String?
                    val delimeter = " "
                    val settingsActiveDurationSecondsFigure =
                        settingsActiveDurationSeconds!!.split(delimeter.toRegex()).toTypedArray()[0]
                    val settingsActiveDurationSecondsFigureTime =
                        settingsActiveDurationSeconds.split(delimeter.toRegex()).toTypedArray()[1]
                    var settingsActiveDurationSecondsLong =
                        settingsActiveDurationSecondsFigure.toLong()
                    if (settingsActiveDurationSecondsFigureTime == "minutes") {
                        settingsActiveDurationSecondsLong = settingsActiveDurationSecondsLong * 60
                    }
                    settingsActiveDurationSecondsLong1000 = settingsActiveDurationSecondsLong * 1000
                    val settingsActiveIntervalMinutes =
                        dataSettingsButton["SettingsActiveIntervalMinutes"] as String?
                    settingsActiveIntervalMinutesFigure =
                        settingsActiveIntervalMinutes!!.split(delimeter.toRegex()).toTypedArray()[0]
                    val settingsActiveIntervalMinutesFigureTime =
                        settingsActiveIntervalMinutes.split(delimeter.toRegex()).toTypedArray()[1]
                    var settingsActiveIntervalMinutesFigureLong =
                        settingsActiveIntervalMinutesFigure!!.toLong()
                    if (settingsActiveIntervalMinutesFigureTime == "minutes") {
                        settingsActiveIntervalMinutesFigureLong =
                            settingsActiveIntervalMinutesFigureLong * 60
                        settingsActiveIntervalMinutesFigure =
                            java.lang.Long.toString(settingsActiveIntervalMinutesFigureLong)
                    }
                    settingsActiveSignal = dataSettingsButton["SettingsActiveSignal"] as Boolean
                    settingsActiveTransition =
                        dataSettingsButton["SettingsActiveTransition"] as String?
                    //метод ожидания времени запуска
                    WaitingForTheQuestionOfActiveControl()
                    //включаем вибросигнал для подтверждения нажатия кнопки
                    val vibrator = getSystemService(VIBRATOR_SERVICE) as Vibrator
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        vibrator.vibrate(
                            VibrationEffect.createOneShot(
                                500,
                                VibrationEffect.DEFAULT_AMPLITUDE
                            )
                        )
                    } else {
                        vibrator.vibrate(500)
                    }
                }
                //
                val settingsPassiveControl = dataSettingsButton["SettingsPassiveControl"] as Boolean
                if (settingsPassiveControl == true) {
                    val settingsPassiveAudio = dataSettingsButton["SettingsPassiveAudio"] as Boolean
                    if (settingsPassiveAudio == true) {
                        startRecordingAudio()
                    }
                    val settingsPassivePhoto = dataSettingsButton["SettingsPassivePhoto"] as Boolean
                    if (settingsPassivePhoto == true) {
                        //получаем настройки параметров интервала Фото фиксации
                        val settingsPassivePhotoInterval =
                            dataSettingsButton["SettingsPassivePhotoInterval"] as String?
                        val delimeter = " "
                        settingsPassivePhotoIntervalSecondsFigure =
                            settingsPassivePhotoInterval!!.split(delimeter.toRegex())
                                .toTypedArray()[0]
                        val settingsPassivePhotoIntervalFigureTime =
                            settingsPassivePhotoInterval.split(delimeter.toRegex())
                                .toTypedArray()[1]
                        val settingsPassivePhotoIntervalSecondsLong =
                            settingsPassivePhotoIntervalSecondsFigure!!.toLong()
                        if (settingsPassivePhotoIntervalFigureTime == "minutes") {
                            val settingsPassivePhotoIntervalMinutesLong =
                                settingsPassivePhotoIntervalSecondsLong * 60
                            settingsPassivePhotoIntervalSecondsFigure =
                                java.lang.Long.toString(settingsPassivePhotoIntervalMinutesLong)
                        }
                        val settingsPassivePhotoSmartphoneCamera =
                            dataSettingsButton["SettingsPassivePhotoSmartphoneCamera"] as Boolean
                        val settingsPassivePhotoCameraIP =
                            dataSettingsButton["SettingsPassivePhotoCameraIP"] as Boolean
                        val settingsPassivePhotoCaptureEventOnClick =
                            dataSettingsButton["SettingsPassivePhotoCaptureEventOnClick"] as Boolean
                        if (settingsPassivePhotoCaptureEventOnClick == true) {
                            //запускае первую фото фиксацию камеры со смарфона
                            if (settingsPassivePhotoSmartphoneCamera == true) {
                                //запускаем фото фиксацию камеры со смарфона
                                dispatchTakePictureIntentSmartphoneCamera()
                            }
                            if (settingsPassivePhotoCameraIP == true) {
                                //запускае первую фото фиксацию с камеры IP
                                dispatchTakePictureIntentCameraIP(idDocActivButtonUser)
                            }
                        }
                        //запускаем интервал фиксации местоположения
                        WaitingForTheQuestionOfPassivePhotoInterval(
                            settingsPassivePhotoSmartphoneCamera,
                            settingsPassivePhotoCameraIP
                        )
                    }
                    val settingsPassiveVideo = dataSettingsButton["SettingsPassiveVideo"] as Boolean
                    if (settingsPassiveVideo == true) {
                        //
                    }
                    val settingsPassiveGeolocation =
                        dataSettingsButton["SettingsPassiveGeolocation"] as Boolean
                    if (settingsPassiveGeolocation == true) {
                        //
                        //получаем настройки параметров интервала ГЕО локации
                        val settingsPassiveGeolocationInterval =
                            dataSettingsButton["SettingsPassiveGeolocationInterval"] as String?
                        val delimeter = " "
                        settingsPassiveGeolocationIntervalSecondsFigure =
                            settingsPassiveGeolocationInterval!!.split(delimeter.toRegex())
                                .toTypedArray()[0]
                        val settingsPassiveGeolocationIntervalFigureTime =
                            settingsPassiveGeolocationInterval.split(delimeter.toRegex())
                                .toTypedArray()[1]
                        val settingsPassiveGeolocationIntervalSecondsLong =
                            settingsPassiveGeolocationIntervalSecondsFigure!!.toLong()
                        if (settingsPassiveGeolocationIntervalFigureTime == "minutes") {
                            val settingsPassiveGeolocationIntervalMinutesLong =
                                settingsPassiveGeolocationIntervalSecondsLong * 60
                            settingsPassiveGeolocationIntervalSecondsFigure =
                                java.lang.Long.toString(
                                    settingsPassiveGeolocationIntervalMinutesLong
                                )
                        }
                        //запускае первую фиксацию местоположения
                        val settingsPassiveGeolocationCaptureEventOnClick =
                            dataSettingsButton["SettingsPassiveGeolocationCaptureEventOnClick"] as Boolean
                        if (settingsPassiveGeolocationCaptureEventOnClick == true) {
                            currentLocationGEO
                        }
                        //запускаем интервал фиксации местоположения
                        WaitingForTheQuestionOfPassiveGeolocationInterval()
                    }
                }
            }
        }
    }

    // ----запуск ожидания окна активного контроля-----
    private fun WaitingForTheQuestionOfActiveControl() {
        //метод ожидания времени запуска
        val myData = Data.Builder()
            .putString("Interval_SECONDS", settingsActiveIntervalMinutesFigure)
            .build()
        mRequest =
            OneTimeWorkRequest.Builder(NotificationWorker::class.java).setInputData(myData).build()
        WorkManager.getInstance().enqueue(mRequest!!)
        //проверка статуса
        mWorkManager!!.getWorkInfoByIdLiveData(mRequest!!.id)
            .observe(this@UserProcessActivity) { workInfo ->
                if (workInfo != null) {
                    val state = workInfo.state
                    if (state == WorkInfo.State.SUCCEEDED) {
                        //подаем звуковой сигнал
                        if (settingsActiveSignal == true) {
                            val mPlay = soundPool!!.play(soundId, 1f, 1f, 1, 0, 1f)
                        }
                        //открываем диалоговое окно
                        settingsActiveTransitionControl = "no forward"
                        val builder = AlertDialog.Builder(this@UserProcessActivity)
                        builder.setTitle("Attention!")
                            .setMessage("You are in the process of $NameDocProcessButton") // .setIcon(R.drawable.ic_android_cat)
                            .setCancelable(false)
                            .setNegativeButton(
                                "ОК"
                            ) { dialog, id ->
                                println("нажали ОК")
                                WaitingForTheQuestionOfActiveControl()
                                settingsActiveTransitionControl = "forward"
                                dialog.cancel()
                            }
                        val alert = builder.create()
                        alert.show()

                        //закрытие диалогового окна по таймеру
                        object : CountDownTimer(settingsActiveDurationSecondsLong1000, 1000) {
                            override fun onTick(millisUntilFinished: Long) {
                                // TODO Auto-generated method stub
                                //  mTimer.setText("Осталось: "
                                //          + millisUntilFinished / 1000);
                                println("запускаем космонавта")
                            }

                            override fun onFinish() {
                                // TODO Auto-generated method stub
                                // проверяем необходимость запуска нужной кнопки
                                if (settingsActiveTransitionControl !== "forward") {
                                    ButtonActivationByBackgroundTask(settingsActiveTransition)
                                }

                                // закрываем диалоговое окно
                                alert.dismiss()
                            }
                        }.start()
                        // включаем вибро на телефоне
                        val vibrator = getSystemService(VIBRATOR_SERVICE) as Vibrator
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            vibrator.vibrate(
                                VibrationEffect.createOneShot(
                                    500,
                                    VibrationEffect.DEFAULT_AMPLITUDE
                                )
                            )
                        } else {
                            vibrator.vibrate(500)
                        }
                    }
                }
            }
    }

    // ------активация кнопки фоновым (программно) заданием------
    private fun ButtonActivationByBackgroundTask(settingsActiveTransitionTransferTo: String?) {
        //
        var settingsActiveTransitionTransferGo = settingsActiveTransitionTransferTo
        var buttonActivationMethod = ""
        if (settingsActiveTransitionTransferTo == "No button") {
            settingsActiveTransitionTransferGo = "Gone"
            buttonActivationMethod = "Programmatically"
        }
        val activeButtonControl = activeButton
        if (activeButton != null) {
            //получаем текущую активную кнопку и закрываем активный докумен
            val idDocActivButtonUserFinalTrans = idDocActivButtonUser
            //изменяем цвет текущей активной кнопки
            activeButton!!.setBackgroundColor(resources.getColor(R.color.colorFonButton))
            for (h in PositionSettingsMap) {
                val idButton = h!!.idButton
                if (activButtonId == idButton) {
                    val idSettingsButton = h.idSettingsButton
                    val dataSettingsButton: Map<*, *>? = h.dataSettingsButton
                    NameDocProcessButton = dataSettingsButton!!["SettingsTitle"] as String?
                    val settingsActiveControl =
                        dataSettingsButton["SettingsActiveControl"] as Boolean
                    if (settingsActiveControl == true) {
                        // удаляем фоновое задание по ID
                        if (mRequest != null) {
                            mWorkManager!!.enqueue(mRequest!!)
                            mWorkManager!!.cancelWorkById(mRequest!!.id)
                        }
                    }
                    //
                    val settingsPassiveControl =
                        dataSettingsButton["SettingsPassiveControl"] as Boolean
                    if (settingsPassiveControl == true) {
                        val settingsPassiveAudio =
                            dataSettingsButton["SettingsPassiveAudio"] as Boolean
                        if (settingsPassiveAudio == true) {
                            stopRecordingAudio()
                        }
                        val settingsPassivePhoto =
                            dataSettingsButton["SettingsPassivePhoto"] as Boolean
                        if (settingsPassivePhoto == true) {
                            // очищаем список фоновых задач с тегом "workmng"
                            if (mRequestPassivePhotoInterval != null) {
                                mWorkManager!!.enqueue(mRequestPassivePhotoInterval!!)
                                mWorkManager!!.cancelWorkById(mRequestPassivePhotoInterval!!.id)
                            }
                        }
                        val settingsPassiveVideo =
                            dataSettingsButton["SettingsPassiveVideo"] as Boolean
                        if (settingsPassiveVideo == true) {
                            //
                        }
                        val settingsPassiveGeolocation =
                            dataSettingsButton["SettingsPassiveGeolocation"] as Boolean
                        if (settingsPassiveGeolocation == true) {
                            // очищаем список фоновых задач с тегом "workmng"
                            if (mRequestPassiveGeolocationInterval != null) {
                                mWorkManager!!.enqueue(mRequestPassiveGeolocationInterval!!)
                                mWorkManager!!.cancelWorkById(mRequestPassiveGeolocationInterval!!.id)
                            }
                        }
                    }
                    val settingsCommitDescription =
                        dataSettingsButton["SettingsCommitDescription"] as Boolean
                    if (settingsCommitDescription == true) { // создаем всплывающее окно
                    }
                    val settingsResultCapture =
                        dataSettingsButton["SettingsResultCapture"] as Boolean
                    if (settingsResultCapture == true) {  //фиксируем результат исполнения процесса из предложенного варианта
                    }
                }
            }
            // Закрываем документ активного процесса
            val washingtonRef = db!!.collection("WorkShift").document(
                activShiftDocId!!
            )
            val docRef = db!!.collection("WorkShift").document(
                activShiftDocId!!
            )
            val washingtonRefProcessUser = washingtonRef.collection("ProcessUser").document(
                idDocActivButtonUserFinalTrans!!
            )
            washingtonRefProcessUser
                .update("ProcessUserEnd", "false")
                .addOnSuccessListener(object : OnSuccessListener<Void?> {
                    override fun onSuccess(aVoid: Void?) {
                        Log.d(TAG, "DocumentSnapshot successfully updated!")
                    }
                })
                .addOnFailureListener { e -> Log.w(TAG, "Error updating document", e) }
            val docRefProcessUser = docRef.collection("ProcessUser").document(
                idDocActivButtonUserFinalTrans
            )
            val updatesProcessUser: MutableMap<String, Any> = HashMap()
            updatesProcessUser["ProcessUserEndTime"] = FieldValue.serverTimestamp()
            docRefProcessUser.update(updatesProcessUser).addOnCompleteListener // [START_EXCLUDE]
            // [START_EXCLUDE]
            { }
        }
        // устанавливаем агресивный цвет фона активной кнопки
        for (h in PositionSettingsMap) {
            val dataSettingsButtonFor: Map<*, *>? = h!!.dataSettingsButton
            val NameDocProcessButtonFor = dataSettingsButtonFor!!["SettingsTitle"] as String?
            if (settingsActiveTransitionTransferGo == NameDocProcessButtonFor) {
                activButtonId = h.idButton
                val idSettingsButton = h.idSettingsButton
                for (s in ButtonMap) {
                    val id = s!!.id
                    if (id == activButtonId) {
                        s.setBackgroundColor(resources.getColor(R.color.colorFonActiviButton))
                        activeButton = s
                    }
                }
                NameDocProcessButton = dataSettingsButtonFor["SettingsTitle"] as String?
                //активизируем процесс по нажатию кнопки
                if (activeButtonControl != null) {
                    val dataProcessUser: MutableMap<String, Any?> = HashMap()
                    dataProcessUser["ButtonActivationMethod"] = buttonActivationMethod
                    dataProcessUser["EmailPositionUser"] = userNameEmail
                    dataProcessUser["IdDocPosition"] = idPosition
                    dataProcessUser["IdDocProcessButton"] = idSettingsButton
                    dataProcessUser["NameDocProcessButton"] = NameDocProcessButton
                    dataProcessUser["ParentHierarchyPositionUser"] = parentHierarchyPositionUserMap
                    dataProcessUser["ProcessUserEnd"] = ""
                    dataProcessUser["ProcessUserStartTime"] = FieldValue.serverTimestamp()
                    val washingtonRef = db!!.collection("WorkShift").document(
                        activShiftDocId!!
                    )
                    washingtonRef.collection("ProcessUser")
                        .add(dataProcessUser)
                        .addOnSuccessListener { documentReference ->
                            Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.id)
                            idDocActivButtonUser = documentReference.id
                        }
                        .addOnFailureListener { e -> Log.w(TAG, "Error adding document", e) }
                }
                // получаем настройки для новой активной кнопки
                val settingsActiveControl =
                    dataSettingsButtonFor["SettingsActiveControl"] as Boolean
                if (settingsActiveControl == true) {
                    //получаем настройки параметров активного контроля
                    val settingsActiveDurationSeconds =
                        dataSettingsButtonFor["SettingsActiveDurationSeconds"] as String?
                    val delimeter = " "
                    val settingsActiveDurationSecondsFigure =
                        settingsActiveDurationSeconds!!.split(delimeter.toRegex()).toTypedArray()[0]
                    val settingsActiveDurationSecondsFigureTime =
                        settingsActiveDurationSeconds.split(delimeter.toRegex()).toTypedArray()[1]
                    var settingsActiveDurationSecondsLong =
                        settingsActiveDurationSecondsFigure.toLong()
                    if (settingsActiveDurationSecondsFigureTime == "minutes") {
                        settingsActiveDurationSecondsLong = settingsActiveDurationSecondsLong * 60
                    }
                    settingsActiveDurationSecondsLong1000 = settingsActiveDurationSecondsLong * 1000
                    val settingsActiveIntervalMinutes =
                        dataSettingsButtonFor["SettingsActiveIntervalMinutes"] as String?
                    settingsActiveIntervalMinutesFigure =
                        settingsActiveIntervalMinutes!!.split(delimeter.toRegex()).toTypedArray()[0]
                    val settingsActiveIntervalMinutesFigureTime =
                        settingsActiveIntervalMinutes.split(delimeter.toRegex()).toTypedArray()[1]
                    var settingsActiveIntervalMinutesFigureLong =
                        settingsActiveIntervalMinutesFigure!!.toLong()
                    if (settingsActiveIntervalMinutesFigureTime == "minutes") {
                        settingsActiveIntervalMinutesFigureLong =
                            settingsActiveIntervalMinutesFigureLong * 60
                        settingsActiveIntervalMinutesFigure =
                            java.lang.Long.toString(settingsActiveIntervalMinutesFigureLong)
                    }
                    settingsActiveSignal = dataSettingsButtonFor["SettingsActiveSignal"] as Boolean
                    settingsActiveTransition =
                        dataSettingsButtonFor["SettingsActiveTransition"] as String?
                    //метод ожидания времени запуска
                    WaitingForTheQuestionOfActiveControl()
                    // вибро звонок
                    val vibrator = getSystemService(VIBRATOR_SERVICE) as Vibrator
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        vibrator.vibrate(
                            VibrationEffect.createOneShot(
                                500,
                                VibrationEffect.DEFAULT_AMPLITUDE
                            )
                        )
                    } else {
                        vibrator.vibrate(500)
                    }
                }
                //
                val settingsPassiveControl =
                    dataSettingsButtonFor["SettingsPassiveControl"] as Boolean
                if (settingsPassiveControl == true) {
                    val settingsPassiveAudio =
                        dataSettingsButtonFor["SettingsPassiveAudio"] as Boolean
                    if (settingsPassiveAudio == true) {
                        startRecordingAudio()
                    }
                    val settingsPassivePhoto =
                        dataSettingsButtonFor["SettingsPassivePhoto"] as Boolean
                    if (settingsPassivePhoto == true) {
                        //получаем настройки параметров интервала Фото фиксации
                        val settingsPassivePhotoInterval =
                            dataSettingsButtonFor["SettingsPassivePhotoInterval"] as String?
                        val delimeter = " "
                        settingsPassivePhotoIntervalSecondsFigure =
                            settingsPassivePhotoInterval!!.split(delimeter.toRegex())
                                .toTypedArray()[0]
                        val settingsPassivePhotoIntervalFigureTime =
                            settingsPassivePhotoInterval.split(delimeter.toRegex())
                                .toTypedArray()[1]
                        val settingsPassivePhotoIntervalSecondsLong =
                            settingsPassivePhotoIntervalSecondsFigure!!.toLong()
                        if (settingsPassivePhotoIntervalFigureTime == "minutes") {
                            val settingsPassivePhotoIntervalMinutesLong =
                                settingsPassivePhotoIntervalSecondsLong * 60
                            settingsPassivePhotoIntervalSecondsFigure =
                                java.lang.Long.toString(settingsPassivePhotoIntervalMinutesLong)
                        }
                        val settingsPassivePhotoSmartphoneCamera =
                            dataSettingsButtonFor["SettingsPassivePhotoSmartphoneCamera"] as Boolean
                        val settingsPassivePhotoCameraIP =
                            dataSettingsButtonFor["SettingsPassivePhotoCameraIP"] as Boolean
                        val settingsPassivePhotoCaptureEventOnClick =
                            dataSettingsButtonFor["SettingsPassivePhotoCaptureEventOnClick"] as Boolean
                        if (settingsPassivePhotoCaptureEventOnClick == true) {
                            //запускае первую фото фиксацию камеры со смарфона
                            if (settingsPassivePhotoSmartphoneCamera == true) {
                                //запускаем фото фиксацию камеры со смарфона
                                dispatchTakePictureIntentSmartphoneCamera()
                            }
                            if (settingsPassivePhotoCameraIP == true) {
                                //запускае первую фото фиксацию с камеры IP
                                dispatchTakePictureIntentCameraIP(idDocActivButtonUser)
                            }
                        }
                        //запускаем интервал фиксации местоположения
                        WaitingForTheQuestionOfPassivePhotoInterval(
                            settingsPassivePhotoSmartphoneCamera,
                            settingsPassivePhotoCameraIP
                        )
                        // if (settingsPassivePhotoSmartphoneCamera == true) {
                        //запускаем фото фиксацию камеры со смарфона
                        //    dispatchTakePictureIntentSmartphoneCamera();
                        // }
                        // if(settingsPassivePhotoCameraIP == true){
                        //запускае первую фото фиксацию с камеры IP
                        //     dispatchTakePictureIntentCameraIP(idDocActivButtonUser);
                        // }
                    }
                    val settingsPassiveVideo =
                        dataSettingsButtonFor["SettingsPassiveVideo"] as Boolean
                    if (settingsPassiveVideo == true) {
                        //
                    }
                    val settingsPassiveGeolocation =
                        dataSettingsButtonFor["SettingsPassiveGeolocation"] as Boolean
                    if (settingsPassiveGeolocation == true) {
                        //
                        //получаем настройки параметров интервала ГЕО локации
                        val settingsPassiveGeolocationInterval =
                            dataSettingsButtonFor["SettingsPassiveGeolocationInterval"] as String?
                        val delimeter = " "
                        settingsPassiveGeolocationIntervalSecondsFigure =
                            settingsPassiveGeolocationInterval!!.split(delimeter.toRegex())
                                .toTypedArray()[0]
                        val settingsPassiveGeolocationIntervalFigureTime =
                            settingsPassiveGeolocationInterval.split(delimeter.toRegex())
                                .toTypedArray()[1]
                        val settingsPassiveGeolocationIntervalSecondsLong =
                            settingsPassiveGeolocationIntervalSecondsFigure!!.toLong()
                        if (settingsPassiveGeolocationIntervalFigureTime == "minutes") {
                            val settingsPassiveGeolocationIntervalMinutesLong =
                                settingsPassiveGeolocationIntervalSecondsLong * 60
                            settingsPassiveGeolocationIntervalSecondsFigure =
                                java.lang.Long.toString(
                                    settingsPassiveGeolocationIntervalMinutesLong
                                )
                        }
                        //запускае первую фиксацию местоположения SettingsPassiveGeolocationCaptureEventOnClick
                        val settingsPassiveGeolocationCaptureEventOnClick =
                            dataSettingsButtonFor["SettingsPassiveGeolocationCaptureEventOnClick"] as Boolean
                        if (settingsPassiveGeolocationCaptureEventOnClick == true) {
                            currentLocationGEO
                        }
                        //запускаем интервал фиксации местоположения
                        WaitingForTheQuestionOfPassiveGeolocationInterval()
                    }
                }
            }
        }
    }

    // разрешение для доступа к микрофону и работы с файлами
    private fun requestPermission() {
        ActivityCompat.requestPermissions(
            this@UserProcessActivity,
            arrayOf(permission.RECORD_AUDIO, permission.ACCESS_FINE_LOCATION, permission.CAMERA),
            RequestPermissionCode
        )
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>, grantResults: IntArray
    ) {
        when (requestCode) {
            RequestPermissionCode -> if (grantResults.size > 0) {
                val RecordPermission = grantResults[0] ==
                        PackageManager.PERMISSION_GRANTED
                val LocationPermission = grantResults[1] ==
                        PackageManager.PERMISSION_GRANTED
                val CameraPermission = grantResults[2] ==
                        PackageManager.PERMISSION_GRANTED
                if (RecordPermission && LocationPermission && CameraPermission) {
                    Toast.makeText(
                        this@UserProcessActivity, "Permission Granted",
                        Toast.LENGTH_LONG
                    ).show()
                } else {
                    Toast.makeText(this@UserProcessActivity, "Permission Denied", Toast.LENGTH_LONG)
                        .show()
                }
            }
        }
    }

    fun checkPermission(): Boolean {
        val result = ContextCompat.checkSelfPermission(
            applicationContext,
            permission.RECORD_AUDIO
        )
        val result1 = ContextCompat.checkSelfPermission(
            applicationContext,
            permission.ACCESS_FINE_LOCATION
        )
        val result2 = ContextCompat.checkSelfPermission(
            applicationContext,
            permission.CAMERA
        )
        return  //result == PackageManager.PERMISSION_GRANTED &&
        result == PackageManager.PERMISSION_GRANTED && result1 == PackageManager.PERMISSION_GRANTED && result2 == PackageManager.PERMISSION_GRANTED
    }

    fun CreateRandomAudioFileName(string: Int): String {
        val stringBuilder = StringBuilder(string)
        var i = 0
        while (i < string) {
            stringBuilder.append(RandomAudioFileName[random!!.nextInt(RandomAudioFileName.length)])
            i++
        }
        return stringBuilder.toString()
    }

    // запись аудио и создание Media Recorder
    protected fun startRecordingAudio() {
        if (checkPermission()) {
            fileName =
                externalCacheDir!!.absolutePath + "/audiorecord_" + idDocActivButtonUser + ".m4a"
            recorder = MediaRecorder()
            recorder!!.setAudioSource(MediaRecorder.AudioSource.MIC)
            recorder!!.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            recorder!!.setOutputFile(fileName)
            recorder!!.setAudioEncoder(MediaRecorder.AudioEncoder.AAC_ELD)
            try {
                recorder!!.prepare()
                recorder!!.start()
            } catch (e: IllegalStateException) {
                // TODO Auto-generated catch block
                e.printStackTrace()
            } catch (e: IOException) {
                // TODO Auto-generated catch block
                e.printStackTrace()
            }
            Toast.makeText(
                this@UserProcessActivity, "Recording started",
                Toast.LENGTH_LONG
            ).show()
        } else {
            requestPermission()
        }
    }

    // стоп аудио
    private fun stopRecordingAudio() {
        recorder!!.stop()
        recorder!!.reset()
        recorder!!.release()
        recorder = null
        // File or Blob
        // Файл или Blob
        val file = Uri.fromFile(File(fileName))
        // Create the file metadata
        // Создаем метаданные файла
        val metadata = StorageMetadata.Builder()
            .setContentType("audio/.mp4")
            .build()
        // Upload file and metadata to the path 'images/mountains.jpg'
        // Загрузить файл и метаданные по пути images / mountains.jpg'
        val uploadTask = storageRef!!.child("AudioRecordingOfEvents/" + file.lastPathSegment)
            .putFile(file, metadata)
        // Listen for state changes, errors, and completion of the upload.
        // Слушаем изменения состояния, ошибки и завершение загрузки
        uploadTask.addOnProgressListener { taskSnapshot ->
            val progress = 100.0 * taskSnapshot.bytesTransferred / taskSnapshot.totalByteCount
            Log.d(TAG, "Upload is $progress% done")
        }.addOnPausedListener(object : OnPausedListener<UploadTask.TaskSnapshot?> {
            override fun onPaused(taskSnapshot: UploadTask.TaskSnapshot?) {
                Log.d(TAG, "Upload is paused")
            }
        }).addOnFailureListener {
            // Handle unsuccessful uploads
        }.addOnSuccessListener(object : OnSuccessListener<UploadTask.TaskSnapshot?> {
            override fun onSuccess(taskSnapshot: UploadTask.TaskSnapshot?) {
                // Handle successful uploads on complete
                // Обработка успешных загрузок по завершении
                // ...
                val fileDelete = File(fileName)
                if (fileDelete.delete()) {
                    println("File deleted!")
                } else println("File not found!")
            }
        })
    }

    // ----запуск ожидания PassiveGeolocationInterval-----
    private fun WaitingForTheQuestionOfPassiveGeolocationInterval() {
        //метод ожидания времени запуска
        val myDataGeolocationInterval = Data.Builder()
            .putString("Interval_SECONDS", settingsPassiveGeolocationIntervalSecondsFigure)
            .build()
        mRequestPassiveGeolocationInterval =
            OneTimeWorkRequest.Builder(NotificationWorker::class.java)
                .setInputData(myDataGeolocationInterval).build()
        WorkManager.getInstance().enqueue(mRequestPassiveGeolocationInterval!!)
        //проверка статуса
        mWorkManager!!.getWorkInfoByIdLiveData(mRequestPassiveGeolocationInterval!!.id)
            .observe(this@UserProcessActivity) { workInfo ->
                if (workInfo != null) {
                    val state = workInfo.state
                    if (state == WorkInfo.State.SUCCEEDED) {
                        //подаем звуковой сигнал
                        currentLocationGEO
                    }
                }
            }
    }// Logic to handle location object

    // Add a new document with a generated id.
// Got last known location. In some rare situations this can be null.
    // получаем данные для геолокация
    val currentLocationGEO: Unit
        get() {
            if (checkPermission()) {
                fusedLocationClient =
                    LocationServices.getFusedLocationProviderClient(this@UserProcessActivity)
                fusedLocationClient!!.lastLocation
                    .addOnSuccessListener(
                        this@UserProcessActivity,
                        object : OnSuccessListener<Location?> {
                            override fun onSuccess(location: Location?) {
                                // Got last known location. In some rare situations this can be null.
                                if (location != null) {
                                    // Logic to handle location object
                                    val latitude = location.latitude
                                    val longitude = location.longitude
                                    val locationCoordinates = GeoPoint(latitude, longitude)
                                    // Add a new document with a generated id.
                                    val data: MutableMap<String, Any?> = HashMap()
                                    data["IdDocActivButtonUser"] = idDocActivButtonUser
                                    data["LocationCoordinates"] = locationCoordinates
                                    data["CheckInTimeLocationCoordinates"] =
                                        FieldValue.serverTimestamp()
                                    db!!.collection("CurrentLocation")
                                        .add(data)
                                        .addOnSuccessListener { documentReference ->
                                            Log.d(
                                                TAG,
                                                "DocumentSnapshot written with ID: " + documentReference.id
                                            )
                                        }
                                        .addOnFailureListener { e ->
                                            Log.w(
                                                TAG,
                                                "Error adding document",
                                                e
                                            )
                                        }
                                }
                            }
                        })
                return
            } else {
                requestPermission()
            }
        }

    //создаем адрес и название файла фото фиксации c камеры смартфона
    @Throws(IOException::class)
    private fun createImageFile(): File {
        // Create an image file name
        // Создаем имя файла изображения
        val timeStamp =
            SimpleDateFormat("yyyyMMdd_HHmmss").format(Date())
        val imageFileName = "Foto_" + idDocActivButtonUser + "_" + timeStamp + "_"
        val storageDir =
            getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        //File storageDir = getExternalCacheDir();
        // Save a file: path for use with ACTION_VIEW intents
        // Сохраняем файл: путь для использования с намерениями ACTION_VIEW
        //   currentPhotoPath = image.getAbsolutePath();
        return File.createTempFile(
            imageFileName,  /* prefix */
            ".jpg",  /* suffix */
            storageDir /* directory */
        )
    }

    //
    private fun dispatchTakePictureIntentSmartphoneCamera() {
        // Create the File where the photo should go
        // Создаем файл, в котором должно быть фото
        var photoFile: File? = null
        try {
            photoFile = createImageFile()
        } catch (ex: IOException) {
            // Error occurred while creating the File
            // Ошибка при создании файла
            println("Photo file not created!")
        }
        // Continue only if the File was successfully created
        // Продолжаем, только если файл был успешно создан
        if (photoFile != null) {
            println("Photo file add!")
            startFoto(photoFile)
        }
    }

    ////////////////////////////
    fun startFoto(photoFile: File) {
        // делаем фото
        //cameraProvider.bindToLifecycle((LifecycleOwner)this, cameraSelector, imageCapture, imageAnalysis, preview);
        //сохраняем фото в файл
        val outputFileOptionsBuilder = ImageCapture.OutputFileOptions.Builder(photoFile)
        imageCapture!!.takePicture(
            outputFileOptionsBuilder.build(),
            { obj: Runnable -> obj.run() },
            object : ImageCapture.OnImageSavedCallback {
                override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
                    //ggg();
                    val params = Bundle()
                    params.putString("FILE_PATH", photoFile.path)
                    // подготовка к удалению файла
                    val file = Uri.fromFile(File(photoFile.toString()))
                    // Create the file metadata
                    // Создаем метаданные файла
                    val metadata = StorageMetadata.Builder()
                        .setContentType("foto/.jpg")
                        .build()
                    // Upload file and metadata to the path 'images/mountains.jpg'
                    // Загрузить файл и метаданные по пути images / mountains.jpg'
                    val uploadTask = storageRef!!.child("FotoOfEvents/" + file.lastPathSegment)
                        .putFile(file, metadata)
                    // Listen for state changes, errors, and completion of the upload.
                    // Слушаем изменения состояния, ошибки и завершение загрузки
                    uploadTask.addOnProgressListener { taskSnapshot ->
                        val progress =
                            100.0 * taskSnapshot.bytesTransferred / taskSnapshot.totalByteCount
                        Log.d(TAG, "Upload is $progress% done")
                    }.addOnPausedListener(object : OnPausedListener<UploadTask.TaskSnapshot?> {
                        override fun onPaused(taskSnapshot: UploadTask.TaskSnapshot?) {
                            Log.d(TAG, "Upload is paused")
                        }
                    }).addOnFailureListener {
                        // Handle unsuccessful uploads
                    }.addOnSuccessListener(object : OnSuccessListener<UploadTask.TaskSnapshot?> {
                        override fun onSuccess(taskSnapshot: UploadTask.TaskSnapshot?) {
                            // Handle successful uploads on complete
                            // Обработка успешных загрузок по завершении
                            val fileDelete = File(photoFile.toString())
                            if (fileDelete.delete()) {
                                println("File deleted!")
                            } else println("File not found!")
                        }
                    })
                }

                override fun onError(exception: ImageCaptureException) {
                    exception.printStackTrace()
                }
            })
    }

    // ----запуск ожидания PassivePhotoInterval-----
    private fun WaitingForTheQuestionOfPassivePhotoInterval(
        settingsPassivePhotoSmartphoneCamera: Boolean,
        settingsPassivePhotoCameraIP: Boolean
    ) {
        //метод ожидания времени запуска
        val myDataPassivePhotoInterval = Data.Builder()
            .putString("Interval_SECONDS", settingsPassivePhotoIntervalSecondsFigure)
            .build()
        mRequestPassivePhotoInterval = OneTimeWorkRequest.Builder(NotificationWorker::class.java)
            .setInputData(myDataPassivePhotoInterval).build()
        WorkManager.getInstance().enqueue(mRequestPassivePhotoInterval!!)
        //проверка статуса
        mWorkManager!!.getWorkInfoByIdLiveData(mRequestPassivePhotoInterval!!.id)
            .observe(this@UserProcessActivity) { workInfo ->
                if (workInfo != null) {
                    val state = workInfo.state
                    if (state == WorkInfo.State.SUCCEEDED) {
                        //запускаем интервал фиксации местоположения
                        WaitingForTheQuestionOfPassivePhotoInterval(
                            settingsPassivePhotoSmartphoneCamera,
                            settingsPassivePhotoCameraIP
                        )
                        if (settingsPassivePhotoSmartphoneCamera == true) {
                            //запускаем фото фиксацию камеры со смарфона
                            dispatchTakePictureIntentSmartphoneCamera()
                        }
                        if (settingsPassivePhotoCameraIP == true) {
                            //запускае первую фото фиксацию с камеры IP
                            dispatchTakePictureIntentCameraIP(idDocActivButtonUser)
                        }
                    }
                }
            }
    }

    //создаем адрес и название файла фото фиксации c камеры IP
    private fun dispatchTakePictureIntentCameraIP(text: String?): Task<String> {  //Отправляем и получаем обработанные данные с сервера списком в каких должностях принимает участие пользователь
        val data: MutableMap<String, Any?> = HashMap()
        data["text"] = text
        data["push"] = true
        return mFunctions
            .getHttpsCallable("addDispatchTakePictureIntentCameraIP")
            .call(data)
            .continueWith(Continuation { task -> // This continuation runs on either success or failure, but if the task
                // has failed then getResult() will throw an Exception which will be
                // propagated down.
                // Это продолжение выполняется при успехе или неудаче, но если задача
                // не удалось, тогда getResult () выдаст исключение, которое будет
                // распространились вниз.
                val rezult = task.result.data as HashMap<*, *>?
                val functionResult = rezult!!["text"] as String?
                //задержка
                Thread.sleep(10000)
                functionResult
            })
    }

    //обработка выбора в верхнем меню
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Операции для выбранного пункта меню
        return when (item.itemId) {
            R.id.note_traffic -> {
                noteTraffic()
                true
            }
            R.id.note_text -> {
                noteText()
                true
            }
            R.id.note_list -> {
                noteList()
                true
            }
            R.id.note_foto -> {
                noteFoto()
                true
            }
            R.id.note_audio -> {
                noteAudio()
                true
            }
            R.id.note_geo -> {
                noteGEO()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    fun noteTraffic() {
        if (PositionSettingsNoteTrafficMap != null) {
            val builder = AlertDialog.Builder(this@UserProcessActivity)
            builder.setTitle("Select traffic source")
            val settings_array_note_traffic: MutableList<String?> = ArrayList()
            val settingsNoteTrafficOption1 =
                PositionSettingsNoteTrafficMap!!["SettingsNoteTrafficOption1"] as String?
            if (settingsNoteTrafficOption1 !== "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption1)
            }
            val settingsNoteTrafficOption2 =
                PositionSettingsNoteTrafficMap!!["SettingsNoteTrafficOption2"] as String?
            if (settingsNoteTrafficOption2 !== "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption2)
            }
            val settingsNoteTrafficOption3 =
                PositionSettingsNoteTrafficMap!!["SettingsNoteTrafficOption3"] as String?
            if (settingsNoteTrafficOption3 !== "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption3)
            }
            val settingsNoteTrafficOption4 =
                PositionSettingsNoteTrafficMap!!["SettingsNoteTrafficOption4"] as String?
            if (settingsNoteTrafficOption4 !== "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption4)
            }
            val settingsNoteTrafficOption5 =
                PositionSettingsNoteTrafficMap!!["SettingsNoteTrafficOption5"] as String?
            if (settingsNoteTrafficOption5 !== "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption5)
            }
            val settingsNoteTrafficOption6 =
                PositionSettingsNoteTrafficMap!!["SettingsNoteTrafficOption6"] as String?
            if (settingsNoteTrafficOption6 !== "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption6)
            }
            val settingsNoteTrafficOption7 =
                PositionSettingsNoteTrafficMap!!["SettingsNoteTrafficOption7"] as String?
            if (settingsNoteTrafficOption7 !== "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption7)
            }
            val settingsNoteTrafficOption8 =
                PositionSettingsNoteTrafficMap!!["SettingsNoteTrafficOption8"] as String?
            if (settingsNoteTrafficOption8 !== "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption8)
            }
            val settingsNoteTrafficOption9 =
                PositionSettingsNoteTrafficMap!!["SettingsNoteTrafficOption9"] as String?
            if (settingsNoteTrafficOption9 !== "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption9)
            }
            val settingsNoteTrafficOption10 =
                PositionSettingsNoteTrafficMap!!["SettingsNoteTrafficOption10"] as String?
            if (settingsNoteTrafficOption10 !== "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption10)
            }
            if (settings_array_note_traffic.size != 0) {
                val dataAdapter = ArrayAdapter(
                    this@UserProcessActivity,
                    android.R.layout.simple_dropdown_item_1line, settings_array_note_traffic
                )
                builder.setAdapter(dataAdapter) { dialog, which ->
                    Toast.makeText(
                        this@UserProcessActivity,
                        "You have selected " + settings_array_note_traffic[which],
                        Toast.LENGTH_LONG
                    ).show()
                    val resultControlButton = settings_array_note_traffic[which]
                    //добавляем документ
                    // Add a new document with a generated id.
                    val data: MutableMap<String, Any?> = HashMap()
                    data["NoteSource"] = "note_traffic"
                    data["NoteParent"] = idDocActivButtonUser
                    data["NoteTime"] = FieldValue.serverTimestamp()
                    data["NoteText"] = resultControlButton
                    data["NoteUser"] = userNameEmail
                    data["NoteStatus"] = "false"
                    data["NoteComment"] = ""
                    data["NoteParentName"] = NameDocProcessButton
                    data["NoteIdDocPosition"] = idPosition
                    db!!.collection("Note")
                        .add(data)
                        .addOnSuccessListener { documentReference ->
                            Log.d(
                                TAG,
                                "DocumentSnapshot written with ID: " + documentReference.id
                            )
                        }
                        .addOnFailureListener { e -> Log.w(TAG, "Error adding document", e) }
                }
                val dialog = builder.create()
                dialog.show()
            }
        }
    }

    //диалоговое окно для текстовой заметки
    fun noteText() {  //открываем окно для заметки
        val li = LayoutInflater.from(context)
        val promptsView = li.inflate(R.layout.prompt, null)
        val builder = AlertDialog.Builder(this@UserProcessActivity)
        builder.setView(promptsView)
        val userInput = promptsView.findViewById<View>(R.id.input_text) as EditText
        builder.setTitle("Write a note")
            .setCancelable(false)
            .setPositiveButton(
                "OK"
            ) { dialog, id -> //получаем текст комментария
                val noteText = userInput.text.toString()
                //создаем документ
                // Add a new document with a generated id.
                val data: MutableMap<String, Any?> = HashMap()
                data["NoteSource"] = "note_text"
                data["NoteParent"] = idDocActivButtonUser
                data["NoteTime"] = FieldValue.serverTimestamp()
                data["NoteText"] = noteText
                data["NoteUser"] = userNameEmail
                data["NoteStatus"] = ""
                data["NoteComment"] = ""
                data["NoteParentName"] = NameDocProcessButton
                data["NoteIdDocPosition"] = idPosition
                db!!.collection("Note")
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

    fun noteList() {
        if (PositionSettingsNoteListMap != null) {
            val builder = AlertDialog.Builder(this@UserProcessActivity)
            builder.setTitle("Select note")
            val settings_array_note_list: MutableList<String?> = ArrayList()
            val settingsNoteListOption1 =
                PositionSettingsNoteListMap!!["SettingsNoteListOption1"] as String?
            if (settingsNoteListOption1 !== "") {
                settings_array_note_list.add(settingsNoteListOption1)
            }
            val settingsNoteListOption2 =
                PositionSettingsNoteListMap!!["SettingsNoteListOption2"] as String?
            if (settingsNoteListOption2 !== "") {
                settings_array_note_list.add(settingsNoteListOption2)
            }
            val settingsNoteListOption3 =
                PositionSettingsNoteListMap!!["SettingsNoteListOption3"] as String?
            if (settingsNoteListOption3 !== "") {
                settings_array_note_list.add(settingsNoteListOption3)
            }
            val settingsNoteListOption4 =
                PositionSettingsNoteListMap!!["SettingsNoteListOption4"] as String?
            if (settingsNoteListOption4 !== "") {
                settings_array_note_list.add(settingsNoteListOption4)
            }
            val settingsNoteListOption5 =
                PositionSettingsNoteListMap!!["SettingsNoteListOption5"] as String?
            if (settingsNoteListOption5 !== "") {
                settings_array_note_list.add(settingsNoteListOption5)
            }
            val settingsNoteListOption6 =
                PositionSettingsNoteListMap!!["SettingsNoteListOption6"] as String?
            if (settingsNoteListOption6 !== "") {
                settings_array_note_list.add(settingsNoteListOption6)
            }
            val settingsNoteListOption7 =
                PositionSettingsNoteListMap!!["SettingsNoteListOption7"] as String?
            if (settingsNoteListOption7 !== "") {
                settings_array_note_list.add(settingsNoteListOption7)
            }
            val settingsNoteListOption8 =
                PositionSettingsNoteListMap!!["SettingsNoteListOption8"] as String?
            if (settingsNoteListOption8 !== "") {
                settings_array_note_list.add(settingsNoteListOption8)
            }
            val settingsNoteListOption9 =
                PositionSettingsNoteListMap!!["SettingsNoteListOption9"] as String?
            if (settingsNoteListOption9 !== "") {
                settings_array_note_list.add(settingsNoteListOption9)
            }
            val settingsNoteListOption10 =
                PositionSettingsNoteListMap!!["SettingsNoteListOption10"] as String?
            if (settingsNoteListOption10 !== "") {
                settings_array_note_list.add(settingsNoteListOption10)
            }
            if (settings_array_note_list.size != 0) {
                val dataAdapter = ArrayAdapter(
                    this@UserProcessActivity,
                    android.R.layout.simple_dropdown_item_1line, settings_array_note_list
                )
                builder.setAdapter(dataAdapter) { dialog, which ->
                    Toast.makeText(
                        this@UserProcessActivity,
                        "You have selected " + settings_array_note_list[which],
                        Toast.LENGTH_LONG
                    ).show()
                    val resultControlButton = settings_array_note_list[which]
                    //добавляем документ
                    //создаем документ
                    // Add a new document with a generated id.
                    val data: MutableMap<String, Any?> = HashMap()
                    data["NoteSource"] = "note_list"
                    data["NoteParent"] = idDocActivButtonUser
                    data["NoteTime"] = FieldValue.serverTimestamp()
                    data["NoteText"] = resultControlButton
                    data["NoteUser"] = userNameEmail
                    data["NoteStatus"] = ""
                    data["NoteComment"] = ""
                    data["NoteParentName"] = NameDocProcessButton
                    data["NoteIdDocPosition"] = idPosition
                    db!!.collection("Note")
                        .add(data)
                        .addOnSuccessListener { documentReference ->
                            Log.d(
                                TAG,
                                "DocumentSnapshot written with ID: " + documentReference.id
                            )
                        }
                        .addOnFailureListener { e -> Log.w(TAG, "Error adding document", e) }
                }
                val dialog = builder.create()
                dialog.show()
            }
        }
    }

    //открываем экран для трансляции камеры
    fun noteFoto() {  // скрываем кнопки основного экрана и показываем для камеры
        linearLayoutButton!!.visibility = View.GONE
        buttonExpect!!.visibility = View.GONE
        buttonOther!!.visibility = View.GONE
        buttonGone!!.visibility = View.GONE
        containerPreviewView!!.visibility = View.VISIBLE
        buttonFoto!!.visibility = View.VISIBLE
        buttonFotoCansel!!.visibility = View.VISIBLE
    }

    //делаем Фото заметку
    fun buttonFotoOpen(view: View?) {
        // Создаем файл, в котором должно быть фото
        var photoFile: File? = null
        try {
            photoFile = createFotoNoteImageFile()
        } catch (ex: IOException) {
            // Error occurred while creating the File
            // Ошибка при создании файла
            println("Photo file not created!")
        }
        // Continue only if the File was successfully created
        // Продолжаем, только если файл был успешно создан
        if (photoFile != null) {
            println("Photo file add!")
            startFotoNote(photoFile)
        }
        // скрываем кнопки основного экрана и показываем для камеры
        containerPreviewView!!.visibility = View.GONE
        buttonFoto!!.visibility = View.GONE
        buttonFotoCansel!!.visibility = View.GONE
        linearLayoutButton!!.visibility = View.VISIBLE
        buttonExpect!!.visibility = View.VISIBLE
        buttonOther!!.visibility = View.VISIBLE
        buttonGone!!.visibility = View.VISIBLE
    }

    //создаем адрес и название файла фото фиксации c камеры смартфона
    @Throws(IOException::class)
    private fun createFotoNoteImageFile(): File {
        // Create an image file name
        // Создаем имя файла изображения
        val timeStamp =
            SimpleDateFormat("yyyyMMdd_HHmmss").format(Date())
        val imageFileName =
            "FotoNote_" + idDocActivButtonUser + "_" + timeStamp + "_"
        val storageDir =
            getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        //File storageDir = getExternalCacheDir();
        // Save a file: path for use with ACTION_VIEW intents
        // Сохраняем файл: путь для использования с намерениями ACTION_VIEW
        //   currentPhotoPath = image.getAbsolutePath();
        return File.createTempFile(
            imageFileName,  /* prefix */
            ".jpg",  /* suffix */
            storageDir /* directory */
        )
    }

    ////////////////////////////
    fun startFotoNote(photoFile: File) {
        // делаем фото
        //cameraProvider.bindToLifecycle((LifecycleOwner)this, cameraSelector, imageCapture, imageAnalysis, preview);
        //сохраняем фото в файл
        val outputFileOptionsBuilder = ImageCapture.OutputFileOptions.Builder(photoFile)
        imageCapture!!.takePicture(
            outputFileOptionsBuilder.build(),
            { obj: Runnable -> obj.run() },
            object : ImageCapture.OnImageSavedCallback {
                override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
                    //ggg();
                    val params = Bundle()
                    params.putString("FILE_PATH", photoFile.path)
                    // подготовка к удалению файла
                    val file = Uri.fromFile(File(photoFile.toString()))
                    // Create the file metadata
                    // Создаем метаданные файла
                    val metadata = StorageMetadata.Builder()
                        .setContentType("foto/.jpg")
                        .build()
                    // Upload file and metadata to the path 'images/mountains.jpg'
                    // Загрузить файл и метаданные по пути images / mountains.jpg'
                    val uploadTask = storageRef!!.child("FotoOfNote/" + file.lastPathSegment)
                        .putFile(file, metadata)
                    // Listen for state changes, errors, and completion of the upload.
                    // Слушаем изменения состояния, ошибки и завершение загрузки
                    uploadTask.addOnProgressListener { taskSnapshot ->
                        val progress =
                            100.0 * taskSnapshot.bytesTransferred / taskSnapshot.totalByteCount
                        Log.d(TAG, "Upload is $progress% done")
                    }.addOnPausedListener(object : OnPausedListener<UploadTask.TaskSnapshot?> {
                        override fun onPaused(taskSnapshot: UploadTask.TaskSnapshot?) {
                            Log.d(TAG, "Upload is paused")
                        }
                    }).addOnFailureListener {
                        // Handle unsuccessful uploads
                    }.addOnSuccessListener(object : OnSuccessListener<UploadTask.TaskSnapshot?> {
                        override fun onSuccess(taskSnapshot: UploadTask.TaskSnapshot?) {
                            // Handle successful uploads on complete
                            // Обработка успешных загрузок по завершении
                            val fileDelete = File(photoFile.toString())
                            if (fileDelete.delete()) {
                                println("File deleted!")
                            } else println("File not found!")
                        }
                    })
                }

                override fun onError(exception: ImageCaptureException) {
                    exception.printStackTrace()
                }
            })
    }

    //отмена экрана вывода фото заметки
    fun buttonFotoCansel(view: View?) { // скрываем кнопки основного экрана и показываем для камеры
        containerPreviewView!!.visibility = View.GONE
        buttonFoto!!.visibility = View.GONE
        buttonFotoCansel!!.visibility = View.GONE
        linearLayoutButton!!.visibility = View.VISIBLE
        buttonExpect!!.visibility = View.VISIBLE
        buttonOther!!.visibility = View.VISIBLE
        buttonGone!!.visibility = View.VISIBLE
    }

    //   public void noteVideo()
    //   {
    // edtext.setText("Выбран пункт Справка");
    //   }
    //запускаем запись аудио заметки
    fun noteAudio() {
        if (recorder == null) {
            if (checkPermission()) {
                val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss").format(Date())
                val fileNameNote =
                    externalCacheDir!!.absolutePath + "/audioNote_" + idDocActivButtonUser + "_" + timeStamp + "_" + ".m4a"
                recorder = MediaRecorder()
                recorder!!.setAudioSource(MediaRecorder.AudioSource.MIC)
                recorder!!.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
                recorder!!.setOutputFile(fileNameNote)
                recorder!!.setAudioEncoder(MediaRecorder.AudioEncoder.AAC_ELD)
                try {
                    recorder!!.prepare()
                    recorder!!.start()
                } catch (e: IllegalStateException) {
                    // TODO Auto-generated catch block
                    e.printStackTrace()
                } catch (e: IOException) {
                    // TODO Auto-generated catch block
                    e.printStackTrace()
                }
                Toast.makeText(
                    this@UserProcessActivity, "Recording started",
                    Toast.LENGTH_LONG
                ).show()
                noteAudioStop(fileNameNote)
            } else {
                requestPermission()
            }
        }
        Toast.makeText(
            this@UserProcessActivity, "Recording active",
            Toast.LENGTH_LONG
        ).show()
    }

    //открываем диалоговое окно для остановки записи аудио заметки
    fun noteAudioStop(fileNameNote: String?) {
        val builder = AlertDialog.Builder(this@UserProcessActivity)
        builder.setTitle("Recording an audio note!")
        //    builder.setMessage(content);
        builder.setPositiveButton(
            "Stop"
        ) { dialog, which ->
            recorder!!.stop()
            recorder!!.reset()
            recorder!!.release()
            recorder = null
            Toast.makeText(
                this@UserProcessActivity, "Recording stop",
                Toast.LENGTH_LONG
            ).show()
            // File or Blob
            // Файл или Blob
            val file = Uri.fromFile(File(fileNameNote))
            // Create the file metadata
            // Создаем метаданные файла
            val metadata = StorageMetadata.Builder()
                .setContentType("audio/.mp4")
                .build()
            // Upload file and metadata to the path 'images/mountains.jpg'
            // Загрузить файл и метаданные по пути images / mountains.jpg'
            val uploadTask = storageRef!!.child("AudioRecordingOfNote/" + file.lastPathSegment)
                .putFile(file, metadata)
            // Listen for state changes, errors, and completion of the upload.
            // Слушаем изменения состояния, ошибки и завершение загрузки
            uploadTask.addOnProgressListener { taskSnapshot ->
                val progress = 100.0 * taskSnapshot.bytesTransferred / taskSnapshot.totalByteCount
                Log.d(TAG, "Upload is $progress% done")
            }.addOnPausedListener(object : OnPausedListener<UploadTask.TaskSnapshot?> {
                override fun onPaused(taskSnapshot: UploadTask.TaskSnapshot?) {
                    Log.d(TAG, "Upload is paused")
                }
            }).addOnFailureListener {
                // Handle unsuccessful uploads
            }.addOnSuccessListener(object : OnSuccessListener<UploadTask.TaskSnapshot?> {
                override fun onSuccess(taskSnapshot: UploadTask.TaskSnapshot?) {
                    // Handle successful uploads on complete
                    // Обработка успешных загрузок по завершении
                    // ...
                    val fileDelete = File(fileNameNote)
                    if (fileDelete.delete()) {
                        println("File deleted!")
                    } else println("File not found!")
                }
            })
        }
        // устанавливаем кнопку, которая отвечает за выбранный нами ответ
        // в данном случаем мы просто хотим всплывающее окно с отменой
        builder.show()
    }

    fun noteGEO() {
        if (checkPermission()) {
            fusedLocationClient =
                LocationServices.getFusedLocationProviderClient(this@UserProcessActivity)
            fusedLocationClient!!.lastLocation
                .addOnSuccessListener(
                    this@UserProcessActivity,
                    object : OnSuccessListener<Location?> {
                        override fun onSuccess(location: Location?) {
                            // Got last known location. In some rare situations this can be null.
                            if (location != null) {
                                // Logic to handle location object
                                val latitude = location.latitude
                                val longitude = location.longitude
                                val locationCoordinates = GeoPoint(latitude, longitude)
                                //создаем документ
                                val data: MutableMap<String, Any?> = HashMap()
                                data["NoteSource"] = "note_geo"
                                data["NoteParent"] = idDocActivButtonUser
                                data["NoteTime"] = FieldValue.serverTimestamp()
                                data["NoteText"] = locationCoordinates
                                data["NoteUser"] = userNameEmail
                                data["NoteStatus"] = "false"
                                data["NoteComment"] = ""
                                data["NoteParentName"] = NameDocProcessButton
                                data["NoteIdDocPosition"] = idPosition
                                db!!.collection("Note")
                                    .add(data)
                                    .addOnSuccessListener { documentReference ->
                                        Log.d(
                                            TAG,
                                            "DocumentSnapshot written with ID: " + documentReference.id
                                        )
                                    }
                                    .addOnFailureListener { e ->
                                        Log.w(
                                            TAG,
                                            "Error adding document",
                                            e
                                        )
                                    }
                            }
                        }
                    })
            return
        } else {
            requestPermission()
        }
    }

    override fun onStop() {
        super.onStop()
        UserProcessActivityObserver.disconnect()
    }

    companion object {
        //
        const val MESSAGE_STATUS = "message_status"
        private var fileName: String? = null
        const val RequestPermissionCode = 1

        //private Camera camera;
        const val REQUEST_IMAGE_CAPTURE = 1
    }
}