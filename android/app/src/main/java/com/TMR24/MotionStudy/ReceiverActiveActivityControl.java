package com.TMR24.MotionStudy;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.PowerManager;
import android.widget.Toast;

import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.concurrent.TimeUnit;

public class ReceiverActiveActivityControl extends BroadcastReceiver {

    final public static String ONE_TIME="onetime";

    @Override
    public void onReceive(Context context, Intent intent) {
        // TODO: This method is called when the BroadcastReceiver is receiving
        // an Intent broadcast.
        // Намерение трансляции.

        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
       // PowerManager.WakeLock wl= pm.newWakeLock (PowerManager.PARTIAL_WAKE_LOCK,"YOUR TAG");
        PowerManager.WakeLock wl= pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, String.valueOf(100));
       // Осуществляем блокировку
        wl.acquire();

       // Здесь можно делать обработку.
        Bundle extras = intent.getExtras();
        StringBuilder msgStr = new StringBuilder();

       // if( extras !=null & amp; & amp; extras.getBoolean(ONE_TIME, Boolean.FALSE))
        if( extras !=null )
        {
        // проверяем параметр ONE_TIME, если это одиночный будильник,
        // выводим соответствующее сообщение.
            msgStr.append("Одноразовый будильник: ");
        }
        Format formatter = new SimpleDateFormat("hh:mm:ss a");
        // msgStr.append(formatter.format(newDate()));

        Toast.makeText(context, msgStr, Toast.LENGTH_LONG).show();

        // Разблокируем поток.
        wl.release();
    }

    public void SetAlarm(Context context)
    {
        AlarmManager am=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        Intent intent=new Intent(context, ReceiverActiveActivityControl.class);
        intent.putExtra(ONE_TIME, Boolean.FALSE);//Задаем параметр интента
        PendingIntent pi= PendingIntent.getBroadcast(context,0, intent,0);
        // Устанавливаем интервал срабатывания в 5 секунд.
        am.setRepeating(AlarmManager.RTC_WAKEUP,System.currentTimeMillis(),1000*5,pi);
    }

    public void CancelAlarm(Context context)
    {
        Intent intent=new Intent(context, ReceiverActiveActivityControl.class);
        PendingIntent sender= PendingIntent.getBroadcast(context,0, intent,0);
        AlarmManager alarmManager=(AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        alarmManager.cancel(sender);//Отменяем будильник, связанный с интентом данного класса
    }

    public void setOnetimeTimer(Context context){
        AlarmManager am=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        Intent intent=new Intent(context, ReceiverActiveActivityControl.class);
        intent.putExtra(ONE_TIME, Boolean.TRUE);//Задаем параметр интента
        PendingIntent pi= PendingIntent.getBroadcast(context,0, intent,0);
        am.set(AlarmManager.RTC_WAKEUP,System.currentTimeMillis(),pi);



        throw new UnsupportedOperationException("Not yet implemented");
    }
}
   // String settingsActiveIntervalMinutes = (String) dataSettingsButton.get("SettingsActiveIntervalMinutes");
  //  String settingsActiveDurationSeconds = (String) dataSettingsButton.get("SettingsActiveDurationSeconds");
  //  String settingsActiveTransition = (String) dataSettingsButton.get("SettingsActiveTransition");
  //  boolean settingsActiveSignal = (boolean) dataSettingsButton.get("SettingsActiveSignal");
  //  // текст сообщения для диалогового окна активного контроля
  //  String attentionMessage = "You are involved in process "+NameDocProcessButton+"?";
  //  // планируем время открытия окна активного контроля
  //  Intent intentAlarm = new Intent (UserProcessActivity.this, ReceiverActiveActivityControl.class);
  //  AlarmManager alarmManager = (AlarmManager) getSystemService (Context.ALARM_SERVICE);
  //  long delay = TimeUnit.MINUTES.toMillis(1);
  //  // TimeUnit timeControl = TimeUnit.MILLISECONDS;
  //  long time = System.currentTimeMillis() + delay;
         //                          long timeInMilliSec = Calendar
         //                                  .getInstance()
         //                                  .getTimeInMillis();
 //                         alarmManager.set (AlarmManager.RTC_WAKEUP, time, PendingIntent.getBroadcast (UserProcessActivity.this, 1, intentAlarm, PendingIntent.FLAG_UPDATE_CURRENT));
 //                                 Toast.makeText (UserProcessActivity.this, attentionMessage, Toast.LENGTH_LONG) .show ();


                                  //далоговое окно активного контроля

 //                                 AlertDialog.Builder builder = new AlertDialog.Builder(UserProcessActivity.this);
 //                                 builder.setTitle("Attention")
 //                                 .setMessage(attentionMessage)
 //                                 .setCancelable(false)
 //                                 .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
//public void onClick(DialogInterface dialog, int id) {
        // do something
//        }
//        })
//        .setNegativeButton("No", new DialogInterface.OnClickListener() {
//public void onClick(DialogInterface dialog, int id) {
//        dialog.dismiss();
//        }
//        });

//        builder.show();


