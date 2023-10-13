package com.setting;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import java.util.Calendar;

public class Helper {
    private static final String TAG = "Helper";
    private static final String ALARM_ID = "ALARM_ID";

    /**
     * Creates a Calendar instance for a specific day, hour, and minute.
     *
     * @param day    The day of the week (e.g., Calendar.MONDAY).
     * @param hour   The hour of the day (24-hour format).
     * @param minute The minute of the hour.
     * @return The Calendar instance representing the specified date and time.
     */
    static Calendar getDate(int day, int hour, int minute) {
        int[] dayConstants = {Calendar.MONDAY, Calendar.TUESDAY, Calendar.WEDNESDAY, Calendar.THURSDAY, Calendar.FRIDAY, Calendar.SATURDAY, Calendar.SUNDAY};

        Calendar date = Calendar.getInstance();
        Calendar today = Calendar.getInstance();
        date.set(Calendar.DAY_OF_WEEK, dayConstants[day]);
        date.set(Calendar.HOUR_OF_DAY, hour);
        date.set(Calendar.MINUTE, minute);
        date.set(Calendar.SECOND, 0);
        if (date.before(today)) {
            date.add(Calendar.DATE, 7);
        }
        return date;
    }

    
 
    /**
     * Sets an alarm using the specified AlarmManager, trigger time, and PendingIntent.
     *
     * @param alarmManager   The AlarmManager instance.
     * @param triggerAtMillis The trigger time in milliseconds since epoch.
     * @param pendingIntent  The PendingIntent for the alarm.
     */
    static void setAlarm(AlarmManager alarmManager, long triggerAtMillis, PendingIntent pendingIntent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
        } else {
            alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
        }
        Log.d(TAG, "SDK version: " + Build.VERSION.SDK_INT);
        Log.d(TAG, "Scheduled alarm with PendingIntent: " + pendingIntent.getIntentSender().toString());
        Log.d(TAG, "Alarm scheduled to fire in " + (((float) (triggerAtMillis - System.currentTimeMillis())) / (1000 * 60)) + " min");
    }
}
