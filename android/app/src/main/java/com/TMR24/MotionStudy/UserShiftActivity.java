package com.TMR24.MotionStudy;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserShiftActivity extends AppCompatActivity {


        private TextView textActivPosition;
        private FirebaseFirestore db;
        private FirebaseFunctions mFunctions;
        private String TAG, nameOrganization, nameSubdivision, namePosition, activShiftDocId, userNameEmail, parentHierarchyShiftUser, parentHierarchyPositionUser, idPosition, idOrganization, idSubdivision, idDocPositionUser, userСomment;
        private Button buttonAddShiftSession, buttonToReturn;
        private Map parentHierarchyPositionUserMap;
        private ListView listViewInfoButton;
        private ArrayAdapter<String> adapterInfoButton;
        private List <String> listInfoButton, listInfoButtonItem;

        @Override
        protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_shift);
        init();
        setOnClickItemlistViewInfoButton();

    }
        private void init()
        {
            db = FirebaseFirestore.getInstance();
            mFunctions = FirebaseFunctions.getInstance();

            buttonAddShiftSession = findViewById(R.id.buttonAddShiftSession);
            buttonToReturn = findViewById(R.id.buttonToReturn);
            listViewInfoButton = findViewById(R.id.listViewInfoButton);
            listInfoButton = new ArrayList <>();
            listInfoButtonItem = new ArrayList<>();
            adapterInfoButton = new ArrayAdapter <>(this, android.R.layout.simple_list_item_1, listInfoButton);
            listViewInfoButton.setAdapter(adapterInfoButton);

        }
        public void onStart()
        {
            super.onStart();
            Intent i = getIntent();
            if (i != null)
            {   //очистили ArrayList
                listInfoButton.clear();
                listInfoButtonItem.clear();
                // получили строку данных с предидущего Активити
                userNameEmail = i.getStringExtra(Constant.USER_NAME_EMAIL);
                parentHierarchyPositionUser = i.getStringExtra(Constant.PARENT_HIERARCHY_POSITION_USER);
                String delimeter = ">";
                idOrganization = parentHierarchyPositionUser.split(delimeter)[0];
                nameOrganization = parentHierarchyPositionUser.split(delimeter)[1];
                idSubdivision = parentHierarchyPositionUser.split(delimeter)[2];
                nameSubdivision = parentHierarchyPositionUser.split(delimeter)[3];
                idPosition = parentHierarchyPositionUser.split(delimeter)[4];
                namePosition = parentHierarchyPositionUser.split(delimeter)[5];
                idDocPositionUser = parentHierarchyPositionUser.split(delimeter)[6];
                userСomment = parentHierarchyPositionUser.split(delimeter)[7];
                //вывели на экран Должность Подразделение Организацию в которой планируем работать
                TextView textActivPosition = findViewById(R.id.textActivPosition);
                textActivPosition.setText(nameOrganization+" > "+nameSubdivision+" > "+namePosition);
                //проверили нет ли активной смены
                db.collection("WorkShift")
                        .whereEqualTo("EmailPositionUser", userNameEmail)
                        .whereEqualTo("WorkShiftEnd", "")
                        .whereEqualTo("IdDocPosition", idPosition)
                        .get()
                        .addOnCompleteListener(new OnCompleteListener < QuerySnapshot >()
                        {
                            @Override
                            public void onComplete(@NonNull Task <QuerySnapshot> task)
                            {
                                if (task.isSuccessful()) {
                                    for (QueryDocumentSnapshot document : task.getResult()) {
                                        //Имеется активная смена
                                        Log.d(TAG, document.getId() + " => " + document.getData());
                                        Map <String, Object> doc = document.getData();
                                        parentHierarchyPositionUserMap = (Map<String, Object>) doc.get("ParentHierarchyPositionUser");
                                        String nameOrganization = (String) parentHierarchyPositionUserMap.get("NameOrganization");
                                        String idOrganization = (String) parentHierarchyPositionUserMap.get("idDocOrganization");
                                        String nameSubdivision = (String) parentHierarchyPositionUserMap.get("NameSubdivision");
                                        String idSubdivision = (String) parentHierarchyPositionUserMap.get("idDocSubdivision");
                                        String namePosition = (String) parentHierarchyPositionUserMap.get("NamePosition");
                                        String idPosition = (String) parentHierarchyPositionUserMap.get("idDocPosition");
                                        String activShiftDocId = document.getId();
                                        parentHierarchyShiftUser = (idOrganization+">"+nameOrganization+">"+idSubdivision+">"+nameSubdivision+">"+idPosition+">"+namePosition+">"+activShiftDocId);
                                        Intent i = new Intent(UserShiftActivity.this, UserProcessActivity.class);
                                        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail);
                                        i.putExtra(Constant.PARENT_HIERARCHY_SHIFT_USER, parentHierarchyShiftUser);
                                        startActivity(i);
                                    }
                                } else {
                                    //отсутствует Активная смена
                                    Log.d(TAG, "Error getting documents: ", task.getException());

                                }
                            }
                        });

            }
                 //получаем список процессов для данной должности
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
                                    String buttonComment = (String) doc.get("SettingsСomment");
                                    listInfoButton.add(buttonName);
                                    listInfoButtonItem.add(buttonName+">"+buttonComment);
                                    adapterInfoButton.notifyDataSetChanged();

                                }
                            } else {
                                Log.d(TAG, "Error getting documents: ", task.getException());
                            }
                        }
                    });
        }

    public void buttonAddShiftSession (View view)
    {  //Сформировали массив с данными для истории и записи в документ Смены
        parentHierarchyPositionUserMap = new HashMap<>();
        parentHierarchyPositionUserMap.put("NameOrganization", nameOrganization);
        parentHierarchyPositionUserMap.put("NameSubdivision", nameSubdivision);
        parentHierarchyPositionUserMap.put("NamePosition", namePosition);
        parentHierarchyPositionUserMap.put("UserEmail", userNameEmail);
        parentHierarchyPositionUserMap.put("UserСomment", userСomment);
        parentHierarchyPositionUserMap.put("idDocOrganization", idOrganization);
        parentHierarchyPositionUserMap.put("idDocPosition", idPosition);
        parentHierarchyPositionUserMap.put("idDocPositionUser", idDocPositionUser);
        parentHierarchyPositionUserMap.put("idDocSubdivision", idSubdivision);
        // Открываем новую смену при нажатии кнопки
        Map<String, Object> data = new HashMap<>();
        data.put("EmailPositionUser", userNameEmail);
        data.put("IdDocPosition", idPosition);
        data.put("ParentHierarchyPositionUser", parentHierarchyPositionUserMap);
        data.put("WorkShiftEnd", "");
        data.put("WorkShiftStartTime", FieldValue.serverTimestamp());
        db.collection("WorkShift")
                .add(data)
                .addOnSuccessListener(new OnSuccessListener <DocumentReference>() {
                    @Override
                    public void onSuccess(DocumentReference documentReference) {
                        Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.getId());
                        //активизируем процесс Expect
                        Map<String, Object> data = new HashMap<>();
                        data.put("EmailPositionUser", userNameEmail);
                        data.put("IdDocPosition", idPosition);
                        data.put("IdDocProcessButton", "buttonExpect");
                        data.put("NameDocProcessButton", "Expect");
                        data.put("ParentHierarchyPositionUser", parentHierarchyPositionUserMap);
                        data.put("ProcessUserEnd", "");
                        data.put("ProcessUserStartTime", FieldValue.serverTimestamp());
                        String activShiftDocId = documentReference.getId();
                        DocumentReference docRef = db.collection("WorkShift").document(activShiftDocId);
                        docRef.collection("ProcessUser")
                                .add(data)
                                .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                                    @Override
                                    public void onSuccess(DocumentReference documentReference) {
                                        Log.d(TAG, "DocumentSnapshot written with ID: " + documentReference.getId());
                                        // idDocActivButtonUser = documentReference.getId();
                                    }
                                })
                                .addOnFailureListener(new OnFailureListener() {
                                    @Override
                                    public void onFailure(@NonNull Exception e) {
                                        Log.w(TAG, "Error adding document", e);
                                    }
                                });
                        parentHierarchyShiftUser = (idOrganization+">"+nameOrganization+">"+idSubdivision+">"+nameSubdivision+">"+idPosition+">"+namePosition+">"+activShiftDocId);
                        Intent i = new Intent(UserShiftActivity.this, UserProcessActivity.class);
                        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail);
                        i.putExtra(Constant.PARENT_HIERARCHY_SHIFT_USER, parentHierarchyShiftUser);
                        startActivity(i);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.w(TAG, "Error adding document", e);
                    }
                });

    }
   public void buttonToReturnClik (View view)
    {
    Intent i = new Intent(UserShiftActivity.this, UserInfoActivity.class);
    i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail);
    startActivity(i);
    }
    private void setOnClickItemlistViewInfoButton()
    { //
        listViewInfoButton.setOnItemClickListener(new AdapterView.OnItemClickListener()
        {
            @Override
            public void onItemClick(AdapterView < ? > parent, View view, int position, long id)
            {
                String commentButtonItem = listInfoButtonItem.get(position);
                String delimeter = ">";
                String commentTitle = commentButtonItem.split(delimeter)[0];
                String commentText = commentButtonItem.split(delimeter)[1];
                AlertDialog.Builder builder = new AlertDialog.Builder(UserShiftActivity.this);
                builder.setTitle(commentTitle)
                        .setMessage(commentText)
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
         //   }

            }
        });
    }
    @Override
    public void onPause()
    {
        super.onPause();  // Always call the superclass method first
       // yourListView.setListAdapter(null); //This clears the listview items
       // listViewInfoButton.setAdapter(null);
    }
}
