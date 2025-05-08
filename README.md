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

### 7. Đánh giá và So sánh Hiệu Năng

#### ⚙️ Hệ thống cũ (monolithic, không queue/cache)
- **Thời gian xử lý trung bình mỗi ảnh**: ~1.346 giây
- **Không có cơ chế queue hoặc cache**, nên toàn bộ quá trình xử lý ảnh phải được thực hiện lại từ đầu cho mỗi yêu cầu, gây tốn tài nguyên khi người dùng yêu cầu lại cùng một tệp PDF.

#### 🏗 Hệ thống mới (sử dụng message queue, chia process, có cache)
- **Thời gian xử lý trung bình mỗi ảnh**: ~1.824 giây (tăng ~35%)
- Độ trễ tăng do yêu cầu được đẩy qua message queue và xử lý bất đồng bộ qua nhiều tiến trình phụ trợ.
- **Ưu điểm nổi bật**: Hệ thống mới **hỗ trợ cache**, nên các ảnh đã xử lý trước đó được lưu lại dưới dạng PDF – người dùng có thể tải lại nhanh chóng mà không cần xử lý lại từ đầu.
- **Khả năng mở rộng cao hơn** nhờ tách riêng các process OCR, dịch và PDF – dễ dàng scale theo chiều ngang bằng cách tăng số lượng worker.

---

### 📈 So sánh Benchmark Thực Tế

| Yếu tố                        | 1 Worker                            | Nhiều Worker (Ảnh benchmark)     |
|------------------------------|-------------------------------------|----------------------------------|
| Số ảnh xử lý                 | 10 ảnh x 100 lần = 1.000 request    | 1.000 request                    |
| Thời gian trung bình         | 934ms                               | 206ms                            |
| Throughput                   | ~16.7 request/giây                  | ~16.9 request/giây               |
| Tỷ lệ lỗi                    | 0%                                  | 0%                               |
| Độ ổn định                   | Vừa                                 | Tốt, không lỗi dù tải tương đương |
| Kết luận                     | Hệ thống hoạt động tốt với khối lượng thấp nhưng thời gian xử lý trung bình cao.                        | Ổn định hơn nhờ đa tiến trình    |

> ⏳ Việc sử dụng nhiều worker rõ ràng giúp giảm thời gian phản hồi từ **934ms xuống 206ms** cho mỗi request – gấp hơn 4 lần nhanh hơn so với hệ thống 1 worker đơn lẻ. Đồng thời, hệ thống mới loại bỏ hoàn toàn lỗi server và throttle khi xử lý đồng thời.

---

### 📝 Kết luận

Hệ thống sau khi cải tiến tuy có độ trễ cao hơn cho từng request đơn lẻ do sử dụng message queue, nhưng **tổng thể hiệu suất và khả năng mở rộng đã được cải thiện đáng kể**:

- **Ổn định hơn** khi xử lý tải lớn.
- **Hỗ trợ cache**, giúp tiết kiệm thời gian và tài nguyên khi xử lý ảnh đã tồn tại.

Hệ thống mới phù hợp cho các ứng dụng thực tế nơi người dùng có thể gửi nhiều ảnh và cần khả năng phục hồi nhanh chóng.

### Link video so sánh: 

https://youtu.be/6gItgdplXZE

https://youtu.be/zGwIzEt8ApM

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
