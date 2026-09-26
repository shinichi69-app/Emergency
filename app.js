// --- 1. PWA Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker Registered'))
      .catch(err => console.error('Service Worker Registration Failed:', err));
  });
}

// --- 2. GPS Location Handling ---
function getLocation() {
  const status = document.getElementById('geoStatus');
  const coords = document.getElementById('geoCoords');
  const copyBtn = document.getElementById('copyBtn');

  if (!navigator.geolocation) {
    status.textContent = 'เบราว์เซอร์ของคุณไม่รองรับการดึง GPS';
    return;
  }

  status.textContent = 'กำลังระบุพิกัดตำแหน่ง...';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(6);
      const lng = position.coords.longitude.toFixed(6);
      
      status.textContent = 'ระบุพิกัดสำเร็จ:';
      coords.textContent = `ละติจูด: ${lat}, ลองจิจูด: ${lng}`;
      coords.classList.remove('hidden');
      copyBtn.classList.remove('hidden');

      // บันทึกพิกัดไว้สำหรับฟังก์ชัน Copy
      window.currentCoordsText = `ตำแหน่งฉุกเฉินของฉัน: https://maps.google.com/?q=${lat},${lng} (Lat: ${lat}, Lng: ${lng})`;
    },
    (error) => {
      status.textContent = 'ไม่สามารถดึงตำแหน่งได้ กรุณาเปิด GPS และอนุญาตสิทธิ์การเข้าถึง';
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// คัดลอกข้อความพิกัด
function copyLocationText() {
  if (window.currentCoordsText) {
    navigator.clipboard.writeText(window.currentCoordsText).then(() => {
      alert('คัดลอกพิกัดตำแหน่งเรียบร้อยแล้ว! สามารถนำไปวางในแชทหรืออ่านให้เจ้าหน้าที่ฟังได้ทันที');
    });
  }
}

// --- 3. Dynamic Contacts Rendering from JSON ---
async function loadContacts() {
  try {
    const response = await fetch('./contacts.json');
    const data = await response.json();
    renderContacts(data);
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
}

function renderContacts(categories) {
  const container = document.getElementById('contactsContainer');
  container.innerHTML = '';

  categories.forEach(cat => {
    const section = document.createElement('section');
    section.className = 'category-section';

    let cardsHTML = cat.items.map(item => `
      <div class="contact-card bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
        <div>
          <h3 class="font-semibold text-gray-800 text-sm sm:text-base">${item.name}</h3>
          <p class="text-xs text-gray-500">${item.desc}</p>
          <span class="text-base sm:text-lg font-bold text-${cat.color}-600">${item.number}</span>
        </div>
        <a href="tel:${item.number}" class="bg-${cat.color}-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 hover:opacity-90 active:scale-95 transition">
          <i class="fa-solid fa-phone"></i> โทร
        </a>
      </div>
    `).join('');

    section.innerHTML = `
      <h2 class="text-base font-bold text-gray-800 border-l-4 border-${cat.color}-600 pl-3 mb-3 flex items-center gap-2">
        <i class="fa-solid ${cat.icon} text-${cat.color}-600"></i> ${cat.category}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${cardsHTML}</div>
    `;

    container.appendChild(section);
  });
}

// Filter Search Functionality
function filterContacts() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.getElementsByClassName('contact-card');
  Array.from(cards).forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(input) ? 'flex' : 'none';
  });
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  getLocation();
  loadContacts();
});
