document.addEventListener('DOMContentLoaded', function() {

  // --- ELEMEN NAVIGASI & HALAMAN ---
  const navGaleri = document.getElementById('nav-galeri');
  const navBelajar = document.getElementById('nav-belajar');
  const pageGaleri = document.getElementById('page-galeri');
  const pageBelajar = document.getElementById('page-belajar');

  // --- ELEMEN FORM GALERI ---
  const inputGambar = document.getElementById('inputGambar');
  const previewGambar = document.getElementById('previewGambar');
  const inputRefleksi = document.getElementById('inputRefleksi');
  const tombolTambahKarya = document.getElementById('tombolTambahKarya');
  const daftarKarya = document.getElementById('daftarKarya');
  
  // Variabel untuk menyimpan data gambar (dalam format Base64)
  let gambarTerpilih = null;

  // --- LOGIKA 1: NAVIGASI PINDAH HALAMAN ---

  function tampilkanHalaman(pageId) {
    // Sembunyikan semua halaman
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    // Hapus 'active' dari semua tombol nav
    document.querySelectorAll('.nav-button').forEach(btn => {
      btn.classList.remove('active');
    });

    // Tampilkan halaman dan tombol yang dipilih
    if (pageId === 'galeri') {
      pageGaleri.classList.add('active');
      navGaleri.classList.add('active');
    } else if (pageId === 'belajar') {
      pageBelajar.classList.add('active');
      navBelajar.classList.add('active');
    }
  }

  // Atur event listener untuk tombol navigasi
  navGaleri.addEventListener('click', () => tampilkanHalaman('galeri'));
  navBelajar.addEventListener('click', () => tampilkanHalaman('belajar'));

  
  // --- LOGIKA 2: PREVIEW GAMBAR ---
  
  inputGambar.addEventListener('change', function(event) {
    // Ambil file yang dipilih
    const file = event.target.files[0];
    
    if (file) {
      // Buat 'FileReader' untuk membaca file
      const reader = new FileReader();
      
      // Saat 'reader' selesai membaca...
      reader.onload = function(e) {
        // Tampilkan gambar di 'preview'
        previewGambar.src = e.target.result;
        previewGambar.style.display = 'block';
        
        // Simpan data gambar (e.target.result) ke variabel
        gambarTerpilih = e.target.result;
      }
      
      // Perintahkan 'reader' untuk membaca file sebagai Data URL (Base64)
      reader.readAsDataURL(file);
    }
  });

  
  // --- LOGIKA 3: TAMBAH KARYA KE GALERI ---

  tombolTambahKarya.addEventListener('click', function() {
    const teksRefleksi = inputRefleksi.value;

    // Validasi: Pastikan gambar dan refleksi sudah diisi
    if (!gambarTerpilih) {
      alert('Harap pilih gambar terlebih dahulu!');
      return;
    }
    if (teksRefleksi.trim() === '') {
      alert('Harap isi refleksi/deskripsi karyamu!');
      inputRefleksi.focus();
      return;
    }

    // Buat elemen 'div' baru untuk kartu karya
    const kartuKarya = document.createElement('div');
    kartuKarya.className = 'kartu-karya';

    // Isi HTML di dalam kartu
    kartuKarya.innerHTML = `
      <img src="${gambarTerpilih}" alt="Karya Siswa">
      <div class="konten">
        <p>${teksRefleksi}</p>
      </div>
      <button class="tombol-hapus-karya">X</button>
    `;

    // Tambahkan fungsi ke tombol hapus
    kartuKarya.querySelector('.tombol-hapus-karya').addEventListener('click', function() {
      daftarKarya.removeChild(kartuKarya);
    });

    // Masukkan kartu baru ke awal galeri
    daftarKarya.prepend(kartuKarya);

    // Reset form setelah berhasil
    inputRefleksi.value = '';
    inputGambar.value = ''; // Kosongkan input file
    previewGambar.style.display = 'none'; // Sembunyikan preview
    previewGambar.src = '#';
    gambarTerpilih = null;
  });

  // Set halaman awal yang aktif
  tampilkanHalaman('galeri');
});
