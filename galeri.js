// ============================================================
//  TAMBAH FOTO DI SINI — isi array GALLERY_DATA di bawah
//
//  Format tiap foto:
//  {
//    title    : 'Judul Foto',
//    category : 'kelas' | 'acara' | 'olahraga' | 'ekstrakurikuler',
//    date     : '10 Jan 2025',
//    imageUrl : 'https://drive.google.com/file/d/ID_FOTO/view',
//    driveUrl : '',   ← opsional, kosongkan kalau tidak ada
//  }
// ============================================================

const GALLERY_DATA = [

    // ── Contoh (ganti imageUrl dengan link Drive kamu) ──────
    {
        title    : 'Pembelajaran Matematika',
        category : 'kelas',
        date     : '10 Jan 2025',
        imageUrl : 'https://drive.google.com/file/d/GANTI_ID_DI_SINI/view',
        driveUrl : '',
    },
    {
        title    : 'Gathering Kelas',
        category : 'acara',
        date     : '05 Feb 2025',
        imageUrl : 'https://drive.google.com/file/d/GANTI_ID_DI_SINI/view',
        driveUrl : '',
    },
    {
        title    : 'Turnamen Futsal',
        category : 'olahraga',
        date     : '08 Feb 2025',
        imageUrl : 'https://drive.google.com/file/d/GANTI_ID_DI_SINI/view',
        driveUrl : '',
    },
    {
        title    : 'Pameran Seni',
        category : 'ekstrakurikuler',
        date     : '09 Mar 2025',
        imageUrl : 'https://drive.google.com/file/d/GANTI_ID_DI_SINI/view',
        driveUrl : '',
    },

    // ── Tambah foto baru di bawah sini ──────────────────────
    // {
    //     title    : 'Judul Foto Baru',
    //     category : 'acara',
    //     date     : '15 Jun 2026',
    //     imageUrl : 'https://drive.google.com/file/d/ID_FOTO/view',
    //     driveUrl : '',
    // },

];

// ============================================================
//  Kode di bawah TIDAK perlu diubah
// ============================================================

var CATEGORY_LABELS = {
    kelas          : '📚 Kelas & Belajar',
    acara          : '🎊 Acara',
    olahraga       : '🏃 Olahraga',
    ekstrakurikuler: '🎭 Ekstrakurikuler',
};

var FALLBACK_EMOJI = {
    kelas          : '📚',
    acara          : '🎊',
    olahraga       : '🏃',
    ekstrakurikuler: '🎭',
};

function toDirect(url) {
    if (!url) return '';
    var m1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (m1) return 'https://drive.google.com/uc?export=view&id=' + m1[1];
    var m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m2) return 'https://drive.google.com/uc?export=view&id=' + m2[1];
    return url;
}

function esc(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

var allItems = GALLERY_DATA.map(function(item, i) {
    return Object.assign({}, item, {
        id       : 'item-' + i,
        imgDirect: toDirect(item.imageUrl),
        emoji    : FALLBACK_EMOJI[item.category] || '🖼️',
    });
});

var currentFilter = 'all';

var galleryGrid   = document.getElementById('galleryGrid');
var filterBtns    = document.querySelectorAll('.filter-btn');
var modal         = document.getElementById('modal');
var modalClose    = document.getElementById('modalClose');
var modalImage    = document.getElementById('modalImage');
var modalCategory = document.getElementById('modalCategory');
var modalTitle    = document.getElementById('modalTitle');
var modalDate     = document.getElementById('modalDate');
var modalDriveBtn = document.getElementById('modalDriveBtn');

function renderGallery(filter) {
    var list = filter === 'all'
        ? allItems
        : allItems.filter(function(i) { return i.category === filter; });

    if (list.length === 0) {
        galleryGrid.innerHTML =
            '<div class="gallery-loading">' +
            '<div style="font-size:3rem">📷</div>' +
            '<p>Belum ada foto di kategori ini</p>' +
            '</div>';
        return;
    }

    galleryGrid.innerHTML = '';

    list.forEach(function(item, idx) {
        var card = document.createElement('div');
        card.className = 'gallery-item';
        card.style.animationDelay = (idx * 0.06) + 's';

        var imgHtml = item.imgDirect
            ? '<img src="' + esc(item.imgDirect) + '" alt="' + esc(item.title) + '" loading="lazy"' +
              ' onerror="this.outerHTML=\'<div class=gallery-placeholder>' + esc(item.emoji) + '</div>\'">'
            : '<div class="gallery-placeholder">' + item.emoji + '</div>';

        card.innerHTML =
            '<div class="gallery-img-wrap">' + imgHtml + '</div>' +
            '<div class="gallery-overlay">' +
            '<div class="gallery-overlay-text">' + esc(item.title) + '</div>' +
            '<div class="gallery-overlay-date">' + esc(item.date) + '</div>' +
            '</div>';

        card.addEventListener('click', function() { openModal(item); });
        galleryGrid.appendChild(card);
    });
}

function openModal(item) {
    modalImage.innerHTML = item.imgDirect
        ? '<img src="' + esc(item.imgDirect) + '" alt="' + esc(item.title) + '"' +
          ' onerror="this.outerHTML=\'<div class=modal-image-placeholder>' + esc(item.emoji) + '</div>\'">'
        : '<div class="modal-image-placeholder">' + item.emoji + '</div>';

    modalCategory.textContent = CATEGORY_LABELS[item.category] || item.category;
    modalTitle.textContent    = item.title;
    modalDate.textContent     = item.date;

    if (item.driveUrl) {
        modalDriveBtn.href = item.driveUrl;
        modalDriveBtn.style.display = 'inline-flex';
    } else {
        modalDriveBtn.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    modalImage.innerHTML = '';
}

filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderGallery(currentFilter);
    });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

renderGallery('all');
    
