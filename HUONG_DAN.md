# Hướng dẫn cài đặt Add-in "Đổi số tiền thành chữ"

Bộ file gồm:
- `manifest.xml` — file khai báo add-in (task pane + custom function)
- `taskpane.html` — giao diện task pane (đổi tay, chọn ô đích để ghi)
- `functions.html`, `functions.js`, `functions.json` — hàm tuỳ chỉnh `=VND.CONVERT(...)`
- `icon-32.png`, `icon-64.png`, `icon-80.png` — icon hiển thị trên ribbon Excel

**Tất cả 8 file trên đều phải upload lên GitHub Pages** (kể cả các file `functions.*`), không chỉ mỗi `taskpane.html` như bản trước.

---

## Bước 1: Host file lên GitHub Pages (miễn phí)

1. Đăng nhập GitHub, tạo 1 repo mới, ví dụ `vnd-addin` (phải để **Public** — GitHub Pages free chỉ chạy với repo public).
2. Upload **8 file** kể trên vào **root** của repo (không để trong thư mục con). Không cần upload `manifest.xml` lên đây (chỉ dùng để sideload).
   → Vậy thực tế cần upload 7 file: `taskpane.html`, `functions.html`, `functions.js`, `functions.json`, `icon-32.png`, `icon-64.png`, `icon-80.png`.
3. Vào repo > **Settings** > **Pages**.
4. Ở "Build and deployment" > Source, chọn **Deploy from a branch** > branch `main`, thư mục `/ (root)` > **Save**.
5. Đợi 1–2 phút, GitHub cấp URL dạng:
   ```
   https://<ten-tai-khoan-github>.github.io/<ten-repo>/
   ```
6. Kiểm tra bằng cách mở `https://.../functions.json` trên trình duyệt — nếu thấy nội dung JSON hiện ra là host ổn.

## Bước 2: Sửa file manifest.xml

Mở `manifest.xml`, tìm và thay **toàn bộ** (có khoảng 9 chỗ) `YOUR_GITHUB_USERNAME` và `YOUR_REPO_NAME` bằng URL thật của bạn, ví dụ:
```
https://phuc123.github.io/vnd-addin/icon-32.png
https://phuc123.github.io/vnd-addin/taskpane.html
https://phuc123.github.io/vnd-addin/functions.js
https://phuc123.github.io/vnd-addin/functions.json
https://phuc123.github.io/vnd-addin/functions.html
```
Dùng Find & Replace cho nhanh, rồi lưu lại.

### Muốn đổi tên hàm ngắn gọn hơn (tuỳ chọn)

Mặc định hàm sẽ gõ là `=VND.CONVERT(D18)`. Excel **bắt buộc** hàm tuỳ chỉnh phải có tiền tố namespace, không thể chỉ gõ `=VND(...)` trần trụi. Nếu muốn gõ ngắn hơn, ví dụ `=VN.C(D18)`:
- Trong `manifest.xml`, sửa `<Namespace>VND</Namespace>` thành `<Namespace>VN</Namespace>`.
- Trong `functions.json` và `functions.js`, đổi `"id": "CONVERT"` / `CustomFunctions.associate("CONVERT", ...)` thành `"C"`.
- Phải sửa đồng bộ ở cả 3 chỗ (manifest namespace, functions.json id, functions.js associate) nếu không hàm sẽ báo lỗi `#NAME?`.

## Bước 3: Sideload vào Excel Online

1. Mở Excel Online (office.com), mở file Excel bất kỳ.
2. Tab **Insert** > **Add-ins** > **More Add-ins** (hoặc "Get Add-ins").
3. Tab **MY ADD-INS** > **Upload My Add-in**.
4. Chọn file `manifest.xml` (đã sửa URL), bấm **Upload**.
5. Add-in xuất hiện, mở task pane để test, hoặc dùng hàm ngay trong ô.

## Bước 4: Sử dụng

### Cách 1 — Dùng hàm trực tiếp trong ô (giống công thức Excel)

Ở ô bất kỳ (ví dụ B20), gõ:
```
=VND.CONVERT(D18)
```
- D18 có thể là số nhập tay, hoặc kết quả của công thức khác — hàm tự tính lại mỗi khi D18 đổi giá trị, giống hệt các hàm có sẵn của Excel.
- Nếu D18 rỗng, kết quả trả về là chuỗi rỗng.
- Nếu D18 không phải là số hợp lệ, hàm trả về `#GIA_TRI_KHONG_HOP_LE`.

### Cách 2 — Task pane (đổi tay, không cần công thức)

Mở task pane từ ribbon (nút "Đổi so thanh chu"):
- **Đổi ô đang chọn / đổi số gõ tay**: như bản trước.
- **Ghi vào ô cụ thể**: gõ địa chỉ ô (ví dụ `B20`) vào ô "Ghi vào ô cụ thể", hoặc bấm **"Lấy ô đang chọn trên sheet làm ô đích"** (bấm chọn ô B20 trên sheet trước, rồi bấm nút này để tự điền địa chỉ), sau đó bấm **"Ghi kết quả vào ô đích ở trên"** — add-in sẽ ghi thẳng giá trị chữ vào đúng ô đó.
- Lưu ý: cách này ghi **giá trị tĩnh** (text), không phải công thức — nếu ô nguồn đổi, phải bấm lại để cập nhật. Muốn tự động cập nhật, dùng Cách 1 (`=VND.CONVERT(...)`).

## Lưu ý quan trọng

- **Sideload gắn với trình duyệt**, không gắn với file cụ thể — mở file khác cùng máy/trình duyệt vẫn dùng được add-in mà không cần upload lại; đổi trình duyệt/máy/xoá cache thì phải Upload My Add-in lại.
- Theo tài liệu chính thức của Microsoft, hàm tuỳ chỉnh (Custom Functions) được hỗ trợ trên Excel Online, Windows, Mac — nhưng thực tế có một số báo cáo hàm tuỳ chỉnh sideload đôi khi **không hiện ra** trên Excel Online dù chạy tốt trên bản desktop (không rõ nguyên nhân, có thể do cache hoặc do khác biệt phiên bản). Nếu gõ `=VND.CONVERT(...)` mà Excel báo `#NAME?`, thử: đóng hẳn tab Excel Online và mở lại, hoặc sideload lại từ đầu, hoặc thử trên Excel Desktop (Windows/Mac) để đối chiếu.
- Nếu dùng **Excel Desktop**, cách sideload khác (dùng thư mục mạng dùng chung hoặc Trust Center > Trusted Add-in Catalogs) — hỏi thêm nếu cần.
