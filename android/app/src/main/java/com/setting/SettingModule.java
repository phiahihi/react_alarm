package com.setting;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import android.content.Context;
import com.facebook.react.bridge.ReadableMap;
import java.util.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import android.media.RingtoneManager;
import android.net.Uri;
import android.content.Intent;
import android.app.PendingIntent;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.os.Build;
import android.content.Context;
import android.content.BroadcastReceiver;
import android.util.Log;
import android.media.Ringtone;
import java.util.Calendar;
import com.react_alarm.R;
import com.setting.receivers.AlarmReceiver;
import com.setting.Alarm;
import com.setting.Storage;
import com.setting.TimeConverter;
import com.setting.AlarmManagerHelper;
import com.setting.PendingIntentHelper;
import org.json.JSONObject;
import com.setting.Settings;
import com.setting.services.ForegroundService;
import com.setting.CustomToast;
import com.facebook.react.modules.core.DeviceEventManagerModule;


public class SettingModule extends ReactContextBaseJavaModule {
    private static Sound sound;
    private static AlarmManagerHelper alarmManagerHelper;
    private static ReactApplicationContext reactContext;
    private static boolean vibrationEnabled = true;
    private static boolean skipAlarmEnabled = true;
    private static final int MINUTE = 60 * 1000;


    public SettingModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "SettingModule";
    }

    public static void sendNotificationDismissedEvent() {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onNotificationDismissed", null);
    }

    @ReactMethod
    public void setVibrationEnabled(boolean enabled) {
        vibrationEnabled = enabled;
    }

    @ReactMethod
    public void playSound(String ringtoneUri) {
        sound = new Sound(reactContext);
        Settings settings = Storage.getSettings(reactContext);
        sound.play(ringtoneUri, false ,(int) settings.getVolume());
    }

    @ReactMethod
    public void enableAlarm(String alarmId, Promise promise) {
        try {
            Alarm alarm = Storage.getAlarm(reactContext, alarmId);
            if (alarm != null) {
                // Thực hiện các thao tác để bật báo thức ở đây, ví dụ: set trạng thái enabled thành true
                alarm.setEnabled(true);
                List<Date> dates = alarm.getDates();

                // Lấy thời gian hiện tại
                long currentTimeMillis = System.currentTimeMillis();
                
                Date nearestDate = null;
                long timeDiff = Long.MAX_VALUE; // Khởi tạo một biến để lưu thời gian chênh lệch nhỏ nhất

                for (Date date : dates) {
                    long dateMillis = date.getTime();
                    long diff = dateMillis - currentTimeMillis;
                    if (diff >= 0 && diff < timeDiff) {
                        nearestDate = date;
                        timeDiff = diff;
                    }
                }

                if (nearestDate != null) {
                    // Chuyển đổi và hiển thị ngày gần nhất
                    String nearestDateStr = TimeConverter.convertTimeToString(nearestDate.getTime());
                    CustomToast.showToast(reactContext, nearestDateStr, 75);

                    // Tiếp tục thực hiện các thao tác khác với ngày này
                    for (Date date : dates) {
                        setPreAlarmAndAlarm(reactContext, date.getTime(), Long.parseLong(alarmId), alarm.getPreAlarmTime());
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

                    CustomToast.showToast(reactContext,TimeConverter.convertTimeToString(calendar.getTime().getTime()), 75);
                    setPreAlarmAndAlarm(reactContext, calendar.getTime().getTime(), Long.parseLong(alarmId), alarm.getPreAlarmTime());
                }
                Storage.saveAlarm(reactContext, alarmId, alarm);
                promise.resolve("Bật báo thức thành công!");
            } else {
                promise.reject("Không tìm thấy báo thức!", "Báo thức không tồn tại với ID đã cho.");
            }
        } catch (Exception e) {
            promise.reject("Lỗi khi bật báo thức!", e.getMessage());
        }
    }


    @ReactMethod
    public void disableAlarm(String alarmId, Promise promise) {
        try {
            Alarm alarm = Storage.getAlarm(reactContext, alarmId);
            if (alarm != null) {
                // Thực hiện các thao tác để tắt báo thức ở đây, ví dụ: set trạng thái enabled thành false
                alarm.setEnabled(false);

                PendingIntentHelper.cancelAllPendingIntentsAlarmId(reactContext, alarmId);
                Storage.saveAlarm(reactContext, alarmId, alarm);
                promise.resolve("Tắt báo thức thành công!");
            } else {
                promise.reject("Không tìm thấy báo thức!", "Báo thức không tồn tại với ID đã cho.");
            }
        } catch (Exception e) {
            promise.reject("Lỗi khi tắt báo thức!", e.getMessage());
        }
    }

    @ReactMethod
    public void updateAlarm(String alarmId, String updatedAlarm, Promise promise) {
        try {
            Alarm existingAlarm = Storage.getAlarm(reactContext, alarmId);
            if (existingAlarm != null) {
                PendingIntentHelper.cancelAllPendingIntentsAlarmId(reactContext, alarmId);
                Alarm updatedAlarmObject = Alarm.fromJson(updatedAlarm);
                updatedAlarmObject.setEnabled(true);
                // Thực hiện các thao tác cập nhật dựa trên thông tin trong updatedAlarmObject
                // Ví dụ: cập nhật thời gian, âm thanh, hoặc bất kỳ thông tin nào khác cần thiết
                List<Date> dates = updatedAlarmObject.getDates();

                long currentTimeMillis = System.currentTimeMillis();
                
                Date nearestDate = null;
                long timeDiff = Long.MAX_VALUE; // Khởi tạo một biến để lưu thời gian chênh lệch nhỏ nhất

                for (Date date : dates) {
                    long dateMillis = date.getTime();
                    long diff = dateMillis - currentTimeMillis;
                    if (diff >= 0 && diff < timeDiff) {
                        nearestDate = date;
                        timeDiff = diff;
                    }
                }

                if (nearestDate != null) {
                    // Chuyển đổi và hiển thị ngày gần nhất
                    String nearestDateStr = TimeConverter.convertTimeToString(nearestDate.getTime());
                    CustomToast.showToast(reactContext, nearestDateStr, 75);

                    // Tiếp tục thực hiện các thao tác khác với ngày này
                    for (Date date : dates) {
                        setPreAlarmAndAlarm(reactContext, date.getTime(), Long.parseLong(alarmId), updatedAlarmObject.getPreAlarmTime());
                    }
                } else {
                    Calendar calendar = Calendar.getInstance();
                    List<Integer> time = TimeConverter.convertToHourAndMinute(updatedAlarmObject.getTime());
                    calendar.set(Calendar.HOUR_OF_DAY, time.get(0));
                    calendar.set(Calendar.MINUTE, time.get(1));
                    calendar.set(Calendar.SECOND, 0);
                    calendar.set(Calendar.MILLISECOND, 0);
                    if (calendar.getTime().getTime() < System.currentTimeMillis()) {
                        calendar.add(Calendar.DAY_OF_MONTH, 1);
                    }

                    CustomToast.showToast(reactContext,TimeConverter.convertTimeToString(calendar.getTime().getTime()), 75);
                    setPreAlarmAndAlarm(reactContext, calendar.getTime().getTime(), Long.parseLong(alarmId), updatedAlarmObject.getPreAlarmTime());
                }
                // Sau khi cập nhật, bạn có thể lưu updatedAlarmObject vào lưu trữ và ghi đè lên thông tin của báo thức cũ
                Storage.saveAlarm(reactContext, alarmId, updatedAlarmObject);
                promise.resolve("Cập nhật báo thức thành công!");
            } else {
                promise.reject("Không tìm thấy báo thức!", "Báo thức không tồn tại với ID đã cho.");
            }
        } catch (Exception e) {
            promise.reject("Lỗi khi cập nhật báo thức!", e.getMessage());
        }
    }


    @ReactMethod
    public void setRepeatingAlarm(String alarm, Promise promise) {
    try {
        Alarm _alarm = Alarm.fromJson(alarm);
        long alarmId = Long.parseLong(_alarm.getId());
        List<Date> dates = _alarm.getDates();

        long currentTimeMillis = System.currentTimeMillis();
                
        Date nearestDate = null;
        long timeDiff = Long.MAX_VALUE; // Khởi tạo một biến để lưu thời gian chênh lệch nhỏ nhất

        for (Date date : dates) {
            long dateMillis = date.getTime();
            long diff = dateMillis - currentTimeMillis;
            if (diff >= 0 && diff < timeDiff) {
                nearestDate = date;
                timeDiff = diff;
            }
        }

        if (nearestDate != null) {
            // Chuyển đổi và hiển thị ngày gần nhất
            String nearestDateStr = TimeConverter.convertTimeToString(nearestDate.getTime());
            CustomToast.showToast(reactContext, nearestDateStr, 75);

            // Tiếp tục thực hiện các thao tác khác với ngày này
            for (Date date : dates) {
                setPreAlarmAndAlarm(reactContext, date.getTime(), alarmId, _alarm.getPreAlarmTime());
            }
        } else {
            Calendar calendar = Calendar.getInstance();
            List<Integer> time = TimeConverter.convertToHourAndMinute(_alarm.getTime());
            calendar.set(Calendar.HOUR_OF_DAY, time.get(0));
            calendar.set(Calendar.MINUTE, time.get(1));
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            if (calendar.getTime().getTime() < System.currentTimeMillis()) {
                calendar.add(Calendar.DAY_OF_MONTH, 1);
            }

            CustomToast.showToast(reactContext,TimeConverter.convertTimeToString(calendar.getTime().getTime()), 75);
            setPreAlarmAndAlarm(reactContext, calendar.getTime().getTime(), alarmId, _alarm.getPreAlarmTime());
        }
        // Gửi thành công qua Promise
        promise.resolve(_alarm.toString());
        
        Storage.saveAlarm(reactContext, _alarm.getId(), _alarm);
        } catch (Exception e) {
            // Gửi lỗi qua Promise
            promise.reject("Lỗi khi đặt báo thức!", e.getMessage());
        }
    }

    @ReactMethod
    public void getAllAlarm(Promise promise) {
        try {
            List<Alarm> alarms = Storage.getAllAlarms(reactContext);
            promise.resolve(alarms.toString());
        } catch (Exception e) {
            promise.reject("Lỗi khi lấy danh sách báo thức!", e.getMessage());
        }
    }


    @ReactMethod
    public void deleteAlarm(String alarmId, Promise promise) {
        try {
            PendingIntentHelper.cancelAllPendingIntentsAlarmId(reactContext, alarmId);
            Storage.deleteAlarm(reactContext, alarmId);
            promise.resolve("Xóa báo thức thành công!");
        } catch (Exception e) {
            promise.reject("Lỗi khi xóa báo thức!", e.getMessage());
        }
    }

    @ReactMethod
    public void deleteAllAlarms(Promise promise) {
        try {
            PendingIntentHelper.cancelAllPendingIntents(reactContext);
            Storage.deleteAllAlarms(reactContext);
            promise.resolve("Xóa tất cả báo thức thành công!");
        } catch (Exception e) {
            promise.reject("Lỗi khi xóa tất cả báo thức!", e.getMessage());
        }
    }


    public static void setExactAlarm(Context context,long timeInMillis, long alarmId, boolean isPreAlarm) {
        long timeInMillis2 = timeInMillis / 1000;


        Intent intent = new Intent(context, AlarmReceiver.class);
        intent.putExtra("alarmId", alarmId);
        intent.putExtra("isPreAlarm", isPreAlarm);
        intent.putExtra("timeInMillis", timeInMillis);
        // Đặt các thông tin khác cho intent (nếu cần)


        String uniqueCode = timeInMillis2 + "_" + alarmId;
        int requestCode = uniqueCode.hashCode();

        intent.putExtra("requestCode", requestCode);

      
        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, requestCode, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
    
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

    public static void setPreAlarmAndAlarm(Context context, long timeInMillis , long alarmId, int preAlarmTime) {

        setExactAlarm(context ,timeInMillis - preAlarmTime * MINUTE, alarmId, true);

        setExactAlarm(context, timeInMillis, alarmId, false);
    }

    @ReactMethod
    public void getSettings(Promise promise) {
        try {
            Settings settings = Storage.getSettings(reactContext);
            
            if (settings == null) {
                JSONObject defaultRingtoneInfo = getDefaultRingtoneUri();
                String uri = "";
                String title = "";
                if (defaultRingtoneInfo != null) {
                     uri = defaultRingtoneInfo.optString("uri");
                     title = defaultRingtoneInfo.optString("title");
                    // Sử dụng uri và title theo nhu cầu của bạn
                }                 
                settings = new Settings(title, uri, 0.0, true, 0, 0, 0, 1, 0);
            } 
            Storage.saveSettings(reactContext, settings);
            promise.resolve(settings.toString());
        } catch (Exception e) {
            promise.reject("Lỗi khi lấy cài đặt!", e.getMessage());
        }
    }

    @ReactMethod
    public void updateSettingsField(String fieldName, String fieldValue, Promise promise) {
        try {
            Storage.updateSettingsField(reactContext, fieldName, fieldValue);
            promise.resolve("Lưu cài đặt thành công!");
        } catch (Exception e) {
            promise.reject("Lỗi khi lưu cài đặt!", e.getMessage());
        }
    }

    private JSONObject getDefaultRingtoneUri() {
        try {
            Uri defaultRingtoneUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            if (defaultRingtoneUri != null) {
                Ringtone defaultRingtone = RingtoneManager.getRingtone(reactContext, defaultRingtoneUri);
                String title = defaultRingtone != null ? defaultRingtone.getTitle(reactContext) : null;
                JSONObject ringtoneInfo = new JSONObject();
                ringtoneInfo.put("uri", defaultRingtoneUri.toString());
                ringtoneInfo.put("title", title);
                return ringtoneInfo;
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static boolean isVibrationEnabled() {
        return vibrationEnabled;
    }
    
}
