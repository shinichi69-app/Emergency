// ฐานข้อมูลเบอร์โทรฉุกเฉินประเทศไทย
const emergencyContacts = [
    { category: "🚨 เหตุด่วนเหตุร้าย", items: [
        { name: "ตำรวจ (แจ้งเหตุฉุกเฉิน)", number: "191", desc: "แจ้งเหตุด่วน เหตุร้าย อุบัติเหตุทุกประเภท" },
        { name: "ตำรวจท่องเที่ยว", number: "1155", desc: "สำหรับนักท่องเที่ยว ต้องการความช่วยเหลือ (มีล่าม)" },
        { name: "ตำรวจทางหลวง", number: "1193", desc: "แจ้งเหตุบนทางหลวง สายหลักทั่วประเทศ" },
        { name: "ศูนย์ปราบปรามการโจรกรรมรถ", number: "1192", desc: "แจ้งรถหาย หรือถูกขโมยทรัพย์สิน" },
        { name: "ตำรวจไซเบอร์", number: "1441", desc: "แจ้งความผิดทางคอมพิวเตอร์ ถูกหลอกลวงออนไลน์" }
    ]},
    { category: "🚑 การแพทย์และสุขภาพ", items: [
        { name: "สถาบันการแพทย์ฉุกเฉิน (EMS)", number: "1669", desc: "เจ็บป่วยฉุกเฉิน ต้องการรถพยาบาลและทีมช่วยชีวิต" },
        { name: "โรงพยาบาลตำรวจ", number: "1691", desc: "สายด่วนปรึกษาและประสานงานโรงพยาบาลตำรวจ" },
        { name: "สายด่วนกรมสุขภาพจิต", number: "1667", desc: "ปรึกษาปัญหาสุขภาพจิต วิกฤตอารมณ์ ซึมเศร้า" },
        { name: "หน่วยแพทย์ฉุกเฉิน กทม.", number: "1646", desc: "บริการการแพทย์ฉุกเฉินในพื้นที่กรุงเทพมหานคร" }
    ]},
    { category: "🚒 ดับเพลิงและกู้ภัย", items: [
        { name: "ดับเพลิงและกู้ภัย", number: "199", desc: "แจ้งเหตุไฟไหม้ สาธารณภัย อุทกภัย ดินถล่ม" },
        { name: "กรมป้องกันและบรรเทาสาธารณภัย", number: "1784", desc: "ประสานงานสาธารณภัยต่างๆ ระดับประเทศ" }
    ]},
    { category: "🛣️ การเดินทางและคมนาคม", items: [
        { name: "สายด่วนกรมทางหลวง", number: "1586", desc: "แจ้งเหตุ ร้องเรียน ขอความช่วยเหลือบนทางหลวงแผ่นดิน" },
        { name: "การทางพิเศษแห่งประเทศไทย", number: "1543", desc: "แจ้งเหตุบนทางด่วน และมอเตอร์เวย์" },
        { name: "ศูนย์ช่วยเหลือนักท่องเที่ยว (ทางน้ำ)", number: "1196", desc: "แจ้งเหตุฉุกเฉินทางน้ำ เรือล่ม จมน้ำ" }
    ]},
    { category: "🤝 ความช่วยเหลือสังคม", items: [
        { name: "ศูนย์ช่วยเหลือสังคม", number: "1300", desc: "แจ้งคนหาย ความรุนแรงในครอบครัว เด็กถูกทารุณกรรม" },
        { name: "ศูนย์บริการข้อมูลภาครัฐ (GCC)", number: "1111", desc: "ร้องเรียน ร้องทุกข์ หน่วยงานรัฐ ตลอด 24 ชม." }
    ]}
];

let currentLocation = null;
let deferredPrompt = null;

// 1. ฟังก์ชันแสดงผลรายการเบอร์โทร
function renderContacts(filterText = '') {
    const container = document.getElementById('contactsContainer');
    container.innerHTML = '';
    const lowerFilter = filterText.toLowerCase().trim();

    emergencyContacts.forEach(cat => {
        const filteredItems = cat.items.filter(item => 
            item.name.toLowerCase().includes(lowerFilter) || 
            item.number.includes(lowerFilter) ||
            item.desc.toLowerCase().includes(lowerFilter)
        );

        if (filteredItems.length > 0) {
            const section = document.createElement('div');
            section.className = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in';
            
            let itemsHtml = '';
            filteredItems.forEach(item => {
                itemsHtml += `
                    <a href="tel:${item.number}" class="flex items-center justify-between p-4 hover:bg-red-50 transition border-b border-gray-50 last:border-0 group active:bg-red-100">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="font-bold text-gray-800 text-base">${item.name}</span>
                                <span class="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">${item.number}</span>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">${item.desc}</p>
                        </div>
                        <div class="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 group-active:scale-95 transition ml-2">
                            <i class="fa-solid fa-phone"></i>
                        </div>
                    </a>
                `;
            });

            section.innerHTML = `
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <h3 class="font-bold text-gray-700 text-sm">${cat.category}</h3>
                </div>
                <div>${itemsHtml}</div>
            `;
            container.appendChild(section);
        }
    });

    if (container.innerHTML === '') {
        container.innerHTML = `
            <div class="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">
                <i class="fa-solid fa-magnifying-glass text-3xl mb-3 text-gray-300"></i>
                <p>ไม่พบข้อมูลที่คุณค้นหา</p>
            </div>
        `;
    }
}

function filterContacts() {
    const searchText = document.getElementById('searchInput').value;
    renderContacts(searchText);
}

// 2. ฟังก์ชันจัดการ GPS
function getLocation() {
    const statusEl = document.getElementById('geoStatus');
    const coordsEl = document.getElementById('geoCoords');
    const copyBtn = document.getElementById('copyBtn');

    statusEl.textContent = "กำลังขออนุญาตเข้าถึงตำแหน่ง...";
    statusEl.className = "text-yellow-600 font-medium flex items-center gap-2"><i class='fa-solid fa-spinner fa-spin'></i> กำลังดึงข้อมูล";

    if (!navigator.geolocation) {
        statusEl.textContent = "⚠️ เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง";
        statusEl.className = "text-red-600 font-medium";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            statusEl.innerHTML = "✅ ระบุตำแหน่งสำเร็จ";
            statusEl.className = "text-green-600 font-medium";
            coordsEl.textContent = `ละติจูด: ${currentLocation.lat.toFixed(6)}, ลองจิจูด: ${currentLocation.lng.toFixed(6)}`;
            coordsEl.classList.remove('hidden');
            copyBtn.classList.remove('hidden');
        },
        (error) => {
            let errorMsg = "ไม่สามารถระบุตำแหน่งได้";
            switch(error.code) {
                case error.PERMISSION_DENIED: errorMsg = "คุณปฏิเสธการเข้าถึงตำแหน่ง กรุณาเปิดอนุญาตในตั้งค่าเบราว์เซอร์"; break;
                case error.POSITION_UNAVAILABLE: errorMsg = "ข้อมูลตำแหน่งไม่พร้อมใช้งาน"; break;
                case error.TIMEOUT: errorMsg = "การขอตำแหน่งหมดเวลา กรุณาลองใหม่"; break;
            }
            statusEl.textContent = `⚠️ ${errorMsg}`;
            statusEl.className = "text-red-600 font-medium";
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function copyLocationText() {
    if (!currentLocation) return;
    const mapLink = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
    const textToCopy = `📍 *ตำแหน่งปัจจุบันของฉัน*\nละติจูด: ${currentLocation.lat.toFixed(6)}\nลองจิจูด: ${currentLocation.lng.toFixed(6)}\nแผนที่: ${mapLink}\n\nกรุณาส่งหน่วยช่วยเหลือด่วน!`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> คัดลอกสำเร็จ! พร้อมวางในแชท';
        copyBtn.classList.replace('bg-gray-800', 'bg-green-600');
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.classList.replace('bg-green-600', 'bg-gray-800');
        }, 2500);
    }).catch(err => {
        alert("ไม่สามารถคัดลอกได้ กรุณาคัดลอกด้วยตนเอง");
    });
}

// 3. ฟังก์ชันจัดการ PWA Install
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallModal();
});

function showInstallModal() {
    const modal = document.getElementById('pwaInstallModal');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        document.getElementById('iosInstallGuide').classList.remove('hidden');
        document.getElementById('androidInstallAction').classList.add('hidden');
    } else {
        document.getElementById('iosInstallGuide').classList.add('hidden');
        document.getElementById('androidInstallAction').classList.remove('hidden');
    }
    modal.classList.remove('hidden');
}

function closeInstallModal() {
    document.getElementById('pwaInstallModal').classList.add('hidden');
}

function triggerPwaInstall() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            closeInstallModal();
        });
    }
}

// เริ่มต้นการทำงานเมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    renderContacts();
    
    // ลงทะเบียน Service Worker สำหรับ Offline
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(reg => {
            console.log('Service Worker registered successfully', reg);
        }).catch(err => {
            console.log('Service Worker registration failed', err);
        });
    }
});
