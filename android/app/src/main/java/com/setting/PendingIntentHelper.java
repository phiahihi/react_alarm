package com.setting;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import com.setting.AlarmManagerHelper;
import com.setting.receivers.AlarmReceiver;
import androidx.core.app.NotificationManagerCompat;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class PendingIntentHelper {

    private static final String TAG = "PendingIntentHelper";
    private static final int MINUTE = 60 * 1000;
  
    // Hàm này sẽ xóa tất cả các pendingIntent đã được đặt trước của alarm có id là alarmId
    public static void cancelAllPendingIntentsAlarmId(Context context, String alarmId) {
        try {
            // Retrieve the alarm information based on alarmId from your storage
                AlarmManagerHelper alarmManagerHelper = new AlarmManagerHelper(context);
                Alarm alarm = Storage.getAlarm(context, alarmId);
                
               if(alarm != null) {
                    long longAlarmId = Long.parseLong(alarm.getId());
                    List<Date> dateAlarm = alarm.getDates();
                    if(dateAlarm.size() > 0) {
                        for (Date date : dateAlarm) {
                            long timeInMillis = date.getTime() / 1000;
                            String uniqueCode = timeInMillis + "_" + longAlarmId;
                            int requestCodeMain = uniqueCode.hashCode();
            
                            // Cancel the main alarm and the notification
                            alarmManagerHelper.cancelAlarm(context, AlarmReceiver.class, requestCodeMain);
                            timeInMillis = (date.getTime() - alarm.getPreAlarmTime() * MINUTE) / 1000;
                            uniqueCode = timeInMillis + "_" + longAlarmId;
                            requestCodeMain = uniqueCode.hashCode();
                            NotificationManagerCompat.from(context).cancel(requestCodeMain);
                            alarmManagerHelper.cancelAlarm(context, AlarmReceiver.class, requestCodeMain);
                        }
                    } else {
                        Calendar calendar = Calendar.getInstance();
                        List<Integer> time = TimeConverter.convertToHourAndMinute(alarm.getTime());
                        calendar.set(Calendar.HOUR_OF_DAY, time.get(0));
                        calendar.set(Calendar.MINUTE, time.get(1));
                        calendar.set(Calendar.SECOND, 0);
                        calendar.set(Calendar.MILLISECOND, 0);
                        if (calendar.getTime().getTime() < System.currentTimeMillis()) {
                            calendar.add(Calendar.DAY_OF_MONTH, 1);
                        }
                        
                        long timeInMillis = calendar.getTimeInMillis() / 1000;
                        String uniqueCode = timeInMillis + "_" + longAlarmId;
                        int requestCodeMain = uniqueCode.hashCode();
        
                        // Cancel the main alarm and the notification
                        alarmManagerHelper.cancelAlarm(context, AlarmReceiver.class, requestCodeMain);
                        timeInMillis = (calendar.getTimeInMillis() - alarm.getPreAlarmTime() * MINUTE) / 1000;
                        uniqueCode = timeInMillis + "_" + longAlarmId;
                        requestCodeMain = uniqueCode.hashCode();
                        NotificationManagerCompat.from(context).cancel(requestCodeMain);
                        alarmManagerHelper.cancelAlarm(context, AlarmReceiver.class, requestCodeMain);
                    }
               }
            
        } catch (NumberFormatException e) {
            // Handle the case where alarmId is not a valid long
            e.printStackTrace();
        } catch (Exception e) {
            // Handle other exceptions gracefully
            e.printStackTrace();
        }
    }
    

    // Hàm này sẽ xóa tất cả các PendingIntent đã được đặt trước
    public static void cancelAllPendingIntents(Context context) {
        // Implement your logic to cancel all pending intents
        // You may need to access your AlarmManager here
    }
}
