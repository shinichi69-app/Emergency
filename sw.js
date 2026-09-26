const CACHE_NAME = 'emergency-th-v1';
// รายการไฟล์ที่ต้องการให้เปิดได้แม้น้ำเน็ตหลุด (Offline)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './contacts.json',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ขั้นตอน Install: ทำการ Cache ไฟล์ทั้งหมด
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ขั้นตอน Fetch: ดึงไฟล์จาก Cache ก่อน ถ้าไม่มีค่อยขอจาก Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
