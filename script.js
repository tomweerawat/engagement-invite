// ─── DOM Elements ────────────────────────────────────────────────
const card3d        = document.getElementById('card3d');
const flipCard      = document.getElementById('flipCard');
const flipCardInner = document.getElementById('flipCardInner');
const flipHint      = document.getElementById('flipHint');
const flipHintBack  = document.getElementById('flipHintBack');
const petalsContainer = document.getElementById('petalsContainer');

// ─── State ───────────────────────────────────────────────────────
let doorsOpened  = false;   // ประตูเปิดแล้วหรือยัง
let isFlipped    = false;   // card กำลังแสดงด้านหลัง (4.png) อยู่ไหม
let idleTimer    = null;    // timer สำหรับ idle hint

// Petal colours (pastel pink/white tones)
const petalColors = ['#a5c9a0','#b8d4b2','#c9dfc5','#d6e8d3','#8fba88','#e2eedf'];

// ─── 1. Auto-open doors after 1.5s ───────────────────────────────
setTimeout(openDoors, 1500);

function openDoors() {
    card3d.classList.add('opened');
    doorsOpened = true;

    // ซ่อนประตูหลัง animation เสร็จ (1.2s) เพื่อไม่ให้โผล่ระหว่าง flip
    setTimeout(() => {
        card3d.classList.add('doors-hidden');
    }, 1400);

    // ร่วงกลีบดอกไม้เมื่อประตูเปิด
    spawnPetals(20);

    // แสดง hint หลังจากประตูเปิดเสร็จ (delay = door transition ~1.4s + 0.3s)
    setTimeout(() => {
        showHint(flipHint);
        startIdleTimer();
    }, 1800);
}

// ─── 2. Click / Tap handler ───────────────────────────────────────
flipCard.addEventListener('click', handleFlip);
flipCard.addEventListener('touchstart', (e) => { e.preventDefault(); handleFlip(); });

function handleFlip() {
    if (!doorsOpened) return;

    clearIdleTimer();
    isFlipped = !isFlipped;

    if (isFlipped) {
        flipCardInner.classList.add('flipped');
        hideHint(flipHint);
        // Sparkle effect เมื่อพลิกไปด้านหลัง
        spawnSparkles('sparklesBack');
        // แสดง hint กลับด้าน
        setTimeout(() => {
            showHint(flipHintBack);
            startIdleTimer();
        }, 1000);
    } else {
        flipCardInner.classList.remove('flipped');
        hideHint(flipHintBack);
        // Sparkle effect เมื่อพลิกกลับด้านหน้า
        spawnSparkles('sparklesFront');
        // แสดง hint อีกครั้ง
        setTimeout(() => {
            showHint(flipHint);
            startIdleTimer();
        }, 1000);
    }
}

// ─── 3. Hint helpers ──────────────────────────────────────────────
function showHint(el) {
    el.classList.add('visible');
    el.classList.remove('urgent');
}

function hideHint(el) {
    el.classList.remove('visible', 'urgent');
}

// ─── 4. Idle timer: 3s ไม่กด → shake + hint urgent ───────────────
function startIdleTimer() {
    clearIdleTimer();
    idleTimer = setTimeout(() => {
        // shake card
        flipCardInner.classList.remove('shake');
        // force reflow เพื่อ restart animation
        void flipCardInner.offsetWidth;
        flipCardInner.classList.add('shake');

        // hint เด่นขึ้น
        const activeHint = isFlipped ? flipHintBack : flipHint;
        activeHint.classList.add('urgent');

        // ลบ class shake หลัง animation เสร็จ
        flipCardInner.addEventListener('animationend', () => {
            flipCardInner.classList.remove('shake');
        }, { once: true });
    }, 3000);
}

function clearIdleTimer() {
    if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
    }
}

// ─── 5. Falling Petals ────────────────────────────────────────────
function spawnPetals(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            petal.style.left     = Math.random() * 100 + 'vw';
            petal.style.backgroundColor = petalColors[Math.floor(Math.random() * petalColors.length)];
            petal.style.width    = (10 + Math.random() * 10) + 'px';
            petal.style.height   = (10 + Math.random() * 10) + 'px';
            petal.style.animationDuration = (2.5 + Math.random() * 2) + 's';
            petal.style.animationDelay    = (Math.random() * 0.8) + 's';
            petal.style.transform = `rotate(${Math.random() * 360}deg)`;
            petalsContainer.appendChild(petal);
            // ลบออกหลัง animation เสร็จ
            petal.addEventListener('animationend', () => petal.remove());
        }, i * 60);
    }
}

// ─── 6. Sparkle Effect ───────────────────────────────────────────
function spawnSparkles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    for (let i = 0; i < 12; i++) {
        const s = document.createElement('div');
        s.classList.add('sparkle');
        s.style.left   = (10 + Math.random() * 80) + '%';
        s.style.top    = (10 + Math.random() * 80) + '%';
        s.style.animationDelay = (Math.random() * 0.4) + 's';
        s.style.width  = (4 + Math.random() * 6) + 'px';
        s.style.height = s.style.width;
        container.appendChild(s);
        s.addEventListener('animationend', () => s.remove());
    }
}
