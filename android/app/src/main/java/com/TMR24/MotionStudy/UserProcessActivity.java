package com.TMR24.MotionStudy;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;


import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.functions.FirebaseFunctions;

import java.util.Map;


public class UserProcessActivity extends AppCompatActivity {

    private TextView textActivPosition;
    private FirebaseFirestore db;
    private FirebaseFunctions mFunctions;
    private String TAG;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_process);
        init();
        getIntentMain();
    }
    private void init()
    {
        db = FirebaseFirestore.getInstance();
        mFunctions = FirebaseFunctions.getInstance();
    }
    private void getIntentMain()
    {
        Intent i = getIntent();
        if (i != null)
        {
        String userNameEmail = i.getStringExtra(Constant.USER_NAME_EMAIL);
        String parentHierarchyPositionUser = i.getStringExtra(Constant.PARENT_HIERARCHY_POSITION_USER);
            String delimeter = ">";
            String idOrganization = parentHierarchyPositionUser.split(delimeter)[0];
            String nameOrganization = parentHierarchyPositionUser.split(delimeter)[1];
            String idSubdivision = parentHierarchyPositionUser.split(delimeter)[2];
            String nameSubdivision = parentHierarchyPositionUser.split(delimeter)[3];
            String idPosition = parentHierarchyPositionUser.split(delimeter)[4];
            String namePosition = parentHierarchyPositionUser.split(delimeter)[5];
            String activShiftDocId = parentHierarchyPositionUser.split(delimeter)[6];
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
                                    Map<String, Object> docy = (Map<String, Object>) doc.get("ParentHierarchyPositionUser");
                                    String nameOrganization = (String) docy.get("NameOrganization");
                                    String idOrganization = (String) docy.get("idDocOrganization");
                                    String nameSubdivision = (String) docy.get("NameSubdivision");
                                    String idSubdivision = (String) docy.get("idDocSubdivision");
                                    String namePosition = (String) docy.get("NamePosition");
                                    String idPosition = (String) docy.get("idDocPosition");


                                }
                            } else {
                                Log.d(TAG, "Error getting documents: ", task.getException());
                            }
                        }
                    });

        }
    }
}

