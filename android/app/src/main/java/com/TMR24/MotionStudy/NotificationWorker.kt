package com.TMR24.MotionStudy

import android.content.Context
import androidx.work.Worker
import androidx.work.WorkerParameters
import java.util.concurrent.TimeUnit

class NotificationWorker(context: Context, workerParams: WorkerParameters) : Worker(context, workerParams) {
    override fun doWork(): Result {
        //запускает
        try {
            val settingsActiveIntervalMinutes = inputData.getString("Interval_SECONDS")
            val settingsActiveIntervalMinutesLong: Long = settingsActiveIntervalMinutes.toLong()
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