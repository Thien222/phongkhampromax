HƯỚNG DẪN SỬ DỤNG - PHẦN MỀM QUẢN LÝ PHÒNG KHÁM MẮT
=====================================================

Đây là phiên bản đóng gói (portable), có thể chạy ngay mà không cần cài đặt thêm phần mềm nào.

DÀNH CHO MÁY CHỦ (BÁC SĨ / ADMIN):
----------------------------------
1. Giải nén toàn bộ thư mục này.
2. Chạy file "start.bat" (nhấn đúp chuột).
3. Một cửa sổ đen sẽ hiện lên. ĐỪNG TẮT NÓ. Đó là máy chủ.
4. Trình duyệt sẽ tự động mở trang web quản lý (http://localhost:3000).

DÀNH CHO CÁC MÁY KHÁC (LỄ TÂN / KHO):
-------------------------------------
1. Đảm bảo các máy tính cùng kết nối chung mạng Wifi hoặc dây Lan.
2. Trên cửa sổ đen ở máy chủ, xem dòng "Network". Ví dụ: http://192.168.1.5:3000
3. Nhập địa chỉ đó vào trình duyệt Chrome/Cốc Cốc trên máy khác để truy cập.

LƯU Ý:
------
- Database (dữ liệu bệnh nhân, thuốc) được lưu trong trình duyệt của mỗi máy (Local Storage). 
  TUY NHIÊN: Bản cập nhật mới này hỗ trợ đồng bộ dữ liệu qua file Backup cơ bản.
  Để an toàn nhất, hãy dùng tính năng "Sao Lưu & Khôi Phục" trong phần Cài Đặt thường xuyên.
- Nếu không truy cập được từ máy khác, hãy kiểm tra Tường Lửa (Firewall) trên máy chủ và cho phép Node.js truy cập mạng.

---
Phát triển bởi: Antigravity AI
