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
      fileUrl: 'assets/pdf/RPP_Siklus_1.pdf',
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
    'modal-materi1': {
      title: 'Bahan Ajar P1 — Dasar Assembly Tool Post',
      type: 'Modul Ajar Cetak & Digital',
      fileUrl: 'assets/pdf/Materi_Siklus-1_P1.pdf',
      context: 'Materi Siklus 1 Pertemuan 1, membahas pengenalan komponen utama Tool Post dan cara melakukan penempatan awal (Place Component) beserta penetapan Grounded Component.',
      purpose: 'Memberikan pemahaman awal mengenai antarmuka Autodesk Inventor untuk perakitan, dan memastikan siswa paham mana komponen yang harus menjadi patokan (Grounded).',
      pros: ['Sangat detail untuk siswa pemula.', 'Dilengkapi gambar tiap ikon perintah.'],
      cons: ['Berfokus pada teori dasar, praktik aslinya mungkin lebih cepat.'],
      theory: 'Mengacu pada prinsip Scaffolding (Vygotsky), di mana tahap awal diberikan panduan penuh.'
    },
    'modal-materi2': {
      title: 'Bahan Ajar P2 — Penerapan Constraint',
      type: 'Modul Ajar Cetak & Digital',
      fileUrl: 'assets/pdf/Materi_Siklus-1_P2.pdf',
      context: 'Materi Siklus 1 Pertemuan 2, fokus pada penerapan constraint Mate, Flush, dan Insert pada 8 komponen Tool Post.',
      purpose: 'Membimbing siswa agar dapat merakit komponen hingga memiliki Degrees of Freedom (DOF) = 0.',
      pros: ['Menyertakan troubleshooting untuk error constraint yang sering terjadi.', 'Glosarium sangat membantu.'],
      cons: ['Cukup padat, siswa butuh waktu untuk memahami perbedaan Mate dan Flush.'],
      theory: 'Didasarkan pada prinsip Cognitive Load Theory (Sweller) dengan memisahkan materi kompleks menjadi sub-langkah kecil.'
    },
    'modal-materi3': {
      title: 'Bahan Ajar P3 — Drawing & Bill of Materials',
      type: 'Modul Ajar Cetak & Digital',
      fileUrl: 'assets/pdf/Materi_Siklus-1_P3.pdf',
      context: 'Materi Siklus 1 Pertemuan 3, materi tingkat lanjut mengenai pembuatan gambar kerja 2D (Drawing) dari hasil rakitan 3D.',
      purpose: 'Siswa dapat membuat etiket (title block), Bill of Materials (BOM), dan Ballooning sesuai standar industri manufaktur.',
      pros: ['Mengajarkan standar industri yang sangat krusial di dunia kerja nyata.'],
      cons: ['Langkah pembuatan BOM dan penomoran (Balloon) cukup rumit.'],
      theory: 'Penerapan Contextual Teaching and Learning (CTL) karena sangat berkaitan dengan dokumen kerja bengkel industri.'
    },
    'modal-media1': {
      title: 'Media Presentasi (PPT) — Assembly Tool Post',
      type: 'Media Pembelajaran (Slide Interaktif)',
      fileUrl: '', // PPTX preview is generally not natively supported
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
      fileUrl: 'assets/pdf/Asesmen_Siklus_1.pdf',
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
    'modal-lkm1': {
      title: 'Lembar Kerja Murid (LKM) — Pertemuan 1',
      type: 'Dokumen Hasil Praktik P1',
      fileUrl: 'assets/pdf/LKM_Siklus-1_P1.pdf',
      context: 'LKM untuk pertemuan pertama yang memandu siswa memposisikan komponen Base dan Tool Holder (Grounded).',
      purpose: 'Melatih kemampuan dasar perakitan 3D, membiasakan siswa melakukan self-assessment.',
      pros: ['Sangat mudah diikuti dengan format checklist.'],
      cons: ['Terkadang siswa lupa mengambil screenshot sebagai bukti.'],
      theory: 'Menerapkan prinsip Self-Regulated Learning (Zimmerman) dengan kolom refleksi kendala di bagian akhir LKM.'
    },
    'modal-lkm2': {
      title: 'Lembar Kerja Murid (LKM) — Pertemuan 2',
      type: 'Dokumen Hasil Praktik P2',
      fileUrl: 'assets/pdf/LKM_Siklus-1_P2.pdf',
      context: 'LKM pertemuan kedua yang berfokus pada pemasangan baut, washer, dan pengunci menggunakan Insert Constraint.',
      purpose: 'Memastikan seluruh komponen Tool Post terakit sempurna dengan DOF = 0.',
      pros: ['Memiliki tingkat kesulitan yang bertahap (graded difficulty).'],
      cons: ['Butuh ketelitian lebih untuk memasang constraint pada lubang yang kecil.'],
      theory: 'Menerapkan Zone of Proximal Development (Vygotsky) dengan pemberian bantuan terstruktur.'
    },
    'modal-lkm3': {
      title: 'Lembar Kerja Murid (LKM) — Pertemuan 3',
      type: 'Dokumen Hasil Praktik P3',
      fileUrl: 'assets/pdf/LKM_Siklus-1_P3.pdf',
      context: 'LKM pertemuan terakhir yang berisi tugas membuat presentasi file 2D (Drawing) lengkap dengan part list (BOM).',
      purpose: 'Mendokumentasikan hasil akhir siswa secara komprehensif dalam bentuk file PDF Drawing.',
      pros: ['Meningkatkan kemampuan literasi grafis siswa sesuai standar.'],
      cons: ['Proses layout drawing cukup kompleks untuk siswa.'],
      theory: 'Penerapan Experiential Learning (Kolb) dari proses merakit (konkret) menjadi gambar teknik standar (abstrak).'
    },
    'modal-toolpost': {
      title: 'Gambar Teknik Tool Post (Revisi)',
      type: 'Gambar Teknik',
      fileUrl: 'assets/pdf/Tool Post Rev.pdf',
      context: 'File gambar rakitan Tool Post hasil revisi, digunakan sebagai referensi objek praktik Assembly di Siklus 1.',
      purpose: 'Siswa menggunakan dimensi dan bentuk pada file ini sebagai acuan perakitan komponen.',
      pros: ['Detail presisi sangat jelas sebagai referensi utama untuk objek rakitan.'],
      cons: ['Bukan modul ajar, murni hanya gambar teknik tanpa instruksi urutan pasang.'],
      theory: 'Video ini menjadi alat utama untuk Reflective Practice (Schon) yang memungkinkan calon guru melakukan reflection-on-action dengan mengevaluasi bahasa tubuh, kejelasan instruksi, serta respon langsung dari para murid.'
    }
  };

  function openModal(modalId, viewMode) {
    const data = artifactData[modalId] || artifactData['modal-rpp1'];
    const fileUrl = data.fileUrl || '';
    const canPreviewPdf = Boolean(fileUrl && /\.pdf(?:$|[?#])/i.test(fileUrl));

    if (viewMode === 'pdf' && canPreviewPdf) {
      // Tampilan HANYA PDF
      modalContent.innerHTML = `
        <div class="modal-header" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; border-bottom: none; padding-bottom: 0; gap: 15px; padding-right: 30px;">
          <div style="flex: 1; min-width: 250px;">
            <h3 style="margin-bottom: 4px; font-size: 1.3rem;">${data.title}</h3>
            <p style="margin-bottom: 0;">Preview Dokumen</p>
          </div>
          <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; background: #2EC4B6; color: #FFFFFF; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(46,196,182,0.3); z-index: 5;">
            Buka di Tab Baru ↗
          </a>
        </div>
        <div class="modal-body" style="height: 75vh; padding-top: 20px;">
          <iframe src="${fileUrl}#toolbar=0" style="width: 100%; height: 100%; border: 1px solid #DEE2E8; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);" title="PDF Preview"></iframe>
        </div>
      `;
    } else {
      // Tampilan ANALISIS (default)
      let prosHtml = data.pros.map(p => `<li>✅ ${p}</li>`).join('');
      let consHtml = data.cons.map(c => `<li>⚠️ ${c}</li>`).join('');

      let filePreviewHtml = '';
      if (canPreviewPdf) {
        filePreviewHtml = `
          <div class="pdf-preview" style="margin-top: 30px; border-top: 2px dashed #DEE2E8; padding-top: 20px;">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 10px;">
              <h4 style="margin: 0;">📄 Preview Dokumen Full</h4>
              <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 6px 14px; background: #EEF0F4; color: #2EC4B6; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 0.85rem;">
                Buka di Tab Baru ↗
              </a>
            </div>
            <iframe src="${fileUrl}#toolbar=0" style="width: 100%; height: 60vh; border: 1px solid #DEE2E8; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);" title="PDF Preview"></iframe>
          </div>
        `;
      } else if (fileUrl) {
        filePreviewHtml = `
          <div class="modal-files" style="margin-top: 20px;">
            <h4>📎 File Artefak</h4>
            <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background: #FF6B6B; color: #FFFFFF; border-radius: 8px; font-weight: 600; text-decoration: none;">Buka File</a>
          </div>
        `;
      }

      modalContent.innerHTML = `
        <div class="modal-header">
          <h3 style="font-size: 1.5rem;">${data.title}</h3>
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
          
          ${filePreviewHtml}
        </div>
      `;
    }

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
      openModal(btn.getAttribute('data-modal'), btn.getAttribute('data-view'));
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
