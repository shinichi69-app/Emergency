const CACHE_NAME = 'emergency-th-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ติดตั้ง Service Worker และแคชไฟล์ที่จำเป็น
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// ดักจับการร้องขอข้อมูล และส่งกลับจากแคชหากไม่มีอินเทอร์เน็ต
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // ส่งข้อมูลจากแคช
        }
        // หากไม่มีในแคช ให้ดึงจากเครือข่าย
        return fetch(event.request).catch(() => {
          // Fallback: หากออฟไลน์และเป็นการขอหน้าเว็บ ให้ส่ง index.html กลับไป
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
