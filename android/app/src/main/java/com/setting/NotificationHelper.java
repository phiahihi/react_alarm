package com.setting;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import com.react_alarm.R;
import com.react_alarm.MainActivity;
import androidx.core.app.NotificationCompat;
import com.setting.receivers.AlarmActionReceiver;
import com.setting.receivers.MainAlarmActionReceiver;

import android.net.Uri;



public class NotificationHelper {

    public static void showPreAlarmNotification(Context context, long alarmId, long timeInMillis) {
        // Tạo và hiển thị thông báo pre-alarm
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(context.getString(R.string.notification_channel_id_alarm), context.getString(R.string.notification_channel_name_alarm), NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }
        long timeInMillis2 = timeInMillis / 1000;
        String uniqueCode = timeInMillis2 + "_" + alarmId;
        int requestCode =  uniqueCode.hashCode();

        Alarm alarm = Storage.getAlarm(context, Long.toString(alarmId));

        String contentAlarm = "";

        if(alarm.getLabel().equals("")){
            contentAlarm = "Chào bạn, đừng quên chuẩn bị cho sự kiện hoặc công việc đặc biệt mà bạn đã đặt báo thức này nhé! Chúc bạn một ngày tốt lành!";
        } else {
            contentAlarm = "Chào bạn, báo thức của bạn với tiêu đề " + alarm.getLabel() + ". Chúc bạn một ngày tốt lành!";
        }

        Notification preAlarmNotification = new Notification.Builder(context,context.getString(R.string.notification_channel_id_alarm))
            .setContentTitle("Báo thức sắp báo: " + alarm.getTime())
            .setContentText(contentAlarm)
            .setSmallIcon(R.drawable.ic_notification)
            .setAutoCancel(true)  // Để tự động tắt thông báo khi được bấm
            .addAction(R.drawable.ic_notification, "Tắt", AlarmActionReceiver.getDismissActionIntent(context, alarmId, requestCode, timeInMillis))
            .build();


        if(alarm.getDates().size() > 0){
            AlarmActionReceiver.resetAlarmForNextWork(context, alarmId);
        } 
        
        notificationManager.notify(requestCode, preAlarmNotification);
    }
    

    public static Notification createForegroundNotification(Context context, String title,long alarmId ) {
        // Tạo channel cho thông báo
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(context.getString(R.string.notification_channel_id_alarm), context.getString(R.string.notification_channel_name_alarm), NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }

    
        // Tạo thông báo với âm thanh và rung
        Notification mainAlarmNotification = new Notification.Builder(context, context.getString(R.string.notification_channel_id_alarm))
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(title)
                .setContentText("Chúc bạn một ngày học tập và làm việc hiệu quả!")
                .setAutoCancel(true) 
                .addAction(R.drawable.ic_notification, "Tắt báo thức", MainAlarmActionReceiver.getActionIntent(context, alarmId, "dismiss_action"))
                .addAction(R.drawable.ic_notification, "Báo lại", MainAlarmActionReceiver.getActionIntent(context, alarmId, "snooze_action"))
                .setSmallIcon(R.drawable.ic_notification).build();
    
        return mainAlarmNotification;
    }
}
