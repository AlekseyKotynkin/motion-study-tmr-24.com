package com.TMR24.MotionStudy;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.functions.FirebaseFunctions;

import java.util.ArrayList;
import java.util.List;

public class UserShiftHistory extends AppCompatActivity {
    private FirebaseFirestore db;
    private String  userNameEmail, parentHierarchyPositionUser;
    private String  nameOrganization, nameSubdivision, namePosition,  idPosition, idOrganization, idSubdivision, idDocPositionUser, userСomment;
    private TextView textActivPositionHistori;
    private Button  buttonToReturnHistori;
    private ListView listViewHistoriButton;
    private ArrayAdapter<String> adapterHistoriButton;
    private List <String> listHistoriButton, listHistoriButtonItem;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_shift_history);
        init();
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
        {
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

        }
    }
    public void buttonToReturnClik (View view)
    {
        Intent i = new Intent(UserShiftHistory.this, UserShiftActivity.class);
        i.putExtra(Constant.USER_NAME_EMAIL, userNameEmail);
        i.putExtra(Constant.PARENT_HIERARCHY_POSITION_USER, parentHierarchyPositionUser);
        startActivity(i);
    }
}