// ============================================================
//  TAMBAH FOTO DI SINI
//
//  imageUrl: paste link Google Drive foto kamu
//  Contoh:   'https://drive.google.com/file/d/1aBcDeF.../view'
//
//  category: 'kelas' | 'acara' | 'olahraga' | 'ekstrakurikuler'
// ============================================================

var GALLERY_DATA = [
    {
        title    : 'Bulan Bahasa',
        category : 'acara',
        date     : '29 Okt 2025',
        imageUrl : 'https://drive.google.com/file/d/1ReD6dTe5jaOXEwRdkZSHiisrmLetV2zy/view?usp=drivesdk', 
        driveUrl : 'https://drive.google.com/drive/folders/1Qr7HGfxBM830kbqShDc0lkL7TRTN4_r_',
    },
];

// ── Tidak perlu diubah di bawah ini ──────────────────────────

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
    if (m1) return 'https://drive.google.com/thumbnail?id=' + m1[1] + '&sz=w800';
    var m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m2) return 'https://drive.google.com/thumbnail?id=' + m2[1] + '&sz=w800';
    return url;
}

function esc(str) {
    return String(str || '')
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

var allItems = GALLERY_DATA.map(function(item, i) {
    return {
        id       : 'item-' + i,
        title    : item.title,
        category : item.category,
        date     : item.date,
        driveUrl : item.driveUrl || '',
        imgDirect: toDirect(item.imageUrl),
        emoji    : FALLBACK_EMOJI[item.category] || '🖼️',
    };
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
            '<div class="gallery-loading"><div>📷</div><p>Belum ada foto di kategori ini</p></div>';
        return;
    }

    galleryGrid.innerHTML = '';

    list.forEach(function(item, idx) {
        var card = document.createElement('div');
        card.className = 'gallery-item';
        card.style.animationDelay = (idx * 0.06) + 's';

        // Gambar atau fallback emoji
        var mediaHtml;
        if (item.imgDirect) {
            mediaHtml =
                '<div class="gallery-img-wrap">' +
                '<img src="' + esc(item.imgDirect) + '" alt="' + esc(item.title) + '" loading="lazy"' +
                ' onerror="this.parentElement.innerHTML=\'<div class=gallery-placeholder>' + esc(item.emoji) + '</div>\'">' +
                '</div>';
        } else {
            mediaHtml = '<div class="gallery-placeholder">' + item.emoji + '</div>';
        }

        card.innerHTML =
            mediaHtml +
            '<div class="gallery-overlay">' +
            '<div class="gallery-overlay-text">' + esc(item.title) + '</div>' +
            '<div class="gallery-overlay-date">' + esc(item.date) + '</div>' +
            '</div>';

        card.addEventListener('click', function() { openModal(item); });
        galleryGrid.appendChild(card);
    });
}

function openModal(item) {
    // Gambar atau fallback
    if (item.imgDirect) {
        modalImage.innerHTML =
            '<img src="' + esc(item.imgDirect) + '" alt="' + esc(item.title) + '"' +
            ' onerror="this.outerHTML=\'<div class=modal-image-placeholder>' + esc(item.emoji) + '</div>\'">';
    } else {
        modalImage.innerHTML = '<div class="modal-image-placeholder">' + item.emoji + '</div>';
    }

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
    setTimeout(function() { modalImage.innerHTML = ''; }, 250);
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
                
