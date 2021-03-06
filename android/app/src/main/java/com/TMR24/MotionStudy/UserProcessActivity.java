package com.TMR24.MotionStudy;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.Presentation;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.media.AudioManager;
import android.media.MediaRecorder;
import android.media.SoundPool;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Environment;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;
import android.util.Size;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.ImageCapture;
import androidx.camera.core.ImageCaptureException;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.Observer;
import androidx.work.Data;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.Continuation;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.common.util.concurrent.ListenableFuture;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.GeoPoint;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.functions.FirebaseFunctions;
import com.google.firebase.functions.HttpsCallableResult;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.OnPausedListener;
import com.google.firebase.storage.OnProgressListener;
import com.google.firebase.storage.StorageMetadata;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ExecutionException;

import static android.Manifest.permission.ACCESS_FINE_LOCATION;
import static android.Manifest.permission.CAMERA;
import static android.Manifest.permission.RECORD_AUDIO;
import static androidx.work.WorkInfo.State.SUCCEEDED;

public class UserProcessActivity extends AppCompatActivity implements LifecycleOwner {
    //
    public static final String MESSAGE_STATUS = "message_status";
    private TextView textActivPosition;
    private FirebaseFirestore db;
    private FirebaseFunctions mFunctions;
    private FirebaseStorage storage;
    private StorageReference storageRef;

    // ID активного документа в данный момент в коллекции ProcessUser
    private String idDocActivButtonUser;
    // ID активной кнопки в данный момент времени
    private int activButtonId;
    // активная кнопка в данный момент времени
    private Button activeButton;
    // ID активного документа смены в данный момент
    private String activShiftDocId;
    // ID фонового задания
    private OneTimeWorkRequest mRequest;
    // список фоновых заданий
    private WorkManager mWorkManager;
    // переменные для звукового сигнала
    private int soundId;
    private SoundPool soundPool;
    private AudioManager amg;
    //переменная для организации активного контроля
    private String settingsActiveIntervalMinutesFigure, NameDocProcessButton, settingsActiveTransition;
    private boolean settingsActiveSignal;
    private long settingsActiveDurationSecondsLong1000;
    //переменная для организации активного контроля, активация кнопки программно
    private String settingsActiveTransitionControl;
    //переменные для аудио записи
    private String AudioSavePathInDevice = null;
    private static String fileName = null;
    private MediaRecorder recorder = null;
    private Random random;
    private String RandomAudioFileName = "ABCDEFGHIJKLMNOP";
    public static final int RequestPermissionCode = 1;
    // Requesting permission to RECORD_AUDIO
    private boolean permissionToRecordAccepted = false;
    private String[] permissions = {Manifest.permission.RECORD_AUDIO};
    //переменные для Фото фиксации CameraX
    private Presentation view;
    private LifecycleOwner lifecycleOwner;
    private Lifecycle lifecycle;
    private UserProcessActivityObserver locationListener;
    private ImageAnalysis imageAnalysis;
    private ImageCapture imageCapture;
    private PreviewView previewView;
    private ProcessCameraProvider cameraProvider;
    private Preview preview;
    private CameraSelector cameraSelector;
    private ListenableFuture cameraProviderFuture;
    //private Camera camera;
    static final int REQUEST_IMAGE_CAPTURE = 1;
    private String currentPhotoPath;
    private String settingsPassivePhotoIntervalSecondsFigure;
    private OneTimeWorkRequest mRequestPassivePhotoInterval;
    //переменные для геолокации
    private FusedLocationProviderClient fusedLocationClient;
    private OneTimeWorkRequest mRequestPassiveGeolocationInterval;
    private String settingsPassiveGeolocationIntervalSecondsFigure;
    private GeoPoint locationCoordinates;
    ////
    private String TAG, userNameEmail, parentHierarchyShiftUser, idPosition;
    private Button buttonCloseShift, buttonExpect, buttonOther, buttonGone, button, buttonFoto, buttonFotoCansel;
    private Map parentHierarchyPositionUserMap;
    private List < PositionSettingObjectMap > PositionSettingsMap = new ArrayList();
    private List < Button > ButtonMap = new ArrayList();
    private LinearLayout linearLayoutButton;
    private FrameLayout containerPreviewView;
    private Window window;
    final Context context = this;
    //переменные для списка заметок List
    private Map < String, Object > PositionSettingsNoteListMap = new HashMap <>();
    private Map < String, Object > PositionSettingsNoteTrafficMap = new HashMap <>();


    @Override
    //@OnLifecycleEvent(ON_CREATE)
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_process);
        locationListener = new UserProcessActivityObserver(UserProcessActivity.this, UserProcessActivity.this.getLifecycle());
        init();
    }
    //menu верхней правой части экрана
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_user_process_activity, menu);
        return super.onCreateOptionsMenu(menu);
    }

    private void init() {

        db = FirebaseFirestore.getInstance();
        storage = FirebaseStorage.getInstance();
        storageRef = storage.getReference();
        mFunctions = FirebaseFunctions.getInstance();
        textActivPosition = findViewById(R.id.textActivPosition);
        buttonCloseShift = findViewById(R.id.buttonCloseShift);
        linearLayoutButton = findViewById(R.id.linearLayoutButton);
        buttonExpect = findViewById(R.id.buttonExpect);
        buttonOther = findViewById(R.id.buttonOther);
        buttonGone = findViewById(R.id.buttonGone);
        buttonFoto = findViewById(R.id.buttonFoto);
        buttonFotoCansel = findViewById(R.id.buttonFotoCansel);
        containerPreviewView =findViewById(R.id.container);
        window = getWindow();
        // переменная для фоновых задач
        mWorkManager = WorkManager.getInstance();
        //переменные для звукового сигнала
        soundPool = new SoundPool(1, AudioManager.STREAM_MUSIC, 0);
        soundId = soundPool.load(UserProcessActivity.this, R.raw.return_tone, 1);
        amg = (AudioManager) getSystemService(AUDIO_SERVICE);
        //переменная для CameraX
        previewView = findViewById(R.id.previewView);
        activateTheCamera();
    }
    private void activateTheCamera()
    {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            cameraProviderFuture = null;
            cameraProvider = null;
            preview = null;
            imageCapture = null;
            cameraSelector = null;
            imageAnalysis = null;
            cameraProviderFuture = ProcessCameraProvider.getInstance(UserProcessActivity.this);
            imageAnalysis = new
                    ImageAnalysis.Builder()
                            .setTargetResolution(new Size(1280, 720))
                            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                            .build();
            cameraProviderFuture.addListener(() -> {
                        try {
                            // Camera provider is now guaranteed to be available
                            // Поставщик камеры теперь гарантированно доступен
                            cameraProvider = (ProcessCameraProvider) cameraProviderFuture.get();
                            // Set up the view finder use case to display camera preview
                            // Настраиваем вариант использования видоискателя для отображения предварительного просмотра камеры
                            preview = new Preview.Builder().build();
                            // Set up the capture use case to allow users to take photos
                            // Настройка сценария использования захвата, чтобы пользователи могли делать фотографии
                            imageCapture = new ImageCapture.Builder()
                                    .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                                    .build();
                            // Choose the camera by requiring a lens facing
                            // Выбираем камеру, требуя, чтобы объектив смотрел
                            cameraSelector = new CameraSelector.Builder()
                                    .requireLensFacing(CameraSelector.LENS_FACING_BACK)
                                    .build();
                            // Connect the preview use case to the previewView
                            // Подключите вариант использования предварительного просмотра к previewView
                            preview.setSurfaceProvider(previewView.getSurfaceProvider());
                            ////
                            cameraProvider.bindToLifecycle((LifecycleOwner)this, cameraSelector, imageCapture, imageAnalysis, preview);
                        } catch (InterruptedException | ExecutionException e) {
                            // Currently no exceptions thrown. cameraProviderFuture.get()
                            // shouldn't block since the listener is being called, so no need to
                            // handle InterruptedException.
                            // В настоящее время исключений нет. cameraProviderFuture.get ()
                            // не должен блокироваться, так как слушатель вызывается, поэтому нет необходимости
                            // обрабатываем InterruptedException.
                        }
                    },
                    ContextCompat.getMainExecutor(UserProcessActivity.this));

        }else{
            // Use Camera1
            Toast.makeText(UserProcessActivity.this, "This device does not support CameraX operation.", Toast.LENGTH_SHORT).show();

        }



        /////////////////

    }
    @Override
    @SuppressLint("ResourceType")
    public void onStart() {
        super.onStart();
        UserProcessActivityObserver.connect();
        Intent i = getIntent();
        if (i != null) {   //window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            //очистили ArrayList
            PositionSettingsMap.clear();
            ButtonMap.clear();
            linearLayoutButton.removeAllViews();
            //
            int idButtonExpect = 9;
            buttonExpect.setId(idButtonExpect);
            buttonExpect.setOnClickListener(mCorkyListener);
            ButtonMap.add(buttonExpect);
            //
            int idButtonOther = 10;
            buttonOther.setId(idButtonOther);
            buttonOther.setOnClickListener(mCorkyListener);
            ButtonMap.add(buttonOther);
            //
            int idButtonGone = 11;
            buttonGone.setId(idButtonGone);
            buttonGone.setOnClickListener(mCorkyListener);
            ButtonMap.add(buttonGone);
            // получили строку данных с предидущего Активити
            userNameEmail = i.getStringExtra(Constant.USER_NAME_EMAIL);
            parentHierarchyShiftUser = i.getStringExtra(Constant.PARENT_HIERARCHY_SHIFT_USER);
            String delimeter = ">";
            String idOrganization = parentHierarchyShiftUser.split(delimeter)[0];
            String nameOrganization = parentHierarchyShiftUser.split(delimeter)[1];
            String idSubdivision = parentHierarchyShiftUser.split(delimeter)[2];
            String nameSubdivision = parentHierarchyShiftUser.split(delimeter)[3];
            idPosition = parentHierarchyShiftUser.split(delimeter)[4];
            String namePosition = parentHierarchyShiftUser.split(delimeter)[5];
            activShiftDocId = parentHierarchyShiftUser.split(delimeter)[6];
            //вывели на экран Должность Подразделение Организацию в которой планируем работать
            textActivPosition.setText(nameOrganization + " > " + nameSubdivision + " > " + namePosition);
            //получаем parentHierarchyPositionUserMap из документа Активной смены
            DocumentReference docRef = db.collection("WorkShift").document(activShiftDocId);
            docRef.get().addOnCompleteListener(new OnCompleteListener < DocumentSnapshot >() {
                @Override
                public void onComplete(@NonNull Task < DocumentSnapshot > task) {
                    if (task.isSuccessful()) {
                        DocumentSnapshot document = task.getResult();
                        if (document.exists()) {
                            Log.d(TAG, "DocumentSnapshot data: " + document.getData());
                            Map < String, Object > doc = document.getData();
                            parentHierarchyPositionUserMap = (Map < String, Object >) doc.get("ParentHierarchyPositionUser");
                            buttonCloseShift.setVisibility(View.VISIBLE);
                        } else {
                            Log.d(TAG, "No such document");
                        }
                    } else {
                        Log.d(TAG, "get failed with ", task.getException());
                    }
                }
            });
            // устанавливаем настройки кнопок buttonExpect, buttonOther, buttonGone в PositionSettingsMap
            String idSettingsButtonExpect = "buttonExpect";
            String settingsTitleExpect = "Expect";
            boolean settingsCommitDescription = false;
            boolean settingsResultCapture = false;
            boolean settingsActiveControl = false;
            boolean settingsPassiveControl = false;
            boolean settingsCommitDescriptionExpect = true;
            Map < String, Object > dataSettingsButtonExpect = new HashMap <>();
            dataSettingsButtonExpect.put("SettingsTitle", settingsTitleExpect);
            dataSettingsButtonExpect.put("SettingsActiveControl", settingsActiveControl);
            dataSettingsButtonExpect.put("SettingsPassiveControl", settingsPassiveControl);
            dataSettingsButtonExpect.put("SettingsCommitDescription", settingsCommitDescriptionExpect);
            dataSettingsButtonExpect.put("SettingsResultCapture", settingsResultCapture);
            PositionSettingObjectMap positionSettingsObjectExpect = new PositionSettingObjectMap(idButtonExpect, idSettingsButtonExpect, dataSettingsButtonExpect);
            PositionSettingsMap.add(positionSettingsObjectExpect);
            buttonExpect.setId(idButtonExpect);
            String idSettingsButtonOther = "buttonOther";
            String SettingsTitleOther = "Other";
            boolean settingsCommitDescriptionOther = true;
            Map < String, Object > dataSettingsButtonOther = new HashMap <>();
            dataSettingsButtonOther.put("SettingsTitle", SettingsTitleOther);
            dataSettingsButtonOther.put("SettingsActiveControl", settingsActiveControl);
            dataSettingsButtonOther.put("SettingsPassiveControl", settingsPassiveControl);
            dataSettingsButtonOther.put("SettingsCommitDescription", settingsCommitDescriptionOther);
            dataSettingsButtonOther.put("SettingsResultCapture", settingsResultCapture);
            PositionSettingObjectMap positionSettingsObjectOther = new PositionSettingObjectMap(idButtonOther, idSettingsButtonOther, dataSettingsButtonOther);
            PositionSettingsMap.add(positionSettingsObjectOther);
            buttonOther.setId(idButtonOther);
            String idSettingsButtonGone = "buttonGone";
            String SettingsTitleGone = "Gone";
            Map < String, Object > dataSettingsButtonGone = new HashMap <>();
            dataSettingsButtonGone.put("SettingsTitle", SettingsTitleGone);
            dataSettingsButtonGone.put("SettingsActiveControl", settingsActiveControl);
            dataSettingsButtonGone.put("SettingsPassiveControl", settingsPassiveControl);
            dataSettingsButtonGone.put("SettingsCommitDescription", settingsCommitDescription);
            dataSettingsButtonGone.put("SettingsResultCapture", settingsResultCapture);
            PositionSettingObjectMap positionSettingsObjectGone = new PositionSettingObjectMap(idButtonGone, idSettingsButtonGone, dataSettingsButtonGone);
            PositionSettingsMap.add(positionSettingsObjectGone);
            buttonGone.setId(idButtonGone);
            //получаем настройки для данной должности
            DocumentReference docRefOrganization = db.collection("Organization").document(idOrganization);
            DocumentReference docRefSubdivision = docRefOrganization.collection("Subdivision").document(idSubdivision);
            DocumentReference docRefPosition = docRefSubdivision.collection("Position").document(idPosition);
            docRefPosition.collection("PositionSettings")
                    .get()
                    .addOnCompleteListener(new OnCompleteListener < QuerySnapshot >() {
                        @Override
                        public void onComplete(@NonNull Task < QuerySnapshot > task) {
                            if (task.isSuccessful()) {
                                for (QueryDocumentSnapshot document : task.getResult()) {
                                    Log.d(TAG, document.getId() + " => " + document.getData());
                                    //достаем название и настройки
                                    Map < String, Object > doc = document.getData();
                                    String buttonName = (String) doc.get("SettingsTitle");
                                    button = new Button(UserProcessActivity.this);
                                    button.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
                                    button.setText(buttonName);
                                    int id = View.generateViewId();
                                    button.setId(id);
                                    button.setOnClickListener(mCorkyListener);
                                    ButtonMap.add(button);
                                    // устанавливаем настройки созданных кнопок в PositionSettingsMap
                                    int idButton = id;
                                    String idSettingsButton = document.getId();
                                    Map < String, Object > dataSettingsButton = document.getData();
                                    PositionSettingObjectMap positionSettingsObject = new PositionSettingObjectMap(idButton, idSettingsButton, dataSettingsButton);
                                    PositionSettingsMap.add(positionSettingsObject);
                                    //публикуем
                                    linearLayoutButton.addView(button);
                                }
                            } else {
                                Log.d(TAG, "Error getting documents: ", task.getException());
                            }
                        }
                    });
            //получаем настройки заметок List для текущей должности PositionSettingsNoteList
            docRefPosition.collection("PositionSettingsNoteList")
                    .get()
                    .addOnCompleteListener(new OnCompleteListener < QuerySnapshot >() {
                        @Override
                        public void onComplete(@NonNull Task < QuerySnapshot > task) {
                            if (task.isSuccessful()) {
                                for (QueryDocumentSnapshot document : task.getResult()) {
                                    Log.d(TAG, document.getId() + " => " + document.getData());
                                    //достаем название и настройки
                                    PositionSettingsNoteListMap = document.getData();
                                }
                            } else {
                                Log.d(TAG, "Error getting documents: ", task.getException());
                            }
                        }
                    });
            //получаем настройки заметок Traffic для текущей должности PositionSettingsNoteTrafficMap
            docRefPosition.collection("PositionSettingsNoteTrafic")
                    .get()
                    .addOnCompleteListener(new OnCompleteListener < QuerySnapshot >() {
                        @Override
                        public void onComplete(@NonNull Task < QuerySnapshot > task) {
                            if (task.isSuccessful()) {
                                for (QueryDocumentSnapshot document : task.getResult()) {
                                    Log.d(TAG, document.getId() + " => " + document.getData());
                                    //достаем название и настройки
                                    PositionSettingsNoteTrafficMap = document.getData();
                                }
                            } else {
                                Log.d(TAG, "Error getting documents: ", task.getException());
                            }
                        }
                    });
            //получаем открытый документ процесса и устанавливаем активность
            docRef.collection("ProcessUser")
                    .whereEqualTo("ProcessUserEnd", "")
                    .get()
                    .addOnCompleteListener(new OnCompleteListener < QuerySnapshot >() {
                        @Override
                        public void onComplete(@NonNull Task < QuerySnapshot > task) {
                            if (task.isSuccessful()) {
                                for (QueryDocumentSnapshot document : task.getResult()) {
                                    Log.d(TAG, document.getId() + " => " + document.getData());
                                    idDocActivButtonUser = document.getId();
                                    Map < String, Object > dataSettingsButton = document.getData();
                                    //String IdDocProcessButton = (String) dataSettingsButton.get("IdDocProcessButton");
                                    NameDocProcessButton = (String) dataSettingsButton.get("NameDocProcessButton");
                                    ButtonActivationByBackgroundTask(NameDocProcessButton);
                                }
                            } else {
                                Log.d(TAG, "Error getting documents: ", task.getException());
                            }
                        }
                    });

        }

    }

    //---Операция закрытия рабочей смены и крайнего сдокумента событие смены.---
    public void buttonCloseShift(View view) { //Закрываем рабочую смену
        DocumentReference washingtonRef = db.collection("WorkShift").document(activShiftDocId);
        washingtonRef
                .update("WorkShiftEnd", "false")
                .addOnSuccessListener(new OnSuccessListener < Void >() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        Log.d(TAG, "DocumentSnapshot successfully updated!");
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.w(TAG, "Error updating document", e);
                    }
                });
        DocumentReference docRef = db.collection("WorkShift").document(activShiftDocId);
        // Обновляем поле отметки времени значением с сервера
        // Update the timestamp field with the value from the server
        Map < String, Object > updates = new HashMap <>();
        updates.put("WorkShiftEndTime", FieldValue.serverTimestamp());

        docRef.update(updates).addOnCompleteListener(new OnCompleteListener < Void >() {
            // [START_EXCLUDE]
            @Override
            public void onComplete(@NonNull Task < Void > task) {
            }
            // [START_EXCLUDE]
        });
        // Закрываем документ активного процесса
        DocumentReference washingtonRefProcessUser = washingtonRef.collection("ProcessUser").document(idDocActivButtonUser);
        washingtonRefProcessUser
                .update("ProcessUserEnd", "false")
                .addOnSuccessListener(new OnSuccessListener < Void >() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        Log.d(TAG, "DocumentSnapshot successfully updated!");
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.w(TAG, "Error updating document", e);
                    }
                });
        DocumentReference docRefProcessUser = docRef.collection("ProcessUser").document(idDocActivButtonUser);
        Map < String, Object > updatesProcessUser = new HashMap <>();
        updatesProcessUser.put("ProcessUserEndTime", FieldValue.serverTimestamp());
        docRefProcessUser.update(updatesProcessUser).addOnCompleteListener(new OnCompleteListener < Void >() {
            // [START_EXCLUDE]
            @Override
            public void onComplete(@NonNull Task < Void > task) {
            }
            // [START_EXCLUDE]
        });
        Intent i = new Intent(UserProcessActivity.this, UserInfoActivity.class);
        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail);
        startActivity(i);
    }

    //--- Основная операция данной активити---
    // Операция слушатель нажатия кнопок процессов
    private final View.OnClickListener mCorkyListener = new View.OnClickListener() {
        public void onClick(View v) {
            //получаем текущую активную кнопку и закрываем активный докумен
            String idDocActivButtonUserFinal = idDocActivButtonUser;
            //изменяем цвет текущей активной кнопки
            activeButton.setBackgroundColor(getResources().getColor(R.color.colorFonButton));
            for (PositionSettingObjectMap h : PositionSettingsMap) {
                int idButton = h.idButton;
                if (activButtonId == idButton) {
                    String idSettingsButton = h.idSettingsButton;
                    Map dataSettingsButton = h.dataSettingsButton;
                    NameDocProcessButton = (String) dataSettingsButton.get("SettingsTitle");
                    // закрываем задачи активного контроля
                    boolean settingsActiveControl = (boolean) dataSettingsButton.get("SettingsActiveControl");
                    if (settingsActiveControl == true) {
                        // очищаем список фоновых задач с тегом "workmng"
                        if (mRequest != null) {
                            mWorkManager.enqueue(mRequest);
                            mWorkManager.cancelWorkById(mRequest.getId());
                        }
                    }
                    //
                    boolean settingsPassiveControl = (boolean) dataSettingsButton.get("SettingsPassiveControl");
                    if (settingsPassiveControl == true) {
                        boolean settingsPassiveAudio = (boolean) dataSettingsButton.get("SettingsPassiveAudio");
                        if (settingsPassiveAudio == true) {
                            stopRecordingAudio();
                        }
                        boolean settingsPassivePhoto = (boolean) dataSettingsButton.get("SettingsPassivePhoto");
                        if (settingsPassivePhoto == true) {
                            // очищаем список фоновых задач с тегом "workmng"
                            if (mRequestPassivePhotoInterval != null) {
                                mWorkManager.enqueue(mRequestPassivePhotoInterval);
                                mWorkManager.cancelWorkById(mRequestPassivePhotoInterval.getId());
                            }
                        }
                        boolean settingsPassiveVideo = (boolean) dataSettingsButton.get("SettingsPassiveVideo");
                        if (settingsPassiveAudio == true) {
                            //
                        }
                        boolean settingsPassiveGeolocation = (boolean) dataSettingsButton.get("SettingsPassiveGeolocation");
                        if (settingsPassiveGeolocation == true) {
                            // очищаем список фоновых задач с тегом "workmng"
                            if (mRequestPassiveGeolocationInterval != null) {
                                mWorkManager.enqueue(mRequestPassiveGeolocationInterval);
                                mWorkManager.cancelWorkById(mRequestPassiveGeolocationInterval.getId());
                            }
                        }
                    }
                    // проверяем необходимость личного комментария при закрытии документа
                    boolean settingsCommitDescription = (boolean) dataSettingsButton.get("SettingsCommitDescription");
                    if (settingsCommitDescription == true) {// создаем всплывающее окно
                        LayoutInflater li = LayoutInflater.from(context);
                        View promptsView = li.inflate(R.layout.prompt, null);
                        AlertDialog.Builder builder = new AlertDialog.Builder(UserProcessActivity.this);
                        builder.setView(promptsView);
                        final EditText userInput = (EditText) promptsView.findViewById(R.id.input_text);
                        builder.setTitle("Comment Result")
                                .setCancelable(false)
                                .setPositiveButton("OK",
                                        new DialogInterface.OnClickListener() {
                                            public void onClick(DialogInterface dialog, int id) {
                                                //получаем текст комментария
                                                String commitDescriptioText = userInput.getText().toString();
                                                DocumentReference docRef = db.collection("WorkShift").document(activShiftDocId);
                                                DocumentReference washingtonRef = docRef.collection("ProcessUser").document(idDocActivButtonUserFinal);
                                                // Set the "isCapital" field of the city 'DC'
                                                washingtonRef
                                                        .update("CommitDescriptioText", commitDescriptioText)
                                                        .addOnSuccessListener(new OnSuccessListener < Void >() {
                                                            @Override
                                                            public void onSuccess(Void aVoid) {
                                                                Log.d(TAG, "DocumentSnapshot successfully updated!");
                                                            }
                                                        })
                                                        .addOnFailureListener(new OnFailureListener() {
                                                            @Override
                                                            public void onFailure(@NonNull Exception e) {
                                                                Log.w(TAG, "Error updating document", e);
                                                            }
                                                        });
                                            }
                                        })
                                .setNegativeButton("Cansel",
                                        new DialogInterface.OnClickListener() {
                                            public void onClick(DialogInterface dialog, int id) {
                                                dialog.cancel();
                                            }
                                        });
                        AlertDialog alert = builder.create();
                        alert.show();
                    }
                    // проверяем необходимость типового комментария при закрытии документа
                    boolean settingsResultCapture = (boolean) dataSettingsButton.get("SettingsResultCapture");
                    if (settingsResultCapture == true) {  //фиксируем результат исполнения процесса из предложенного варианта
                        AlertDialog.Builder builder = new AlertDialog.Builder(UserProcessActivity.this);
                        builder.setTitle("Select result");
                        final List < String > settings_array = new ArrayList <>();
                        String settingsResultControlOption1 = (String) dataSettingsButton.get("SettingsResultControlOption1");
                        if (settingsResultControlOption1 != "") {
                            settings_array.add(settingsResultControlOption1);
                        }
                        String settingsResultControlOption2 = (String) dataSettingsButton.get("SettingsResultControlOption2");
                        if (settingsResultControlOption2 != "") {
                            settings_array.add(settingsResultControlOption2);
                        }
                        String settingsResultControlOption3 = (String) dataSettingsButton.get("SettingsResultControlOption3");
                        if (settingsResultControlOption3 != "") {
                            settings_array.add(settingsResultControlOption3);
                        }
                        String settingsResultControlOption4 = (String) dataSettingsButton.get("SettingsResultControlOption4");
                        if (settingsResultControlOption4 != "") {
                            settings_array.add(settingsResultControlOption4);
                        }
                        String settingsResultControlOption5 = (String) dataSettingsButton.get("SettingsResultControlOption5");
                        if (settingsResultControlOption5 != "") {
                            settings_array.add(settingsResultControlOption5);
                        }
                        String settingsResultControlOption6 = (String) dataSettingsButton.get("SettingsResultControlOption6");
                        if (settingsResultControlOption6 != "") {
                            settings_array.add(settingsResultControlOption6);
                        }
                        String settingsResultControlOption7 = (String) dataSettingsButton.get("SettingsResultControlOption7");
                        if (settingsResultControlOption7 != "") {
                            settings_array.add(settingsResultControlOption7);
                        }
                        String settingsResultControlOption8 = (String) dataSettingsButton.get("SettingsResultControlOption8");
                        if (settingsResultControlOption8 != "") {
                            settings_array.add(settingsResultControlOption8);
                        }
                        if (settings_array.size() != 0) {
                            ArrayAdapter < String > dataAdapter = new ArrayAdapter < String >(UserProcessActivity.this,
                                    android.R.layout.simple_dropdown_item_1line, settings_array);
                            builder.setAdapter(dataAdapter, new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    Toast.makeText(UserProcessActivity.this, "You have selected " + settings_array.get(which), Toast.LENGTH_LONG).show();
                                    String resultControlButton = settings_array.get(which);
                                    DocumentReference docRef = db.collection("WorkShift").document(activShiftDocId);
                                    DocumentReference washingtonRef = docRef.collection("ProcessUser").document(idDocActivButtonUserFinal);
                                    // Set the "isCapital" field of the city 'DC'
                                    washingtonRef
                                            .update("ResultControlButton", resultControlButton)
                                            .addOnSuccessListener(new OnSuccessListener < Void >() {
                                                @Override
                                                public void onSuccess(Void aVoid) {
                                                    Log.d(TAG, "DocumentSnapshot successfully updated!");
                                                }
                                            })
                                            .addOnFailureListener(new OnFailureListener() {
                                                @Override
                                                public void onFailure(@NonNull Exception e) {
                                                    Log.w(TAG, "Error updating document", e);
                                                }
                                            });
                                }
                            });
                            AlertDialog dialog = builder.create();
                            dialog.show();
                        }
                    }
                }
            }
            // Закрываем документ активного процесса
            DocumentReference washingtonRef = db.collection("WorkShift").document(activShiftDocId);
            DocumentReference docRef = db.collection("WorkShift").document(activShiftDocId);
            DocumentReference washingtonRefProcessUser = washingtonRef.collection("ProcessUser").document(idDocActivButtonUser);
            washingtonRefProcessUser
                    .update("ProcessUserEnd", "false")
                    .addOnSuccessListener(new OnSuccessListener < Void >() {
                        @Override
                        public void onSuccess(Void aVoid) {
                            Log.d(TAG, "DocumentSnapshot successfully updated!");
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            Log.w(TAG, "Error updating document", e);
                        }
                    });
            DocumentReference docRefProcessUser = docRef.collection("ProcessUser").document(idDocActivButtonUser);
            Map < String, Object > updatesProcessUser = new HashMap <>();
            updatesProcessUser.put("ProcessUserEndTime", FieldValue.serverTimestamp());

            docRefProcessUser.update(updatesProcessUser).addOnCompleteListener(new OnCompleteListener < Void >() {
                // [START_EXCLUDE]
                @Override
                public void onComplete(@NonNull Task < Void > task) {
                }
                // [START_EXCLUDE]
            });
            // устанавливаем агресивный цвет фона активной кнопки
            v.setBackgroundColor(getResources().getColor(R.color.colorFonActiviButton));
            activeButton = (Button) v;
            activButtonId = v.getId();
            //получам данные для документа процесса
            for (PositionSettingObjectMap h : PositionSettingsMap) {
                int idButton = h.idButton;
                if (activButtonId == idButton) {
                    String idSettingsButton = h.idSettingsButton;
                    Map dataSettingsButton = h.dataSettingsButton;
                    NameDocProcessButton = (String) dataSettingsButton.get("SettingsTitle");
                    //активизируем процесс по нажатию кнопки
                    Map < String, Object > dataProcessUser = new HashMap <>();
                    dataProcessUser.put("EmailPositionUser", userNameEmail);
                    dataProcessUser.put("IdDocPosition", idPosition);
                    dataProcessUser.put("IdDocProcessButton", idSettingsButton);
                    dataProcessUser.put("NameDocProcessButton", NameDocProcessButton);
                    dataProcessUser.put("ParentHierarchyPositionUser", parentHierarchyPositionUserMap);
                    dataProcessUser.put("ProcessUserEnd", "");
                    dataProcessUser.put("ProcessUserStartTime", FieldValue.serverTimestamp());
                    washingtonRef.collection("ProcessUser")
                            .add(dataProcessUser)
                            .addOnSuccessListener(new OnSuccessListener < DocumentReference >() {
                                @Override
                                public void onSuccess(DocumentReference documentReference) {
                                    Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.getId());
                                    idDocActivButtonUser = documentReference.getId();
                                }
                            })
                            .addOnFailureListener(new OnFailureListener() {
                                @Override
                                public void onFailure(@NonNull Exception e) {
                                    Log.w(TAG, "Error adding document", e);
                                }
                            });
                    // получаем настройки для новой активной кнопки
                    boolean settingsActiveControl = (boolean) dataSettingsButton.get("SettingsActiveControl");
                    if (settingsActiveControl == true) {
                        //получаем настройки параметров активного контроля
                        String settingsActiveDurationSeconds = (String) dataSettingsButton.get("SettingsActiveDurationSeconds");
                        String delimeter = " ";
                        String settingsActiveDurationSecondsFigure = settingsActiveDurationSeconds.split(delimeter)[0];
                        String settingsActiveDurationSecondsFigureTime = settingsActiveDurationSeconds.split(delimeter)[1];
                        long settingsActiveDurationSecondsLong = Long.parseLong(settingsActiveDurationSecondsFigure);
                        if (settingsActiveDurationSecondsFigureTime.equals("minutes")) {
                            settingsActiveDurationSecondsLong = settingsActiveDurationSecondsLong * 60;
                        }
                        ;
                        settingsActiveDurationSecondsLong1000 = settingsActiveDurationSecondsLong * 1000;
                        String settingsActiveIntervalMinutes = (String) dataSettingsButton.get("SettingsActiveIntervalMinutes");
                        settingsActiveIntervalMinutesFigure = settingsActiveIntervalMinutes.split(delimeter)[0];
                        String settingsActiveIntervalMinutesFigureTime = settingsActiveIntervalMinutes.split(delimeter)[1];
                        long settingsActiveIntervalMinutesFigureLong = Long.parseLong(settingsActiveIntervalMinutesFigure);
                        if (settingsActiveIntervalMinutesFigureTime.equals("minutes")) {
                            settingsActiveIntervalMinutesFigureLong = settingsActiveIntervalMinutesFigureLong * 60;
                            settingsActiveIntervalMinutesFigure = Long.toString(settingsActiveIntervalMinutesFigureLong);
                        }
                        ;
                        settingsActiveSignal = (boolean) dataSettingsButton.get("SettingsActiveSignal");
                        settingsActiveTransition = (String) dataSettingsButton.get("SettingsActiveTransition");
                        //метод ожидания времени запуска
                        WaitingForTheQuestionOfActiveControl();
                        //включаем вибросигнал для подтверждения нажатия кнопки
                        Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            vibrator.vibrate(VibrationEffect.createOneShot(500, VibrationEffect.DEFAULT_AMPLITUDE));
                        } else {
                            vibrator.vibrate(500);
                        }

                    }
                    //
                    boolean settingsPassiveControl = (boolean) dataSettingsButton.get("SettingsPassiveControl");
                    if (settingsPassiveControl == true) {
                        boolean settingsPassiveAudio = (boolean) dataSettingsButton.get("SettingsPassiveAudio");
                        if (settingsPassiveAudio == true) {
                            startRecordingAudio();
                        }
                        boolean settingsPassivePhoto = (boolean) dataSettingsButton.get("SettingsPassivePhoto");
                        if (settingsPassivePhoto == true) {
                            //получаем настройки параметров интервала Фото фиксации
                            String settingsPassivePhotoInterval = (String) dataSettingsButton.get("SettingsPassivePhotoInterval");
                            String delimeter = " ";
                            settingsPassivePhotoIntervalSecondsFigure = settingsPassivePhotoInterval.split(delimeter)[0];
                            String settingsPassivePhotoIntervalFigureTime = settingsPassivePhotoInterval.split(delimeter)[1];
                            long settingsPassivePhotoIntervalSecondsLong = Long.parseLong(settingsPassivePhotoIntervalSecondsFigure);
                            if (settingsPassivePhotoIntervalFigureTime.equals("minutes")) {
                                long settingsPassivePhotoIntervalMinutesLong = settingsPassivePhotoIntervalSecondsLong * 60;
                                settingsPassivePhotoIntervalSecondsFigure = Long.toString(settingsPassivePhotoIntervalMinutesLong);
                            }
                            boolean settingsPassivePhotoSmartphoneCamera = (boolean) dataSettingsButton.get("SettingsPassivePhotoSmartphoneCamera");
                            boolean settingsPassivePhotoCameraIP = (boolean) dataSettingsButton.get("SettingsPassivePhotoCameraIP");
                            boolean settingsPassivePhotoCaptureEventOnClick = (boolean) dataSettingsButton.get("SettingsPassivePhotoCaptureEventOnClick");
                            if (settingsPassivePhotoCaptureEventOnClick == true) {
                                //запускае первую фото фиксацию камеры со смарфона
                                if (settingsPassivePhotoSmartphoneCamera == true) {
                                    //запускаем фото фиксацию камеры со смарфона
                                    dispatchTakePictureIntentSmartphoneCamera();
                                }
                                if(settingsPassivePhotoCameraIP == true){
                                    //запускае первую фото фиксацию с камеры IP
                                    dispatchTakePictureIntentCameraIP(idDocActivButtonUser);
                                }
                            }
                            //запускаем интервал фиксации местоположения
                            WaitingForTheQuestionOfPassivePhotoInterval(settingsPassivePhotoSmartphoneCamera,settingsPassivePhotoCameraIP);
                        }
                        boolean settingsPassiveVideo = (boolean) dataSettingsButton.get("SettingsPassiveVideo");
                        if (settingsPassiveVideo == true) {
                            //
                        }
                        boolean settingsPassiveGeolocation = (boolean) dataSettingsButton.get("SettingsPassiveGeolocation");
                        if (settingsPassiveGeolocation == true) {
                            //
                            //получаем настройки параметров интервала ГЕО локации
                            String settingsPassiveGeolocationInterval = (String) dataSettingsButton.get("SettingsPassiveGeolocationInterval");
                            String delimeter = " ";
                            settingsPassiveGeolocationIntervalSecondsFigure = settingsPassiveGeolocationInterval.split(delimeter)[0];
                            String settingsPassiveGeolocationIntervalFigureTime = settingsPassiveGeolocationInterval.split(delimeter)[1];
                            long settingsPassiveGeolocationIntervalSecondsLong = Long.parseLong(settingsPassiveGeolocationIntervalSecondsFigure);
                            if (settingsPassiveGeolocationIntervalFigureTime.equals("minutes")) {
                                long settingsPassiveGeolocationIntervalMinutesLong = settingsPassiveGeolocationIntervalSecondsLong * 60;
                                settingsPassiveGeolocationIntervalSecondsFigure = Long.toString(settingsPassiveGeolocationIntervalMinutesLong);
                            }
                            //запускае первую фиксацию местоположения
                            boolean settingsPassiveGeolocationCaptureEventOnClick = (boolean) dataSettingsButton.get("SettingsPassiveGeolocationCaptureEventOnClick");
                            if(settingsPassiveGeolocationCaptureEventOnClick == true)
                            {
                                getCurrentLocationGEO();
                            }
                            //запускаем интервал фиксации местоположения
                            WaitingForTheQuestionOfPassiveGeolocationInterval();
                        }
                    }
                }
            }
        }
    };

    // ----запуск ожидания окна активного контроля-----
    private void WaitingForTheQuestionOfActiveControl() {
        //метод ожидания времени запуска
        Data myData = new Data.Builder()
                .putString("Interval_SECONDS", settingsActiveIntervalMinutesFigure)
                .build();
        mRequest = new OneTimeWorkRequest.Builder(NotificationWorker.class).setInputData(myData).build();
        WorkManager.getInstance().enqueue(mRequest);
        //проверка статуса
        mWorkManager.getWorkInfoByIdLiveData(mRequest.getId()).observe(UserProcessActivity.this, new Observer < WorkInfo >() {
            @Override
            public void onChanged(@Nullable WorkInfo workInfo) {
                if (workInfo != null) {
                    WorkInfo.State state = workInfo.getState();
                    if (state == SUCCEEDED)
                    {
                        //подаем звуковой сигнал
                        if (settingsActiveSignal == true) {
                            int mPlay = soundPool.play(soundId, 1, 1, 1, 0, 1);
                        }
                        ;
                        //открываем диалоговое окно
                        settingsActiveTransitionControl = "no forward";
                        AlertDialog.Builder builder = new AlertDialog.Builder(UserProcessActivity.this);
                        builder.setTitle("Attention!")
                                .setMessage("You are in the process of " + NameDocProcessButton)
                                // .setIcon(R.drawable.ic_android_cat)
                                .setCancelable(false)
                                .setNegativeButton("ОК",
                                        new DialogInterface.OnClickListener()
                                        {
                                            public void onClick(DialogInterface dialog, int id)
                                            {
                                                System.out.println("нажали ОК");
                                                WaitingForTheQuestionOfActiveControl();
                                                settingsActiveTransitionControl = "forward";
                                                dialog.cancel();
                                            }
                                        });
                        AlertDialog alert = builder.create();
                        alert.show();

                        //закрытие диалогового окна по таймеру
                        new CountDownTimer(settingsActiveDurationSecondsLong1000, 1000)
                        {

                            @Override
                            public void onTick(long millisUntilFinished)
                            {
                                // TODO Auto-generated method stub
                                //  mTimer.setText("Осталось: "
                                //          + millisUntilFinished / 1000);
                                System.out.println("запускаем космонавта");
                            }

                            @Override
                            public void onFinish()
                            {
                                // TODO Auto-generated method stub
                                // проверяем необходимость запуска нужной кнопки
                                if (settingsActiveTransitionControl != "forward")
                                {
                                    ButtonActivationByBackgroundTask(settingsActiveTransition);
                                }

                                // закрываем диалоговое окно
                                alert.dismiss();
                            }
                        }.start();
                        // включаем вибро на телефоне
                        Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            vibrator.vibrate(VibrationEffect.createOneShot(500, VibrationEffect.DEFAULT_AMPLITUDE));
                        } else {
                            vibrator.vibrate(500);
                        }
                    }

                }
            }
        });
    }

    // ------активация кнопки фоновым (программно) заданием------
    private void ButtonActivationByBackgroundTask(String settingsActiveTransitionTransferTo) {
        //
        String settingsActiveTransitionTransferGo = settingsActiveTransitionTransferTo;
        String buttonActivationMethod = "";
        if (settingsActiveTransitionTransferTo.equals("No button")) {
            settingsActiveTransitionTransferGo = "Gone";
            buttonActivationMethod = "Programmatically";
        }
        ;
        Button activeButtonControl = activeButton;
        if (activeButton != null) {
            //получаем текущую активную кнопку и закрываем активный докумен
            String idDocActivButtonUserFinalTrans = idDocActivButtonUser;
            //изменяем цвет текущей активной кнопки
            activeButton.setBackgroundColor(getResources().getColor(R.color.colorFonButton));
            for (PositionSettingObjectMap h : PositionSettingsMap) {
                int idButton = h.idButton;
                if (activButtonId == idButton) {
                    String idSettingsButton = h.idSettingsButton;
                    Map dataSettingsButton = h.dataSettingsButton;
                    NameDocProcessButton = (String) dataSettingsButton.get("SettingsTitle");
                    boolean settingsActiveControl = (boolean) dataSettingsButton.get("SettingsActiveControl");
                    if (settingsActiveControl == true) {
                        // удаляем фоновое задание по ID
                        if (mRequest != null) {
                            mWorkManager.enqueue(mRequest);
                            mWorkManager.cancelWorkById(mRequest.getId());
                        }
                    }
                    //
                    boolean settingsPassiveControl = (boolean) dataSettingsButton.get("SettingsPassiveControl");
                    if (settingsPassiveControl == true) {
                        boolean settingsPassiveAudio = (boolean) dataSettingsButton.get("SettingsPassiveAudio");
                        if (settingsPassiveAudio == true) {
                            stopRecordingAudio();
                        }
                        boolean settingsPassivePhoto = (boolean) dataSettingsButton.get("SettingsPassivePhoto");
                        if (settingsPassivePhoto == true) {
                            // очищаем список фоновых задач с тегом "workmng"
                            if (mRequestPassivePhotoInterval != null) {
                                mWorkManager.enqueue(mRequestPassivePhotoInterval);
                                mWorkManager.cancelWorkById(mRequestPassivePhotoInterval.getId());
                            }
                        }
                        boolean settingsPassiveVideo = (boolean) dataSettingsButton.get("SettingsPassiveVideo");
                        if (settingsPassiveVideo == true) {
                            //
                        }
                        boolean settingsPassiveGeolocation = (boolean) dataSettingsButton.get("SettingsPassiveGeolocation");
                        if (settingsPassiveGeolocation == true) {
                            // очищаем список фоновых задач с тегом "workmng"
                            if (mRequestPassiveGeolocationInterval != null) {
                                mWorkManager.enqueue(mRequestPassiveGeolocationInterval);
                                mWorkManager.cancelWorkById(mRequestPassiveGeolocationInterval.getId());
                            }
                        }
                    }
                    boolean settingsCommitDescription = (boolean) dataSettingsButton.get("SettingsCommitDescription");
                    if (settingsCommitDescription == true) {// создаем всплывающее окно

                    }
                    boolean settingsResultCapture = (boolean) dataSettingsButton.get("SettingsResultCapture");
                    if (settingsResultCapture == true) {  //фиксируем результат исполнения процесса из предложенного варианта

                    }
                }
            }
            // Закрываем документ активного процесса
            DocumentReference washingtonRef = db.collection("WorkShift").document(activShiftDocId);
            DocumentReference docRef = db.collection("WorkShift").document(activShiftDocId);
            DocumentReference washingtonRefProcessUser = washingtonRef.collection("ProcessUser").document(idDocActivButtonUserFinalTrans);
            washingtonRefProcessUser
                    .update("ProcessUserEnd", "false")
                    .addOnSuccessListener(new OnSuccessListener < Void >() {
                        @Override
                        public void onSuccess(Void aVoid) {
                            Log.d(TAG, "DocumentSnapshot successfully updated!");
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            Log.w(TAG, "Error updating document", e);
                        }
                    });
            DocumentReference docRefProcessUser = docRef.collection("ProcessUser").document(idDocActivButtonUserFinalTrans);
            Map < String, Object > updatesProcessUser = new HashMap <>();
            updatesProcessUser.put("ProcessUserEndTime", FieldValue.serverTimestamp());

            docRefProcessUser.update(updatesProcessUser).addOnCompleteListener(new OnCompleteListener < Void >() {
                // [START_EXCLUDE]
                @Override
                public void onComplete(@NonNull Task < Void > task) {
                }
                // [START_EXCLUDE]
            });
        }
        ;
        // устанавливаем агресивный цвет фона активной кнопки

        for (PositionSettingObjectMap h : PositionSettingsMap) {
            Map dataSettingsButtonFor = h.dataSettingsButton;
            String NameDocProcessButtonFor = (String) dataSettingsButtonFor.get("SettingsTitle");
            if (settingsActiveTransitionTransferGo.equals(NameDocProcessButtonFor)) {

                activButtonId = h.idButton;
                String idSettingsButton = h.idSettingsButton;
                for (Button s : ButtonMap) {
                    int id = s.getId();
                    if (id == activButtonId) {
                        s.setBackgroundColor(getResources().getColor(R.color.colorFonActiviButton));
                        activeButton = (Button) s;
                    }
                }
                NameDocProcessButton = (String) dataSettingsButtonFor.get("SettingsTitle");
                //активизируем процесс по нажатию кнопки
                if (activeButtonControl != null) {
                    Map < String, Object > dataProcessUser = new HashMap <>();
                    dataProcessUser.put("ButtonActivationMethod", buttonActivationMethod);
                    dataProcessUser.put("EmailPositionUser", userNameEmail);
                    dataProcessUser.put("IdDocPosition", idPosition);
                    dataProcessUser.put("IdDocProcessButton", idSettingsButton);
                    dataProcessUser.put("NameDocProcessButton", NameDocProcessButton);
                    dataProcessUser.put("ParentHierarchyPositionUser", parentHierarchyPositionUserMap);
                    dataProcessUser.put("ProcessUserEnd", "");
                    dataProcessUser.put("ProcessUserStartTime", FieldValue.serverTimestamp());
                    DocumentReference washingtonRef = db.collection("WorkShift").document(activShiftDocId);
                    washingtonRef.collection("ProcessUser")
                            .add(dataProcessUser)
                            .addOnSuccessListener(new OnSuccessListener < DocumentReference >() {
                                @Override
                                public void onSuccess(DocumentReference documentReference) {
                                    Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.getId());
                                    idDocActivButtonUser = documentReference.getId();
                                }
                            })
                            .addOnFailureListener(new OnFailureListener() {
                                @Override
                                public void onFailure(@NonNull Exception e) {
                                    Log.w(TAG, "Error adding document", e);
                                }
                            });
                }
                // получаем настройки для новой активной кнопки
                boolean settingsActiveControl = (boolean) dataSettingsButtonFor.get("SettingsActiveControl");
                if (settingsActiveControl == true) {
                    //получаем настройки параметров активного контроля
                    String settingsActiveDurationSeconds = (String) dataSettingsButtonFor.get("SettingsActiveDurationSeconds");
                    String delimeter = " ";
                    String settingsActiveDurationSecondsFigure = settingsActiveDurationSeconds.split(delimeter)[0];
                    String settingsActiveDurationSecondsFigureTime = settingsActiveDurationSeconds.split(delimeter)[1];
                    long settingsActiveDurationSecondsLong = Long.parseLong(settingsActiveDurationSecondsFigure);
                    if (settingsActiveDurationSecondsFigureTime.equals("minutes")) {
                        settingsActiveDurationSecondsLong = settingsActiveDurationSecondsLong * 60;
                    };
                    settingsActiveDurationSecondsLong1000 = settingsActiveDurationSecondsLong * 1000;
                    String settingsActiveIntervalMinutes = (String) dataSettingsButtonFor.get("SettingsActiveIntervalMinutes");
                    settingsActiveIntervalMinutesFigure = settingsActiveIntervalMinutes.split(delimeter)[0];
                    String settingsActiveIntervalMinutesFigureTime = settingsActiveIntervalMinutes.split(delimeter)[1];
                    long settingsActiveIntervalMinutesFigureLong = Long.parseLong(settingsActiveIntervalMinutesFigure);
                    if (settingsActiveIntervalMinutesFigureTime.equals("minutes")) {
                        settingsActiveIntervalMinutesFigureLong = settingsActiveIntervalMinutesFigureLong * 60;
                        settingsActiveIntervalMinutesFigure = Long.toString(settingsActiveIntervalMinutesFigureLong);
                    };
                    settingsActiveSignal = (boolean) dataSettingsButtonFor.get("SettingsActiveSignal");
                    settingsActiveTransition = (String) dataSettingsButtonFor.get("SettingsActiveTransition");
                    //метод ожидания времени запуска
                    WaitingForTheQuestionOfActiveControl();
                    // вибро звонок
                    Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        vibrator.vibrate(VibrationEffect.createOneShot(500, VibrationEffect.DEFAULT_AMPLITUDE));
                    } else {
                        vibrator.vibrate(500);
                    }

                }
                //
                boolean settingsPassiveControl = (boolean) dataSettingsButtonFor.get("SettingsPassiveControl");
                if (settingsPassiveControl == true) {
                    boolean settingsPassiveAudio = (boolean) dataSettingsButtonFor.get("SettingsPassiveAudio");
                    if (settingsPassiveAudio == true) {
                        startRecordingAudio();
                    }
                    boolean settingsPassivePhoto = (boolean) dataSettingsButtonFor.get("SettingsPassivePhoto");
                    if (settingsPassivePhoto == true) {
                        //получаем настройки параметров интервала Фото фиксации
                        String settingsPassivePhotoInterval = (String) dataSettingsButtonFor.get("SettingsPassivePhotoInterval");
                        String delimeter = " ";
                        settingsPassivePhotoIntervalSecondsFigure = settingsPassivePhotoInterval.split(delimeter)[0];
                        String settingsPassivePhotoIntervalFigureTime = settingsPassivePhotoInterval.split(delimeter)[1];
                        long settingsPassivePhotoIntervalSecondsLong = Long.parseLong(settingsPassivePhotoIntervalSecondsFigure);
                        if (settingsPassivePhotoIntervalFigureTime.equals("minutes")) {
                            long settingsPassivePhotoIntervalMinutesLong = settingsPassivePhotoIntervalSecondsLong * 60;
                            settingsPassivePhotoIntervalSecondsFigure = Long.toString(settingsPassivePhotoIntervalMinutesLong);
                        }
                        boolean settingsPassivePhotoSmartphoneCamera = (boolean) dataSettingsButtonFor.get("SettingsPassivePhotoSmartphoneCamera");
                        boolean settingsPassivePhotoCameraIP = (boolean) dataSettingsButtonFor.get("SettingsPassivePhotoCameraIP");
                        boolean settingsPassivePhotoCaptureEventOnClick = (boolean) dataSettingsButtonFor.get("SettingsPassivePhotoCaptureEventOnClick");
                        if (settingsPassivePhotoCaptureEventOnClick == true) {
                            //запускае первую фото фиксацию камеры со смарфона
                                if (settingsPassivePhotoSmartphoneCamera == true) {
                                    //запускаем фото фиксацию камеры со смарфона
                                    dispatchTakePictureIntentSmartphoneCamera();
                                }
                                if(settingsPassivePhotoCameraIP == true){
                                    //запускае первую фото фиксацию с камеры IP
                                    dispatchTakePictureIntentCameraIP(idDocActivButtonUser);
                                }
                        }
                        //запускаем интервал фиксации местоположения
                        WaitingForTheQuestionOfPassivePhotoInterval(settingsPassivePhotoSmartphoneCamera,settingsPassivePhotoCameraIP);
                       // if (settingsPassivePhotoSmartphoneCamera == true) {
                            //запускаем фото фиксацию камеры со смарфона
                       //    dispatchTakePictureIntentSmartphoneCamera();
                       // }
                       // if(settingsPassivePhotoCameraIP == true){
                            //запускае первую фото фиксацию с камеры IP
                       //     dispatchTakePictureIntentCameraIP(idDocActivButtonUser);
                       // }
                    }
                    boolean settingsPassiveVideo = (boolean) dataSettingsButtonFor.get("SettingsPassiveVideo");
                    if (settingsPassiveVideo == true) {
                        //
                    }
                    boolean settingsPassiveGeolocation = (boolean) dataSettingsButtonFor.get("SettingsPassiveGeolocation");
                    if (settingsPassiveGeolocation == true) {
                        //
                        //получаем настройки параметров интервала ГЕО локации
                        String settingsPassiveGeolocationInterval = (String) dataSettingsButtonFor.get("SettingsPassiveGeolocationInterval");
                        String delimeter = " ";
                        settingsPassiveGeolocationIntervalSecondsFigure = settingsPassiveGeolocationInterval.split(delimeter)[0];
                        String settingsPassiveGeolocationIntervalFigureTime = settingsPassiveGeolocationInterval.split(delimeter)[1];
                        long settingsPassiveGeolocationIntervalSecondsLong = Long.parseLong(settingsPassiveGeolocationIntervalSecondsFigure);
                        if (settingsPassiveGeolocationIntervalFigureTime.equals("minutes")) {
                           long settingsPassiveGeolocationIntervalMinutesLong = settingsPassiveGeolocationIntervalSecondsLong * 60;
                            settingsPassiveGeolocationIntervalSecondsFigure = Long.toString(settingsPassiveGeolocationIntervalMinutesLong);
                        }
                        //запускае первую фиксацию местоположения SettingsPassiveGeolocationCaptureEventOnClick
                        boolean settingsPassiveGeolocationCaptureEventOnClick = (boolean) dataSettingsButtonFor.get("SettingsPassiveGeolocationCaptureEventOnClick");
                        if(settingsPassiveGeolocationCaptureEventOnClick == true)
                        {
                            getCurrentLocationGEO();
                        }
                        //запускаем интервал фиксации местоположения
                        WaitingForTheQuestionOfPassiveGeolocationInterval();
                    }
                }
            }
        }
    }


    // разрешение для доступа к микрофону и работы с файлами
    private void requestPermission() {
        ActivityCompat.requestPermissions(UserProcessActivity.this, new
                String[]{RECORD_AUDIO, ACCESS_FINE_LOCATION, CAMERA}, RequestPermissionCode);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String permissions[], int[] grantResults) {
        switch (requestCode) {
            case RequestPermissionCode:
                if (grantResults.length > 0) {
                    boolean RecordPermission = grantResults[0] ==
                            PackageManager.PERMISSION_GRANTED;
                    boolean LocationPermission = grantResults[1] ==
                            PackageManager.PERMISSION_GRANTED;
                    boolean CameraPermission = grantResults[2] ==
                            PackageManager.PERMISSION_GRANTED;

                    if (RecordPermission && LocationPermission && CameraPermission) {
                        Toast.makeText(UserProcessActivity.this, "Permission Granted",
                                Toast.LENGTH_LONG).show();
                    } else {
                        Toast.makeText(UserProcessActivity.this, "Permission Denied", Toast.LENGTH_LONG).show();
                    }
                }
                break;
        }
    }

    public boolean checkPermission() {
        int result = ContextCompat.checkSelfPermission(getApplicationContext(),
                RECORD_AUDIO);
        int result1 = ContextCompat.checkSelfPermission(getApplicationContext(),
                ACCESS_FINE_LOCATION);
        int result2 = ContextCompat.checkSelfPermission(getApplicationContext(),
                CAMERA);

        return //result == PackageManager.PERMISSION_GRANTED &&
               result == PackageManager.PERMISSION_GRANTED &&
               result1 == PackageManager.PERMISSION_GRANTED &&
               result2 == PackageManager.PERMISSION_GRANTED;

    }

    public String CreateRandomAudioFileName(int string) {
        StringBuilder stringBuilder = new StringBuilder(string);
        int i = 0;
        while (i < string) {
            stringBuilder.append(RandomAudioFileName.
                    charAt(random.nextInt(RandomAudioFileName.length())));
            i++;
        }
        return stringBuilder.toString();
    }

    // запись аудио и создание Media Recorder
    protected void startRecordingAudio() {
        if (checkPermission()) {
            fileName = getExternalCacheDir().getAbsolutePath() + "/audiorecord_" + idDocActivButtonUser + ".m4a";
            recorder = new MediaRecorder();
            recorder.setAudioSource(MediaRecorder.AudioSource.MIC);

            recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
            recorder.setOutputFile(fileName);
            recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC_ELD);
            try {
                recorder.prepare();
                recorder.start();
            } catch (IllegalStateException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            Toast.makeText(UserProcessActivity.this, "Recording started",
                    Toast.LENGTH_LONG).show();
        } else {
            requestPermission();
        }
    }

    // стоп аудио
    private void stopRecordingAudio() {
        recorder.stop();
        recorder.reset();
        recorder.release();
        recorder = null;
        // File or Blob
        // Файл или Blob
        Uri file = Uri.fromFile(new File(fileName));
        // Create the file metadata
        // Создаем метаданные файла
        StorageMetadata metadata = new StorageMetadata.Builder()
                .setContentType("audio/.mp4")
                .build();
        // Upload file and metadata to the path 'images/mountains.jpg'
        // Загрузить файл и метаданные по пути images / mountains.jpg'
        UploadTask uploadTask = storageRef.child("AudioRecordingOfEvents/" + file.getLastPathSegment()).putFile(file, metadata);
        // Listen for state changes, errors, and completion of the upload.
        // Слушаем изменения состояния, ошибки и завершение загрузки
        uploadTask.addOnProgressListener(new OnProgressListener < UploadTask.TaskSnapshot >() {
            @Override
            public void onProgress(UploadTask.TaskSnapshot taskSnapshot) {
                double progress = ( 100.0 * taskSnapshot.getBytesTransferred() ) / taskSnapshot.getTotalByteCount();
                Log.d(TAG, "Upload is " + progress + "% done");
            }
        }).addOnPausedListener(new OnPausedListener < UploadTask.TaskSnapshot >() {
            @Override
            public void onPaused(UploadTask.TaskSnapshot taskSnapshot) {
                Log.d(TAG, "Upload is paused");
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception exception) {
                // Handle unsuccessful uploads
            }
        }).addOnSuccessListener(new OnSuccessListener < UploadTask.TaskSnapshot >() {
            @Override
            public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                // Handle successful uploads on complete
                // Обработка успешных загрузок по завершении
                // ...
                File fileDelete = new File(fileName);
                if (fileDelete.delete()) {
                    System.out.println("File deleted!");
                } else System.out.println("File not found!");
            }
        });
    }

    // ----запуск ожидания PassiveGeolocationInterval-----
    private void WaitingForTheQuestionOfPassiveGeolocationInterval() {
        //метод ожидания времени запуска
        Data myDataGeolocationInterval = new Data.Builder()
                .putString("Interval_SECONDS", settingsPassiveGeolocationIntervalSecondsFigure)
                .build();
        mRequestPassiveGeolocationInterval = new OneTimeWorkRequest.Builder(NotificationWorker.class).setInputData(myDataGeolocationInterval).build();
        WorkManager.getInstance().enqueue(mRequestPassiveGeolocationInterval);
        //проверка статуса
        mWorkManager.getWorkInfoByIdLiveData(mRequestPassiveGeolocationInterval.getId()).observe(UserProcessActivity.this, new Observer < WorkInfo >() {
            @Override
            public void onChanged(@Nullable WorkInfo workInfo) {
                if (workInfo != null) {
                    WorkInfo.State state = workInfo.getState();
                    if (state == SUCCEEDED) {
                        //подаем звуковой сигнал
                        getCurrentLocationGEO();

                    }

                }
            }
        });
    }


    // получаем данные для геолокация
    public void getCurrentLocationGEO() {
        if (checkPermission()) {
            fusedLocationClient = LocationServices.getFusedLocationProviderClient(UserProcessActivity.this);
            fusedLocationClient.getLastLocation()
                    .addOnSuccessListener(UserProcessActivity.this, new OnSuccessListener < Location >() {
                        @Override
                        public void onSuccess(Location location) {
                            // Got last known location. In some rare situations this can be null.
                            if (location != null) {
                                // Logic to handle location object
                                double latitude = location.getLatitude();
                                double longitude = location.getLongitude();
                                GeoPoint locationCoordinates = new GeoPoint(latitude,longitude);
                                // Add a new document with a generated id.
                                Map<String, Object> data = new HashMap<>();
                                data.put("IdDocActivButtonUser", idDocActivButtonUser);
                                data.put("LocationCoordinates", locationCoordinates);
                                data.put("CheckInTimeLocationCoordinates", FieldValue.serverTimestamp());
                                db.collection("CurrentLocation")
                                        .add(data)
                                        .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                                            @Override
                                            public void onSuccess(DocumentReference documentReference) {
                                                Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.getId());
                                            }
                                        })
                                        .addOnFailureListener(new OnFailureListener() {
                                            @Override
                                            public void onFailure(@NonNull Exception e) {
                                                Log.w(TAG, "Error adding document", e);
                                            }
                                        });
                            }
                        }
                    });
            return;
        } else {
            requestPermission();
        }
    }
    //создаем адрес и название файла фото фиксации c камеры смартфона
  private File createImageFile() throws IOException {
        // Create an image file name
        // Создаем имя файла изображения
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String imageFileName = "Foto_"+idDocActivButtonUser+"_" + timeStamp + "_";
        File storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        //File storageDir = getExternalCacheDir();
        File image = File.createTempFile(
                imageFileName,  /* prefix */
                ".jpg",         /* suffix */
                storageDir      /* directory */
        );
        // Save a file: path for use with ACTION_VIEW intents
        // Сохраняем файл: путь для использования с намерениями ACTION_VIEW
     //   currentPhotoPath = image.getAbsolutePath();
        return image;
    }
    //
  private void dispatchTakePictureIntentSmartphoneCamera() {
            // Create the File where the photo should go
            // Создаем файл, в котором должно быть фото
            File photoFile = null;
            try {
                photoFile = createImageFile();
            } catch (IOException ex) {
                // Error occurred while creating the File
                // Ошибка при создании файла
                System.out.println("Photo file not created!");
            }
            // Continue only if the File was successfully created
            // Продолжаем, только если файл был успешно создан
            if (photoFile != null) {
                System.out.println("Photo file add!");
                startFoto(photoFile);
            }
        }
    ////////////////////////////
  public void startFoto (File photoFile){
        // делаем фото
        //cameraProvider.bindToLifecycle((LifecycleOwner)this, cameraSelector, imageCapture, imageAnalysis, preview);
        //сохраняем фото в файл
        ImageCapture.OutputFileOptions.Builder outputFileOptionsBuilder =
                new ImageCapture.OutputFileOptions.Builder(photoFile);
            imageCapture.takePicture(outputFileOptionsBuilder.build(), Runnable::run, new ImageCapture.OnImageSavedCallback() {
            @Override
            public void onImageSaved(@NonNull ImageCapture.OutputFileResults outputFileResults) {
                //ggg();
                Bundle params = new Bundle();
                params.putString("FILE_PATH", photoFile.getPath());
                // подготовка к удалению файла
                Uri file = Uri.fromFile(new File(String.valueOf(photoFile)));
                // Create the file metadata
                // Создаем метаданные файла
                StorageMetadata metadata = new StorageMetadata.Builder()
                        .setContentType("foto/.jpg")
                        .build();
                // Upload file and metadata to the path 'images/mountains.jpg'
                // Загрузить файл и метаданные по пути images / mountains.jpg'
                UploadTask uploadTask = storageRef.child("FotoOfEvents/" + file.getLastPathSegment()).putFile(file, metadata);
                // Listen for state changes, errors, and completion of the upload.
                // Слушаем изменения состояния, ошибки и завершение загрузки
                uploadTask.addOnProgressListener(new OnProgressListener < UploadTask.TaskSnapshot >() {
                    @Override
                    public void onProgress(UploadTask.TaskSnapshot taskSnapshot) {
                        double progress = ( 100.0 * taskSnapshot.getBytesTransferred() ) / taskSnapshot.getTotalByteCount();
                        Log.d(TAG, "Upload is " + progress + "% done");
                    }
                }).addOnPausedListener(new OnPausedListener < UploadTask.TaskSnapshot >() {
                    @Override
                    public void onPaused(UploadTask.TaskSnapshot taskSnapshot) {
                        Log.d(TAG, "Upload is paused");
                    }
                }).addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception exception) {
                        // Handle unsuccessful uploads
                    }
                }).addOnSuccessListener(new OnSuccessListener < UploadTask.TaskSnapshot >() {
                    @Override
                    public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                        // Handle successful uploads on complete
                        // Обработка успешных загрузок по завершении
                        File fileDelete = new File(String.valueOf(photoFile));
                        if (fileDelete.delete()) {
                            System.out.println("File deleted!");
                        } else System.out.println("File not found!");
                    }
                });
            }
            @Override
            public void onError(@NonNull ImageCaptureException exception) {
                exception.printStackTrace();
            }
        });
    }
 // ----запуск ожидания PassivePhotoInterval-----
    private void WaitingForTheQuestionOfPassivePhotoInterval(boolean settingsPassivePhotoSmartphoneCamera,boolean settingsPassivePhotoCameraIP) {
        //метод ожидания времени запуска
        Data myDataPassivePhotoInterval = new Data.Builder()
                .putString("Interval_SECONDS", settingsPassivePhotoIntervalSecondsFigure)
                .build();
        mRequestPassivePhotoInterval = new OneTimeWorkRequest.Builder(NotificationWorker.class).setInputData(myDataPassivePhotoInterval).build();
        WorkManager.getInstance().enqueue(mRequestPassivePhotoInterval);
        //проверка статуса
        mWorkManager.getWorkInfoByIdLiveData(mRequestPassivePhotoInterval.getId()).observe(UserProcessActivity.this, new Observer < WorkInfo >() {
            @Override
            public void onChanged(@Nullable WorkInfo workInfo) {
                if (workInfo != null) {
                    WorkInfo.State state = workInfo.getState();
                    if (state == SUCCEEDED) {
                        //запускаем интервал фиксации местоположения
                        WaitingForTheQuestionOfPassivePhotoInterval(settingsPassivePhotoSmartphoneCamera, settingsPassivePhotoCameraIP);
                        if (settingsPassivePhotoSmartphoneCamera == true) {
                            //запускаем фото фиксацию камеры со смарфона
                            dispatchTakePictureIntentSmartphoneCamera();
                        }
                        if(settingsPassivePhotoCameraIP == true){
                            //запускае первую фото фиксацию с камеры IP
                            dispatchTakePictureIntentCameraIP(idDocActivButtonUser);
                        }
                    }
                }
            }
        });
    }
    //создаем адрес и название файла фото фиксации c камеры IP
    private Task<String> dispatchTakePictureIntentCameraIP(String text)
    {  //Отправляем и получаем обработанные данные с сервера списком в каких должностях принимает участие пользователь
       Map<String, Object> data = new HashMap<>();
       data.put("text", text);
       data.put("push", true);
       return mFunctions
          .getHttpsCallable("addDispatchTakePictureIntentCameraIP")
          .call(data)
          .continueWith(new Continuation < HttpsCallableResult, String>() {
              @Override
              public String then(@NonNull Task<HttpsCallableResult> task) throws Exception {
              // This continuation runs on either success or failure, but if the task
              // has failed then getResult() will throw an Exception which will be
              // propagated down.
              // Это продолжение выполняется при успехе или неудаче, но если задача
              // не удалось, тогда getResult () выдаст исключение, которое будет
              // распространились вниз.
              HashMap rezult = (HashMap) task.getResult().getData();
              String functionResult = (String) rezult.get("text");
              //задержка
              Thread.sleep(10000);
              return functionResult;
          }
       });
    }
    //обработка выбора в верхнем меню
    @Override
    public boolean onOptionsItemSelected(MenuItem item)
    {
        // Операции для выбранного пункта меню
        switch (item.getItemId())
        {
            case R.id.note_traffic:
                noteTraffic();
                return true;
            case R.id.note_text:
                noteText();
                return true;
            case R.id.note_list:
                noteList();
                return true;
            case R.id.note_foto:
                noteFoto();
                return true;
        //    case R.id.note_video:
        //        noteVideo();
        //        return true;
            case R.id.note_audio:
                noteAudio();
                return true;
            case R.id.note_geo:
                noteGEO();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    public void noteTraffic()
    {
        if ( PositionSettingsNoteTrafficMap != null)
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(UserProcessActivity.this);
            builder.setTitle("Select traffic source");
            final List < String > settings_array_note_traffic = new ArrayList <>();
            String settingsNoteTrafficOption1 = (String) PositionSettingsNoteTrafficMap.get("SettingsNoteTrafficOption1");
            if (settingsNoteTrafficOption1 != "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption1);
            }
            String settingsNoteTrafficOption2 = (String) PositionSettingsNoteTrafficMap.get("SettingsNoteTrafficOption2");
            if (settingsNoteTrafficOption2 != "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption2);
            }
            String settingsNoteTrafficOption3 = (String) PositionSettingsNoteTrafficMap.get("SettingsNoteTrafficOption3");
            if (settingsNoteTrafficOption3 != "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption3);
            }
            String settingsNoteTrafficOption4 = (String) PositionSettingsNoteTrafficMap.get("SettingsNoteTrafficOption4");
            if (settingsNoteTrafficOption4 != "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption4);
            }
            String settingsNoteTrafficOption5 = (String) PositionSettingsNoteTrafficMap.get("SettingsNoteTrafficOption5");
            if (settingsNoteTrafficOption5 != "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption5);
            }
            String settingsNoteTrafficOption6 = (String) PositionSettingsNoteTrafficMap.get("SettingsNoteTrafficOption6");
            if (settingsNoteTrafficOption6 != "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption6);
            }
            String settingsNoteTrafficOption7 = (String) PositionSettingsNoteTrafficMap.get("SettingsNoteTrafficOption7");
            if (settingsNoteTrafficOption7 != "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption7);
            }
            String settingsNoteTrafficOption8 = (String) PositionSettingsNoteTrafficMap.get("SettingsNoteTrafficOption8");
            if (settingsNoteTrafficOption8 != "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption8);
            }
            String settingsNoteTrafficOption9 = (String) PositionSettingsNoteTrafficMap.get("SettingsNoteTrafficOption9");
            if (settingsNoteTrafficOption9 != "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption9);
            }
            String settingsNoteTrafficOption10 = (String) PositionSettingsNoteTrafficMap.get("SettingsNoteTrafficOption10");
            if (settingsNoteTrafficOption10 != "") {
                settings_array_note_traffic.add(settingsNoteTrafficOption10);
            }
            if (settings_array_note_traffic.size() != 0) {
                ArrayAdapter < String > dataAdapter = new ArrayAdapter < String >(UserProcessActivity.this,
                        android.R.layout.simple_dropdown_item_1line, settings_array_note_traffic);
                builder.setAdapter(dataAdapter, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Toast.makeText(UserProcessActivity.this, "You have selected " + settings_array_note_traffic.get(which), Toast.LENGTH_LONG).show();
                        String resultControlButton = settings_array_note_traffic.get(which);
                        //добавляем документ
                        // Add a new document with a generated id.
                        Map<String, Object> data = new HashMap<>();
                        data.put("NoteSource", "note_traffic");
                        data.put("NoteParent", idDocActivButtonUser);
                        data.put("NoteTime", FieldValue.serverTimestamp());
                        data.put("NoteText", resultControlButton);
                        data.put("NoteUser", userNameEmail);
                        data.put("NoteStatus", "false");
                        data.put("NoteComment", "");
                        data.put("NoteParentName", NameDocProcessButton);
                        data.put("NoteIdDocPosition", idPosition);

                        db.collection("Note")
                                .add(data)
                                .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                                    @Override
                                    public void onSuccess(DocumentReference documentReference) {
                                        Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.getId());
                                    }
                                })
                                .addOnFailureListener(new OnFailureListener() {
                                    @Override
                                    public void onFailure(@NonNull Exception e) {
                                        Log.w(TAG, "Error adding document", e);
                                    }
                                });
                    }
                });
                AlertDialog dialog = builder.create();
                dialog.show();
            }
        }
    }
    //диалоговое окно для текстовой заметки
    public void noteText()
    {  //открываем окно для заметки
        LayoutInflater li = LayoutInflater.from(context);
        View promptsView = li.inflate(R.layout.prompt, null);
        AlertDialog.Builder builder = new AlertDialog.Builder(UserProcessActivity.this);
        builder.setView(promptsView);
        final EditText userInput = (EditText) promptsView.findViewById(R.id.input_text);
        builder.setTitle("Write a note")
                .setCancelable(false)
                .setPositiveButton("OK",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                //получаем текст комментария
                                String noteText = userInput.getText().toString();
                                //создаем документ
                                // Add a new document with a generated id.
                                Map<String, Object> data = new HashMap<>();
                                data.put("NoteSource", "note_text");
                                data.put("NoteParent", idDocActivButtonUser);
                                data.put("NoteTime", FieldValue.serverTimestamp());
                                data.put("NoteText", noteText);
                                data.put("NoteUser", userNameEmail);
                                data.put("NoteStatus", "");
                                data.put("NoteComment", "");
                                data.put("NoteParentName", NameDocProcessButton);
                                data.put("NoteIdDocPosition", idPosition);

                                db.collection("Note")
                                        .add(data)
                                        .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                                            @Override
                                            public void onSuccess(DocumentReference documentReference) {
                                                Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.getId());
                                            }
                                        })
                                        .addOnFailureListener(new OnFailureListener() {
                                            @Override
                                            public void onFailure(@NonNull Exception e) {
                                                Log.w(TAG, "Error adding document", e);
                                            }
                                        });
                            }
                        })
                .setNegativeButton("Cansel",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                dialog.cancel();
                            }
                        });
        AlertDialog alert = builder.create();
        alert.show();
    }

    public void noteList()
    {
        if ( PositionSettingsNoteListMap != null)
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(UserProcessActivity.this);
            builder.setTitle("Select note");
            final List < String > settings_array_note_list = new ArrayList <>();
            String settingsNoteListOption1 = (String) PositionSettingsNoteListMap.get("SettingsNoteListOption1");
            if (settingsNoteListOption1 != "") {
                settings_array_note_list.add(settingsNoteListOption1);
            }
            String settingsNoteListOption2 = (String) PositionSettingsNoteListMap.get("SettingsNoteListOption2");
            if (settingsNoteListOption2 != "") {
                settings_array_note_list.add(settingsNoteListOption2);
            }
            String settingsNoteListOption3 = (String) PositionSettingsNoteListMap.get("SettingsNoteListOption3");
            if (settingsNoteListOption3 != "") {
                settings_array_note_list.add(settingsNoteListOption3);
            }
            String settingsNoteListOption4 = (String) PositionSettingsNoteListMap.get("SettingsNoteListOption4");
            if (settingsNoteListOption4 != "") {
                settings_array_note_list.add(settingsNoteListOption4);
            }
            String settingsNoteListOption5 = (String) PositionSettingsNoteListMap.get("SettingsNoteListOption5");
            if (settingsNoteListOption5 != "") {
                settings_array_note_list.add(settingsNoteListOption5);
            }
            String settingsNoteListOption6 = (String) PositionSettingsNoteListMap.get("SettingsNoteListOption6");
            if (settingsNoteListOption6 != "") {
                settings_array_note_list.add(settingsNoteListOption6);
            }
            String settingsNoteListOption7 = (String) PositionSettingsNoteListMap.get("SettingsNoteListOption7");
            if (settingsNoteListOption7 != "") {
                settings_array_note_list.add(settingsNoteListOption7);
            }
            String settingsNoteListOption8 = (String) PositionSettingsNoteListMap.get("SettingsNoteListOption8");
            if (settingsNoteListOption8 != "") {
                settings_array_note_list.add(settingsNoteListOption8);
            }
            String settingsNoteListOption9 = (String) PositionSettingsNoteListMap.get("SettingsNoteListOption9");
            if (settingsNoteListOption9 != "") {
                settings_array_note_list.add(settingsNoteListOption9);
            }
            String settingsNoteListOption10 = (String) PositionSettingsNoteListMap.get("SettingsNoteListOption10");
            if (settingsNoteListOption10 != "") {
                settings_array_note_list.add(settingsNoteListOption10);
            }
            if (settings_array_note_list.size() != 0) {
                ArrayAdapter < String > dataAdapter = new ArrayAdapter < String >(UserProcessActivity.this,
                        android.R.layout.simple_dropdown_item_1line, settings_array_note_list);
                builder.setAdapter(dataAdapter, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Toast.makeText(UserProcessActivity.this, "You have selected " + settings_array_note_list.get(which), Toast.LENGTH_LONG).show();
                        String resultControlButton = settings_array_note_list.get(which);
                        //добавляем документ
                        //создаем документ
                        // Add a new document with a generated id.
                        Map<String, Object> data = new HashMap<>();
                        data.put("NoteSource", "note_list");
                        data.put("NoteParent", idDocActivButtonUser);
                        data.put("NoteTime", FieldValue.serverTimestamp());
                        data.put("NoteText", resultControlButton);
                        data.put("NoteUser", userNameEmail);
                        data.put("NoteStatus", "");
                        data.put("NoteComment", "");
                        data.put("NoteParentName", NameDocProcessButton);
                        data.put("NoteIdDocPosition", idPosition);


                        db.collection("Note")
                                .add(data)
                                .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                                    @Override
                                    public void onSuccess(DocumentReference documentReference) {
                                        Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.getId());
                                    }
                                })
                                .addOnFailureListener(new OnFailureListener() {
                                    @Override
                                    public void onFailure(@NonNull Exception e) {
                                        Log.w(TAG, "Error adding document", e);
                                    }
                                });
                    }
                });
                AlertDialog dialog = builder.create();
                dialog.show();
            }
        }
    }
    //открываем экран для трансляции камеры
    public void noteFoto()
    {  // скрываем кнопки основного экрана и показываем для камеры
        linearLayoutButton.setVisibility(View.GONE);
        buttonExpect.setVisibility(View.GONE);
        buttonOther.setVisibility(View.GONE);
        buttonGone.setVisibility(View.GONE);
        containerPreviewView.setVisibility(View.VISIBLE);
        buttonFoto.setVisibility(View.VISIBLE);
        buttonFotoCansel.setVisibility(View.VISIBLE);
    }
    //делаем Фото заметку
    public void buttonFotoOpen(View view)
    {
        // Создаем файл, в котором должно быть фото
        File photoFile = null;
        try {
            photoFile = createFotoNoteImageFile();
        } catch (IOException ex) {
            // Error occurred while creating the File
            // Ошибка при создании файла
            System.out.println("Photo file not created!");
        }
        // Continue only if the File was successfully created
        // Продолжаем, только если файл был успешно создан
        if (photoFile != null) {
            System.out.println("Photo file add!");
            startFotoNote(photoFile);
        }
        // скрываем кнопки основного экрана и показываем для камеры
        containerPreviewView.setVisibility(View.GONE);
        buttonFoto.setVisibility(View.GONE);
        buttonFotoCansel.setVisibility(View.GONE);
        linearLayoutButton.setVisibility(View.VISIBLE);
        buttonExpect.setVisibility(View.VISIBLE);
        buttonOther.setVisibility(View.VISIBLE);
        buttonGone.setVisibility(View.VISIBLE);

    }
    //создаем адрес и название файла фото фиксации c камеры смартфона
    private File createFotoNoteImageFile() throws IOException {
        // Create an image file name
        // Создаем имя файла изображения
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String imageFileName = "FotoNote_"+idDocActivButtonUser+"_" + timeStamp + "_";
        File storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        //File storageDir = getExternalCacheDir();
        File image = File.createTempFile(
                imageFileName,  /* prefix */
                ".jpg",         /* suffix */
                storageDir      /* directory */
        );
        // Save a file: path for use with ACTION_VIEW intents
        // Сохраняем файл: путь для использования с намерениями ACTION_VIEW
        //   currentPhotoPath = image.getAbsolutePath();
        return image;
    }
    ////////////////////////////
    public void startFotoNote (File photoFile){
        // делаем фото
        //cameraProvider.bindToLifecycle((LifecycleOwner)this, cameraSelector, imageCapture, imageAnalysis, preview);
        //сохраняем фото в файл
        ImageCapture.OutputFileOptions.Builder outputFileOptionsBuilder =
                new ImageCapture.OutputFileOptions.Builder(photoFile);
        imageCapture.takePicture(outputFileOptionsBuilder.build(), Runnable::run, new ImageCapture.OnImageSavedCallback() {
            @Override
            public void onImageSaved(@NonNull ImageCapture.OutputFileResults outputFileResults) {
                //ggg();
                Bundle params = new Bundle();
                params.putString("FILE_PATH", photoFile.getPath());
                // подготовка к удалению файла
                Uri file = Uri.fromFile(new File(String.valueOf(photoFile)));
                // Create the file metadata
                // Создаем метаданные файла
                StorageMetadata metadata = new StorageMetadata.Builder()
                        .setContentType("foto/.jpg")
                        .build();
                // Upload file and metadata to the path 'images/mountains.jpg'
                // Загрузить файл и метаданные по пути images / mountains.jpg'
                UploadTask uploadTask = storageRef.child("FotoOfNote/" + file.getLastPathSegment()).putFile(file, metadata);
                // Listen for state changes, errors, and completion of the upload.
                // Слушаем изменения состояния, ошибки и завершение загрузки
                uploadTask.addOnProgressListener(new OnProgressListener < UploadTask.TaskSnapshot >() {
                    @Override
                    public void onProgress(UploadTask.TaskSnapshot taskSnapshot) {
                        double progress = ( 100.0 * taskSnapshot.getBytesTransferred() ) / taskSnapshot.getTotalByteCount();
                        Log.d(TAG, "Upload is " + progress + "% done");
                    }
                }).addOnPausedListener(new OnPausedListener < UploadTask.TaskSnapshot >() {
                    @Override
                    public void onPaused(UploadTask.TaskSnapshot taskSnapshot) {
                        Log.d(TAG, "Upload is paused");
                    }
                }).addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception exception) {
                        // Handle unsuccessful uploads
                    }
                }).addOnSuccessListener(new OnSuccessListener < UploadTask.TaskSnapshot >() {
                    @Override
                    public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                        // Handle successful uploads on complete
                        // Обработка успешных загрузок по завершении
                        File fileDelete = new File(String.valueOf(photoFile));
                        if (fileDelete.delete()) {
                            System.out.println("File deleted!");
                        } else System.out.println("File not found!");
                    }
                });
            }
            @Override
            public void onError(@NonNull ImageCaptureException exception) {
                exception.printStackTrace();
            }
        });
    }
    //отмена экрана вывода фото заметки
    public void buttonFotoCansel(View view)
    { // скрываем кнопки основного экрана и показываем для камеры
        containerPreviewView.setVisibility(View.GONE);
        buttonFoto.setVisibility(View.GONE);
        buttonFotoCansel.setVisibility(View.GONE);
        linearLayoutButton.setVisibility(View.VISIBLE);
        buttonExpect.setVisibility(View.VISIBLE);
        buttonOther.setVisibility(View.VISIBLE);
        buttonGone.setVisibility(View.VISIBLE);
    }
 //   public void noteVideo()
 //   {
        // edtext.setText("Выбран пункт Справка");
 //   }
    //запускаем запись аудио заметки
    public void noteAudio() {
        if (recorder == null) {
            if (checkPermission()) {
                String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
                String fileNameNote = getExternalCacheDir().getAbsolutePath() + "/audioNote_" + idDocActivButtonUser + "_" + timeStamp + "_" + ".m4a";
                recorder = new MediaRecorder();
                recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
                recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
                recorder.setOutputFile(fileNameNote);
                recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC_ELD);
                try {
                    recorder.prepare();
                    recorder.start();
                } catch (IllegalStateException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                Toast.makeText(UserProcessActivity.this, "Recording started",
                        Toast.LENGTH_LONG).show();
                        noteAudioStop(fileNameNote);
            } else {
                requestPermission();
            }
        }
        Toast.makeText(UserProcessActivity.this, "Recording active",
                Toast.LENGTH_LONG).show();
    }
    //открываем диалоговое окно для остановки записи аудио заметки
    public void noteAudioStop(String fileNameNote)
    {
        AlertDialog.Builder builder = new AlertDialog.Builder(UserProcessActivity.this);
        builder.setTitle("Recording an audio note!");
    //    builder.setMessage(content);
        builder.setPositiveButton("Stop",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog,
                                        int which) {
                        recorder.stop();
                        recorder.reset();
                        recorder.release();
                        recorder = null;
                        Toast.makeText(UserProcessActivity.this, "Recording stop",
                                Toast.LENGTH_LONG).show();
                        // File or Blob
                        // Файл или Blob
                        Uri file = Uri.fromFile(new File(fileNameNote));
                        // Create the file metadata
                        // Создаем метаданные файла
                        StorageMetadata metadata = new StorageMetadata.Builder()
                                .setContentType("audio/.mp4")
                                .build();
                        // Upload file and metadata to the path 'images/mountains.jpg'
                        // Загрузить файл и метаданные по пути images / mountains.jpg'
                        UploadTask uploadTask = storageRef.child("AudioRecordingOfNote/" + file.getLastPathSegment()).putFile(file, metadata);
                        // Listen for state changes, errors, and completion of the upload.
                        // Слушаем изменения состояния, ошибки и завершение загрузки
                        uploadTask.addOnProgressListener(new OnProgressListener < UploadTask.TaskSnapshot >() {
                            @Override
                            public void onProgress(UploadTask.TaskSnapshot taskSnapshot) {
                                double progress = ( 100.0 * taskSnapshot.getBytesTransferred() ) / taskSnapshot.getTotalByteCount();
                                Log.d(TAG, "Upload is " + progress + "% done");
                            }
                        }).addOnPausedListener(new OnPausedListener < UploadTask.TaskSnapshot >() {
                            @Override
                            public void onPaused(UploadTask.TaskSnapshot taskSnapshot) {
                                Log.d(TAG, "Upload is paused");
                            }
                        }).addOnFailureListener(new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception exception) {
                                // Handle unsuccessful uploads
                            }
                        }).addOnSuccessListener(new OnSuccessListener < UploadTask.TaskSnapshot >() {
                            @Override
                            public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                                // Handle successful uploads on complete
                                // Обработка успешных загрузок по завершении
                                // ...
                                File fileDelete = new File(fileNameNote);
                                if (fileDelete.delete()) {
                                    System.out.println("File deleted!");
                                } else System.out.println("File not found!");
                            }
                        });
                    }
                });
        // устанавливаем кнопку, которая отвечает за выбранный нами ответ
        // в данном случаем мы просто хотим всплывающее окно с отменой
        builder.show();
    }
    public void noteGEO()
    {
        if (checkPermission()) {
            fusedLocationClient = LocationServices.getFusedLocationProviderClient(UserProcessActivity.this);
            fusedLocationClient.getLastLocation()
                    .addOnSuccessListener(UserProcessActivity.this, new OnSuccessListener < Location >() {
                        @Override
                        public void onSuccess(Location location) {
                            // Got last known location. In some rare situations this can be null.
                            if (location != null) {
                                // Logic to handle location object
                                double latitude = location.getLatitude();
                                double longitude = location.getLongitude();
                                GeoPoint locationCoordinates = new GeoPoint(latitude,longitude);
                                //создаем документ
                                Map<String, Object> data = new HashMap<>();
                                data.put("NoteSource", "note_geo");
                                data.put("NoteParent", idDocActivButtonUser);
                                data.put("NoteTime", FieldValue.serverTimestamp());
                                data.put("NoteText", locationCoordinates);
                                data.put("NoteUser", userNameEmail);
                                data.put("NoteStatus", "false");
                                data.put("NoteComment", "");
                                data.put("NoteParentName", NameDocProcessButton);
                                data.put("NoteIdDocPosition", idPosition);

                                db.collection("Note")
                                        .add(data)
                                        .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                                            @Override
                                            public void onSuccess(DocumentReference documentReference) {
                                                Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.getId());
                                            }
                                        })
                                        .addOnFailureListener(new OnFailureListener() {
                                            @Override
                                            public void onFailure(@NonNull Exception e) {
                                                Log.w(TAG, "Error adding document", e);
                                            }
                                        });
                            }
                        }
                    });
            return;
        } else {
            requestPermission();
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        UserProcessActivityObserver.disconnect();
    }

}


