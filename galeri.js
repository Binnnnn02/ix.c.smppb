import { db } from './firebase-config.js';
import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Category label map ──────────────────────────────────────────────
const CATEGORY_LABELS = {
    kelas:          '📚 Kelas & Belajar',
    acara:          '🎊 Acara',
    olahraga:       '🏃 Olahraga',
    ekstrakurikuler:'🎭 Ekstrakurikuler',
};

// ── DOM refs ────────────────────────────────────────────────────────
const galleryGrid   = document.getElementById('galleryGrid');
const filterBtns    = document.querySelectorAll('.filter-btn');
const modal         = document.getElementById('modal');
const modalClose    = document.getElementById('modalClose');
const modalImage    = document.getElementById('modalImage');
const modalCategory = document.getElementById('modalCategory');
const modalTitle    = document.getElementById('modalTitle');
const modalDate     = document.getElementById('modalDate');
const modalDriveBtn = document.getElementById('modalDriveBtn');

let allItems    = [];   // cached from Firestore
let currentFilter = 'all';

// ── Fetch from Firestore ────────────────────────────────────────────
async function fetchGallery() {
    try {
        const q = query(collection(db, 'galeri'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
        console.error('Firestore error:', err);
        // Fallback to static demo data so the page still looks good
        allItems = DEMO_DATA;
    }
    renderGallery(currentFilter);
}

// ── Render ──────────────────────────────────────────────────────────
function renderGallery(filter = 'all') {
    const filtered = filter === 'all'
        ? allItems
        : allItems.filter(item => item.category === filter);

    if (filtered.length === 0) {
        galleryGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-emoji">📷</div>
                <p>Belum ada foto di kategori ini</p>
            </div>`;
        return;
    }

    galleryGrid.innerHTML = '';
    filtered.forEach((item, i) => {
        const el = document.createElement('div');
        el.className = 'gallery-item';
        el.style.animationDelay = `${i * 0.07}s`;

        // Inner: real image OR emoji placeholder
        const inner = item.imageUrl
            ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" loading="lazy">`
            : `<div class="gallery-placeholder" style="background:linear-gradient(135deg,${item.color||'#FF6B9D'},${item.color||'#FF6B9D'}99)">${item.emoji || '🖼️'}</div>`;

        el.innerHTML = `
            ${inner}
            <div class="gallery-overlay">
                <div class="gallery-overlay-text">${escapeHtml(item.title)}</div>
                <div class="gallery-overlay-date">${escapeHtml(item.date)}</div>
            </div>`;

        el.addEventListener('click', () => openModal(item));
        galleryGrid.appendChild(el);
    });
}

// ── Modal ───────────────────────────────────────────────────────────
function openModal(item) {
    // Image
    if (item.imageUrl) {
        modalImage.innerHTML = `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}">`;
    } else {
        modalImage.innerHTML = `
            <div class="modal-image-placeholder"
                 style="background:linear-gradient(135deg,${item.color||'#FF6B9D'},${item.color||'#FF6B9D'}99)">
                ${item.emoji || '🖼️'}
            </div>`;
    }

    // Info
    modalCategory.textContent = CATEGORY_LABELS[item.category] || item.category;
    modalTitle.textContent = item.title;
    modalDate.textContent   = item.date;

    // Drive button
    if (item.driveUrl) {
        modalDriveBtn.href = item.driveUrl;
        modalDriveBtn.classList.remove('hidden');
    } else {
        modalDriveBtn.classList.add('hidden');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ── Filter buttons ──────────────────────────────────────────────────
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderGallery(currentFilter);
    });
});

// ── Modal close ─────────────────────────────────────────────────────
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Sanitize helper (prevent XSS from Firestore data) ───────────────
function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ── Demo data (shown when Firestore not yet set up) ─────────────────
const DEMO_DATA = [
    { id:'d1', title:'Pembelajaran Matematika', category:'kelas',          date:'10 Jan 2025', emoji:'📚', color:'#FF6B9D', driveUrl:'' },
    { id:'d2', title:'Presentasi Hasil Proyek',  category:'kelas',          date:'15 Jan 2025', emoji:'📊', color:'#FFB347', driveUrl:'' },
    { id:'d3', title:'Gathering Kelas',           category:'acara',          date:'05 Feb 2025', emoji:'🎉', color:'#FFB347', driveUrl:'' },
    { id:'d4', title:'Turnamen Futsal',           category:'olahraga',       date:'08 Feb 2025', emoji:'⚽', color:'#FF6B9D', driveUrl:'' },
    { id:'d5', title:'Pameran Seni',              category:'ekstrakurikuler',date:'09 Mar 2025', emoji:'🎨', color:'#FF6B9D', driveUrl:'' },
    { id:'d6', title:'Konser Musik',              category:'ekstrakurikuler',date:'15 Mar 2025', emoji:'🎵', color:'#6C5CE7', driveUrl:'' },
];

// ── Boot ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', fetchGallery);
