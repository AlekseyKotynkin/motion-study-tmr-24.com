package com.TMR24.MotionStudy;

import android.os.Bundle;
import android.util.Log;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.Continuation;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.functions.FirebaseFunctions;
import com.google.firebase.functions.HttpsCallableResult;

import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;



public class UserInfoActivity extends AppCompatActivity {



    private TextView textCurrentDate;
    private ListView listSessions, listPosts;
    private ArrayAdapter<String> adapter, adapterPosts;
    private List<String> listData, listDataPosts;


    private FirebaseFirestore db;
    private FirebaseFunctions mFunctions;
    private String TAG;
    private String emailDoc;

    public UserInfoActivity() {
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_info);

        init();
        getCurrentDate();
        getDataFromDB();
        emailDoc = "cay211076@gmail.com";
        addMessage(emailDoc);


    }
    private void init()
    {
           listPosts = findViewById(R.id.listPosts);
           listDataPosts = new ArrayList<>();
           adapterPosts = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, listDataPosts);
           listPosts.setAdapter(adapterPosts);

           listSessions = findViewById(R.id.listSessions);
           listData = new ArrayList<>();
           adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, listData);
           listSessions.setAdapter(adapter);

           db = FirebaseFirestore.getInstance();
           mFunctions = FirebaseFunctions.getInstance();

    }
    private void getCurrentDate()
    {
           Calendar calendar = Calendar.getInstance();
           String currentDate = DateFormat.getDateInstance(DateFormat.FULL).format(calendar.getTime());
           TextView textViewDate = findViewById(R.id.textCurrentDate);
           textViewDate.setText(currentDate);
    }

    private void getDataFromDB()
    {
                   db.collection("WorkShift")
                   .whereEqualTo("EmailPositionUser", "cay211076@gmail.com")
                           .whereEqualTo("WorkShiftEnd", "")
                   .get()
                   .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>()
                   {
                       @Override
                       public void onComplete(@NonNull Task<QuerySnapshot> task)
                       {
                           if (task.isSuccessful()) {
                               for (QueryDocumentSnapshot document : task.getResult()) {
                                   Log.d(TAG, document.getId() + " => " + document.getData());
                                   Map<String, Object> doc = document.getData();
                                   Map<String, Object> docy = (Map<String, Object>) doc.get("ParentHierarchyPositionUser");
                                   String nameOrganization = (String) docy.get("NameOrganization");
                                   String nameSubdivision = (String) docy.get("NameSubdivision");
                                   String namePosition = (String) docy.get("NamePosition");
                                   listData.add(nameOrganization+" > "+nameSubdivision+" > "+namePosition);
                                   adapter.notifyDataSetChanged();
                               }
                          } else {
                               Log.d(TAG, "Error getting documents: ", task.getException());
                            }
                       }
                   });

    }

    private Task<String> addMessage(String text) {

        Map<String, Object> data = new HashMap<>();
        data.put("text", text);
        data.put("push", true);

        return mFunctions
                .getHttpsCallable("addDocListPosts")
                .call(data)
                .continueWith(new Continuation<HttpsCallableResult, String>() {
                    @Override
                    public String then(@NonNull Task<HttpsCallableResult> task) throws Exception {
                        // This continuation runs on either success or failure, but if the task
                        // has failed then getResult() will throw an Exception which will be
                        // propagated down.
                        // Это продолжение выполняется при успехе или неудаче, но если задача
                        // не удалось, тогда getResult () выдаст исключение, которое будет
                        // распространились вниз.
                        HashMap rezult = (HashMap) task.getResult().getData();
                        String idDocPosts = (String) rezult.get("text");
                        DocumentReference docRef = db.collection("messages").document(idDocPosts);
                        docRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                            @Override
                            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                                if (task.isSuccessful()) {
                                    DocumentSnapshot document = task.getResult();
                                    if (document.exists()) {
                                        Log.d(TAG, "DocumentSnapshot data: " + document.getData());
                                        Map<String, Object> doc = document.getData();
                                        ArrayList massivDocPosts = (ArrayList) doc.get("gerDoc");
                                        for (int i = 0; i < massivDocPosts.size(); i++) {
                                            String stringDocPosts = (String) massivDocPosts.get(i);
                                            String stringSybvisio = stringDocPosts.substring(0, stringDocPosts.length() - 21);
                                            listDataPosts.add(stringSybvisio);
                                            adapterPosts.notifyDataSetChanged();
                                        }
                                         db.collection("messages").document(idDocPosts)
                                                .delete()
                                                .addOnSuccessListener(new OnSuccessListener <Void>() {
                                                    @Override
                                                    public void onSuccess(Void aVoid) {
                                                        Log.d(TAG, "DocumentSnapshot successfully deleted!");
                                                    }
                                                })
                                                .addOnFailureListener(new OnFailureListener() {
                                                    @Override
                                                    public void onFailure(@NonNull Exception e) {
                                                        Log.w(TAG, "Error deleting document", e);
                                                    }
                                                });
                                    } else {
                                        Log.d(TAG, "No such document");
                                    }
                                } else {
                                    Log.d(TAG, "get failed with ", task.getException());
                                }
                            }
                        });
                        return idDocPosts;
                    }
              });
    }



}
