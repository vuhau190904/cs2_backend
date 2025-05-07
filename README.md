📄 OCR-Translate-PDF Web Service
Dịch vụ web tích hợp OCR, dịch thuật và tạo PDF từ hình ảnh tiếng Anh sang tài liệu PDF tiếng Việt, được phát triển theo kiến trúc microservice và sử dụng hàng đợi thông điệp (message queue) để xử lý song song.

🧠 Tổng quan
Hệ thống này giúp người dùng:

Nhận dạng văn bản từ hình ảnh tiếng Anh (OCR)

Dịch văn bản tiếng Anh sang tiếng Việt

Tạo file PDF từ nội dung dịch

Toàn bộ quy trình được tự động hóa và hoạt động theo từng bước xử lý riêng biệt giúp dễ dàng mở rộng, bảo trì và tối ưu hiệu suất.

📦 Kiến trúc hệ thống
Ứng dụng sử dụng kiến trúc microservice gồm các thành phần:

1. Web Server (Express.js + API RESTful)
Cho phép người dùng tải lên ảnh

Gọi tuần tự các dịch vụ xử lý:

OCR

Dịch ngôn ngữ

Tạo PDF

Trả lại file PDF để người dùng tải về

2. Worker Services
Mỗi worker đảm nhận một nhiệm vụ riêng biệt:

Preprocess Worker: Xử lý sơ bộ ảnh đầu vào

OCR Worker: Trích xuất văn bản từ ảnh

Translate Worker: Dịch văn bản tiếng Anh sang tiếng Việt

PDF Worker: Tạo file PDF từ nội dung dịch

3. Message Queue (RabbitMQ)
Đảm nhận việc phân phối công việc đến các worker qua các hàng đợi:

preprocess_queue

ocr_queue

translate_queue

pdf_queue

4. Caching (Redis)
Tăng tốc xử lý và giảm tải:

Cache file hình ảnh được tải lên

5. Monitoring
Giám sát hiệu suất hệ thống:

Thời gian xử lý từng giai đoạn

Tốc độ hàng đợi

Tình trạng các worker

⚙️ Hướng dẫn cài đặt
Yêu cầu:
Đã cài sẵn Tesseract OCR

Các bước cài đặt:
bash
Copy
Edit
# Cài đặt các gói npm
$ npm install

# Tạo thư mục lưu output
$ mkdir output

# Chạy ứng dụng
$ npm start
🗂️ Cấu trúc chức năng
File	Chức năng
utils/ocr.js	Chuyển đổi ảnh sang text (OCR)
utils/translate.js	Dịch tiếng Anh sang tiếng Việt
utils/pdf.js	Tạo file PDF từ nội dung text

