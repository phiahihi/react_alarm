package com.setting;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import android.content.BroadcastReceiver;


public class AlarmManagerHelper {

    private static final String TAG = "AlarmManagerHelper";
    private static Context context;

    public static Helper helper;

    public AlarmManagerHelper(Context context) {
        AlarmManagerHelper.context = context;
    }

    public void cancelAlarm(Context context, Class<? extends BroadcastReceiver> receiverClass, int requestCode) {
        PendingIntent pendingIntent = createAlarmPendingIntent(context, receiverClass,requestCode);
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        alarmManager.cancel(pendingIntent);
        pendingIntent.cancel();
    
    }

    private PendingIntent createAlarmPendingIntent(Context context, Class<? extends BroadcastReceiver> receiverClass,int requestCode) {

        Intent intent = new Intent(context, receiverClass);

        // Tạo PendingIntent với requestCode là alarmId (đảm bảo requestCode là duy nhất cho mỗi báo thức)
        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, requestCode, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

        return pendingIntent;
    }


}
