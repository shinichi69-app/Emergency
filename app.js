// --- 1. ข้อมูลเบอร์โทรฉุกเฉิน (Embedded Data ป้องกันปัญหา CORS/Fetch Error) ---
const EMERGENCY_DATA = [
  {
    category: "เหตุด่วนเหตุร้าย & ความปลอดภัย",
    color: "red",
    icon: "fa-shield-halved",
    items: [
      { name: "เหตุด่วน-เหตุร้าย (ตำรวจ)", desc: "แจ้งเหตุอาชญากรรม เรื่องด่วน", number: "191" },
      { name: "ดับเพลิง-สัตว์เข้าบ้าน", desc: "เหตุอัคคีภัย งูเข้าบ้าน", number: "199" },
      { name: "ตำรวจท่องเที่ยว", desc: "ขอความช่วยเหลือชาวต่างชาติ", number: "1155" }
    ]
  },
  {
    category: "การแพทย์ & กู้ชีพ (พยาบาล)",
    color: "green",
    icon: "fa-truck-medical",
    items: [
      { name: "เจ็บป่วยฉุกเฉิน (สพฉ.)", desc: "รถพยาบาลกู้ชีพทั่วประเทศ", number: "1669" },
      { name: "ศูนย์เอราวัณ (กทม.)", desc: "กู้ชีพฉุกเฉินเฉพาะเขตกรุงเทพฯ", number: "1646" }
    ]
  },
  {
    category: "อุบัติเหตุ & จราจร",
    color: "blue",
    icon: "fa-car",
    items: [
      { name: "ตำรวจทางหลวง", desc: "อุบัติเหตุ/รถเสีย บนทางหลวง", number: "1193" },
      { name: "จราจร (JS100)", desc: "จส.100 แจ้งเหตุและของหาย", number: "1137" }
    ]
  }
];

// --- 2. PWA Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service Worker Registered'))
      .catch((err) => console.log('SW Registration Bypass/Notice:', err));
  });
}

// --- 3. ฟังก์ชัน Render เบอร์โทรฉุกเฉิน (ทำงานเสมอมั่นใจได้ว่าปุ่มไม่หาย) ---
function renderContacts(categories) {
  const container = document.getElementById('contactsContainer');
  if (!container) return;
  
  container.innerHTML = '';

  categories.forEach((cat) => {
    const section = document.createElement('section');
    section.className = 'category-section';

    // กำหนด Class สีพื้นฐานตามหมวดหมู่
    let btnColorClass = 'bg-red-600 hover:bg-red-700';
    let textColorClass = 'text-red-600';
    let borderColorClass = 'border-red-600';

    if (cat.color === 'green') {
      btnColorClass = 'bg-green-600 hover:bg-green-700';
      textColorClass = 'text-green-600';
      borderColorClass = 'border-green-600';
    } else if (cat.color === 'blue') {
      btnColorClass = 'bg-blue-600 hover:bg-blue-700';
      textColorClass = 'text-blue-600';
      borderColorClass = 'border-blue-600';
    }

    let cardsHTML = cat.items.map((item) => {
      return `
        <div class="contact-card bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
          <div>
            <h3 class="font-semibold text-gray-800 text-sm sm:text-base">${item.name}</h3>
            <p class="text-xs text-gray-500">${item.desc}</p>
            <span class="text-base sm:text-lg font-bold ${textColorClass}">${item.number}</span>
          </div>
          <a href="tel:${item.number}" class="${btnColorClass} text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 active:scale-95 transition">
            <i class="fa-solid fa-phone"></i> โทร
          </a>
        </div>
      `;
    }).join('');

    section.innerHTML = `
      <h2 class="text-base font-bold text-gray-800 border-l-4 ${borderColorClass} pl-3 mb-3 flex items-center gap-2">
        <i class="fa-solid ${cat.icon} ${textColorClass}"></i> ${cat.category}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${cardsHTML}</div>
    `;

    container.appendChild(section);
  });
}

// --- 4. GPS Location Handling ---
function getLocation() {
  const status = document.getElementById('geoStatus');
  const coords = document.getElementById('geoCoords');
  const copyBtn = document.getElementById('copyBtn');

  if (!status) return;

  if (!navigator.geolocation) {
    status.textContent = 'เบราว์เซอร์ของคุณไม่รองรับการดึง GPS';
    return;
  }

  status.textContent = 'กำลังดึงพิกัดตำแหน่ง...';

  navigator.geolocation.getCurrentPosition(
    (position) => {
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
    },
    (error) => {
      status.innerHTML = `<span class="text-amber-600">⚠️ ไม่สามารถดึงพิกัดได้ (กรุณาเปิด GPS/อนุญาตสิทธิ์)</span>`;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// คัดลอกข้อความพิกัด
function copyLocationText() {
  if (window.currentCoordsText) {
    navigator.clipboard.writeText(window.currentCoordsText).then(() => {
      alert('คัดลอกพิกัดตำแหน่งเรียบร้อยแล้ว!');
    });
  }
}

// --- 5. Filter Search Functionality ---
function filterContacts() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.getElementsByClassName('contact-card');
  Array.from(cards).forEach((card) => {
    card.style.display = card.innerText.toLowerCase().includes(input) ? 'flex' : 'none';
  });
}

// --- 6. App Initialization (สั่งรันพร้อมกันทันทีเมื่อโหลดหน้าเว็บ) ---
document.addEventListener('DOMContentLoaded', () => {
  // 1. เรนเดอร์เบอร์โทรขึ้นมาก่อนทันทีเพื่อความปลอดภัย
  renderContacts(EMERGENCY_DATA);
  // 2. เรียกทำงาน GPS ตามหลัง
  getLocation();
});
// --- 7. PWA Automatic Install Prompt Handling ---
let deferredPrompt = null;

// ตรวจสอบว่าเป็น iOS หรือไม่
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// ตรวจสอบว่าแอปถูกติดตั้งไปแล้วหรือยัง (In Standalone Mode)
function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// ดักจับ Event ก่อนที่ Browser จะโชว์ Banner หลัก
window.addEventListener('beforeinstallprompt', (e) => {
  // ป้องกันไม่ให้ Browser ขึ้น Banner ดั้งเดิมอัตโนมัติ
  e.preventDefault();
  deferredPrompt = e;

  // ตรวจสอบว่าถ้ายังไม่ได้ติดตั้ง และยังไม่ได้กดปิดไปในรอบนี้ ให้โชว์ Pop-up ของเรา
  if (!isAppInstalled() && !sessionStorage.getItem('pwaModalDismissed')) {
    setTimeout(() => {
      showInstallModal();
    }, 1500); // ดีเลย์ 1.5 วินาทีหลังเปิดหน้าเว็บเพื่อให้ดูนุ่มนวล
  }
});

// แสดง Pop-up Modal
function showInstallModal() {
  const modal = document.getElementById('pwaInstallModal');
  const iosGuide = document.getElementById('iosInstallGuide');
  const androidAction = document.getElementById('androidInstallAction');

  if (!modal) return;

  if (isIOS()) {
    // ถ้าเป็น iOS ให้ซ่อนปุ่มกดติดตั้ง แล้วแสดงวิธีทำผ่าน Safari แทน
    if (iosGuide) iosGuide.classList.remove('hidden');
    if (androidAction) androidAction.classList.add('hidden');
  }

  modal.classList.remove('hidden');
}

// เมื่อผู้ใช้กดปุ่ม "ติดตั้งแอปทันที" บน Pop-up
async function triggerPwaInstall() {
  if (deferredPrompt) {
    // เรียก Pop-up ติดตั้งของ OS ขึ้นมา
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null;
    closeInstallModal();
  }
}

// ปิด Pop-up Modal
function closeInstallModal() {
  const modal = document.getElementById('pwaInstallModal');
  if (modal) modal.classList.add('hidden');
  // บันทึกไว้ใน Session ว่าปิดแล้ว จะได้ไม่ขึ้นกวนใจซ้ำในการเข้าเว็บครั้งนี้
  sessionStorage.setItem('pwaModalDismissed', 'true');
}

// ตรวจสอบกรณี iOS (เนื่องจากไม่มี event beforeinstallprompt)
document.addEventListener('DOMContentLoaded', () => {
  if (isIOS() && !isAppInstalled() && !sessionStorage.getItem('pwaModalDismissed')) {
    setTimeout(() => {
      showInstallModal();
    }, 2000);
  }
});
