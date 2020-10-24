package com.TMR24.MotionStudy;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.functions.FirebaseFunctions;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class UserShiftHistory extends AppCompatActivity {
    private FirebaseFirestore db;
    private String  TAG, userNameEmail, parentHierarchyPositionUser;
    private String  nameOrganization, nameSubdivision, namePosition,  idPosition, idOrganization, idSubdivision, idDocPositionUser, userСomment;
    private TextView textActivPositionHistori;
    private Button  buttonToReturnHistori;
    private ListView listViewHistoriButton;
    private ArrayAdapter<String> adapterHistoriButton;
    private List <String> listHistoriButton, listHistoriButtonItem;
    private Timestamp workShiftEndTime, workShiftStartTime;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_shift_history);
        init();
        setOnClickItemlistViewHistoriButton();
    }
    private void init()
    {
        db = FirebaseFirestore.getInstance();
     //   mFunctions = FirebaseFunctions.getInstance();

        buttonToReturnHistori = findViewById(R.id.buttonToReturnHistori);
        listViewHistoriButton = findViewById(R.id.listViewHistori);
        listHistoriButton = new ArrayList <>();
        listHistoriButtonItem = new ArrayList<>();
        adapterHistoriButton = new ArrayAdapter <>(this, android.R.layout.simple_list_item_1, listHistoriButton);
        listViewHistoriButton.setAdapter(adapterHistoriButton);

    }
    public void onStart() {

        super.onStart();
        Intent i = getIntent();
        if (i != null)
        {   //очистили ArrayList
            listHistoriButton.clear();
            listHistoriButtonItem.clear();
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
            TextView textActivPosition = findViewById(R.id.textActivPositionHistori);
            textActivPosition.setText(nameOrganization+" > "+nameSubdivision+" > "+namePosition);
            //проверили нет ли активной смены
            db.collection("WorkShift")
                    .whereEqualTo("EmailPositionUser", userNameEmail)
                    .whereEqualTo("WorkShiftEnd", "false")
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
                                    workShiftStartTime = (Timestamp) doc.get("WorkShiftStartTime");
                                    Date g = workShiftStartTime.toDate();
                                    long x = workShiftStartTime.getSeconds();
                                    SimpleDateFormat formatForDateNow = new SimpleDateFormat("dd.MM.yyyy ' time ' k:mm:ss");
                                    workShiftEndTime = (Timestamp) doc.get("WorkShiftEndTime");
                                    Date h = workShiftEndTime.toDate();
                                    long a = workShiftEndTime.getSeconds();
                                    long seconds = a-x;
                                    // переводим секунды в дни-часы-минуты-секунды
                                    // long sec = seconds % 60;
                                    long minutes = seconds % 3600 / 60;
                                    long hours = seconds % 86400 / 3600;
                                    long days = seconds / 86400;
                                    listHistoriButton.add("Shift start "+formatForDateNow.format(g)+" > End of shift "+formatForDateNow.format(h));
                                    listHistoriButtonItem.add(document.getId()+">"+"Day " + days + " Hour " + hours + " Minute " + minutes);
                                    adapterHistoriButton.notifyDataSetChanged();
                                }
                            } else {
                                //отсутствует Активная смена
                                Log.d(TAG, "Error getting documents: ", task.getException());

                            }
                        }
                    });
        }
    }
    private void setOnClickItemlistViewHistoriButton()
    { //
        listViewHistoriButton.setOnItemClickListener(new AdapterView.OnItemClickListener()
        {
            @Override
            public void onItemClick(AdapterView < ? > parent, View view, int position, long id)
            {
                String buttonHistori = listHistoriButtonItem.get(position);
                String delimeter = ">";
                String idButtonHistori = buttonHistori.split(delimeter)[0];
                String shiftDurationHistori = buttonHistori.split(delimeter)[1];
                // выводим диалоговое окно
                AlertDialog.Builder builder = new AlertDialog.Builder(UserShiftHistory.this);
                builder.setTitle("Histori Shift")
                        .setMessage("Apologize! This object is under construction! Shift duration "+shiftDurationHistori)
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

            }
        });
    }
    public void buttonToReturnClik (View view)
    {
        Intent i = new Intent(UserShiftHistory.this, UserShiftActivity.class);
        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail);
        i.putExtra(Constant.PARENT_HIERARCHY_POSITION_USER, parentHierarchyPositionUser);
        startActivity(i);
    }
}