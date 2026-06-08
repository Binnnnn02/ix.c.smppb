// Data galeri
const galleryData = [
    // Kelas & Belajar
    { id: 1, title: 'Pembelajaran Matematika', category: 'kelas', date: '10 Jan 2025', emoji: '📚', color: '#FF6B9D' },
    { id: 2, title: 'Presentasi Hasil Proyek', category: 'kelas', date: '15 Jan 2025', emoji: '📊', color: '#FFB347' },
    { id: 3, title: 'Ulangan Akhir Semester', category: 'kelas', date: '20 Jan 2025', emoji: '📝', color: '#6C5CE7' },
    { id: 4, title: 'Kelas Bahasa Inggris', category: 'kelas', date: '22 Jan 2025', emoji: '🗣️', color: '#FF6B9D' },
    
    // Acara Spesial
    { id: 5, title: 'Gathering Kelas', category: 'acara', date: '05 Feb 2025', emoji: '🎉', color: '#FFB347' },
    { id: 6, title: 'Hari Ulang Tahun Sekolah', category: 'acara', date: '12 Feb 2025', emoji: '🎂', color: '#FF6B9D' },
    { id: 7, title: 'Perayaan Imlek', category: 'acara', date: '29 Jan 2025', emoji: '🧧', color: '#6C5CE7' },
    { id: 8, title: 'Farewell Party', category: 'acara', date: '28 Mar 2025', emoji: '👋', color: '#FFB347' },
    
    // Olahraga
    { id: 9, title: 'Turnamen Futsal', category: 'olahraga', date: '08 Feb 2025', emoji: '⚽', color: '#FF6B9D' },
    { id: 10, title: 'Volley Ball Cup', category: 'olahraga', date: '14 Feb 2025', emoji: '🏐', color: '#6C5CE7' },
    { id: 11, title: 'Badminton Tournament', category: 'olahraga', date: '21 Feb 2025', emoji: '🏸', color: '#FFB347' },
    { id: 12, title: 'Senam Bersama', category: 'olahraga', date: '26 Feb 2025', emoji: '🤸', color: '#FF6B9D' },
    
    // Ekstrakurikuler
    { id: 13, title: 'Pertunjukan Tari Tradisional', category: 'ekstrakurikuler', date: '03 Mar 2025', emoji: '💃', color: '#FFB347' },
    { id: 14, title: 'Pameran Seni', category: 'ekstrakurikuler', date: '09 Mar 2025', emoji: '🎨', color: '#FF6B9D' },
    { id: 15, title: 'Konser Musik', category: 'ekstrakurikuler', date: '15 Mar 2025', emoji: '🎵', color: '#6C5CE7' },
    { id: 16, title: 'Drama Club Performance', category: 'ekstrakurikuler', date: '20 Mar 2025', emoji: '🎭', color: '#FFB347' },
];

const galleryGrid = document.getElementById('galleryGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
let currentFilter = 'all';

// Render gallery
function renderGallery(filter = 'all') {
    galleryGrid.innerHTML = '';
    
    const filteredData = filter === 'all' 
        ? galleryData 
        : galleryData.filter(item => item.category === filter);

    if (filteredData.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div class="empty-state-emoji">📷</div>
                <div class="empty-state">Belum ada foto di kategori ini</div>
            </div>
        `;
        return;
    }

    filteredData.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.style.animationDelay = `${index * 0.1}s`;
        galleryItem.innerHTML = `
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${item.color}, ${item.color}99); display: flex; align-items: center; justify-content: center; font-size: 3rem;">
                ${item.emoji}
            </div>
            <div class="gallery-overlay">
                <div class="gallery-overlay-emoji">${item.emoji}</div>
                <div class="gallery-overlay-text">${item.title}</div>
                <div class="gallery-overlay-date">${item.date}</div>
            </div>
        `;
        
        galleryItem.addEventListener('click', () => openModal(item));
        galleryGrid.appendChild(galleryItem);
    });
}

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderGallery(currentFilter);
    });
});

// Modal
function openModal(item) {
    document.getElementById('modalImage').innerHTML = `
        <div style="width: 100%; background: linear-gradient(135deg, ${item.color}, ${item.color}99); height: 400px; display: flex; align-items: center; justify-content: center; font-size: 6rem;">
            ${item.emoji}
        </div>
    `;
    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalDate').textContent = item.date;
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});
