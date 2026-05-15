# Barcode Studio

เว็บสร้างบาร์โค้ดสินค้าแบบ static สำหรับแชร์บน GitHub Pages เปิดได้จากไฟล์ `index.html` โดยตรง และไม่ต้องมี backend หรือ CDN

## Features

- ทำงานใน browser ทั้งหมด ไม่ส่งข้อมูลไป server
- Self-contained: ไม่มี CDN, ไม่มี analytics, ไม่มี ads
- รองรับ EAN-13, EAN-8, UPC-A, CODE128, CODE39, ITF และ ITF-14
- คำนวณและตรวจสอบ check digit สำหรับ EAN/UPC/ITF-14
- ปรับความหนา ความสูง ระยะขอบ สีเส้น สีพื้นหลัง และการแสดงตัวเลขได้
- ดาวน์โหลดเป็น SVG หรือ PNG
- สร้างหลายรหัสพร้อมกันแบบ batch
- รองรับ light/dark mode และ responsive layout

## วิธีใช้งานบนเครื่อง

เปิดไฟล์นี้ใน browser ได้เลย:

```text
index.html
```

หรือใช้ local static server:

```bash
python3 -m http.server 8000
```

แล้วเปิด:

```text
http://localhost:8000
```

## Deploy บน GitHub Pages

1. สร้าง repository ใหม่บน GitHub
2. อัปโหลดไฟล์ทั้งหมดในโปรเจกต์นี้
3. ไปที่ Settings > Pages
4. เลือก Branch: `main` และ Folder: `/root`
5. กด Save

## ข้อควรระวัง

เว็บนี้ช่วยสร้างภาพบาร์โค้ด แต่ไม่ได้ออกเลข GTIN/UPC/EAN อย่างเป็นทางการให้สินค้า หากจะใช้กับสินค้าขายปลีกจริง ควรตรวจสอบหรือขอเลขจาก GS1/หน่วยงานที่เกี่ยวข้องก่อนพิมพ์ใช้งานจริง

## โครงสร้างไฟล์

```text
barcode-studio/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── README.md
├── LICENSE
└── .gitignore
```

## License

MIT
