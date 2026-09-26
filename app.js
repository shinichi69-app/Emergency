// --- GPS Location Handling (Enhanced Version) ---
async function getLocation() {
  const status = document.getElementById('geoStatus');
  const coords = document.getElementById('geoCoords');
  const copyBtn = document.getElementById('copyBtn');

  // 1. ตรวจสอบว่าเปิดผ่าน HTTPS หรือ Localhost หรือไม่
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    status.innerHTML = `<span class="text-red-600 font-bold">⚠️ GPS ต้องใช้งานผ่านโปรโตคอล HTTPS เท่านั้น</span>`;
    return;
  }

  // 2. ตรวจสอบว่า เบราว์เซอร์รองรับ Geolocation หรือไม่
  if (!navigator.geolocation) {
    status.textContent = 'เบราว์เซอร์ของคุณไม่รองรับการดึง GPS';
    return;
  }

  status.textContent = 'กำลังขอสิทธิ์เข้าถึงตำแหน่ง และระบุพิกัด...';

  // 3. ตรวจสอบ Permission State ผ่าน Permissions API (ถ้าเบราว์เซอร์รองรับ)
  if (navigator.permissions && navigator.permissions.query) {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      if (permissionStatus.state === 'denied') {
        showPermissionHelp(status);
        return;
      }
    } catch (e) {
      console.log('Permissions API query not supported, proceeding to getCurrentPosition');
    }
  }

  // 4. เรียกขอพิกัด GPS
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(6);
      const lng = position.coords.longitude.toFixed(6);
      
      status.innerHTML = `<span class="text-green-600 font-bold"><i class="fa-solid fa-circle-check"></i> ระบุพิกัดสำเร็จ</span>`;
      coords.textContent = `ละติจูด: ${lat}, ลองจิจูด: ${lng}`;
      coords.classList.remove('hidden');
      copyBtn.classList.remove('hidden');

      // บันทึกพิกัดไว้สำหรับฟังก์ชัน Copy
      window.currentCoordsText = `ตำแหน่งฉุกเฉินของฉัน: https://maps.google.com/?q=${lat},${lng} (Lat: ${lat}, Lng: ${lng})`;
    },
    (error) => {
      // จัดการกับ Error แต่ละกรณี
      switch (error.code) {
        case error.PERMISSION_DENIED:
          showPermissionHelp(status);
          break;
        case error.POSITION_UNAVAILABLE:
          status.innerHTML = `<span class="text-red-600">❌ ไม่สามารถระบุตำแหน่งได้ กรุณาเปิด GPS/ตำแหน่งในตั้งค่าด่วนของโทรศัพท์</span>`;
          break;
        case error.TIMEOUT:
          status.innerHTML = `<span class="text-red-600">⏳ หมดเวลาการดึงพิกัด กรุณากดอัปเดตใหม่อีกครั้ง</span>`;
          break;
        default:
          status.innerHTML = `<span class="text-red-600">❌ เกิดข้อผิดพลาดในการดึงตำแหน่ง</span>`;
          break;
      }
    },
    { 
      enableHighAccuracy: true, // ขอความแม่นยำสูง
      timeout: 15000,           // เพิ่มเวลาให้ค้นหาสัญญาณดาวเทียม 15 วินาที
      maximumAge: 0             // ไม่ใช้ค่าเก่าในแคช
    }
  );
}

// ฟังก์ชันแสดงคำแนะนำเมื่อสิทธิ์ถูกบล็อก (User Denied)
function showPermissionHelp(element) {
  element.innerHTML = `
    <div class="text-red-600 font-medium space-y-1">
      <p>⚠️ <strong>เบราว์เซอร์ปฏิเสธการเข้าถึงตำแหน่ง</strong></p>
      <p class="text-xs text-gray-600">เนื่องจากนี่คือ PWA ให้แก้ไขที่สิทธิ์ของ Chrome/เบราว์เซอร์ ดังนี้:</p>
      <ol class="list-decimal list-inside text-xs text-gray-700 bg-red-50 p-2 rounded mt-1 space-y-1">
        <li>เปิดแอป <strong>Chrome</strong> (หรือเบราว์เซอร์หลัก)</li>
        <li>แตะจุด 3 จุด มุมขวาบน > เลือก <strong>ตั้งค่า (Settings)</strong></li>
        <li>เลือก <strong>ตั้งค่าเว็บไซต์ (Site Settings)</strong> > <strong>ตำแหน่ง (Location)</strong></li>
        <li>ค้นหา URL เว็บนี้ แล้วเปลี่ยนจาก "บล็อก" เป็น <strong>"อนุญาต" (Allow)</strong></li>
      </ol>
    </div>
  `;
}
