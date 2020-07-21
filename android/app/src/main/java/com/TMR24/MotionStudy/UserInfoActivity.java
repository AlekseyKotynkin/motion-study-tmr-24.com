package com.TMR24.MotionStudy;

        import androidx.annotation.NonNull;
        import androidx.appcompat.app.AppCompatActivity;

        import android.os.Bundle;
        import android.util.Log;
        import android.widget.ArrayAdapter;
        import android.widget.ListView;
        import android.widget.TextView;

        import com.google.android.gms.tasks.OnCompleteListener;
        import com.google.android.gms.tasks.OnSuccessListener;
        import com.google.android.gms.tasks.Task;
        import com.google.firebase.firestore.CollectionReference;
        import com.google.firebase.firestore.DocumentReference;
        import com.google.firebase.firestore.DocumentSnapshot;
        import com.google.firebase.firestore.FirebaseFirestore;
        import com.google.firebase.firestore.QueryDocumentSnapshot;
        import com.google.firebase.firestore.QuerySnapshot;


        import java.text.DateFormat;
        import java.util.ArrayList;
        import java.util.Calendar;
        import java.util.List;
        import java.util.Map;


public class UserInfoActivity extends AppCompatActivity {

    private TextView textCurrentDate;
    private ListView listSessions, listPosts;
    private ArrayAdapter<String> adapter, adapterPosts;
    private List<String> listData, listDataPosts, nameListPosts, nameListPostsOrg, nameListPostsSub, nameListPostsPos ;
  //  public static ArrayList nameListPosts = new ArrayList<>();
  //  public static ArrayList nameListPostsOrg = new ArrayList<>();
  //  public static ArrayList nameListPostsSub = new ArrayList<>();
  //  public static ArrayList nameListPostsPos = new ArrayList<>();

    private FirebaseFirestore db;
    private String TAG;
    public UserInfoActivity() {
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_info);
        init();
        getCurrentDate();
        getDataFromDB();
      //  getDataPosts();
        getDataPostsPrint();
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

           nameListPosts = new ArrayList<>();
           nameListPostsOrg = new ArrayList<>();
           nameListPostsSub = new ArrayList<>();
           nameListPostsPos = new ArrayList<>();

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
    private void getDataPosts()
    {
        db.collectionGroup("PositionUser").whereEqualTo("UserEmail", "cay211076@gmail.com").get()
                .addOnSuccessListener(new OnSuccessListener<QuerySnapshot>() {
                    @Override
                    public void onSuccess(QuerySnapshot queryDocumentSnapshots) {
                        for (QueryDocumentSnapshot documentGroup : queryDocumentSnapshots) {

                            //Extracting Group name from each document
                            CollectionReference parent = documentGroup.getReference().getParent();
                            String parentHierarchyDoc = parent.getPath();
                            String[] organizationDocArray = parentHierarchyDoc.split("/");
                            String organizationDocId = organizationDocArray[1];
                            String subdivisionDocId = organizationDocArray[3];
                            String positionDocId = organizationDocArray[5];
                            nameListPosts.add(new String("idDoc/"+documentGroup.getId()));

                            DocumentReference docRefOrganization = db.collection("Organization").document(String.valueOf(organizationDocId));
                            docRefOrganization.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                                @Override
                                public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                                    if (task.isSuccessful()) {
                                        DocumentSnapshot documentOrganization = task.getResult();
                                        if (documentOrganization.exists()) {
                                            Log.d(TAG, "DocumentSnapshot data: " + documentOrganization.getData());
                                            Map<String, Object> docOrganization = documentOrganization.getData();
                                            String nameOrganizationPosts = (String) docOrganization.get("Organization");
                                            nameListPostsOrg.add(new String("nameOrg/"+nameOrganizationPosts));
                                        } else {
                                            Log.d(TAG, "No such document");
                                        }
                                    } else {
                                        Log.d(TAG, "get failed with ", task.getException());
                                    }
                                }
                            });

                            DocumentReference docRefSubdivision = docRefOrganization.collection("Subdivision").document(String.valueOf(subdivisionDocId));
                            docRefSubdivision.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                                @Override
                                public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                                    if (task.isSuccessful()) {
                                        DocumentSnapshot documentSubdivision = task.getResult();
                                        if (documentSubdivision.exists()) {
                                            Log.d(TAG, "DocumentSnapshot data: " + documentSubdivision.getData());
                                            Map<String, Object> docSubdivision = documentSubdivision.getData();
                                            String nameSubdivisionPosts = (String) docSubdivision.get("Subdivision");
                                            nameListPostsSub.add(new String("nameSub/"+nameSubdivisionPosts));
                                        } else {
                                            Log.d(TAG, "No such document");
                                        }
                                    } else {
                                        Log.d(TAG, "get failed with ", task.getException());
                                    }
                                }
                            });

                            DocumentReference docRefPosition = docRefSubdivision.collection("Position").document(String.valueOf(positionDocId));
                            docRefPosition.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                                @Override
                                public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                                    if (task.isSuccessful()) {
                                        DocumentSnapshot documentPosition = task.getResult();
                                        if (documentPosition.exists()) {
                                            Log.d(TAG, "DocumentSnapshot data: " + documentPosition.getData());
                                            Map<String, Object> docPosition = documentPosition.getData();
                                            String namePositionPosts = (String) docPosition.get("Position");
                                            nameListPostsPos.add(new String("namePos/"+namePositionPosts));

                                        } else {
                                            Log.d(TAG, "No such document");
                                        }
                                    } else {
                                        Log.d(TAG, "get failed with ", task.getException());
                                    };
                                }
                            });
                        }
                    }
                });
    };

   private void getDataPostsPrint() {
       getDataPosts();

       if (nameListPosts.size() == 0)
       {
           db.collectionGroup("PositionUser").whereEqualTo("UserEmail", "cay211076@gmail.com").get()
                   .addOnSuccessListener(new OnSuccessListener<QuerySnapshot>() {
                       @Override
                       public void onSuccess(QuerySnapshot queryDocumentSnapshots) {
                           for (QueryDocumentSnapshot documentGroup : queryDocumentSnapshots) {

                               //Extracting Group name from each document
                               CollectionReference parent = documentGroup.getReference().getParent();
                               String parentHierarchyDoc = parent.getPath();
                               String[] organizationDocArray = parentHierarchyDoc.split("/");
                               String organizationDocId = organizationDocArray[1];
                               String subdivisionDocId = organizationDocArray[3];
                               String positionDocId = organizationDocArray[5];
                               nameListPosts.add(new String("idDoc/"+documentGroup.getId()));
                               nameListPostsOrg.add(new String("idDoc/"+organizationDocId));
                               nameListPosts.add(new String("idDoc/"+subdivisionDocId));
                               nameListPosts.add(new String("idDoc/"+positionDocId));
                           }
                       }
                   });
       };

     for(int i = 0; i< nameListPosts.size(); i++) {
            String organizationDocId = nameListPosts.get(i);

         DocumentReference docRefOrganization = db.collection("Organization").document(String.valueOf(organizationDocId));
         docRefOrganization.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
             @Override
             public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                 if (task.isSuccessful()) {
                     DocumentSnapshot documentOrganization = task.getResult();
                     if (documentOrganization.exists()) {
                         Log.d(TAG, "DocumentSnapshot data: " + documentOrganization.getData());
                         Map<String, Object> docOrganization = documentOrganization.getData();
                         String nameOrganizationPosts = (String) docOrganization.get("Organization");
                         nameListPostsOrg.add(new String("nameOrg/"+nameOrganizationPosts));
                     } else {
                         Log.d(TAG, "No such document");
                     }
                 } else {
                     Log.d(TAG, "get failed with ", task.getException());
                 }
             }
         });

         for(int a = 0; a< nameListPostsOrg.size(); a++) {
             String subdivisionDocId = nameListPostsOrg.get(a);

             DocumentReference docRefSubdivision = docRefOrganization.collection("Subdivision").document(String.valueOf(subdivisionDocId));
             docRefSubdivision.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                 @Override
                 public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                     if (task.isSuccessful()) {
                         DocumentSnapshot documentSubdivision = task.getResult();
                         if (documentSubdivision.exists()) {
                             Log.d(TAG, "DocumentSnapshot data: " + documentSubdivision.getData());
                             Map<String, Object> docSubdivision = documentSubdivision.getData();
                             String nameSubdivisionPosts = (String) docSubdivision.get("Subdivision");
                             nameListPostsSub.add(new String("nameSub/"+nameSubdivisionPosts));
                         } else {
                             Log.d(TAG, "No such document");
                         }
                     } else {
                         Log.d(TAG, "get failed with ", task.getException());
                     }
                 }
             });

         }

     }




       //     String organizationName = nameListPostsOrg.get(0);
       //      String subdivisionName = nameListPostsSub.get(0);
       //      String positionName = nameListPostsPos.get(0);
       //   listDataPosts.add(organizationName+" > "+subdivisionName+" > "+positionName+" > "+docId);
     listDataPosts.add("А");
     adapterPosts.notifyDataSetChanged();
   }

}