package com.TMR24.MotionStudy;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

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

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


public class UserProcessActivity extends AppCompatActivity
{

    private TextView textActivPosition;
    private FirebaseFirestore db;
    private FirebaseFunctions mFunctions;
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
    private int idButtonExpect, idButtonOther,idButtonGone;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_process);
        init();

    }
    private void init()
    {
        db = FirebaseFirestore.getInstance();
        mFunctions = FirebaseFunctions.getInstance();

        textActivPosition = findViewById(R.id.textActivPosition);
        buttonCloseShift = findViewById(R.id.buttonCloseShift);
        linearLayoutButton = findViewById(R.id.linearLayoutButton);



    }
    public void onStart()
    {
      super.onStart();
      Intent i = getIntent();
      if (i != null)
        {   //очистили ArrayList
            PositionSettingsMap.clear();
            ButtonMap.clear();
            linearLayoutButton.removeAllViews();
            //
            buttonExpect = findViewById(R.id.buttonExpect);
            idButtonExpect = 9;
            buttonExpect.setId(idButtonExpect);
            buttonExpect.setOnClickListener(mCorkyListener);
            ButtonMap.add(buttonExpect);

            buttonOther = findViewById(R.id.buttonOther);
            idButtonOther = 10;
            buttonOther.setId(idButtonOther);
            buttonOther.setOnClickListener(mCorkyListener);
            ButtonMap.add(buttonOther);

            buttonGone = findViewById(R.id.buttonGone);
            idButtonGone = 11;
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
            String SettingsTitleExpect = "Expect";
            Map<String, Object> dataSettingsButtonExpect = new HashMap<>();
            dataSettingsButtonExpect.put("SettingsTitle", SettingsTitleExpect);
            PositionSettingObjectMap positionSettingsObjectExpect = new PositionSettingObjectMap(idButtonExpect,idSettingsButtonExpect,dataSettingsButtonExpect);
            PositionSettingsMap.add(positionSettingsObjectExpect);
            buttonExpect.setId(idButtonExpect);
            String idSettingsButtonOther = "buttonOther";
            String SettingsTitleOther = "Other";
            Map<String, Object> dataSettingsButtonOther = new HashMap<>();
            dataSettingsButtonOther.put("SettingsTitle", SettingsTitleOther);
            PositionSettingObjectMap positionSettingsObjectOther = new PositionSettingObjectMap(idButtonOther,idSettingsButtonOther,dataSettingsButtonOther);
            PositionSettingsMap.add(positionSettingsObjectOther);
            buttonOther.setId(idButtonOther);
            String idSettingsButtonGone = "buttonGone";
            String SettingsTitleGone = "Gone";
            Map<String, Object> dataSettingsButtonGone = new HashMap<>();
            dataSettingsButtonGone.put("SettingsTitle", SettingsTitleGone);
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

        // Update the timestamp field with the value from the server
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
    private View.OnClickListener mCorkyListener = new View.OnClickListener() {
        public void onClick(View v) {
            //получаем текущую активную кнопкуи закрываем активный докумен
            activeButton.setBackgroundColor(getResources().getColor(R.color.colorFonButton));
            // Закрываем документ активного процесса
            DocumentReference washingtonRef = db.collection("WorkShift").document(activShiftDocId);
            DocumentReference docRef = db.collection("WorkShift").document(activShiftDocId);
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

            // Update the timestamp field with the value from the server
            Map<String,Object> updatesProcessUser = new HashMap<>();
            updatesProcessUser.put("ProcessUserEndTime", FieldValue.serverTimestamp());

            docRefProcessUser.update(updatesProcessUser).addOnCompleteListener(new OnCompleteListener<Void>() {
                // [START_EXCLUDE]
                @Override
                public void onComplete(@NonNull Task<Void> task) {}
                // [START_EXCLUDE]
            });
           // устанавливаем агресивный цвет фона активной кнопки
            v.setBackgroundColor(getResources().getColor(R.color.colorFonActiviButton));
            activeButton = (Button) v;
            activButtonId = v.getId();
            //получам данные для документа процесса
            for (PositionSettingObjectMap h:PositionSettingsMap)
            {
                int idButton = h.idButton;
                if (activButtonId == idButton)
                {
                  String idSettingsButton = h.idSettingsButton;
                  Map dataSettingsButton = h.dataSettingsButton;
                  String NameDocProcessButton = (String) dataSettingsButton.get("SettingsTitle");
                    //активизируем процесс по нажатию кнопки
                    Map<String, Object> dataProcessUser = new HashMap<>();
                    dataProcessUser.put("EmailPositionUser", userNameEmail);
                    dataProcessUser.put("IdDocPosition", idPosition);
                    dataProcessUser.put("IdDocProcessButton", idSettingsButton);
                    dataProcessUser.put("NameDocProcessButton", NameDocProcessButton);
                    dataProcessUser.put("ParentHierarchyPositionUser", parentHierarchyPositionUserMap);
                    dataProcessUser.put("ProcessUserEnd", "");
                    dataProcessUser.put("ProcessUserStartTime", FieldValue.serverTimestamp());
                    washingtonRef.collection("ProcessUser")
                            .add(dataProcessUser)
                            .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
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


              switch (v.getId()) {
            //      case R.id.corky:

                    // do something when the corky is clicked
                    //сделай что-нибудь, когда corky нажата

            //         break;
            //      case R.id.corky2:

                    // do something when the corky2 is clicked

            //         break;
            //     case R.id.corky3:

                    // do something when the corky3 is clicked

            //         break;
            //     default:
            //         break;
             }
        }
    };
}

