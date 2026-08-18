# Food Online Ordering App

Ứng dụng đặt đồ ăn trực tuyến — đồ án môn **Lập trình di động**.
Gồm 2 phần: **Backend API** (ASP.NET Core Web API + SQL Server) và **Frontend Mobile** (React Native).

```
├── backend/     # ASP.NET Core Web API (.NET 8)
└── project/     # React Native App
```

---

## 1. Yêu cầu môi trường

| Thành phần | Phiên bản khuyến nghị | Ghi chú |
|---|---|---|
| .NET SDK | 8.0+ | Cho backend |
| SQL Server | 2019+ (hoặc Express/LocalDB) | Cho database |
| Node.js | 20 LTS+ | Cho frontend |
| npm | đi kèm Node.js | Cài package |
| Android Studio | bản mới nhất | Build/chạy Android (SDK, emulator) |
| JDK | 17 | Bắt buộc cho Android Gradle build |
| Xcode | mới nhất (chỉ macOS) | Nếu build iOS |
| Visual Studio 2022 / VS Code | — | IDE khuyến nghị cho backend |

> Kiểm tra nhanh: `dotnet --version`, `node --version`, `npm --version`, `java --version`

---

## 2. Chạy Backend (ASP.NET Core Web API)

### Bước 1 — Cấu hình kết nối database

Mở file `backend/backend/appsettings.json`, kiểm tra chuỗi kết nối:

```json
"ConnectionStrings": {
  "DBConnection": "data source=.;initial catalog=FoodOrderApp;persist security info=True;user id=sa;password=123456;MultipleActiveResultSets=True;encrypt=false"
}
```

- `data source=.` — trỏ tới SQL Server instance mặc định trên máy local. Nếu máy bạn dùng instance khác (ví dụ `.\SQLEXPRESS`), sửa lại cho đúng.
- `user id` / `password` — đổi thành tài khoản SQL Server thật trên máy bạn nếu không dùng `sa/123456`.
- Nếu dùng Windows Authentication thay vì SQL login, đổi chuỗi thành:
  `"data source=.;initial catalog=FoodOrderApp;integrated security=True;encrypt=false"`

### Bước 2 — Khởi tạo database

Mở terminal tại thư mục chứa file `.csproj` (`backend/backend/`):

```bash
cd backend/backend

# Cài EF Core CLI tool (chỉ cần làm 1 lần trên máy)
dotnet tool install --global dotnet-ef

# Tạo database + toàn bộ bảng theo Migrations có sẵn
dotnet ef database update
```

Lệnh này sẽ tự tạo database `FoodOrderApp` trên SQL Server và sinh đầy đủ các bảng theo đúng schema trong thư mục `Migrations/`. Nếu project có `DataSeeder.cs`, dữ liệu mẫu (tài khoản, nhà hàng, món ăn...) sẽ được nạp sẵn khi chạy ứng dụng lần đầu.

### Bước 3 — Chạy API

```bash
dotnet restore
dotnet run
```

Mặc định API chạy tại:

- HTTP: `http://localhost:5078`
- HTTPS: `https://localhost:7133`
- Swagger UI (test API trực tiếp trên trình duyệt): `https://localhost:7133/swagger`

Có thể chạy trực tiếp bằng Visual Studio 2022 (mở file `backend.slnx`, nhấn F5) thay vì dùng CLI.

### Kiểm tra nhanh

Mở `https://localhost:7133/swagger`, thử gọi `POST /api/auth/register` hoặc `GET /api/foods` — nếu trả về JSON là backend đã chạy đúng.

---

## 3. Chạy Frontend (React Native)

### Bước 1 — Cài dependencies

```bash
cd project/project
npm install
```

### Bước 2 — Cấu hình địa chỉ API

Mở file cấu hình API client (thường ở `api/client.js` hoặc tương đương) và trỏ `baseURL` về địa chỉ backend:

- Chạy trên **Android Emulator**: dùng `http://10.0.2.2:5078` (địa chỉ đặc biệt emulator dùng để trỏ về `localhost` của máy host).
- Chạy trên **thiết bị thật** (cùng mạng Wi-Fi với máy chạy backend): dùng địa chỉ IP LAN của máy, ví dụ `http://192.168.1.10:5078`.
- Chạy trên **iOS Simulator**: có thể dùng thẳng `http://localhost:5078`.

### Bước 3 — Chạy ứng dụng Android

```bash
# Terminal 1: khởi động Metro bundler
npx react-native start

# Terminal 2: build & cài lên emulator/thiết bị
npx react-native run-android
```

> Cần mở sẵn 1 Android Emulator (qua Android Studio > Device Manager) hoặc cắm thiết bị Android thật đã bật USB debugging trước khi chạy `run-android`.

### Chạy ứng dụng iOS (chỉ trên macOS)

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### Lưu ý về Google Sign-In / Firebase

Ứng dụng dùng `google-services.json` (đã có sẵn trong `android/app/`) để đăng nhập Google/Firebase. Nếu Gradle báo lỗi thiếu file này, kiểm tra lại đường dẫn `android/app/google-services.json` có tồn tại không.

---

## 3.1. Cấu hình Firebase Admin SDK cho Backend (bắt buộc)

Backend sử dụng **Firebase Admin SDK** (ví dụ để xác thực token đăng nhập Google, gửi thông báo...) thông qua file `firebase-service-account.json`. Đây là **credential nhạy cảm** (chứa private key), **không được commit lên Git** — vì vậy file này **không có sẵn trong repository** và cần được cấp riêng.

### Cách lấy file `firebase-service-account.json`

1. Truy cập [Firebase Console](https://console.firebase.google.com/) → chọn đúng project của ứng dụng.
2. Vào **Project Settings** (biểu tượng bánh răng) → tab **Service Accounts**.
3. Nhấn **Generate new private key** → xác nhận → file `.json` sẽ được tải về máy.
4. Đổi tên file (nếu cần) thành `firebase-service-account.json`.

> Nếu bạn không có quyền truy cập Firebase project gốc của nhóm, liên hệ trực tiếp thành viên phụ trách Backend để nhận file này qua kênh riêng tư (email, Zalo, Drive có phân quyền...) — **không gửi qua kênh công khai**.

### Đặt file vào đúng vị trí

Copy file vừa tải về vào:

```
backend/backend/firebase-service-account.json
```

(ngang hàng với file `appsettings.json` và `backend.csproj`)

### Kiểm tra cấu hình đọc file trong code

Xác nhận trong `Program.cs` (hoặc file cấu hình Firebase Admin liên quan) đang trỏ đúng tên/đường dẫn file này, ví dụ:

```csharp
var credential = GoogleCredential.FromFile("firebase-service-account.json");
```

Nếu thiếu file này, backend vẫn build được nhưng các API liên quan đến Firebase (đăng nhập Google, gửi notification...) sẽ báo lỗi khi gọi tới — các API CRUD cơ bản khác (món ăn, đơn hàng, giỏ hàng...) không bị ảnh hưởng.

---

## 4. Tài khoản demo (nếu có DataSeeder)

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Khách hàng | *(điền theo dữ liệu seed thực tế)* | *(điền theo dữ liệu seed thực tế)* |
| Chủ nhà hàng | *(điền theo dữ liệu seed thực tế)* | *(điền theo dữ liệu seed thực tế)* |

> Nhóm cập nhật lại bảng này theo đúng dữ liệu mẫu thực tế trong `DataSeeder.cs` trước khi nộp.

---

## 5. Cấu trúc thư mục chính

```
backend/backend/
├── Controllers/     # 14 API controller
├── Services/        # Xử lý nghiệp vụ
├── Repositories/     # Truy xuất dữ liệu (EF Core)
├── Models/           # Entity ánh xạ database
├── DTOs/              # Data Transfer Objects
├── Data/               # AppDbContext, DataSeeder
├── Migrations/          # EF Core migration history
└── appsettings.json      # Cấu hình kết nối DB

project/project/
├── screens/       # 20 màn hình ứng dụng
├── navigation/     # Điều hướng (Stack + Bottom Tabs)
├── store/           # Redux Toolkit (12 slice)
├── services/          # Gọi API tương ứng từng nghiệp vụ
├── api/                 # Cấu hình Axios client
└── android/ , ios/        # Native project
```

---

## 6. Xử lý sự cố thường gặp

| Lỗi | Nguyên nhân thường gặp | Cách khắc phục |
|---|---|---|
| `dotnet ef` không nhận lệnh | Chưa cài EF Core CLI tool | `dotnet tool install --global dotnet-ef` |
| Không kết nối được SQL Server | Sai `data source` / SQL Server chưa bật TCP/IP | Kiểm tra SQL Server Configuration Manager, bật TCP/IP, đúng instance name |
| App không gọi được API (Network Error) | Sai `baseURL`, dùng nhầm `localhost` trên emulator | Dùng `10.0.2.2` cho Android Emulator thay vì `localhost` |
| Lỗi build Android thiếu `google-services.json` | File bị xóa hoặc đặt sai thư mục | Đảm bảo file nằm đúng tại `android/app/google-services.json` |
| API liên quan Firebase (đăng nhập Google, notification) báo lỗi 500 | Thiếu `firebase-service-account.json` ở Backend | Xem mục 3.1 — lấy file từ Firebase Console hoặc liên hệ nhóm |
| Metro bundler treo / lỗi cache | Cache cũ | `npx react-native start --reset-cache` |

---

## 7. Liên hệ / Nhóm thực hiện

Đồ án môn Lập trình di động — Nhóm [điền tên nhóm].
Danh sách thành viên và phân công: xem file báo cáo `BaoCao_FoodOrderingApp.docx`, mục 1.5.
