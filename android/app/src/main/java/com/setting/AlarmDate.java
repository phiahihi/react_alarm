package com.setting;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Random;

public class AlarmDate {
    private final String alarmId;
    private final List<Date> dates;
    private final List<Integer> notificationIds;
    private static final String POSTFIX = "_DATES";


    public AlarmDate(String alarmId, List<Date> dates) {
        this.alarmId = alarmId;
        this.dates = new ArrayList<>(dates); // Defensive copy to prevent external modification.
        this.notificationIds = generateNotificationIds(dates.size());
    }

    public String getAlarmId() {
        return alarmId;
    }

    public String getDatesId() {
        return alarmId + POSTFIX;
    }

    public List<Date> getDates() {
        return new ArrayList<>(dates); // Defensive copy to prevent external modification.
    }

    public int getNotificationId(Date date) {
        int index = dates.indexOf(date);
        if (index >= 0 && index < notificationIds.size()) {
            return notificationIds.get(index);
        }
        return -1;
    }

    private List<Integer> generateNotificationIds(int size) {
        List<Integer> ids = new ArrayList<>();
        Random random = new Random();
        for (int i = 0; i < size; i++) {
            ids.add(random.nextInt(NotificationIdConstants.MAX_ID));
        }
        return ids;
    }

    public static Date setNextWeek(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, 7);
        return calendar.getTime();
    }

    public static Date snooze(Date date, int minutes) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE, minutes);
        return calendar.getTime();
    }

    // Constants for notification ID generation
    private static class NotificationIdConstants {
        private static final int MAX_ID = 10_000_000;
    }
}
