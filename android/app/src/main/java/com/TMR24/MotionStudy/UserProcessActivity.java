package com.TMR24.MotionStudy;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;


import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.functions.FirebaseFunctions;

import java.util.HashMap;
import java.util.Map;


public class UserProcessActivity extends AppCompatActivity
{

    private TextView textActivPosition;
    private FirebaseFirestore db;
    private FirebaseFunctions mFunctions;
    private String TAG, activShiftDocId, userNameEmail, parentHierarchyPositionUser, idPosition;
    private Button buttonAddShift, buttonCloseShift, button1, button2, button3, button4, button5, button6, button7, button8, buttonExpect, buttonOther, buttonGone;
    private Map parentHierarchyPositionUserMap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_process);
        init();
       // getIntentMain();
    }
    private void init()
    {
        db = FirebaseFirestore.getInstance();
        mFunctions = FirebaseFunctions.getInstance();

        buttonAddShift = findViewById(R.id.buttonAddShift);
        buttonCloseShift = findViewById(R.id.buttonCloseShift);
        button1 = findViewById(R.id.button1);
        button2 = findViewById(R.id.button2);
        button3 = findViewById(R.id.button3);
        button4 = findViewById(R.id.button4);
        button5 = findViewById(R.id.button5);
        button6 = findViewById(R.id.button6);
        button7 = findViewById(R.id.button7);
        button8 = findViewById(R.id.button8);
        buttonExpect = findViewById(R.id.buttonExpect);
        buttonOther = findViewById(R.id.buttonOther);
        buttonGone = findViewById(R.id.buttonGone);

    }
    public void onStart()
    {
      super.onStart();
      Intent i = getIntent();
      if (i != null)
        {
        userNameEmail = i.getStringExtra(Constant.USER_NAME_EMAIL);
        parentHierarchyPositionUser = i.getStringExtra(Constant.PARENT_HIERARCHY_POSITION_USER);
        String delimeter = ">";
        String idOrganization = parentHierarchyPositionUser.split(delimeter)[0];
        String nameOrganization = parentHierarchyPositionUser.split(delimeter)[1];
        String idSubdivision = parentHierarchyPositionUser.split(delimeter)[2];
        String nameSubdivision = parentHierarchyPositionUser.split(delimeter)[3];
        idPosition = parentHierarchyPositionUser.split(delimeter)[4];
        String namePosition = parentHierarchyPositionUser.split(delimeter)[5];
        String idDocPositionUser = parentHierarchyPositionUser.split(delimeter)[6];
        String userСomment = parentHierarchyPositionUser.split(delimeter)[7];
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
        TextView textActivPosition = findViewById(R.id.textActivPosition);
        textActivPosition.setText(nameOrganization+" > "+nameSubdivision+" > "+namePosition);
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
                Log.d(TAG, document.getId() + " => " + document.getData());
                Map <String, Object> doc = document.getData();
               // parentHierarchyPositionUserMap = (Map<String, Object>) doc.get("ParentHierarchyPositionUser");
               // String nameOrganization = (String) parentHierarchyPositionUserMap.get("NameOrganization");
                //String idOrganization = (String) parentHierarchyPositionUserMap.get("idDocOrganization");
                //String nameSubdivision = (String) parentHierarchyPositionUserMap.get("NameSubdivision");
                //String idSubdivision = (String) parentHierarchyPositionUserMap.get("idDocSubdivision");
                //String namePosition = (String) parentHierarchyPositionUserMap.get("NamePosition");
                //String idPosition = (String) parentHierarchyPositionUserMap.get("idDocPosition");
                buttonAddShift.setVisibility(View.GONE);
                buttonCloseShift.setVisibility(View.VISIBLE);

                }
             } else {
               Log.d(TAG, "Error getting documents: ", task.getException());
               buttonAddShift.setVisibility(View.VISIBLE);
               buttonCloseShift.setVisibility(View.GONE);
               button1.setEnabled(true);
                    }
               }
           });

     }
        buttonAddShift.setVisibility(View.VISIBLE);
        buttonCloseShift.setVisibility(View.GONE);
        button1.setVisibility(View.GONE);
        button2.setVisibility(View.GONE);
        button3.setVisibility(View.GONE);
        button4.setVisibility(View.GONE);
        button5.setVisibility(View.GONE);
        button6.setVisibility(View.GONE);
        button7.setVisibility(View.GONE);
        button8.setVisibility(View.GONE);
        buttonExpect.setVisibility(View.GONE);
        buttonOther.setVisibility(View.GONE);
        buttonGone.setVisibility(View.GONE);
  }

    public void buttonAddShift (View view)
    {

        // Add a new document with a generated id.
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
                        activShiftDocId = documentReference.getId();
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.w(TAG, "Error adding document", e);
                    }
                });
        buttonAddShift.setVisibility(View.GONE);
        buttonCloseShift.setVisibility(View.VISIBLE);

    }
    public void buttonCloseShift (View view)
    {

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
        buttonAddShift.setVisibility(View.VISIBLE);
        buttonCloseShift.setVisibility(View.GONE);

        Intent i = new Intent(UserProcessActivity.this, UserInfoActivity.class);
        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail);
        startActivity(i);
    }


}

