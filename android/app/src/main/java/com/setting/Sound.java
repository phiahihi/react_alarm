package com.setting;

import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.Settings;
import android.util.Log;
import android.os.Handler;

public class Sound {

    private static final String TAG = "AlarmSound";
    private static final int MAX_VOLUME = 100;
    private static final long DEFAULT_VIBRATION = 100;
    private static final long LONG_VIBRATION = 5000;
    private static final long[] VIBRATION_PATTERN = {0, 100, 1000};

    private AudioManager audioManager;
    private int userVolume;
    private MediaPlayer mediaPlayer;
    private Vibrator vibrator;
    private boolean isPlaying = false;
    private Handler volumeHandler;
    private int currentVolume = 0;

    private Context context;

    public Sound(Context context) {
        this.context = context;
        this.vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
        this.audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        this.userVolume = audioManager.getStreamVolume(AudioManager.STREAM_ALARM);
        this.mediaPlayer = new MediaPlayer();
    }

    public void play(String sound , boolean isVibrate, int volume) {
        if (!isPlaying) {
            Uri soundUri = getSoundUri(sound) ;
            if (isVibrate) {
                startVibration();
            }
            playSound(soundUri, volume);
            isPlaying = true;
        }
    }

   public void stop() {
        if (isPlaying) {
            stopSound();
            stopVibration();
            isPlaying = false;
            mediaPlayer.release();
        }
    }

    private void playSound(Uri soundUri, int vol) {
        try {
            if (!mediaPlayer.isPlaying()) {
                mediaPlayer.setScreenOnWhilePlaying(true);
                mediaPlayer.setAudioStreamType(AudioManager.STREAM_ALARM);
                mediaPlayer.setDataSource(context, soundUri);
                mediaPlayer.setVolume(vol, vol);
                mediaPlayer.setLooping(true);
                mediaPlayer.prepare();
                mediaPlayer.start();
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to play sound", e);
        }
    }

    private void stopSound() {
        try {
            audioManager.setStreamVolume(AudioManager.STREAM_ALARM, userVolume, AudioManager.FLAG_PLAY_SOUND);
            mediaPlayer.stop();
            mediaPlayer.reset();
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "ringtone: " + e.getMessage());
        }
    }

    private void fadeInVolume(int targetVolume) {
        volumeHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (currentVolume < targetVolume) {
                    float volume = (float) currentVolume / targetVolume; // Chia cho targetVolume để có một dải từ 0 đến 1
                    mediaPlayer.setVolume(volume, volume);
                    currentVolume++;
                    fadeInVolume(targetVolume);
                }
            }
        }, 2000); // Tăng âm lượng mỗi giây trong 2 giây
    }

    private void startVibration() {
        vibrator.vibrate(DEFAULT_VIBRATION);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(LONG_VIBRATION, VibrationEffect.DEFAULT_AMPLITUDE));
        } else {
            vibrator.vibrate(LONG_VIBRATION);
        }

        vibrator.vibrate(VIBRATION_PATTERN, 0);
    }

    private void stopVibration() {
        vibrator.cancel();
    }

    private Uri getSoundUri(String soundUrl) {
        // Chuyển đổi soundUrl thành Uri
        Uri soundUri = Uri.parse(soundUrl);
        
        // Kiểm tra xem soundUri có hợp lệ không trước khi trả về
        if (soundUri != null) {
            return soundUri;
        } else {
            // Nếu soundUri không hợp lệ, bạn có thể trả về một giá trị mặc định hoặc báo lỗi
            // Ví dụ:
            return Settings.System.DEFAULT_RINGTONE_URI;
        }
    }
    
}
