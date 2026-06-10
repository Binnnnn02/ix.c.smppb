import { db } from './firebase-config.js';
import {
    collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Category label map ───────────────────────────────────────────
const CATEGORY_LABELS = {
    kelas:           '📚 Kelas & Belajar',
    acara:           '🎊 Acara',
    olahraga:        '🏃 Olahraga',
    ekstrakurikuler: '🎭 Ekstrakurikuler',
};

// ── DOM refs ─────────────────────────────────────────────────────
const galleryGrid    = document.getElementById('galleryGrid');
const filterBtns     = document.querySelectorAll('.filter-btn');
const modal          = document.getElementById('modal');
const modalClose     = document.getElementById('modalClose');
const modalImage     = document.getElementById('modalImage');
const modalCategory  = document.getElementById('modalCategory');
const modalTitle     = document.getElementById('modalTitle');
const modalDate      = document.getElementById('modalDate');
const modalDriveBtn  = document.getElementById('modalDriveBtn');

let allItems      = [];
let currentFilter = 'all';

// ── Konversi Google Drive share link → direct image URL ──────────
function toDriveDirectUrl(url) {
    if (!url) return '';
    // Format: https://drive.google.com/file/d/FILE_ID/view
    const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matchFile) return `https://drive.google.com/uc?export=view&id=${matchFile[1]}`;
    // Format: https://drive.google.com/open?id=FILE_ID
    const matchOpen = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchOpen) return `https://drive.google.com/uc?export=view&id=${matchOpen[1]}`;
    // Format: sudah uc?id= atau link gambar biasa
    return url;
}

// ── Fetch dari Firestore ─────────────────────────────────────────
async function fetchGallery() {
    try {
        // order by createdAt — field yang benar dari dashboard
        const q = query(collection(db, 'galeri'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        allItems = snapshot.docs.map(doc => {
            const d = doc.data();
            return {
                id: doc.id,
                ...d,
                // Konversi imageUrl ke direct URL kalau dari Drive
                imageUrl: toDriveDirectUrl(d.imageUrl || '')
            };
        });
    } catch (err) {
        console.error('Firestore error:', err);
        allItems = DEMO_DATA;
    }
    renderGallery(currentFilter);
}

// ── Render galeri ────────────────────────────────────────────────
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

        const inner = item.imageUrl
            ? `<img src="${esc(item.imageUrl)}" alt="${esc(item.title)}" loading="lazy"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
            : '';

        const placeholder = `<div class="gallery-placeholder"
            style="display:${item.imageUrl ? 'none' : 'flex'};background:linear-gradient(135deg,${item.color||'#FF6B9D'},${item.color||'#FF6B9D'}99)">
            ${item.emoji || '🖼️'}
        </div>`;

        el.innerHTML = `
            ${inner}
            ${placeholder}
            <div class="gallery-overlay">
                <div class="gallery-overlay-text">${esc(item.title)}</div>
                <div class="gallery-overlay-date">${esc(item.date)}</div>
            </div>`;

        el.addEventListener('click', () => openModal(item));
        galleryGrid.appendChild(el);
    });
}

// ── Modal ────────────────────────────────────────────────────────
function openModal(item) {
    if (item.imageUrl) {
        modalImage.innerHTML = `
            <img src="${esc(item.imageUrl)}" alt="${esc(item.title)}"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="modal-image-placeholder" style="display:none;background:linear-gradient(135deg,${item.color||'#FF6B9D'},${item.color||'#FF6B9D'}99)">
                ${item.emoji || '🖼️'}
            </div>`;
    } else {
        modalImage.innerHTML = `
            <div class="modal-image-placeholder"
                 style="background:linear-gradient(135deg,${item.color||'#FF6B9D'},${item.color||'#FF6B9D'}99)">
                ${item.emoji || '🖼️'}
            </div>`;
    }

    modalCategory.textContent = CATEGORY_LABELS[item.category] || item.category;
    modalTitle.textContent    = item.title;
    modalDate.textContent     = item.date;

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

// ── Filter buttons ───────────────────────────────────────────────
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderGallery(currentFilter);
    });
});

// ── Modal close ──────────────────────────────────────────────────
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── XSS sanitizer ────────────────────────────────────────────────
function esc(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ── Demo data (fallback kalau Firebase belum dikonfigurasi) ───────
const DEMO_DATA = [
    { id:'d1', title:'Pembelajaran Matematika', category:'kelas',           date:'10 Jan 2025', emoji:'📚', color:'#FF6B9D', driveUrl:'' },
    { id:'d2', title:'Presentasi Hasil Proyek',  category:'kelas',           date:'15 Jan 2025', emoji:'📊', color:'#FFB347', driveUrl:'' },
    { id:'d3', title:'Gathering Kelas',           category:'acara',           date:'05 Feb 2025', emoji:'🎉', color:'#FFB347', driveUrl:'' },
    { id:'d4', title:'Turnamen Futsal',           category:'olahraga',        date:'08 Feb 2025', emoji:'⚽', color:'#FF6B9D', driveUrl:'' },
    { id:'d5', title:'Pameran Seni',              category:'ekstrakurikuler', date:'09 Mar 2025', emoji:'🎨', color:'#FF6B9D', driveUrl:'' },
    { id:'d6', title:'Konser Musik',              category:'ekstrakurikuler', date:'15 Mar 2025', emoji:'🎵', color:'#6C5CE7', driveUrl:'' },
];

// ── Boot ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', fetchGallery);
            
