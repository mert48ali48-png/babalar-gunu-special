let currentActiveSlide = 1;
let internalTriviaIndex = 1;
let interactiveClicks = 0;

// WEB AUDIO API SENTEZLEYİCİSİ (Tarayıcıdan gerçek zamanlı ses sinyali üretir)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 Notası
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.12); // E5 Notası
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(125, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start(); osc.stop(audioCtx.currentTime + 0.35);
    } else if (type === 'clink') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1550, audioCtx.currentTime); // Kristal tınısı frekansı
        osc.frequency.exponentialRampToValueAtTime(1420, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.75); // Sönümlenen kristal çınlaması
        osc.start(); osc.stop(audioCtx.currentTime + 0.75);
    }
}

function playStepSound() { playSound('success'); }

function goToSlide(num) {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.getElementById('slide' + num).classList.add('active');
    currentActiveSlide = num;
}

// SLIDE 1 DOĞRULAMA
function checkSlide1() {
    const val = document.getElementById('input1').value.trim().toLowerCase();
    const err = document.getElementById('error1');
    
    if (val.includes('güven') && val.includes('tedbir')) {
        err.classList.remove('show');
        playSound('success');
        goToSlide(2);
    } else {
        err.innerHTML = "🚨 SİKİMDEN AŞAĞIYA KASIM PAŞA! Giriş Reddedildi. (Tedbir felsefeni hatırla...)";
        err.classList.add('show');
        playSound('error');
    }
}

// SLIDE 2 TRIVIA KONTROLLERİ
function checkTrivia() {
    const val = document.getElementById('input2').value.trim().toLowerCase();
    const err = document.getElementById('error2');
    const title = document.getElementById('triviaTitle');
    const desc = document.getElementById('triviaDesc');
    const field = document.getElementById('input2');

    if (internalTriviaIndex === 1) {
        if (val.includes('kadir gecesi') || val.includes('serkan')) {
            internalTriviaIndex = 2;
            title.innerHTML = "Hafıza Matrisi (Aşama 2/3)";
            desc.innerHTML = "Yatağan ve Kavaklıdere hattında yer alan asıl köklü sülale ismimiz nedir?";
            field.value = "";
            err.classList.remove('show');
            playSound('success');
        } else {
            err.innerHTML = "❌ Eşleşme Başarısız. Doğduğun mübarek geceyi ve babanın en sevdiği futbolcuyu hatırla!";
            err.classList.add('show');
            playSound('error');
        }
    } else if (internalTriviaIndex === 2) {
        if (val.includes('hacı molla') || val.includes('ömerler')) {
            internalTriviaIndex = 3;
            title.innerHTML = "Hafıza Matrisi (Aşama 3/3)";
            desc.innerHTML = "Son Soru: Kadir Serkan Tekin'in bu hayatta her şeyin üstünde tuttuğu o mutlak değer nedir?";
            field.value = "";
            err.classList.remove('show');
            playSound('success');
        } else {
            err.innerHTML = "❌ Köken lokasyonu reddedildi. Sülale adını yazmalısın.";
            err.classList.add('show');
            playSound('error');
        }
    } else if (internalTriviaIndex === 3) {
        if (val.includes('aile')) {
            err.classList.remove('show');
            playSound('success');
            goToSlide(3);
        } else {
            err.innerHTML = "❌ Temel yapı taşı hatası. Bizi bir arada tutan o kutsal kelime?";
            err.classList.add('show');
            playSound('error');
        }
    }
}

// SLIDE 3 KADEH ETKİLEŞİMİ
function playClinkInteraction() {
    interactiveClicks++;
    const glass = document.getElementById('glasses');
    const lbl = document.getElementById('clickLabel');
    const sub = document.getElementById('storySub');

    glass.classList.add('animate');
    setTimeout(() => { glass.classList.remove('animate'); }, 500);
    
    playSound('clink');

    if (interactiveClicks === 1) {
        lbl.innerHTML = "Bilkent Hattı Aktif 📞";
        sub.innerHTML = "'Oğlum hiç çekinme, hemen yakın bir meyhane bul, karşılıklı açıyoruz!'";
    } else if (interactiveClicks === 2) {
        lbl.innerHTML = "Süpüroğlu Hattı Aktif 🌊";
        sub.innerHTML = "Muğla ve Ankara masaları birleşiyor, kadehler kalkıyor...";
    } else if (interactiveClicks === 3) {
        lbl.innerHTML = "Hat Kusursuz! 🥂";
        sub.innerHTML = "Mesafe sıfırlandı. Keyifli muhabbetler tescillendi!";
        document.getElementById('slide3Btn').style.display = "block";
    }
}

// SLIDE 4 TAKVİM SEÇİMİ
function selectPremiumDay(element, dayName) {
    document.querySelectorAll('.calendar-node').forEach(c => c.classList.remove('selected-day'));
    element.classList.add('selected-day');
    playSound('success');
    document.getElementById('calStatus').innerHTML = "🚢 Kontenjan Onaylandı: " + dayName + " 2026 Kos gidiş-dönüş seferi ayrıldı.";
    document.getElementById('calNextBtn').style.display = "inline-flex";
}
