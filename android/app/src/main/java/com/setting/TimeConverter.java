package com.setting;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.Date;

public class TimeConverter {
    public static List<Integer> convertToHourAndMinute(String time) {
        String[] parts = time.split(":");
        List<Integer> result = new ArrayList<>();

        if (parts.length == 2) {
            try {
                result.add( Integer.parseInt(parts[0])); // Hours
                result.add( Integer.parseInt(parts[1])); // Minutes
            } catch (NumberFormatException e) {
                // Handle parsing error if needed
            }
        }

        return result;
    }

    public static String convertTimeToString(long timeAlarm) {
        Date currentTime = new Date();
        String result = "Báo thức sẽ kêu sau ";
        long timeRemaining = timeAlarm - currentTime.getTime();
        
        // Kiểm tra nếu timeRemaining âm hoặc bằng 0, thì thêm một ngày
        if (timeRemaining <= 0) {
            timeRemaining += TimeUnit.DAYS.toMillis(1); // Thêm một ngày
        }
        
        // Chuyển đổi thời gian còn lại thành phút và giờ
        long minutes = TimeUnit.MILLISECONDS.toMinutes(timeRemaining);
        long hours = TimeUnit.MILLISECONDS.toHours(timeRemaining);
        long days = TimeUnit.MILLISECONDS.toDays(timeRemaining);
        
        // Bớt đi khoảng thời gian đã tính thành phút và giờ
        long remainingMinutes = minutes - TimeUnit.HOURS.toMinutes(hours);
        long remainingHours = hours - TimeUnit.DAYS.toHours(days);
    
        // Tạo chuỗi kết quả
        if (days > 0) {
            result += days + " ngày ";
        }
        if (remainingHours > 0) {
            result += remainingHours + " giờ ";
        }
        if (remainingMinutes > 0) {
            result += remainingMinutes + " phút";
        }

        if (remainingMinutes <= 1 && remainingHours <= 0 && days <= 0) {
            result = "Báo thức sẽ kêu trong ít phút nữa";
        }
        
        // Trả về chuỗi kết quả
        return result;
    }
}
