package com.TMR24.MotionStudy;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.work.Data;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.functions.FirebaseFunctions;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static androidx.work.WorkInfo.State.SUCCEEDED;

public class UserProcessActivity extends AppCompatActivity
{
    public static final String MESSAGE_STATUS = "message_status";
    private TextView textActivPosition;
    private FirebaseFirestore db;
    private FirebaseFunctions mFunctions;
    private StorageReference mStorageRef;
    // ID активного документа в данный момент в коллекции ProcessUser
    private String idDocActivButtonUser;
    // ID активной кнопки в данный момент времени
    private int activButtonId;
    // активная кнопка в данный момент времени
    private Button activeButton;
    // ID активного документа смены в данный момент
    private String activShiftDocId;

    private String TAG, userNameEmail, parentHierarchyShiftUser, idPosition;
    private Button buttonCloseShift, buttonExpect, buttonOther, buttonGone, button;
    private Map parentHierarchyPositionUserMap;
    private List<PositionSettingObjectMap> PositionSettingsMap = new ArrayList();
    private List<Button> ButtonMap = new ArrayList();
    private LinearLayout linearLayoutButton;
    private Window window;
   // private ReceiverActiveActivityControl alarm;
    final Context context = this;
    public AlertDialog.Builder builder1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_process);
        init();

    }
    private void init()
    {
        db = FirebaseFirestore.getInstance();
        mStorageRef = FirebaseStorage.getInstance().getReference();
        mFunctions = FirebaseFunctions.getInstance();
        textActivPosition = findViewById(R.id.textActivPosition);
        buttonCloseShift = findViewById(R.id.buttonCloseShift);
        linearLayoutButton = findViewById(R.id.linearLayoutButton);
        buttonExpect = findViewById(R.id.buttonExpect);
        buttonOther = findViewById(R.id.buttonOther);
        buttonGone = findViewById(R.id.buttonGone);
        window = getWindow();
       // alarm = new ReceiverActiveActivityControl();
    }
    @SuppressLint("ResourceType")
    public void onStart()
    {
      super.onStart();
      Intent i = getIntent();
      if (i != null)
        {   //window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
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
        textActivPosition.setText(nameOrganization+" > "+nameSubdivision+" > "+namePosition);
            //получаем parentHierarchyPositionUserMap из документа Активной смены
            DocumentReference docRef = db.collection("WorkShift").document(activShiftDocId);
            docRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                @Override
                public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                    if (task.isSuccessful()) {
                        DocumentSnapshot document = task.getResult();
                        if (document.exists()) {
                            Log.d(TAG, "DocumentSnapshot data: " + document.getData());
                            Map <String, Object> doc = document.getData();
                            parentHierarchyPositionUserMap = (Map<String, Object>) doc.get("ParentHierarchyPositionUser");
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
            Map<String, Object> dataSettingsButtonExpect = new HashMap<>();
            dataSettingsButtonExpect.put("SettingsTitle", settingsTitleExpect);
            dataSettingsButtonExpect.put("SettingsActiveControl", settingsActiveControl);
            dataSettingsButtonExpect.put("SettingsPassiveControl", settingsPassiveControl);
            dataSettingsButtonExpect.put("SettingsCommitDescription", settingsCommitDescriptionExpect);
            dataSettingsButtonExpect.put("SettingsResultCapture", settingsResultCapture);
            PositionSettingObjectMap positionSettingsObjectExpect = new PositionSettingObjectMap(idButtonExpect,idSettingsButtonExpect,dataSettingsButtonExpect);
            PositionSettingsMap.add(positionSettingsObjectExpect);
            buttonExpect.setId(idButtonExpect);
            String idSettingsButtonOther = "buttonOther";
            String SettingsTitleOther = "Other";
            boolean settingsCommitDescriptionOther = true;
            Map<String, Object> dataSettingsButtonOther = new HashMap<>();
            dataSettingsButtonOther.put("SettingsTitle", SettingsTitleOther);
            dataSettingsButtonOther.put("SettingsActiveControl", settingsActiveControl);
            dataSettingsButtonOther.put("SettingsPassiveControl", settingsPassiveControl);
            dataSettingsButtonOther.put("SettingsCommitDescription", settingsCommitDescriptionOther);
            dataSettingsButtonOther.put("SettingsResultCapture", settingsResultCapture);
            PositionSettingObjectMap positionSettingsObjectOther = new PositionSettingObjectMap(idButtonOther,idSettingsButtonOther,dataSettingsButtonOther);
            PositionSettingsMap.add(positionSettingsObjectOther);
            buttonOther.setId(idButtonOther);
            String idSettingsButtonGone = "buttonGone";
            String SettingsTitleGone = "Gone";
            Map<String, Object> dataSettingsButtonGone = new HashMap<>();
            dataSettingsButtonGone.put("SettingsTitle", SettingsTitleGone);
            dataSettingsButtonGone.put("SettingsActiveControl", settingsActiveControl);
            dataSettingsButtonGone.put("SettingsPassiveControl", settingsPassiveControl);
            dataSettingsButtonGone.put("SettingsCommitDescription", settingsCommitDescription);
            dataSettingsButtonGone.put("SettingsResultCapture", settingsResultCapture);
            PositionSettingObjectMap positionSettingsObjectGone = new PositionSettingObjectMap(idButtonGone,idSettingsButtonGone,dataSettingsButtonGone);
            PositionSettingsMap.add(positionSettingsObjectGone);
            buttonGone.setId(idButtonGone);
            //получаем настройки для данной должности
            DocumentReference docRefOrganization = db.collection("Organization").document(idOrganization);
            DocumentReference docRefSubdivision = docRefOrganization.collection("Subdivision").document(idSubdivision);
            DocumentReference docRefPosition = docRefSubdivision.collection("Position").document(idPosition);
            docRefPosition.collection("PositionSettings")
                    .get()
                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull Task<QuerySnapshot> task) {
                            if (task.isSuccessful()) {
                                for (QueryDocumentSnapshot document : task.getResult()) {
                                    Log.d(TAG, document.getId() + " => " + document.getData());
                                    //достаем название и настройки
                                    Map<String, Object> doc = document.getData();
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
                                    Map<String, Object> dataSettingsButton = document.getData();
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
            //получаем открытый документ процесса и устанавливаем активность
            docRef.collection("ProcessUser")
                    .whereEqualTo("ProcessUserEnd", "")
                    .get()
                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull Task<QuerySnapshot> task) {
                            if (task.isSuccessful()) {
                                for (QueryDocumentSnapshot document : task.getResult()) {
                                    Log.d(TAG, document.getId() + " => " + document.getData());
                                    idDocActivButtonUser = document.getId();
                                    Map<String, Object> dataSettingsButton = document.getData();
                                    String IdDocProcessButton = (String) dataSettingsButton.get("IdDocProcessButton");
                                    for (PositionSettingObjectMap h:PositionSettingsMap) {
                                        String idSettingsButton = h.idSettingsButton;
                                        if (idSettingsButton.equals(IdDocProcessButton))
                                        {
                                            activButtonId =h.idButton;
                                            for (Button s: ButtonMap)
                                            {
                                                int id = s.getId();
                                                if (id == activButtonId) {
                                                    s.setBackgroundColor(getResources().getColor(R.color.colorFonActiviButton));
                                                    activeButton = (Button) s;
                                                }
                                            }
                                        }
                                    }

                                }
                            } else {
                                Log.d(TAG, "Error getting documents: ", task.getException());
                            }
                        }
                    });

     }

  }
    public void buttonCloseShift (View view)
    { //Закрываем рабочую смену
        DocumentReference washingtonRef = db.collection("WorkShift").document(activShiftDocId);
        washingtonRef
                .update("WorkShiftEnd", "false")
                .addOnSuccessListener(new OnSuccessListener<Void>() {
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

        // Update the timestamp field with the value from the server
        Map<String,Object> updates = new HashMap<>();
        updates.put("WorkShiftEndTime", FieldValue.serverTimestamp());

        docRef.update(updates).addOnCompleteListener(new OnCompleteListener<Void>() {
            // [START_EXCLUDE]
            @Override
            public void onComplete(@NonNull Task<Void> task) {}
            // [START_EXCLUDE]
        });
     // Закрываем документ активного процесса
        DocumentReference washingtonRefProcessUser = washingtonRef.collection("ProcessUser").document(idDocActivButtonUser);
        washingtonRefProcessUser
                .update("ProcessUserEnd", "false")
                .addOnSuccessListener(new OnSuccessListener<Void>() {
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
        Map<String,Object> updatesProcessUser = new HashMap<>();
        updatesProcessUser.put("ProcessUserEndTime", FieldValue.serverTimestamp());
        docRefProcessUser.update(updatesProcessUser).addOnCompleteListener(new OnCompleteListener<Void>() {
            // [START_EXCLUDE]
            @Override
            public void onComplete(@NonNull Task<Void> task) {}
            // [START_EXCLUDE]
        });
        Intent i = new Intent(UserProcessActivity.this, UserInfoActivity.class);
        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail);
        startActivity(i);
    }
    // слушатель нажатия кнопок процессов
    private final View.OnClickListener mCorkyListener = new View.OnClickListener() {
        public void onClick(View v) {
            //получаем текущую активную кнопкуи закрываем активный докумен
            String idDocActivButtonUserFinal = idDocActivButtonUser;
            activeButton.setBackgroundColor(getResources().getColor(R.color.colorFonButton));
            for (PositionSettingObjectMap h : PositionSettingsMap) {
                int idButton = h.idButton;
                if (activButtonId == idButton) {
                    String idSettingsButton = h.idSettingsButton;
                    Map dataSettingsButton = h.dataSettingsButton;
                    String NameDocProcessButton = (String) dataSettingsButton.get("SettingsTitle");
                    boolean settingsActiveControl = (boolean) dataSettingsButton.get("SettingsActiveControl");
                    if (settingsActiveControl == true)
                    {   //получаем настройки параметров активного контроля
                        String settingsActiveDurationSeconds = (String) dataSettingsButton.get("SettingsActiveDurationSeconds");
                        String delimeter = " ";
                        String settingsActiveDurationSecondsFigure = settingsActiveDurationSeconds.split(delimeter)[0];
                        String settingsActiveDurationSecondsFigureTime = settingsActiveDurationSeconds.split(delimeter)[1];
                        if (settingsActiveDurationSecondsFigureTime == "minutes")
                        {

                        };
                        long settingsActiveDurationSecondsLong = Long.parseLong(settingsActiveDurationSecondsFigure);
                        long settingsActiveDurationSecondsLong1000 = settingsActiveDurationSecondsLong*1000;
                        String settingsActiveIntervalMinutes = (String) dataSettingsButton.get("SettingsActiveIntervalMinutes");
                        String settingsActiveIntervalMinutesFigure = settingsActiveIntervalMinutes.split(delimeter)[0];
                        String settingsActiveIntervalMinutesFigureTime = settingsActiveIntervalMinutes.split(delimeter)[1];
                        if (settingsActiveIntervalMinutesFigureTime == "seconds")
                        {

                        };
                        boolean settingsActiveSignal = (boolean) dataSettingsButton.get("SettingsActiveSignal");

                               // SettingsActiveTransition
                        //метод ожидания времени запуска
                        WorkManager mWorkManager = WorkManager.getInstance();
                        Data myData = new Data.Builder()
                                .putString("SettingsActiveIntervalMinutes", settingsActiveIntervalMinutesFigure)
                              //  .putInt("keyB", 1)
                                .build();
                      //  OneTimeWorkRequest mRequest = new OneTimeWorkRequest.Builder(NotificationWorker.class).build();
                        OneTimeWorkRequest mRequest = new OneTimeWorkRequest.Builder(NotificationWorker.class).setInputData(myData).build();
                        WorkManager.getInstance().enqueue(mRequest);
                        //проверка статуса
                        mWorkManager.getWorkInfoByIdLiveData(mRequest.getId()).observe(UserProcessActivity.this, new Observer < WorkInfo >() {
                            @Override
                            public void onChanged(@Nullable WorkInfo workInfo) {
                                if (workInfo != null) {
                                    WorkInfo.State state = workInfo.getState();
                                    if (state == SUCCEEDED) {
                                        AlertDialog.Builder builder = new AlertDialog.Builder(UserProcessActivity.this);
                                        builder.setTitle("Attention!")
                                                .setMessage("You are in the process of "+NameDocProcessButton)
                                                // .setIcon(R.drawable.ic_android_cat)
                                                .setCancelable(false)
                                                .setNegativeButton("ОК",
                                                        new DialogInterface.OnClickListener() {
                                                            public void onClick(DialogInterface dialog, int id) {
                                                                dialog.cancel();
                                                            }
                                                        });
                                        AlertDialog alert = builder.create();
                                        alert.show();

                                        //закрытие диалогового окна по таймеру
                                        new CountDownTimer(settingsActiveDurationSecondsLong1000, 1000) {

                                            @Override
                                            public void onTick(long millisUntilFinished) {
                                                // TODO Auto-generated method stub
                                              //  mTimer.setText("Осталось: "
                                              //          + millisUntilFinished / 1000);
                                            }

                                            @Override
                                            public void onFinish() {
                                                // TODO Auto-generated method stub

                                                alert.dismiss();
                                            }
                                        }.start();

                                        //вибро
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
                        Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            vibrator.vibrate(VibrationEffect.createOneShot(500, VibrationEffect.DEFAULT_AMPLITUDE));
                        } else {
                            vibrator.vibrate(500);
                        }
                    }
                    boolean settingsPassiveControl = (boolean) dataSettingsButton.get("SettingsPassiveControl");
                    if (settingsPassiveControl == true) {
                        //
                    }
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
                    String NameDocProcessButton = (String) dataSettingsButton.get("SettingsTitle");
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
                }
            }
        }
    };

         public static void ActiveControlFunctions()
        {
            //  AlertDialog.Builder builder1 = new AlertDialog.Builder(this);
            // builder1.setTitle("Select result");
            //  AlertDialog alert = builder1.create();
            // alert.show();
            System.out.println("next");

            //   public Dialog onCreateDialog(Bundle savedInstanceState) {
            // Use the Builder class for convenient dialog construction
         //   AlertDialog.Builder builder1 = new AlertDialog.Builder(UserProcessActivity.this);
         //   builder1.setMessage(R.string.dialog_fire_missiles)
         //           .setPositiveButton(R.string.fire, new DialogInterface.OnClickListener() {
         //               public void onClick(DialogInterface dialog, int id) {
        //                    // FIRE ZE MISSILES!
        //                }
        //            })
         //           .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
         //               public void onClick(DialogInterface dialog, int id) {
                            // User cancelled the dialog
         //               }
         //           });
            // Create the AlertDialog object and return it
            // return builder.create();
            // }

        }





}


