package com.setting;

import android.content.Context;
import android.content.SharedPreferences;

import com.react_alarm.R;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Date;
import java.util.Map;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

public class Storage {
    private static final String SHARED_PREF_KEY = "MyAlarmPreferences";


    private static SharedPreferences getSharedPreferences(Context context) {
        return context.getSharedPreferences(SHARED_PREF_KEY, Context.MODE_PRIVATE);
    }

    // Lưu đối tượng Alarm với một khóa riêng biệt
    public static void saveAlarm(Context context, String alarmId, Alarm alarm) {
        SharedPreferences sharedPreferences = getSharedPreferences(context);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        Gson gson = new Gson();
        String json = gson.toJson(alarm);
        editor.putString("alarm_" + alarmId, json); // Sử dụng khóa riêng biệt
        editor.apply();

        // Thêm khóa của Alarm vào danh sách các khóa
        addAlarmKey(context, alarmId);
    }
    // Thêm khóa của Alarm vào danh sách các khóa
    private static void addAlarmKey(Context context, String alarmId) {
        SharedPreferences sharedPreferences = getSharedPreferences(context);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        Set<String> alarmKeys = sharedPreferences.getStringSet("alarm_keys", new HashSet<>());
        alarmKeys.add("alarm_" + alarmId);
        editor.putStringSet("alarm_keys", alarmKeys);
        editor.apply();
    }

    public static Alarm getAlarm(Context context, String alarmId) {
        SharedPreferences sharedPreferences = getSharedPreferences(context);
        String json = sharedPreferences.getString("alarm_" + alarmId, null);
        if (json != null) {
            Gson gson = new Gson();
            return gson.fromJson(json, Alarm.class);
        }
        return null;
    }

    public static void updateAlarmField(Context context, String alarmId, String fieldName, String newValue) {
        SharedPreferences sharedPreferences = getSharedPreferences(context);

        // Bước 1: Truy xuất đối tượng Alarm hiện có từ SharedPreferences bằng "alarmId"
        Alarm existingAlarm = getAlarm(context, alarmId);

        if (existingAlarm != null) {
            // Bước 2: Thay đổi giá trị của trường dữ liệu cần cập nhật
            if ("time".equals(fieldName)) {
                existingAlarm.setTime(newValue);
            } else if ("label".equals(fieldName)) {
                existingAlarm.setLabel(newValue);
            } else if ("ringtoneTitle".equals(fieldName)) {
                existingAlarm.setRingtoneTitle(newValue);
            } else if ("ringtoneUrl".equals(fieldName)) {
                existingAlarm.setRingtoneUrl(newValue);
            } else if ("repeatDaysOfWeek".equals(fieldName)) {
                // Giá trị newValue là một chuỗi JSON
                Gson gson = new Gson();
                List<Boolean> repeatDaysOfWeek = gson.fromJson(newValue, List.class);
                existingAlarm.setrepeatDaysOfWeek(repeatDaysOfWeek);
            } else if ("enabled".equals(fieldName)) {
                // Giá trị newValue là một chuỗi JSON
                Gson gson = new Gson();
                Boolean enabled = gson.fromJson(newValue, Boolean.class);
                existingAlarm.setEnabled(enabled);
            }

            // Thêm các trường dữ liệu khác cần cập nhật tương tự ở đây

            // Bước 3: Lưu đối tượng Alarm đã cập nhật vào SharedPreferences với cùng "alarmId"
            saveAlarm(context, alarmId, existingAlarm);
        }
    }

    public static void deleteAlarm(Context context, String alarmId) {
        SharedPreferences sharedPreferences = getSharedPreferences(context);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.remove("alarm_" + alarmId); // Đảm bảo rằng khóa của alarm được xóa
        removeAlarmKey(context, alarmId); // Xóa khóa của alarm khỏi danh sách
        editor.apply();
    }
    
    public static void deleteAllAlarms(Context context) {
        SharedPreferences sharedPreferences = getSharedPreferences(context);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        Set<String> alarmKeys = sharedPreferences.getStringSet("alarm_keys", new HashSet<>());
    
        // Xóa tất cả các alarms dựa trên danh sách các khóa
        for (String alarmKey : alarmKeys) {
            editor.remove(alarmKey);
        }
    
        // Xóa danh sách các khóa
        editor.remove("alarm_keys");
        editor.apply();
    }
    
    // Hàm này để xóa khóa của một alarm ra khỏi danh sách các khóa
    private static void removeAlarmKey(Context context, String alarmId) {
        SharedPreferences sharedPreferences = getSharedPreferences(context);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        Set<String> alarmKeys = sharedPreferences.getStringSet("alarm_keys", new HashSet<>());
        alarmKeys.remove("alarm_" + alarmId);
        editor.putStringSet("alarm_keys", alarmKeys);
        editor.apply();
    }

    public static List<Alarm> getAllAlarms(Context context) {
        SharedPreferences sharedPreferences = getSharedPreferences(context);
        Set<String> alarmKeys = sharedPreferences.getStringSet("alarm_keys", new HashSet<>());
        List<Alarm> alarms = new ArrayList<>();
    
        for (String alarmKey : alarmKeys) {
            String json = sharedPreferences.getString(alarmKey, null);
            if (json != null) {
                Gson gson = new Gson();
                Alarm alarm = gson.fromJson(json, Alarm.class);
                alarms.add(alarm);
            }
        }
    
        return alarms;
    }
    
    public static void saveSettings(Context context, Settings settings) {
        SharedPreferences sharedPreferences = getSharedPreferences(context);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        Gson gson = new Gson();
        String json = gson.toJson(settings);
        editor.putString("settings", json);
        editor.apply();
    }

    public static Settings getSettings(Context context) {
        SharedPreferences sharedPreferences = getSharedPreferences(context);
        String json = sharedPreferences.getString("settings", null);
        if (json != null) {
            Gson gson = new Gson();
            return gson.fromJson(json, Settings.class);
        }
        return null;
    }

    public static void updateSettingsField(Context context, String fieldName, String newValue) {
        SharedPreferences sharedPreferences = getSharedPreferences(context);

        // Bước 1: Truy xuất đối tượng Settings hiện có từ SharedPreferences bằng "settings"
        Settings existingSettings = getSettings(context);

        if (existingSettings != null) {
            // Bước 2: Thay đổi giá trị của trường dữ liệu cần cập nhật
            if ("vibrate".equals(fieldName)) {
                existingSettings.setVibrate(Boolean.parseBoolean(newValue));
            }  else if ("urlRingTone".equals(fieldName)) {
                existingSettings.setUrlRingTone(newValue);
            }
            else if ("volume".equals(fieldName)) {
                existingSettings.setVolume(Double.parseDouble(newValue));
            }
            else if ("titleRingTone".equals(fieldName)) {
                existingSettings.setTitleRingTone(newValue);
            }
            else if ("skipNotificationAlarm".equals(fieldName)) {
                existingSettings.setSkipNotificationAlarm(Integer.parseInt(newValue));
            } else if ("timePreAlarm".equals(fieldName)) {
                existingSettings.setTimePreAlarm(Integer.parseInt(newValue));
            } else if ("timeShowNotification".equals(fieldName)) {
                existingSettings.setTimeShowNotification(Integer.parseInt(newValue));
            } else if ("timeSnooze".equals(fieldName)) {
                existingSettings.setTimeSnooze(Integer.parseInt(newValue));
            } else if ("timeStopAlarm".equals(fieldName)) {
                existingSettings.setTimeStopAlarm(Integer.parseInt(newValue));
            }

            // Thêm các trường dữ liệu khác cần cập nhật tương tự ở đây

            // Bước 3: Lưu đối tượng Settings đã cập nhật vào SharedPreferences với cùng "settings"
            saveSettings(context, existingSettings);
        }
    }
}
