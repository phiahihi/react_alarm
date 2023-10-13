package com.setting.receivers;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import androidx.core.app.NotificationManagerCompat;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import com.setting.NotificationHelper;

import com.react_alarm.R;
import com.setting.Sound;
import com.setting.AlarmManagerHelper;
import com.setting.Storage;
import com.setting.Settings;
import com.setting.Alarm;
import com.setting.services.ForegroundService;
import android.app.ActivityManager;
import android.content.ComponentName;
import com.setting.SettingModule;


public class AlarmReceiver extends BroadcastReceiver {
    NotificationHelper notificationHelper = new NotificationHelper();
    private static Sound sound;
    private static Settings settings;
    private static Alarm alarm;
    private static final int MINUTE = 60 * 1000;

    @Override
    public void onReceive(Context context, Intent intent) {
        boolean isPreAlarm = intent.getBooleanExtra("isPreAlarm", false);
        long alarmId = intent.getLongExtra("alarmId", -1);
        int requestCode = intent.getIntExtra("requestCode", -1);
        long timeInMillis = intent.getLongExtra("timeInMillis", -1);


        if (alarmId != -1 && isPreAlarm) {
            notificationHelper.showPreAlarmNotification(context, alarmId, timeInMillis);
        } else {
                // Service không đang chạy, bạn có thể bắt đầu nó
                Intent serviceIntent = new Intent(context, ForegroundService.class);
                serviceIntent.putExtra("alarmId", alarmId);
                serviceIntent.setAction("start_foreground");
                context.startForegroundService(serviceIntent);

                AlarmManagerHelper alarmManagerHelper = new AlarmManagerHelper(context);
                alarmManagerHelper.cancelAlarm(context, AlarmReceiver.class, requestCode);
                Alarm alarm = Storage.getAlarm(context, Long.toString(alarmId));
                
                if (alarm != null) {
                    long timePreAlarm = (timeInMillis - MINUTE * alarm.getPreAlarmTime()) / 1000;
                    if(alarm.getDates().size() <= 0){
                        Storage.updateAlarmField(context, alarm.getId(), "enabled", "false");
                    }
                    SettingModule.sendNotificationDismissedEvent();
                    String uniqueCode = timePreAlarm + "_" + alarmId;
                    int requestCodeNoti = uniqueCode.hashCode();
                    NotificationManagerCompat.from(context).cancel(requestCodeNoti);
                }
        }
    }
}
