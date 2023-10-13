package com.setting;

import android.content.Context;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import com.react_alarm.R;

public class CustomToast {

    public static void showToast(Context context, String message, int verticalPercentage) {
        // Tạo một đối tượng LayoutInflater để inflate layout của toast
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View customToastView = inflater.inflate(R.drawable.custom_toast, null);

        // Tạo một đối tượng Toast
        Toast customToast = new Toast(context);

        // Thiết lập thời gian hiển thị của toast
        customToast.setDuration(Toast.LENGTH_SHORT);

        // Gán layout và view cho toast
        customToast.setView(customToastView);

        // Hiển thị hình ảnh và văn bản trong toast
        ImageView imageView = customToastView.findViewById(R.id.toast_image);
        TextView textView = customToastView.findViewById(R.id.toast_text);
        imageView.setImageResource(R.drawable.ic_toast); // Thay đổi hình ảnh nếu cần
        textView.setText(message); // Đặt văn bản của toast

        // Tính toán giá trị pixel dựa trên phần trăm của màn hình
        DisplayMetrics displayMetrics = new DisplayMetrics();
        WindowManager windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        if (windowManager != null) {
            windowManager.getDefaultDisplay().getMetrics(displayMetrics);
            int screenHeight = displayMetrics.heightPixels;
            int yOffset = (verticalPercentage * screenHeight) / 100;

            // Đặt vị trí của toast
            customToast.setGravity(Gravity.TOP | Gravity.CENTER_HORIZONTAL, 0, yOffset);
        }

        // Hiển thị toast
        customToast.show();
    }
}
