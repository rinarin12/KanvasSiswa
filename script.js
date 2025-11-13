document.addEventListener('DOMContentLoaded', function() {
  
  // =================================================================
  // LANGKAH 1: KONFIGURASI FIREBASE
  // =================================================================
  // GANTI DENGAN KODE firebaseConfig YANG KAMU DAPATKAN TADI
  const firebaseConfig = {
    apiKey: "AIzaSyB...xxxxxxxxxxxx",
    authDomain: "kanvassiswa.firebaseapp.com",
    projectId: "kanvassiswa",
    storageBucket: "kanvassiswa.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:123456...xxxxxxxxxxxx"
  };

  // Inisialisasi Firebase
  firebase.initializeApp(firebaseConfig);

  // Hubungkan ke layanan-layanan
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();

  let currentUser = null; // Variabel untuk menyimpan info user yang login

  // =================================================================
  // LANGKAH 2: MENGAMBIL ELEMEN HTML
  // =================================================================
  // Navigasi
  const navGaleri = document.getElementById('nav-galeri');
  const navBelajar = document.getElementById('nav-belajar');
  const pageGaleri = document.getElementById('page-galeri');
  const pageBelajar = document.getElementById('page-belajar');
  
  // Auth (Login/Logout)
  const tombolLogin = document.getElementById('tombolLogin');
  const tombolLogout = document.getElementById('tombolLogout');
  const areaAuth = document.getElementById('area-auth');
  const infoUser = document.getElementById('infoUser');
  const namaUser = document.getElementById('namaUser');
  
  // Form Galeri
  const inputGambar = document.getElementById('inputGambar');
  const previewGambar = document.getElementById('previewGambar');
  const inputRefleksi = document.getElementById('inputRefleksi');
  const tombolTambahKarya = document.getElementById('tombolTambahKarya');
  const daftarKarya = document.getElementById('daftarKarya');
  
  let fileGambarTerpilih = null; // Kita ganti, bukan simpan data base64, tapi file-nya

  // =================================================================
  // LANGKAH 3: LOGIKA NAVIGASI (Sama seperti sebelumnya)
  // =================================================================
  function tampilkanHalaman(pageId) {
    pageGaleri.classList.remove('active');
    pageBelajar.classList.remove('active');
    navGaleri.classList.remove('active');
    navBelajar.classList.remove('active');

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

  // =================================================================
  // LANGKAH 4: LOGIKA AUTENTIKASI (LOGIN & LOGOUT)
  // =================================================================
  
  // Cek status login saat halaman dimuat
  auth.onAuthStateChanged(user => {
    if (user) {
      // Pengguna sedang login
      currentUser = user;
      namaUser.textContent = user.displayName;
      infoUser.style.display = 'block';
      tombolLogin.style.display = 'none';
    } else {
      // Pengguna logout
      currentUser = null;
      infoUser.style.display = 'none';
      tombolLogin.style.display = 'block';
    }
    // Setelah tahu status login, baru kita muat galerinya
    muatSemuaKarya(); 
  });

  // Fungsi untuk Login
  tombolLogin.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(error => {
      console.error("Error saat login:", error);
    });
  });

  // Fungsi untuk Logout
  tombolLogout.addEventListener('click', () => {
    auth.signOut();
  });

  // =================================================================
  // LANGKAH 5: LOGIKA GALERI (BERUBAH TOTAL)
  // =================================================================

  // --- 5a. Preview Gambar (Hampir sama) ---
  inputGambar.addEventListener('change', (e) => {
    fileGambarTerpilih = e.target.files[0]; // Simpan file-nya
    if (fileGambarTerpilih) {
      const reader = new FileReader();
      reader.onload = function(event) {
        previewGambar.src = event.target.result;
        previewGambar.style.display = 'block';
      }
      reader.readAsDataURL(fileGambarTerpilih);
    }
  });

  // --- 5b. Publikasikan Karya (Upload ke Firebase) ---
  tombolTambahKarya.addEventListener('click', () => {
    const teksRefleksi = inputRefleksi.value;

    // Cek 1: Sudah login belum?
    if (!currentUser) {
      alert("Harap login terlebih dahulu untuk mempublikasikan karya!");
      return;
    }
    // Cek 2: Sudah isi form belum?
    if (!fileGambarTerpilih || teksRefleksi.trim() === '') {
      alert("Harap pilih gambar dan isi refleksi!");
      return;
    }

    // Nonaktifkan tombol agar tidak di-klik berkali-kali
    tombolTambahKarya.disabled = true;
    tombolTambahKarya.textContent = "Mengunggah...";

    // 1. Upload file gambar ke Firebase Storage
    const namaFile = `${Date.now()}_${fileGambarTerpilih.name}`;
    const storageRef = storage.ref(`karya/${namaFile}`);
    
    storageRef.put(fileGambarTerpilih).then(snapshot => {
      // 2. Dapatkan URL gambar yang sudah di-upload
      return snapshot.ref.getDownloadURL();
    }).then(downloadURL => {
      // 3. Simpan data (URL gambar + refleksi + info user) ke Database Firestore
      return db.collection("karya").add({
        urlGambar: downloadURL,
        refleksi: teksRefleksi,
        pembuatId: currentUser.uid,       // ID unik user
        pembuatNama: currentUser.displayName, // Nama user
        dibuatPada: firebase.firestore.FieldValue.serverTimestamp() // Waktu
      });
    }).then(() => {
      // 4. Berhasil! Bersihkan form
      alert("Karya berhasil dipublikasikan!");
      resetForm();
    }).catch(error => {
      console.error("Error saat upload:", error);
      alert("Gagal mengunggah karya!");
    }).finally(() => {
      // Aktifkan tombol kembali
      tombolTambahKarya.disabled = false;
      tombolTambahKarya.textContent = "Publikasikan Karya";
    });
  });
  
  function resetForm() {
    inputRefleksi.value = '';
    inputGambar.value = '';
    previewGambar.style.display = 'none';
    previewGambar.src = '#';
    fileGambarTerpilih = null;
  }

  // --- 5c. Muat Semua Karya dari Firestore (Bisa dilihat orang lain) ---
  function muatSemuaKarya() {
    db.collection("karya").orderBy("dibuatPada", "desc") // Ambil data, urutkan dari terbaru
      .onSnapshot(snapshot => { // .onSnapshot = otomatis update jika ada data baru
        daftarKarya.innerHTML = ''; // Kosongkan galeri dulu
        
        snapshot.forEach(doc => {
          const data = doc.data();
          const docId = doc.id; // Ini ID unik dari dokumen/karya
          
          // Buat kartu HTML
          const kartuKarya = document.createElement('div');
          kartuKarya.className = 'kartu-karya';
          kartuKarya.innerHTML = `
            <img src="${data.urlGambar}" alt="Karya Siswa">
            <div class="konten">
              <p>${data.refleksi}</p>
              <small>Dibuat oleh: ${data.pembuatNama}</small>
            </div>
          `;
          
          // --- 5d. Logika Tombol Hapus (Hanya muncul jika milik sendiri) ---
          if (currentUser && currentUser.uid === data.pembuatId) {
            const tombolHapus = document.createElement('button');
            tombolHapus.className = 'tombol-hapus-karya';
            tombolHapus.textContent = 'X';
            
            tombolHapus.addEventListener('click', () => {
              if (confirm("Apakah kamu yakin ingin menghapus karya ini?")) {
                hapusKarya(docId, data.urlGambar);
              }
            });
            
            kartuKarya.appendChild(tombolHapus);
          }
          
          daftarKarya.appendChild(kartuKarya);
        });
      });
  }

  // Fungsi untuk menghapus karya
  function hapusKarya(docId, urlGambar) {
    // 1. Hapus dokumen dari Firestore
    db.collection("karya").doc(docId).delete().then(() => {
      // 2. Hapus file dari Storage (agak rumit, tapi penting)
      const storageRef = storage.refFromURL(urlGambar);
      storageRef.delete().catch(error => {
        console.error("Error hapus file di Storage:", error);
      });
      alert("Karya berhasil dihapus!");
    }).catch(error => {
      console.error("Error hapus data di Firestore:", error);
      alert("Gagal menghapus karya!");
    });
  }
});
