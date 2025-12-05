// বাংলা কনভার্টার
const toBangla = (num) => {
    const numbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(d => numbers[d] || d).join('');
}

const banglaWords = {
    1: 'এক', 2: 'দুই', 3: 'তিন', 4: 'চার', 5: 'পাঁচ', 6: 'ছয়',
    7: 'সাত', 8: 'আট', 9: 'নয়', 10: 'দশ', 11: 'এগারো', 12: 'বারো'
};

const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

// এলিমেন্ট সিলেক্ট
const dial = document.getElementById('dial');
const hourHand = document.getElementById('hourHand');
const minHand = document.getElementById('minHand');
const secHand = document.getElementById('secHand');
const digitalTime = document.getElementById('digitalTime');
const dateText = document.getElementById('dateText');

// ঘড়ির ইন্টারফেস তৈরি (সংখ্যা এবং মার্কার)
function initClockFace() {
    const radius = 120; // সংখ্যাগুলো কেন্দ্র থেকে কতটা দূরে থাকবে

    // ১. সংখ্যা বসানো
    for (let i = 1; i <= 12; i++) {
        const num = document.createElement('div');
        num.className = 'number';
        num.innerText = banglaWords[i];

        // জ্যামিতি (Geometry) দিয়ে পজিশন বের করা
        // প্রতিটি সংখ্যা ৩০ ডিগ্রি (360 / 12) ব্যবধানে থাকবে
        const angle = i * 30;
        // ডিগ্রিকে রেডিয়ানে কনভার্ট (Math.PI / 180) - 90 ডিগ্রি বিয়োগ কারণ শুরু হয় ৩টার দিক থেকে কিন্তু আমরা চাই ১২টা থেকে
        const radian = (angle - 90) * (Math.PI / 180);

        // পজিশন ক্যালকুলেশন (cos = x, sin = y)
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;

        // CSS ট্রান্সফর্ম দিয়ে পজিশন সেট করা (সেন্টার থেকে x, y দূরত্বে)
        num.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        
        dial.appendChild(num);
    }

    // ২. মার্কার (দাগ) বসানো
    for (let i = 0; i < 60; i++) {
        const marker = document.createElement('div');
        marker.className = i % 5 === 0 ? 'marker big' : 'marker small';
        
        const angle = i * 6; // প্রতি মিনিট ৬ ডিগ্রি
        // মার্কারগুলো পরিধির দিকে থাকবে
        // translate(140px) মানে সেন্টার থেকে ১৪০ পিক্সেল দূরে সরে যাবে
        marker.style.transform = `translate(-50%, -50%) rotate(${angle - 90}deg) translate(140px)`;
        
        dial.appendChild(marker);
    }
}

// সময় আপডেট ফাংশন
function updateClock() {
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes();
    const h = now.getHours();

    // কাঁটার রোটেশন ক্যালকুলেশন
    const sDeg = s * 6; // ৬ ডিগ্রি প্রতি সেকেন্ড
    const mDeg = (m * 6) + (s * 0.1); // ৬ ডিগ্রি প্রতি মিনিট + সামান্য মুভমেন্ট
    const hDeg = ((h % 12) * 30) + (m * 0.5); // ৩০ ডিগ্রি প্রতি ঘন্টা

    secHand.style.transform = `translateX(-50%) rotate(${sDeg}deg)`;
    minHand.style.transform = `translateX(-50%) rotate(${mDeg}deg)`;
    hourHand.style.transform = `translateX(-50%) rotate(${hDeg}deg)`;

    // ডিজিটাল টাইম আপডেট
    let ampm = h >= 12 ? 'PM' : 'AM';
    let dH = h % 12;
    dH = dH ? dH : 12;
    
    const timeStr = `${toBangla(dH)}:${toBangla(m.toString().padStart(2,'0'))}:${toBangla(s.toString().padStart(2,'0'))} <span style="font-size:1rem">${ampm}</span>`;
    digitalTime.innerHTML = timeStr;

    // তারিখ আপডেট
    const dayStr = days[now.getDay()];
    const dateStr = toBangla(now.getDate());
    const monthStr = months[now.getMonth()];
    const yearStr = toBangla(now.getFullYear());
    
    dateText.innerText = `${dayStr}, ${dateStr} ${monthStr}, ${yearStr}`;
}

// থিম চেঞ্জার
function setTheme(mode) {
    document.body.className = ''; // সব ক্লাস রিমুভ
    if (mode === 'dark') document.body.classList.add('dark-mode');
    if (mode === 'neon') document.body.classList.add('neon-mode');
}

// রান করা
initClockFace();
setInterval(updateClock, 1000);
updateClock();
