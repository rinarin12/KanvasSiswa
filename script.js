// Menunggu sampai semua elemen HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. AMBIL SEMUA ELEMEN YANG DIBUTUHKAN ---
  const navGaleri = document.getElementById('nav-galeri');
  const navBelajar = document.getElementById('nav-belajar');
  const pageGaleri = document.getElementById('page-galeri');
  const pageBelajar = document.getElementById('page-belajar');

  const inputGambar = document.getElementById('inputGambar');
  const previewGambar = document.getElementById('previewGambar');
  const inputRefleksi = document.getElementById('inputRefleksi');
  const tombolTambah = document.getElementById('tombolTambahKarya');
  const daftarKarya = document.getElementById('daftarKarya');

  // Variabel untuk menyimpan data URL gambar yang di-preview
  let dataGambarUrl = null;
  // Kunci untuk localStorage
  const KUNCI_STORAGE = 'kanvasSiswaKarya';

  // --- 2. LOGIKA NAVIGASI (TAB) ---
  navGaleri.addEventListener('click', () => {
    pageGaleri.classList.add('active');
    pageBelajar.classList.remove('active');
    navGaleri.classList.add('active');
    navBelajar.classList.remove('active');
  });

  navBelajar.addEventListener('click', () => {
    pageBelajar.classList.add('active');
    pageGaleri.classList.remove('active');
    navBelajar.classList.add('active');
    navGaleri.classList.remove('active');
  });

  // --- 3. LOGIKA PREVIEW GAMBAR ---
  inputGambar.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      // Saat file selesai dibaca
      reader.onload = (e) => {
        const url = e.target.result;
        previewGambar.src = url;
        previewGambar.style.display = 'block';
        // Simpan data URL gambar untuk disimpan nanti
        dataGambarUrl = url;
      };

      // Baca file sebagai Data URL (teks base64)
      reader.readAsDataURL(file);
    }
  });

  // --- 4. FUNGSI UNTUK MENGAMBIL DATA DARI LOCALSTORAGE ---
  function ambilDataKarya() {
    const dataString = localStorage.getItem(KUNCI_STORAGE);
    // Jika ada data, ubah dari string JSON ke array. Jika tidak, kembalikan array kosong.
    return dataString ? JSON.parse(dataString) : [];
  }

  // --- 5. FUNGSI UNTUK MENAMPILKAN SEMUA KARYA KE LAYAR ---
  function tampilkanSemuaKarya() {
    // Kosongkan galeri sebelum diisi ulang
    daftarKarya.innerHTML = '';
    
    const semuaKarya = ambilDataKarya();

    // Loop setiap data karya dan buat elemennya
    // Kita pakai forEach.reverse() agar karya terbaru muncul di paling atas
    semuaKarya.reverse().forEach((karya, indexAsli) => {
      // Hitung index terbalik (karena array-nya di-reverse) untuk kepentingan Hapus
      const index = semuaKarya.length - 1 - indexAsli;
      
      buatElemenKarya(karya.gambarUrl, karya.refleksi, index);
    });
  }

  // --- 6. FUNGSI UNTUK MEMBUAT SATU KARTU KARYA ---
  function buatElemenKarya(gambarUrl, refleksi, index) {
    const itemKarya = document.createElement('div');
    itemKarya.classList.add('kartu-karya'); // Beri kelas untuk styling CSS

    const img = document.createElement('img');
    img.src = gambarUrl;
    img.alt = 'Karya Siswa';

    const p = document.createElement('p');
    p.textContent = refleksi;

    const tombolHapus = document.createElement('button');
    tombolHapus.textContent = 'Hapus Karya';
    tombolHapus.classList.add('tombol-hapus'); // Beri kelas untuk styling CSS
    
    // Tambahkan event listener untuk menghapus karya
    tombolHapus.onclick = () => {
      hapusKarya(index);
    };

    itemKarya.appendChild(img);
    itemKarya.appendChild(p);
    itemKarya.appendChild(tombolHapus);
    
    daftarKarya.appendChild(itemKarya);
  }

  // --- 7. FUNGSI UNTUK MENYIMPAN KARYA BARU ---
  tombolTambah.addEventListener('click', () => {
    const refleksi = inputRefleksi.value;

    // Validasi
    if (!dataGambarUrl || !refleksi) {
      alert('Harap pilih gambar DAN isi refleksi terlebih dahulu.');
      return;
    }

    // Ambil data lama
    const semuaKarya = ambilDataKarya();
    
    // Tambahkan data baru
    semuaKarya.push({
      gambarUrl: dataGambarUrl,
      refleksi: refleksi
    });

    // Simpan kembali ke localStorage (ubah array ke string JSON)
    localStorage.setItem(KUNCI_STORAGE, JSON.stringify(semuaKarya));

    // Reset form
    inputGambar.value = '';
    inputRefleksi.value = '';
    previewGambar.style.display = 'none';
    previewGambar.src = '#';
    dataGambarUrl = null;

    // Perbarui tampilan galeri
    tampilkanSemuaKarya();
  });

  // --- 8. FUNGSI UNTUK MENGHAPUS KARYA ---
  function hapusKarya(index) {
    if (!confirm('Apakah Anda yakin ingin menghapus karya ini?')) {
      return; // Batalkan jika pengguna menekan 'Cancel'
    }

    const semuaKarya = ambilDataKarya();
    
    // Hapus 1 item pada 'index' yang dipilih
    semuaKarya.splice(index, 1);

    // Simpan kembali array yang sudah diubah ke localStorage
    localStorage.setItem(KUNCI_STORAGE, JSON.stringify(semuaKarya));

    // Perbarui tampilan galeri
    tampilkanSemuaKarya();
  }

  // --- 9. TAMPILKAN KARYA SAAT HALAMAN PERTAMA KALI DIBUKA ---
  tampilkanSemuaKarya();
  
});
