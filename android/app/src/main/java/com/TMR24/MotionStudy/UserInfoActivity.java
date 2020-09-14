package com.TMR24.MotionStudy;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
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
    private List<String> listData, listDataItem, listDataPosts, listDataPostsItem;
    private FirebaseFirestore db;
    private FirebaseFunctions mFunctions;
    private String TAG, userNameEmail, parentHierarchyPositionUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_info);

        init();
        getIntentMain();
        getCurrentDate();
        getDataFromDB();
        userNameEmail = "cay211076@gmail.com";
        addMessage(userNameEmail);
        setOnClickItemPosts ();
        setOnClickItemSesions();


    }
    private void init()
    {
           listPosts = findViewById(R.id.listPosts);
           listDataPosts = new ArrayList<>();
           listDataPostsItem = new ArrayList<>();
           adapterPosts = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, listDataPosts);
           listPosts.setAdapter(adapterPosts);

           listSessions = findViewById(R.id.listSessions);
           listData = new ArrayList<>();
           listDataItem = new ArrayList<>();
           adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, listData);
           listSessions.setAdapter(adapter);

           db = FirebaseFirestore.getInstance();
           mFunctions = FirebaseFunctions.getInstance();

    }
    private void getCurrentDate()
    {      // Формируем надпись с датой
           Calendar calendar = Calendar.getInstance();
           String currentDate = DateFormat.getDateInstance(DateFormat.FULL).format(calendar.getTime());
           TextView textViewDate = findViewById(R.id.textCurrentDate);
           textViewDate.setText(currentDate);
    }

    private void getDataFromDB()
    {             // Заполняем табличную часть с Активными сменами
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
                                   String idOrganization = (String) docy.get("idDocOrganization");
                                   String nameSubdivision = (String) docy.get("NameSubdivision");
                                   String idSubdivision = (String) docy.get("idDocSubdivision");
                                   String namePosition = (String) docy.get("NamePosition");
                                   String idPosition = (String) docy.get("idDocPosition");
                                   String activShiftDocId = document.getId();
                                   listData.add(nameOrganization+" > "+nameSubdivision+" > "+namePosition);
                                   listDataItem.add(idOrganization+">"+nameOrganization+">"+idSubdivision+">"+nameSubdivision+">"+idPosition+">"+namePosition+">"+activShiftDocId);
                                   adapter.notifyDataSetChanged();
                               }
                          } else {
                               Log.d(TAG, "Error getting documents: ", task.getException());
                            }
                       }
                   });

    }

    private Task<String> addMessage(String text)
    {  //Отправляем и получаем обработанные данные с сервера списком в каких должностях принимает участие пользователь

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
                        Thread.sleep(10000);
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
                                            String delimeter = ">";
                                            String idOrganization = stringDocPosts.split(delimeter)[0];
                                            String nameOrganization = stringDocPosts.split(delimeter)[1];
                                            String idSubdivision = stringDocPosts.split(delimeter)[2];
                                            String nameSubdivision = stringDocPosts.split(delimeter)[3];
                                            String idPosition = stringDocPosts.split(delimeter)[4];
                                            String namePosition = stringDocPosts.split(delimeter)[5];
                                            String idDocPositionUser = stringDocPosts.split(delimeter)[6];
                                            String userСomment = stringDocPosts.split(delimeter)[7];
                                            listDataPosts.add(nameOrganization+" > "+nameSubdivision+" > "+namePosition);
                                            listDataPostsItem.add(idOrganization+">"+nameOrganization+">"+idSubdivision+">"+nameSubdivision+">"+idPosition+">"+namePosition+">"+idDocPositionUser+">"+userСomment);
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

    private void setOnClickItemPosts ()
    { //
        listPosts.setOnItemClickListener(new AdapterView.OnItemClickListener()
           {
        @Override
        public void onItemClick(AdapterView < ? > parent, View view, int position, long id)
                {
            String parentHierarchyPositionUser = listDataPostsItem.get(position);
            Intent i = new Intent(UserInfoActivity.this, UserShiftActivity.class);
            i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail);
            i.putExtra(Constant.PARENT_HIERARCHY_POSITION_USER, parentHierarchyPositionUser);
            startActivity(i);

                }
           });
    }
    private void setOnClickItemSesions ()
    {
        listSessions.setOnItemClickListener(new AdapterView.OnItemClickListener()
            {
            @Override
            public void onItemClick(AdapterView < ? > parent, View view, int position, long id) {
                String parentHierarchyShiftUser = listDataItem.get(position);
                Intent i = new Intent(UserInfoActivity.this, UserProcessActivity.class);
                i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail);
                i.putExtra(Constant.PARENT_HIERARCHY_SHIFT_USER, parentHierarchyShiftUser);
                startActivity(i);

            }
        });
    }
    private void getIntentMain()
    {
        Intent i = getIntent();
        if (i != null)
        {
         String userNameEmail = i.getStringExtra(Constant.USER_NAME_EMAIL);
      //   System.out.println(userNameEmail);
        }
    }
}
