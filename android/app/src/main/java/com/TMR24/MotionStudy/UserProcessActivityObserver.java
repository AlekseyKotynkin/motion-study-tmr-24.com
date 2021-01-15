package com.TMR24.MotionStudy;

import android.content.Context;

import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleObserver;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.OnLifecycleEvent;

import javax.security.auth.callback.Callback;

public class UserProcessActivityObserver implements LifecycleObserver {

    private boolean enabled = false;
    private Lifecycle lifecycle;
    public UserProcessActivityObserver(Context context, Lifecycle lifecycle) {
        this.lifecycle = lifecycle;
        this.lifecycle.addObserver(this);
    }

        @OnLifecycleEvent(Lifecycle.Event.ON_START)
        public static void connect ( ) {
            // ...
            System.out.println("Start LifecycleObserver");

        }


        @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
        public static void disconnect ( ) {
            // ...
            System.out.println("Stop LifecycleObserver");

        }




}

//myLifecycleOwner.getLifecycle().addObserver(new UserProcessActivityObserver());
