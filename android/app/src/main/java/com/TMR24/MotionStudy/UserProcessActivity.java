package com.TMR24.MotionStudy;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;


import android.content.Intent;
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
import java.util.List;
import java.util.Map;


public class UserProcessActivity extends AppCompatActivity
{

    private TextView textActivPosition;
    private FirebaseFirestore db;
    private FirebaseFunctions mFunctions;
    private String TAG, activShiftDocId, userNameEmail, parentHierarchyShiftUser, idPosition, activButtonId;
    private Button buttonCloseShift, buttonExpect, buttonOther, buttonGone, button;
    private Map parentHierarchyPositionUserMap;
    private List<PositionSettingObjectMap> PositionSettingsMap = new ArrayList();

    private LinearLayout linearLayoutButton;

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
        buttonExpect = findViewById(R.id.buttonExpect);
        buttonExpect.setOnClickListener(mCorkyListener);
        buttonOther = findViewById(R.id.buttonOther);
        buttonOther.setOnClickListener(mCorkyListener);
        buttonGone = findViewById(R.id.buttonGone);
        buttonGone.setOnClickListener(mCorkyListener);

    }
    public void onStart()
    {
      super.onStart();
      Intent i = getIntent();
      if (i != null)
        { // получили строку данных с предидущего Активити
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
            //получаем настройки для данной должности
            DocumentReference docRefOrganization = db.collection("Organization").document(idOrganization);
            docRefOrganization.get().addOnCompleteListener(new OnCompleteListener< DocumentSnapshot >() {
                @Override
                public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                    if (task.isSuccessful()) {
                        DocumentSnapshot document = task.getResult();
                        if (document.exists()) {
                            Log.d(TAG, "DocumentSnapshot data: " + document.getData());
                        } else {
                            Log.d(TAG, "No such document");
                        }
                    } else {
                        Log.d(TAG, "get failed with ", task.getException());
                    }
                }
            });
            DocumentReference docRefSubdivision = docRefOrganization.collection("Subdivision").document(idSubdivision);
            docRefSubdivision.get().addOnCompleteListener(new OnCompleteListener< DocumentSnapshot >() {
                @Override
                public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                    if (task.isSuccessful()) {
                        DocumentSnapshot document = task.getResult();
                        if (document.exists()) {
                            Log.d(TAG, "DocumentSnapshot data: " + document.getData());
                        } else {
                            Log.d(TAG, "No such document");
                        }
                    } else {
                        Log.d(TAG, "get failed with ", task.getException());
                    }
                }
            });
            DocumentReference docRefPosition = docRefSubdivision.collection("Position").document(idPosition);
            docRefPosition.get().addOnCompleteListener(new OnCompleteListener< DocumentSnapshot >() {
                @Override
                public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                    if (task.isSuccessful()) {
                        DocumentSnapshot document = task.getResult();
                        if (document.exists()) {
                            Log.d(TAG, "DocumentSnapshot data: " + document.getData());
                        } else {
                            Log.d(TAG, "No such document");
                        }
                    } else {
                        Log.d(TAG, "get failed with ", task.getException());
                    }
                }
            });
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
                                    //создаем массив настроек кнопок
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

        Intent i = new Intent(UserProcessActivity.this, UserInfoActivity.class);
        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail);
        startActivity(i);
    }
    private View.OnClickListener mCorkyListener = new View.OnClickListener() {
        public void onClick(View v) {
            // do something when the button is clicked
            //делать что-нибудь, когда кнопка нажата
            // Yes we will handle click here but which button clicked??? We don't know
            //Да, мы будем обрабатывать щелчок здесь, но какая кнопка была нажата ??? Мы не знаем

            // So we will make
            //Итак, мы сделаем
            //switch (v.getId () / * для получения идентификатора просмотра при клике ** /
          //  switch (v.getId() /*to get clicked view id**/) {
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
           // }
        }
    };
}

