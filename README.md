# 📌 NestJS API

## 📖 Giới thiệu
Dự án này sử dụng [NestJS](https://nestjs.com/) để xây dựng API, hỗ trợ RESTful API.

## 📋 Yêu cầu hệ thống
- **Node.js** >= 22.11.x
- **NPM** hoặc **Yarn**
- **Cơ sở dữ liệu**: MongoDB, MySQL

## 🚀 Cài đặt
```sh
# Clone repository
$ git clone https://github.com/IT-NVC/online_courses_management.git
$ cd online_courses_management

# Cài đặt dependencies
$ npm install  # Hoặc dùng yarn
$ yarn install
```

## ⚙️ Cấu hình
Sao chép file `.env.example` thành `.env` và cập nhật các biến môi trường phù hợp với hệ thống của bạn.

## ▶️ Chạy dự án
```sh
# Chạy dự án ở chế độ development
$ npm run start:dev  # Hoặc dùng yarn
$ yarn start:dev
```

---

## 📌 API Endpoints

### 🔑 Xác thực
| Method | Endpoint   | Mô tả                  |
|--------|-----------|------------------------|
| `POST` | `/login`  | Đăng nhập người dùng   |
| `POST` | `/sign-up` | Đăng ký người dùng     |

### 👤 Quản lý Người dùng
| Method  | Endpoint                  | Mô tả                            |
|---------|---------------------------|----------------------------------|
| `GET`   | `/user/getUser/:id`       | Lấy thông tin người dùng theo ID |
| `PATCH` | `/user/updateUser`        | Cập nhật thông tin người dùng    |
| `POST`  | `/user/register-course`   | Đăng ký khóa học                 |
| `POST`  | `/user/cancel-course`     | Hủy đăng ký khóa học             |
| `GET`   | `/user/get-list-course-registered` | Lấy danh sách khóa học đã đăng ký |

### 📚 Quản lý Khóa học
| Method  | Endpoint                     | Mô tả                           |
|---------|------------------------------|---------------------------------|
| `DELETE` | `/course/deleteCourse/:id`  | Xóa khóa học                    |
| `PATCH`  | `/course/updateCourse/:id`  | Cập nhật thông tin khóa học     |
| `GET`    | `/course/getCourseById/:id` | Lấy thông tin chi tiết khóa học |
| `GET`    | `/course`                   | Lấy danh sách khóa học          |

---

📌 **Lưu ý**: Một số API yêu cầu xác thực bằng token, vui lòng kiểm tra tài liệu hoặc liên hệ với đội ngũ phát triển để biết thêm chi tiết.

💡 **Tác giả**: [IT-NVC](https://github.com/IT-NVC)

