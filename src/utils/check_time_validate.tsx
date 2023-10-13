export function checkValid24HourFormat(input: string): boolean {
    // Chuyển đổi chuỗi đầu vào thành định dạng thời gian "HH:mm"
    const cleanedInput = input.replace('-', '');
    // Biểu thức chính quy kiểm tra định dạng thời gian 24 giờ HH:mm
    const pattern = /^(?:[01]?\d|2[0-3]):[0-5]\d$/;
    return pattern.test(cleanedInput);
  }
