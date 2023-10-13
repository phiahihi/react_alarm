package com.setting.receivers;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import com.react_alarm.R;
import androidx.core.app.NotificationManagerCompat;
import android.app.AlarmManager;
import androidx.core.app.NotificationCompat;
import com.setting.NotificationHelper;
import com.setting.services.ForegroundService;
import com.setting.receivers.AlarmReceiver;
import com.setting.AlarmManagerHelper;
import com.setting.Storage;
import com.setting.Settings;


public class MainAlarmActionReceiver extends BroadcastReceiver {

    private static final int NOTIFICATION_ID = 3;
    private static final String ACTION_DISMISS = "dismiss_action";
    private static final String ACTION_SNOOZE = "snooze_action";
    private static final String TAG = "MainAlarmActionReceiver";
    private static final int MINUTE = 60 * 1000;

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent != null) {
            String action = intent.getAction();
            if (action != null) {
                if (action.equals(ACTION_DISMISS)) {
                    // Xử lý khi nút "Dismiss" được nhấn
                    cancelNotification(context , intent.getLongExtra("alarmId", -1), intent.getIntExtra("requestCode", -1));
                    getActionIntent(context, intent.getLongExtra("alarmId", -1), ACTION_DISMISS).cancel();
                    getActionIntent(context, intent.getLongExtra("alarmId", -1), ACTION_SNOOZE).cancel();
                } else if (action.equals(ACTION_SNOOZE)) {
                    // Xử lý khi nút "Snooze" được nhấn
                    // Tạo một PendingIntent cho Snooze và kích hoạt báo thức sau một khoảng thời gian
                    cancelNotification(context , intent.getLongExtra("alarmId", -1), intent.getIntExtra("requestCode", -1));
                    scheduleSnooze(context, intent.getLongExtra("alarmId", -1));
                    getActionIntent(context, intent.getLongExtra("alarmId", -1), ACTION_SNOOZE).cancel();
                    getActionIntent(context, intent.getLongExtra("alarmId", -1), ACTION_DISMISS).cancel();

                }
            }
        }
    }

    private void cancelNotification(Context context, long alarmId, int requestCode) {
        Intent serviceIntent = new Intent(context, ForegroundService.class);
        serviceIntent.putExtra("alarmId", alarmId);
        serviceIntent.setAction("stop_foreground");
        context.startForegroundService(serviceIntent);
        
        AlarmManagerHelper alarmManagerHelper = new AlarmManagerHelper(context);
        alarmManagerHelper.cancelAlarm(context, AlarmReceiver.class, requestCode);
      
    }

    private void scheduleSnooze(Context context, long alarmId) {
        // Tạo PendingIntent cho Snooze
        Intent intent = new Intent(context, AlarmReceiver.class);
        intent.putExtra("alarmId", alarmId);
        intent.putExtra("isPreAlarm", false);
        intent.putExtra("requestCode", Long.toString(alarmId).hashCode());
        // Đặt các thông tin khác cho intent (nếu cần)

        Settings settings = Storage.getSettings(context);

        long timeInMillis = System.currentTimeMillis() +  settings.getTimeSnooze() * MINUTE;

        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 10, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
    
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
    
        // Đặt báo thức chính xác
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, timeInMillis, pendingIntent);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, timeInMillis, pendingIntent);
        } else {
            alarmManager.set(AlarmManager.RTC_WAKEUP, timeInMillis, pendingIntent);
        }
    }


    public static PendingIntent getActionIntent(Context context, long alarmId, String action) {
        Intent intent = new Intent(context, MainAlarmActionReceiver.class);
        intent.setAction(action);
        intent.putExtra("alarmId", alarmId);

        int requestCode = Long.toString(alarmId).hashCode();

        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, requestCode, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        return pendingIntent;
    }

}
