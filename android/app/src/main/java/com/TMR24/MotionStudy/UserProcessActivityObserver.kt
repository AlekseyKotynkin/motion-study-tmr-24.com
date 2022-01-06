package com.TMR24.MotionStudy

import android.content.Context
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleObserver
import androidx.lifecycle.OnLifecycleEvent

class UserProcessActivityObserver(context: Context?, private val lifecycle: Lifecycle) :
    LifecycleObserver {
    private val enabled = false

    companion object {
        @OnLifecycleEvent(Lifecycle.Event.ON_START)
        fun connect() {
            // ...
            println("Start LifecycleObserver")
        }

        @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
        fun disconnect() {
            // ...
            println("Stop LifecycleObserver")
        }
    }

    init {
        lifecycle.addObserver(this)
    }
}