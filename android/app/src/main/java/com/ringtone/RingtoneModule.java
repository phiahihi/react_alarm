package com.ringtone;

import android.app.Activity;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ActivityEventListener;
import android.media.Ringtone;
import org.json.JSONException;
import org.json.JSONObject;

public class RingtoneModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private final ReactApplicationContext reactContext;
    private Promise pickRingtonePromise; 
    private Uri selectedRingtoneUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
    private boolean hasSelectedRingtone = true;

     
    RingtoneModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "RingtoneModule";
    }

    @ReactMethod
    public void getDefaultRingtoneUri(Promise promise) {
        try {
            Uri defaultRingtoneUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            if (defaultRingtoneUri != null) {
                Ringtone defaultRingtone = RingtoneManager.getRingtone(reactContext, defaultRingtoneUri);
                String title = defaultRingtone != null ? defaultRingtone.getTitle(reactContext) : null;
                JSONObject ringtoneInfo = new JSONObject();
                ringtoneInfo.put("uri", defaultRingtoneUri.toString());
                ringtoneInfo.put("title", title);
                promise.resolve(ringtoneInfo.toString());
            } else {
                promise.resolve(null);
            }
        } catch (Exception e) {
            promise.reject("RINGTONE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void pickRingtone(String ringtoneTitle, String ringtoneUri, Promise promise) {
        this.pickRingtonePromise = promise;
        try {
            Activity activity = getCurrentActivity();
            if (activity != null) {
                Intent intent = new Intent(RingtoneManager.ACTION_RINGTONE_PICKER);
                intent.putExtra(RingtoneManager.EXTRA_RINGTONE_TYPE, RingtoneManager.TYPE_ALARM);
                intent.putExtra(RingtoneManager.EXTRA_RINGTONE_EXISTING_URI, Uri.parse(ringtoneUri));
                intent.putExtra(RingtoneManager.EXTRA_RINGTONE_SHOW_SILENT, false);
                // Đặt tiêu đề của ringtone
                intent.putExtra(RingtoneManager.EXTRA_RINGTONE_TITLE, ringtoneTitle);
                
                activity.startActivityForResult(intent, 0);
            }
        } catch (Exception e) {
            this.pickRingtonePromise.reject("RINGTONE_ERROR", e.getMessage());
            this.pickRingtonePromise = null;
        }
    }
    


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
        if (requestCode == 0) { // Ensure the request code matches what you used when calling startActivityForResult
            handleRingtonePickerResult(resultCode, intent); // Use 'intent' instead of 'data'
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        // This is an empty implementation since you don't need to handle new intents
    }


    private void handleRingtonePickerResult(int resultCode, Intent data) {
        if (pickRingtonePromise != null) {
            if (resultCode == Activity.RESULT_OK) {
                Uri ringtoneUri = data.getParcelableExtra(RingtoneManager.EXTRA_RINGTONE_PICKED_URI);
                if (ringtoneUri != null) {
                    Ringtone ringtone = RingtoneManager.getRingtone(reactContext, ringtoneUri);
                    if (ringtone != null) {
                        String title = ringtone.getTitle(reactContext);
                        selectedRingtoneUri = ringtoneUri;
                        // Đối với Android, tạo một đối tượng JSON để trả về
                        JSONObject ringtoneResult = new JSONObject();
                        try {
                            ringtoneResult.put("title", title);
                            ringtoneResult.put("uri", ringtoneUri.toString());
                            pickRingtonePromise.resolve(ringtoneResult.toString());
                        } catch (JSONException e) {
                            pickRingtonePromise.reject("RINGTONE_ERROR", e.getMessage());
                        }
                    } else {
                        pickRingtonePromise.resolve(null);
                    }
                } else {
                    pickRingtonePromise.resolve(null); // Không có nhạc chuông được chọn
                }
            } else {
                pickRingtonePromise.resolve(null);
            }
            pickRingtonePromise = null;
        }
    }
    
    
    
    
}
