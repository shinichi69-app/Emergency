// --- GPS Location Handling (With Fallback Mechanism) ---
function getLocation() {
  const status = document.getElementById('geoStatus');
  const coords = document.getElementById('geoCoords');
  const copyBtn = document.getElementById('copyBtn');

  if (!status) return;

  if (!navigator.geolocation) {
    status.textContent = 'เบราว์เซอร์ของคุณไม่รองรับการดึง GPS';
    return;
  }

  status.textContent = 'กำลังค้นหาสัญญาณ GPS...';

  // ตัวเลือกที่ 1: ขอพิกัดแม่นยำสูงก่อน (High Accuracy)
  const highAccuracyOptions = {
    enableHighAccuracy: true,
    timeout: 6000, // รอสัญญาณดาวเทียม 6 วินาที
    maximumAge: 0
  };

  // ตัวเลือกที่ 2: พิกัดสำรองกรณีอยู่อาคาร/ดาวเทียมจับไม่ได้ (Low Accuracy via Wi-Fi/Cellular)
  const lowAccuracyOptions = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 30000
  };

  // ฟังก์ชันแสดงผลเมื่อสำเร็จ
  const onSuccess = (position) => {
    const lat = position.coords.latitude.toFixed(6);
    const lng = position.coords.longitude.toFixed(6);
    
    status.innerHTML = `<span class="text-green-600 font-bold"><i class="fa-solid fa-circle-check"></i> ระบุพิกัดสำเร็จ</span>`;
    if (coords) {
      coords.textContent = `ละติจูด: ${lat}, ลองจิจูด: ${lng}`;
      coords.classList.remove('hidden');
    }
    if (copyBtn) {
      copyBtn.classList.remove('hidden');
    }

    window.currentCoordsText = `ตำแหน่งฉุกเฉินของฉัน: https://maps.google.com/?q=${lat},${lng} (Lat: ${lat}, Lng: ${lng})`;
  };

  // เรียกขอพิกัดแม่นยำสูงก่อน หากล้มเหลวให้ใช้ Low Accuracy สำรอง
  navigator.geolocation.getCurrentPosition(
    onSuccess,
    (error) => {
      console.warn('High accuracy location failed, retrying with low accuracy...', error);
      status.textContent = 'กำลังดึงพิกัดจากสัญญาณสำรอง (Wi-Fi/สัญญานมือถือ)...';
      
      // Retry ด้วย Low Accuracy
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        (fallbackError) => {
          status.innerHTML = `<span class="text-amber-600">⚠️ ไม่พบตำแหน่ง กรุณาเปิด GPS ที่มือถือ หรือลองยืนใกล้น้าต่าง</span>`;
        },
        lowAccuracyOptions
      );
    },
    highAccuracyOptions
  );
}
