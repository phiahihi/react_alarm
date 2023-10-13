package com.setting.receivers;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.core.app.NotificationManagerCompat;
import android.util.Log;
import com.setting.NotificationHelper;
import com.setting.SettingModule;
import com.setting.Storage;
import com.setting.TimeConverter;
import com.setting.Alarm;
import java.util.Calendar;
import java.util.List;
import com.setting.AlarmManagerHelper;
import com.setting.SettingModule;

public class AlarmActionReceiver extends BroadcastReceiver {
    public static final String ACTION_DISMISS_ALARM = "com.react_alarm.DISMISS_ALARM";
    public static final String EXTRA_ALARM_ID = "alarm_id";
    private static final String TAG = "AlarmActionReceiver";
    private static final int MINUTE = 60 * 1000;

    NotificationHelper notificationHelper = new NotificationHelper();

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction() != null && intent.getAction().equals(ACTION_DISMISS_ALARM)) {
            long alarmId = intent.getLongExtra(EXTRA_ALARM_ID, -1);
            long timeInMillis = intent.getLongExtra("timeInMillis", -1);
            int requestCode = intent.getIntExtra("requestCode", -1);

            if (alarmId != -1) {
                Alarm alarm = Storage.getAlarm(context, String.valueOf(alarmId));
                AlarmManagerHelper alarmManagerHelper = new AlarmManagerHelper(context);
                long timeInMillis2 = timeInMillis / 1000;
                String uniqueCode = timeInMillis2 + "_" + alarmId;
                int requestCodeMain = uniqueCode.hashCode();

                // Cancel the main alarm and the notification
                alarmManagerHelper.cancelAlarm(context, AlarmReceiver.class, requestCodeMain);
                timeInMillis = timeInMillis + alarm.getPreAlarmTime() * MINUTE;
                timeInMillis2 = timeInMillis / 1000;
                uniqueCode = timeInMillis2  + "_" + alarmId;
                requestCodeMain = uniqueCode.hashCode();
                alarmManagerHelper.cancelAlarm(context, AlarmReceiver.class, requestCodeMain);
                NotificationManagerCompat.from(context).cancel(requestCode);
                if(alarm.getDates().size() <= 0){
                    Storage.updateAlarmField(context, alarm.getId(), "enabled", "false");
                }
                SettingModule.sendNotificationDismissedEvent();
                // Cancel the dismiss action intent
                getDismissActionIntent(context, alarmId, requestCode, timeInMillis).cancel();
            } else {
                Log.d(TAG, "onReceive: alarmId = -1");
            }
        } 
    }

    public static PendingIntent getDismissActionIntent(Context context, long alarmId, int requestCode,long timeInMillis ) {
        Intent intent = new Intent(context, AlarmActionReceiver.class);
        intent.setAction(ACTION_DISMISS_ALARM);
        intent.putExtra(EXTRA_ALARM_ID, alarmId);
        intent.putExtra("timeInMillis", timeInMillis);      
        intent.putExtra("requestCode", requestCode);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, requestCode, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        return pendingIntent;
    }

    public static void resetAlarmForNextWork(Context context, long alarmId) {
        String alarmIdString = String.valueOf(alarmId);
        Alarm alarm =  Storage.getAlarm(context, alarmIdString);
        List<Integer> timeAlarm = TimeConverter.convertToHourAndMinute(alarm.getTime());
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(System.currentTimeMillis());
        calendar.set(Calendar.HOUR_OF_DAY, timeAlarm.get(0));
        calendar.set(Calendar.MINUTE, timeAlarm.get(1));
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.add(Calendar.DAY_OF_MONTH, 7);
        SettingModule.setPreAlarmAndAlarm(context, calendar.getTimeInMillis(), alarmId, alarm.getPreAlarmTime());
    }
}
