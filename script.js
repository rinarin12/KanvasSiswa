const inputFile = document.querySelector('input[type="file"]');
const imageContainer = document.getElementById('image-container'); // Tempat menampilkan gambar

// Fungsi untuk mengubah gambar ke base64 dan simpan ke LocalStorage
inputFile.addEventListener('change', function() {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    const base64Image = reader.result;
    localStorage.setItem('savedImage', base64Image);
    displayImage(base64Image);
  }

  if(file) {
    reader.readAsDataURL(file);
  }
});

// Fungsi tampilkan gambar
function displayImage(base64Image) {
  imageContainer.innerHTML = `<img src="${base64Image}" alt="Uploaded Image" width="200">`;
}

// Saat halaman diload, cek apakah ada data gambar di LocalStorage
window.onload = function() {
  const savedImage = localStorage.getItem('savedImage');
  if(savedImage) {
    displayImage(savedImage);
  }
}
