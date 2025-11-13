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
  
  // Variabel untuk menyimpan data gambar (Base64)
  let gambarTerpilih = null;

  // --- LOGIKA 1: NAVIGASI PINDAH HALAMAN ---
  function tampilkanHalaman(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));

    if (pageId === 'galeri') {
      pageGaleri.classList.add('active');
      navGaleri.classList.add('active');
    } else if (pageId === 'belajar') {
      pageBelajar.classList.add('active');
      navBelajar.classList.add('active');
    }
  }
  navGaleri.addEventListener('click', () => tampilkanHalaman('galeri'));
  navBelajar.addEventListener('click', () => tampilkanHalaman('belajar'));
  tampilkanHalaman('galeri');

  
  // --- LOGIKA 2: PREVIEW GAMBAR ---
  inputGambar.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewGambar.src = e.target.result;
        previewGambar.style.display = 'block';
        gambarTerpilih = e.target.result; // Simpan gambar sebagai data Base64
      }
      reader.readAsDataURL(file);
    }
  });

  
  // --- LOGIKA 3: FUNGSI PENYIMPANAN (LocalStorage) ---

  // Fungsi untuk mengambil semua karya dari localStorage
  function getKaryaTersimpan() {
    return JSON.parse(localStorage.getItem('daftarKarya')) || [];
  }

  // Fungsi untuk menyimpan array karya ke localStorage
  function simpanKarya(karya) {
    localStorage.setItem('daftarKarya', JSON.stringify(karya));
  }

  // Fungsi untuk membuat HTML kartu karya
  function buatKartuHTML(itemKarya) {
    const kartuKarya = document.createElement('div');
    kartuKarya.className = 'kartu-karya';
    // Tambahkan ID unik ke elemen untuk menghapus
    kartuKarya.setAttribute('data-id', itemKarya.id); 

    kartuKarya.innerHTML = `
      <img src="${itemKarya.gambar}" alt="Karya Siswa">
      <div class="konten">
        <p>${itemKarya.refleksi}</p>
      </div>
      <button class="tombol-hapus-karya">X</button>
    `;

    // Tambahkan fungsi ke tombol hapus
    kartuKarya.querySelector('.tombol-hapus-karya').addEventListener('click', function() {
      // Panggil fungsi hapus dengan ID unik
      hapusKaryaDariStorage(itemKarya.id);
    });

    return kartuKarya;
  }

  // Fungsi untuk memuat dan menampilkan semua karya saat halaman dibuka
  function muatSemuaKarya() {
    daftarKarya.innerHTML = ''; // Kosongkan galeri
    const karyaTersimpan = getKaryaTersimpan();
    karyaTersimpan.forEach(item => {
      const kartuBaru = buatKartuHTML(item);
      daftarKarya.appendChild(kartuBaru); // Tampilkan di galeri
    });
  }

  // Fungsi untuk menghapus karya dari localStorage dan dari layar
  function hapusKaryaDariStorage(id) {
    if (!confirm("Apakah kamu yakin ingin menghapus karya ini?")) {
      return; // Batalkan jika user klik "Cancel"
    }

    // 1. Ambil data
    let karyaTersimpan = getKaryaTersimpan();
    // 2. Buat array baru tanpa karya yang dihapus
    const karyaBaru = karyaTersimpan.filter(item => item.id !== id);
    // 3. Simpan array baru ke localStorage
    simpanKarya(karyaBaru);
    // 4. Hapus kartu dari layar
    document.querySelector(`.kartu-karya[data-id="${id}"]`).remove();
  }

  // --- LOGIKA 4: TOMBOL TAMBAH KARYA ---
  tombolTambahKarya.addEventListener('click', function() {
    const teksRefleksi = inputRefleksi.value;

    if (!gambarTerpilih || teksRefleksi.trim() === '') {
      alert('Harap pilih gambar dan isi refleksi!');
      return;
    }

    // Buat objek karya baru dengan ID unik (pakai waktu)
    const karyaBaru = {
      id: Date.now(), // ID unik
      gambar: gambarTerpilih,
      refleksi: teksRefleksi
    };

    // 1. Ambil data lama
    let karyaTersimpan = getKaryaTersimpan();
    // 2. Tambahkan karya baru ke paling depan (unshift)
    karyaTersimpan.unshift(karyaBaru);
    // 3. Simpan kembali ke localStorage
    simpanKarya(karyaTersimpan);
    
    // 4. Tampilkan kartu baru di paling depan layar
    const kartuBaruHTML = buatKartuHTML(karyaBaru);
    daftarKarya.prepend(kartuBaruHTML);

    // 5. Reset form
    inputRefleksi.value = '';
    inputGambar.value = '';
    previewGambar.style.display = 'none';
    previewGambar.src = '#';
    gambarTerpilih = null;
  });

  // --- JALANKAN FUNGSI INI SAAT HALAMAN PERTAMA KALI DIBUKA ---
  muatSemuaKarya();
});
