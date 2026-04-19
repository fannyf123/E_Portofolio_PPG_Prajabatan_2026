/* ============================================
   E-PORTFOLIO — ARTEFAK & MODAL JS
   Portfolio modal popup for artifact analysis
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalContent = document.getElementById('modalContent');
  const modalTriggers = document.querySelectorAll('.btn-modal');

  // Artifact analysis data (per rubrik PPG)
  const artifactData = {
    'modal-rpp1': {
      title: 'RPP Siklus 1 — Gambar Teknik Manufaktur (Deep Learning)',
      type: 'RPP & Modul Ajar (Fase F / Kelas XI TPM)',
      context: 'RPP ini disusun untuk kelas XI Teknik Pemesinan (TPM) di SMK Negeri 2 Depok Sleman pada materi "Perancangan Gambar Rakitan Kompleks (Assembly) Menggunakan Aplikasi Teknologi CAD". Latar belakang penyusunan didasarkan pada hasil asesmen diagnostik di mana mayoritas siswa memiliki gaya belajar visual-kinestetik dan sudah menguasai dasar 3D Part Modeling (.ipt).',
      purpose: 'Menerapkan Perencanaan Pembelajaran Mendalam (Deep Learning) untuk memfasilitasi kebutuhan belajar siswa yang beragam, membimbing mereka dari merakit komponen fisik di bengkel hingga mahir merakit secara virtual (Assembly) di Autodesk Inventor.',
      pros: [
        'Menerapkan scaffolding (panduan bertahap) bagi murid yang butuh panduan ekstra.',
        'Menyediakan pengayaan eksplorasi fitur lanjut bagi siswa yang lebih cepat paham.',
        'Sangat relevan dengan dunia kerja industri manufaktur karena fokus pada visualisasi 3D realistis.'
      ],
      cons: [
        'Membutuhkan ketersediaan perangkat komputer yang memadai untuk menjalankan software CAD yang berat.',
        'Alokasi waktu (24 JP) harus dikelola ketat agar semua siswa mencapai target kompetensi perakitan kompleks.'
      ],
      theory: 'Pembelajaran ini didasarkan pada teori Konstruktivisme Vygotsky dengan penerapan Scaffolding. Pendekatan Diferensiasi (Tomlinson) juga diterapkan dengan membedakan proses belajar antara kelompok yang butuh panduan bertahap dengan kelompok yang siap untuk eksplorasi mandiri.'
    },
    'modal-modul1': {
      title: 'Bahan Ajar — Assembly Tool Post',
      type: 'Modul Ajar / Bahan Ajar Cetak & Digital',
      context: 'Modul ini dirancang khusus untuk Siklus 1, materi "Perancangan Gambar Rakitan Kompleks". Disusun berdasarkan Capaian Pembelajaran Fase F.',
      purpose: 'Menyediakan panduan sistematis bagi siswa untuk merakit 8 komponen utama Tool Post (menetapkan Grounded Component, constraint Mate, Flush, Insert) hingga mencapai derajat kebebasan (DOF) = 0.',
      pros: [
        'Terstruktur secara runtut mulai dari tujuan hingga referensi.',
        'Dilengkapi bagian Panduan Troubleshooting Error Umum yang sangat praktis bagi siswa SMK.',
        'Menyertakan Glosarium Istilah CAD untuk memperkaya kosakata keteknikan siswa.'
      ],
      cons: [
        'Teks instruksional dalam format dokumen kurang interaktif dibandingkan video tutorial.',
        'Biaya cetak yang cukup tinggi jika memperbanyak modul berhalaman tebal secara fisik.'
      ],
      theory: 'Pengembangan bahan ajar ini didasarkan pada prinsip Cognitive Load Theory (Sweller) yang berusaha mengurangi extraneous cognitive load dengan menyajikan informasi esensial seperti daftar komponen dan troubleshooting secara ringkas dan terfokus.'
    },
    'modal-media1': {
      title: 'Media Presentasi (PPT) — Assembly Tool Post',
      type: 'Media Pembelajaran (Slide Interaktif)',
      context: 'Disusun sebagai pendamping visualisasi bagi siswa di awal pertemuan sebelum mereka turun praktik merakit komponen menggunakan komputer.',
      purpose: 'Memvisualisasikan bentuk akhir dari Tool Post secara 3D untuk memancing atensi (hook) serta menjelaskan langkah krusial seperti perbedaan constraint Mate dan Flush.',
      pros: [
        'Sangat efektif menarik perhatian awal kelas.',
        'Mempermudah penjelasan konsep abstrak (seperti DOF) melalui representasi visual.'
      ],
      cons: [
        'Bersifat komunikasi satu arah.',
        'Masih membutuhkan demonstrasi software langsung agar siswa benar-benar paham alur klik pada mouse.'
      ],
      theory: 'Desain media ini bertumpu pada Dual Coding Theory (Paivio), di mana integrasi stimulasi verbal (penjelasan guru) dan gambar (slide PPT) terbukti lebih mudah diingat dalam *working memory* siswa.'
    },
    'modal-asesmen1': {
      title: 'Perangkat Asesmen Terpadu — Siklus 1',
      type: 'Instrumen Asesmen (Diagnostik, Formatif, Sumatif)',
      context: 'Dikembangkan untuk memantau kemajuan siswa dari sebelum hingga sesudah pembelajaran. Memuat instrumen Asesmen Awal, Lembar Observasi Guru, Exit Ticket per pertemuan, dan Rubrik Sumatif.',
      purpose: 'Memetakan tingkat pemahaman awal siswa (untuk pengelompokan scaffolding) dan mengevaluasi ketercapaian perakitan Tool Post secara autentik.',
      pros: [
        'Sangat komprehensif dan berkelanjutan (mulai dari pra-pembelajaran hingga akhir).',
        'Exit ticket (seperti pertanyaan mengapa Tool Holder harus di-grounded) sangat efektif mengecek pemahaman konsep.',
        'Rubrik jelas untuk mengkategorikan siswa: mandiri, butuh panduan, atau butuh scaffolding penuh.'
      ],
      cons: [
        'Lembar observasi manual memakan banyak waktu guru jika diterapkan pada kelas dengan jumlah siswa >30 orang.'
      ],
      theory: 'Asesmen ini mengimplementasikan konsep Assessment for Learning dan Assessment as Learning (Earl, 2003). Rubrik unjuk kerjanya berlandaskan prinsip Asesmen Autentik (Wiggins) di mana siswa dinilai melalui performa praktik yang menyerupai standar industri manufaktur sesungguhnya.'
    },
    'modal-hasil1': {
      title: 'Lembar Kerja Murid (LKM) & Portofolio Siswa',
      type: 'Dokumen Hasil Praktik',
      context: 'LKM dirancang khusus untuk memandu siswa tahap demi tahap. Siswa diwajibkan melampirkan screenshot pada tahap-tahap krusial.',
      purpose: 'Merekam proses dan rekam jejak praktik (portofolio) setiap siswa secara individu. Melatih kedisiplinan dan prosedur kerja operasional di software CAD.',
      pros: [
        'Terdapat kolom "Self-Assessment" dan "Refleksi/Kendala" yang melatih kemandirian siswa.',
        'Tugas didokumentasikan rapi sebagai portofolio belajar.'
      ],
      cons: [
        'Ada risiko siswa sekadar meniru *screenshot* teman bila guru tidak memonitor layar mereka satu-per-satu.'
      ],
      theory: 'Fitur self-assessment dan refleksi di dalam LKM ini merepresentasikan implementasi dari Self-Regulated Learning (Zimmerman), di mana siswa diajak secara sadar mengevaluasi progres dan kendala yang mereka hadapi dalam merakit.'
    },
    'modal-video1': {
      title: 'Video Pelaksanaan PPL — Siklus 1',
      type: 'Dokumentasi Audiovisual',
      context: 'Video perekaman realisasi skenario RPP Deep Learning di dalam kelas XI TPM, SMKN 2 Depok Sleman.',
      purpose: 'Mendokumentasikan penerapan praktik mengajar secara riil, memuat tahapan pendahuluan, inti (scaffolding dan pengerjaan LKM), hingga penutup.',
      pros: [
        'Menjadi bukti empiris dari kompetensi pedagogik guru dan pengelolaan interaksi siswa (terlihat dari sesi bimbingan berkeliling).',
        'Menunjukkan atmosfer lab komputer yang kondusif.'
      ],
      cons: [
        'Keterbatasan angle kamera tunggal yang membuat aktivitas di sudut belakang kelas kurang terekam dengan jelas.'
      ],
      theory: 'Video ini menjadi alat utama untuk Reflective Practice (Schon) yang memungkinkan calon guru melakukan reflection-on-action dengan mengevaluasi bahasa tubuh, kejelasan instruksi, serta respon langsung dari para murid.'
    }
  };

  function openModal(modalId) {
    const data = artifactData[modalId] || artifactData['modal-rpp1'];
    
    let prosHtml = data.pros.map(p => `<li>✅ ${p}</li>`).join('');
    let consHtml = data.cons.map(c => `<li>⚠️ ${c}</li>`).join('');

    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>${data.title}</h3>
        <p>${data.type}</p>
      </div>
      <div class="modal-body">
        <h4>📌 Konteks Pembuatan</h4>
        <p>${data.context}</p>
        
        <h4>🎯 Tujuan</h4>
        <p>${data.purpose}</p>
        
        <h4>📈 Kelebihan & Kekurangan</h4>
        <ul>
          ${prosHtml}
          ${consHtml}
        </ul>
        
        <h4>📖 Kajian Teori</h4>
        <p>${data.theory}</p>
      </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.getAttribute('data-modal'));
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

}); // End DOMContentLoaded
