package com.TMR24.MotionStudy;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.util.concurrent.TimeUnit;



public class NotificationWorker extends Worker {


        static final String TAG = "workmng";

    public NotificationWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
        @Override
        public Result doWork() {
            //запускает

            try {
                String settingsActiveIntervalMinutes = getInputData().getString("SettingsActiveIntervalMinutes");
                long settingsActiveIntervalMinutesLong = Long.parseLong(settingsActiveIntervalMinutes);
                TimeUnit.MINUTES.sleep(settingsActiveIntervalMinutesLong);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            // возобновляет через установленный интервал времени


            return Result.success();
        }
    }



