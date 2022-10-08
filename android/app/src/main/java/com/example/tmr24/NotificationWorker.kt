package com.example.tmr24

import android.content.Context
import androidx.work.WorkerParameters
import androidx.work.ListenableWorker
import androidx.work.Worker
import java.util.concurrent.TimeUnit

class NotificationWorker(context: Context, workerParams: WorkerParameters) :
    Worker(context, workerParams) {
    override fun doWork(): Result {
        //запускает
        try {
            val settingsActiveIntervalMinutes = inputData.getString("Interval_SECONDS")
            val settingsActiveIntervalMinutesLong = settingsActiveIntervalMinutes!!.toLong()
            TimeUnit.SECONDS.sleep(settingsActiveIntervalMinutesLong)
        } catch (e: InterruptedException) {
            e.printStackTrace()
        }
        // возобновляет через установленный интервал времени
        return Result.success()
    }

    companion object {
        const val TAG = "workmng"
    }
}