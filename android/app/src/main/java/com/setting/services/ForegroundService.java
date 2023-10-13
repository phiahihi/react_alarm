package com.setting.services;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.app.Notification;
import android.os.Handler;
import android.os.IBinder;
import android.os.Vibrator;
import com.setting.Sound;
import com.setting.Storage;
import com.setting.Settings;
import com.setting.Alarm;
import com.setting.NotificationHelper;
import android.os.Looper;
import com.setting.SettingModule;

public class ForegroundService extends Service {
    private static final int NOTIFICATION_ID = 3;
    private static final String CHANNEL_ID = "ForegroundServiceChannel";
    private Sound sound;
    private Handler timeoutHandler;
    private Runnable timeoutRunnable;
    private static final String START_FOREGROUND_ACTION = "start_foreground";
    private static final String STOP_FOREGROUND_ACTION = "stop_foreground";
    private static final long TIMEOUT_MILLISECONDS = 60000; // 1 phút

    private BroadcastReceiver intentReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent != null && intent.getAction() != null && intent.getAction().equals("com.example.NEW_INTENT_ACTION")) {
                // Xử lý intent mới ở đây, có thể dừng và khởi động lại dịch vụ
                stopForegroundService();
                startServiceAgain(context, intent.getLongExtra("alarmId", -1));
            }
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        sound = new Sound(this);

        // Đăng ký BroadcastReceiver để lắng nghe intent mới
        IntentFilter filter = new IntentFilter("com.example.NEW_INTENT_ACTION"); // Thay "com.example.NEW_INTENT_ACTION" bằng action của bạn
        registerReceiver(intentReceiver, filter);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && intent.getAction() != null) {
            if (intent.getAction().equals(START_FOREGROUND_ACTION)) {
                long alarmId = intent.getLongExtra("alarmId", -1);
                Alarm alarm = Storage.getAlarm(this, Long.toString(alarmId));
                Settings settings = Storage.getSettings(this);

                if (alarm != null) {
                    String title = "";
                    if(alarm.getLabel().equals("")){
                        title = "Báo thức lúc " + alarm.getTime();
                    } else {
                        title = "Báo thức " + alarm.getLabel();
                    }
                    Notification notification = NotificationHelper.createForegroundNotification(this, title + " đã kích hoạt!", alarmId);
                    startForeground(NOTIFICATION_ID, notification);
                    SettingModule.sendNotificationDismissedEvent();
                    sound.play(alarm.getRingtoneUrl(), settings.isVibrate(), (int)settings.getVolume());
                }

                startTimeoutTimer(TIMEOUT_MILLISECONDS);
            } else if (intent.getAction().equals(STOP_FOREGROUND_ACTION)) {
                stopForegroundService();
            }
        }
        return START_STICKY;
    }

    private void startTimeoutTimer(long timeoutMillis) {
        if (timeoutHandler == null) {
            timeoutHandler = new Handler(Looper.getMainLooper());
        }

        if (timeoutRunnable == null) {
            timeoutRunnable = new Runnable() {
                @Override
                public void run() {
                    // Dừng dịch vụ nếu không có hoạt động nào trong khoảng thời gian đã đặt
                    stopForegroundService();
                }
            };
        }

        timeoutHandler.removeCallbacks(timeoutRunnable);
        timeoutHandler.postDelayed(timeoutRunnable, timeoutMillis);
    }

    private void stopForegroundService() {
        unregisterReceiver(intentReceiver);

        if (sound != null) {
            sound.stop(); // Giải phóng tài nguyên âm thanh nếu có
        }

        stopSelf();
    }

    private void startServiceAgain(Context context, long alarmId) {
        // Tạo intent để khởi động lại dịch vụ
        Intent serviceIntent = new Intent(context, ForegroundService.class);
        serviceIntent.putExtra("alarmId", alarmId);
        serviceIntent.setAction("start_foreground");
        context.startForegroundService(serviceIntent);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        stopForeground(true);
        if (timeoutHandler != null) {
            timeoutHandler.removeCallbacks(timeoutRunnable);
        }
    }
}
