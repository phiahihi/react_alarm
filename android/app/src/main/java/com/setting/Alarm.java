package com.setting;

import com.google.gson.Gson;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class Alarm {
    private String id;
    private String time;
    private List<Boolean> repeatDaysOfWeek;
    private boolean enabled;
    private String ringtoneTitle;
    private String ringtoneUrl;
    private String label;
    private int preAlarmTime;


    public Alarm(String id, String time, List<Boolean> repeatDaysOfWeek, boolean enabled, String ringtoneTitle, String ringtoneUrl, String label, int preAlarmTime) {
        this.id = id;
        this.time = time;
        this.repeatDaysOfWeek = repeatDaysOfWeek;
        this.enabled = enabled;
        this.ringtoneTitle = ringtoneTitle;
        this.ringtoneUrl = ringtoneUrl;
        this.label = label;
        this.preAlarmTime = preAlarmTime;

    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public List<Boolean> getRepeatDaysOfWeek() {
        return repeatDaysOfWeek;
    }

    public void setrepeatDaysOfWeek(List<Boolean> repeatDaysOfWeek) {
        this.repeatDaysOfWeek = repeatDaysOfWeek;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getRingtoneTitle() {
        return ringtoneTitle;
    }

    public void setRingtoneTitle(String ringtoneTitle) {
        this.ringtoneTitle = ringtoneTitle;
    }

    public String getRingtoneUrl() {
        return ringtoneUrl;
    }

    public void setRingtoneUrl(String ringtoneUrl) {
        this.ringtoneUrl = ringtoneUrl;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public int getPreAlarmTime() {
        return preAlarmTime;
    }

    public void setPreAlarmTime(int preAlarmTime) {
        this.preAlarmTime = preAlarmTime;
    }

    public static Alarm fromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, Alarm.class);
    }

    // Method to convert an Alarm object to JSON
    public String toJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }

    public List<Date> getDates() {
        List<Date> dates = new ArrayList<>();
        List<Integer> times = TimeConverter.convertToHourAndMinute(time);
        for (int i = 0; i < repeatDaysOfWeek.size(); i++) {
            if (repeatDaysOfWeek.get(i)) {
                Calendar date = Helper.getDate(i, times.get(0), times.get(1));
                dates.add(date.getTime());
            }
        }
        return dates;
    }  

    // Other methods
    @Override
    public String toString() {
        return "{" +
                "\"id\":\"" + id + "\"" +
                ", \"time\":\"" + time + "\"" +
                ", \"repeatDaysOfWeek\":" + repeatDaysOfWeek +
                ", \"enabled\":" + enabled +
                ", \"ringtoneTitle\":\"" + ringtoneTitle + "\"" +
                ", \"ringtoneUrl\":\"" + ringtoneUrl + "\"" +
                ", \"label\":\"" + label + "\"" +
                ", \"preAlarmTime\":\"" + preAlarmTime + "\"" +
                "}";
    }

}

