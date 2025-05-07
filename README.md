## 📄 OCR-Translate-PDF Web Service

Dịch vụ web tích hợp OCR, dịch thuật và tạo PDF từ hình ảnh tiếng Anh sang tài liệu PDF tiếng Việt. Ứng dụng được phát triển theo kiến trúc **Pipe and Filter**, kết hợp với **Message Queue** để xử lý bất đồng bộ hiệu quả.

---

## 🧠 Tổng quan

Hệ thống hỗ trợ người dùng:

- Nhận dạng văn bản từ hình ảnh tiếng Anh (OCR)
- Dịch văn bản từ tiếng Anh sang tiếng Việt
- Tạo file PDF từ nội dung đã dịch

Toàn bộ quy trình được tự động hóa, tổ chức thành các bước xử lý riêng biệt giúp dễ dàng bảo trì, mở rộng và tối ưu hiệu suất.

---

## 📦 Kiến trúc hệ thống

Hệ thống được triển khai theo mô hình Pipe and Filter, gồm các thành phần chính sau:

### 1. Web Server (Express.js + RESTful API)

- Cho phép người dùng **tải lên ảnh**
- Gọi tuần tự các dịch vụ xử lý:
  - OCR
  - Dịch ngôn ngữ
  - Tạo PDF
- Trả lại file PDF để người dùng tải về

### 2. Worker Services

Mỗi worker phụ trách một tác vụ riêng:

- `OCR Worker`: Trích xuất văn bản từ ảnh
- `Translate Worker`: Dịch văn bản tiếng Anh sang tiếng Việt
- `PDF Worker`: Tạo file PDF từ nội dung đã dịch

### 3. Message Queue (BullMQ)

Quản lý và điều phối tác vụ giữa các worker thông qua hàng đợi:

- `ocr_queue`
- `translate_queue`
- `pdf_queue`

### 4. Caching (Redis)

Tăng tốc và giảm tải hệ thống:

- Cache hình ảnh được gửi đến


### 5. Rate Limiting
- Giới hạn số request mỗi phút, tránh gọi request quá nhiều làm quá tải hệ thống


### 6. Cron
- Dọn sạch những file pdf được xuất ra theo chu kỳ

---

## ⚙️ Hướng dẫn cài đặt

### Yêu cầu:

- Hệ điều hành đã cài sẵn **Tesseract OCR**
- Đảm bảo **Redis server** đang chạy

### Các bước cài đặt:

```bash
# Cài đặt các gói npm
$ npm install

# Tạo thư mục lưu output
$ mkdir output

# Chạy ứng dụng
$ npm start
```

---

## 🗂️ Cấu trúc chức năng

| File                  | Chức năng                                      |
|-----------------------|-----------------------------------------------|
| `utils/ocr.js`        | Chuyển đổi ảnh sang văn bản (OCR)             |
| `utils/translate.js`  | Dịch văn bản tiếng Anh sang tiếng Việt        |
| `utils/pdf.js`        | Tạo file PDF từ văn bản đã dịch               |
