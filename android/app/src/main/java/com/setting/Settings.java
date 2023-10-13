package com.setting;

import com.google.gson.Gson;

public class Settings {
    private String titleRingTone;
    private String urlRingTone;
    private double volume;
    private boolean vibrate;
    private int skipNotificationAlarm;
    private int timePreAlarm;
    private int timeShowNotification;
    private int timeSnooze;
    private int timeStopAlarm;

    public Settings(String titleRingTone, String urlRingTone, double volume, boolean vibrate, int skipNotificationAlarm,int timePreAlarm, int timeShowNotification, int timeSnooze, int timeStopAlarm) {
        this.titleRingTone = titleRingTone;
        this.urlRingTone = urlRingTone;
        this.volume = volume;
        this.vibrate = vibrate;
        this.timePreAlarm = timePreAlarm;
        this.timeShowNotification = timeShowNotification;
        this.timeSnooze = timeSnooze;
        this.timeStopAlarm = timeStopAlarm;
    }

    public String getTitleRingTone() {
        return titleRingTone;
    }

    public void setTitleRingTone(String titleRingTone) {
        this.titleRingTone = titleRingTone;
    }

    public String getUrlRingTone() {
        return urlRingTone;
    }

    public void setUrlRingTone(String urlRingTone) {
        this.urlRingTone = urlRingTone;
    }

    public double getVolume() {
        return volume;
    }

    public void setVolume(double volume) {
        this.volume = volume;
    }

    public boolean isVibrate() {
        return vibrate;
    }

    public void setVibrate(boolean vibrate) {
        this.vibrate = vibrate;
    }

    public int getSkipNotificationAlarm() {
        return skipNotificationAlarm;
    }

    public void setSkipNotificationAlarm(int skipNotificationAlarm) {
        this.skipNotificationAlarm = skipNotificationAlarm;
    }

    public int getTimePreAlarm() {
        return timePreAlarm;
    }

    public void setTimePreAlarm(int timePreAlarm) {
        this.timePreAlarm = timePreAlarm;
    }

    public int getTimeShowNotification() {
        return timeShowNotification;
    }

    public void setTimeShowNotification(int timeShowNotification) {
        this.timeShowNotification = timeShowNotification;
    }

    public int getTimeSnooze() {
        return timeSnooze;
    }

    public void setTimeSnooze(int timeSnooze) {
        this.timeSnooze = timeSnooze;
    }

    public int getTimeStopAlarm() {
        return timeStopAlarm;
    }

    public void setTimeStopAlarm(int timeStopAlarm) {
        this.timeStopAlarm = timeStopAlarm;
    }

    public static Settings fromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, Settings.class);
    }

    public String toJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }

    @Override
    public String toString() {
        return "{" +
                "\"titleRingTone\":\"" + titleRingTone + "\"" +
                ", \"urlRingTone\":\"" + urlRingTone + "\"" +
                ", \"volume\":" + volume +
                ", \"vibrate\":" + vibrate +
                ", \"timePreAlarm\":" + timePreAlarm +
                ", \"timeShowNotification\":" + timeShowNotification +
                ", \"timeSnooze\":" + timeSnooze +
                ", \"timeStopAlarm\":" + timeStopAlarm +
                "}";
    }

}