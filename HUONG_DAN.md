# Hướng dẫn cài đặt Add-in "Đổi số tiền thành chữ"

## Bản này đã sửa gì so với bản trước

**Sửa lỗi #NAME? (nguyên nhân chính khiến `=VND.CONVERT()` không chạy):**
`manifest.xml` trước đó sai cấu trúc ở 3 chỗ so với chuẩn của Microsoft — đã sửa lại:
1. `<Namespace>` giờ trỏ đúng resource (`resid="Functions.Namespace"`) thay vì viết tên trực tiếp.
2. `<Requirements>` chuyển về đúng vị trí (cấp gốc của manifest), trước đó đặt sai chỗ.
3. Bỏ khối `<Runtimes>` thừa không cần thiết cho loại custom function đơn giản này.

**Đổi task pane theo yêu cầu:**
- Bỏ nút "Đổi ô đang chọn trong Excel", "Ghi kết quả vào ô bên phải", "Lấy ô đang chọn trên sheet làm ô đích".
- Nút "Ghi kết quả vào ô đang chọn" giờ tự làm mọi thứ trong 1 lần bấm: đọc số ở ô "Nhập số tiền", convert, và ghi thẳng vào ô đang được chọn trên sheet — không cần bấm "Xem trước" trước nữa.
- Giữ lại nút "Xem trước kết quả" cho ai muốn kiểm tra kết quả trước khi ghi (tuỳ chọn, không bắt buộc).

---

## Bước 1: Host file lên GitHub Pages (miễn phí)

Cần upload **7 file** vào root của 1 repo GitHub public:
- `taskpane.html`
- `functions.html`
- `functions.js`
- `functions.json`
- `icon-32.png`
- `icon-64.png`
- `icon-80.png`

(không upload `manifest.xml` lên đây — file này chỉ dùng để sideload ở Bước 3)

Các bước:
1. Tạo repo mới, ví dụ `vnd-addin` (Public).
2. Upload 7 file trên vào root repo.
3. Settings > Pages > Source: **Deploy from a branch** > `main` > `/ (root)` > Save.
4. Đợi 1–2 phút, lấy URL dạng `https://<username>.github.io/<repo>/`.
5. Kiểm tra bằng cách mở `https://.../functions.json` — thấy nội dung JSON là ổn.

## Bước 2: Sửa file manifest.xml

Mở `manifest.xml`, Find & Replace toàn bộ `YOUR_GITHUB_USERNAME` và `YOUR_REPO_NAME` bằng thông tin thật của bạn (có 9 chỗ). Lưu lại.

### Nếu đang sideload lại add-in cũ (đã từng cài bản trước)

Vì manifest đã sửa cấu trúc, cần **gỡ hẳn add-in cũ trước khi upload bản mới**, không chỉ upload đè:
1. Insert > Add-ins > My Add-ins > tìm add-in cũ > bấm dấu **...** > **Remove**.
2. Đóng hẳn tab Excel Online, mở lại (hoặc Ctrl+F5 để xoá cache).
3. Upload lại `manifest.xml` mới từ đầu (Bước 3 bên dưới).

Bỏ qua bước gỡ này thường là lý do phổ biến khiến sửa xong manifest vẫn còn báo lỗi cũ do Excel cache lại thông tin đăng ký hàm.

## Bước 3: Sideload vào Excel Online

1. Mở Excel Online, mở file Excel bất kỳ.
2. Insert > Add-ins > More Add-ins > tab **MY ADD-INS** > **Upload My Add-in**.
3. Chọn `manifest.xml` đã sửa, bấm Upload.

## Bước 4: Sử dụng

### Cách 1 — Hàm `=VND.CONVERT(D18)` (khuyên dùng, tự cập nhật)

Gõ vào ô bất kỳ: `=VND.CONVERT(D18)` — D18 có thể là số nhập tay hoặc kết quả công thức, hàm tự tính lại khi D18 đổi.

### Cách 2 — Task pane (ghi giá trị tĩnh, 1 lần bấm)

1. Mở task pane (nút "Doi so thanh chu" trên ribbon Home).
2. Gõ số tiền vào ô "Nhập số tiền".
3. **Bấm chọn 1 ô trên sheet** (ví dụ B20) — đây sẽ là ô nhận kết quả.
4. Bấm **"Ghi kết quả vào ô đang chọn"** — add-in tự convert và ghi thẳng vào ô B20 trong 1 lần bấm.
5. (Tuỳ chọn) Bấm "Xem trước kết quả" bất kỳ lúc nào nếu chỉ muốn xem chữ mà chưa ghi vào sheet.

Lưu ý: cách này ghi **giá trị tĩnh** — nếu đổi số ở ô "Nhập số tiền" thì phải bấm ghi lại, không tự cập nhật như Cách 1.

## Nếu vẫn còn lỗi #NAME? sau khi sửa

Thử theo thứ tự:
1. Mở trực tiếp từng URL `functions.js`, `functions.json`, `functions.html` trên trình duyệt — đảm bảo cả 3 đều load được, không bị lỗi 404 (chú ý viết hoa/thường, GitHub Pages phân biệt hoa thường).
2. Gỡ hẳn add-in cũ (như hướng dẫn Bước 2) rồi sideload lại từ đầu, không chỉ upload đè.
3. Đóng hẳn Excel Online, xoá cache trình duyệt (Ctrl+Shift+Delete) hoặc mở tab ẩn danh, thử lại.
4. Mở Developer Tools (F12) > tab Console khi mở task pane, xem có lỗi tải `functions.js` không (báo lỗi cụ thể sẽ giúp chẩn đoán chính xác hơn).
5. Nếu vẫn lỗi, gửi lại nội dung lỗi trong Console — mình sẽ xem tiếp.
