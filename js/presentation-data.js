(function () {
  'use strict';

  const digitalPresentation = [
    {
      content_id:'P-D1', session_id:'DIGI-WED', display_order:1,
      activity:'KEGIATAN 1', activity_title:'Nonton Bersama Film Pencegahan Judi Online',
      type:'presentation', template:'opening_visual', title:'Pengantar: Waspada Jebakan Digital',
      body:'Di era digital ini, banyak tawaran terlihat menggiurkan di internet: janji uang instan, bonus besar, atau pinjaman mudah tanpa syarat. Namun, kita perlu sangat berhati-hati karena hal tersebut dapat menjadi jebakan berbahaya.\nHari ini kita belajar mengenali risiko, menjaga diri, dan berani mencari bantuan.',
      duration_minutes:4, icon:'🛡️', accent:'cyan', action:'none', action_label:'', media_url:'', is_active:true,
      visuals:[
        {icon:'💸',title:'Janji Uang Instan',text:'Keuntungan cepat sering dipakai untuk memancing rasa penasaran.'},
        {icon:'🎰',title:'Permainan Berisiko',text:'Tampilan menarik dapat menyembunyikan kerugian dan kecanduan.'},
        {icon:'🤝',title:'Berani Minta Bantuan',text:'Orang tua, wali, guru, dan konselor adalah tempat aman untuk bercerita.'}
      ],
      teacher_cue:'Bacakan pengantar dengan tenang. Hindari menyalahkan korban dan tekankan bahwa tujuan kegiatan adalah perlindungan diri.'
    },
    {
      content_id:'P-D2', session_id:'DIGI-WED', display_order:2,
      activity:'KEGIATAN 1', activity_title:'Nonton Bersama Film Pencegahan Judi Online',
      type:'discussion', template:'trigger_questions', title:'Pertanyaan Pemantik Sebelum Menonton',
      body:'Tampilkan pertanyaan satu per satu. Beri waktu berpikir, lalu undang beberapa murid menjawab secara sukarela. Tidak perlu mencari jawaban yang sempurna; yang penting murid berani menyampaikan alasan.',
      duration_minutes:4, icon:'❓', accent:'violet', action:'guided_prompts', action_label:'Mulai Pertanyaan Pemantik', media_url:'', is_active:true,
      prompts:[
        {id:'PEM-01',question:'Apa yang dimaksud dengan judi online?',answer:'Judi online adalah kegiatan mempertaruhkan uang atau sesuatu yang bernilai melalui internet pada permainan atau hasil yang tidak pasti. Kegiatan ini berisiko menimbulkan kerugian, ketagihan, dan masalah lain.'},
        {id:'PEM-02',question:'Mengapa ada orang yang tertarik pada judi online?',answer:'Seseorang dapat tertarik karena janji uang cepat, bonus, iklan yang menarik, ajakan teman, rasa penasaran, tekanan ekonomi, atau belum memahami risikonya.'},
        {id:'PEM-03',question:'Pernahkah kalian mendengar berita tentang seseorang yang terjerat judi online? Pola masalah apa yang biasanya terlihat?',answer:'Pola yang sering terlihat antara lain kehilangan uang, berutang, stres, berbohong, konflik keluarga, sulit berkonsentrasi, serta terus bermain untuk mengejar kerugian.'},
        {id:'PEM-04',question:'Menurut kalian, apa saja potensi bahaya dari judi online?',answer:'Bahaya judi online mencakup kerugian keuangan, ketagihan, stres dan kecemasan, rusaknya hubungan keluarga atau pertemanan, gangguan belajar, penyalahgunaan data pribadi, dan terganggunya masa depan.'},
        {id:'PEM-05',question:'Apa yang sebaiknya dilakukan ketika menerima tautan atau ajakan yang menjanjikan uang cepat?',answer:'Jangan klik atau mengirim uang. Hentikan komunikasi, blokir dan laporkan akun, simpan bukti seperlunya, serta ceritakan kepada orang tua, wali, guru, atau orang dewasa tepercaya.'}
      ],
      teacher_cue:'Setelah setiap pertanyaan, beri jeda 20–30 detik dan kesempatan kepada 2–3 murid untuk menjawab. Tanggapi dengan apresiasi, bukan penghakiman.'
    },
    {
      content_id:'P-D3', session_id:'DIGI-WED', display_order:3,
      activity:'KEGIATAN 1', activity_title:'Nonton Bersama Film Pencegahan Judi Online',
      type:'video', template:'film', title:'FILM PENDEK “KEMENANGAN SEJATI”',
      body:'Saksikan film dari awal hingga akhir. Ajak murid memperhatikan tiga hal: bagaimana tokoh mulai terlibat, dampak yang muncul, dan keputusan aman yang seharusnya dapat diambil.',
      duration_minutes:17, icon:'🎬', accent:'pink', action:'open_film', action_label:'Putar Film Kemenangan Sejati',
      media_url:'https://youtu.be/xJD37cmYPws', youtube_id:'xJD37cmYPws', is_active:true,
      teacher_cue:'Gunakan mode layar penuh dan pastikan suara terdengar. Setelah film selesai, kembali ke aplikasi untuk masuk ke kegiatan refleksi.'
    },
    {
      content_id:'P-D4', session_id:'DIGI-WED', display_order:4,
      activity:'KEGIATAN 2', activity_title:'Diskusi dan Refleksi Film Pencegahan Judi Online',
      type:'discussion', template:'discussion_flow', title:'Diskusi dan Refleksi Film',
      body:'Tujuan kegiatan ini adalah memfasilitasi refleksi, mengidentifikasi faktor pemicu dan dampak negatif secara komprehensif, serta mendorong murid mengetahui cara menghindari judi online dan berani mencari bantuan.',
      duration_minutes:5, icon:'💬', accent:'violet', action:'guided_discussion', action_label:'Buka Alur Diskusi', media_url:'', is_active:true,
      prompts:[
        {id:'REF-01',question:'Apa pelajaran paling berharga yang kamu peroleh dari film Kemenangan Sejati?',answer:'Pelajaran utamanya adalah bahwa janji keuntungan cepat dapat menjadi jebakan, keputusan digital memiliki akibat nyata, dan meminta bantuan lebih baik daripada menyembunyikan masalah.'},
        {id:'REF-02',question:'Mengapa tokoh utama dalam film dapat terjerumus ke dalam judi online?',answer:'Tokoh dapat terjerumus karena rasa penasaran, iming-iming uang cepat, dorongan lingkungan, kurangnya pemahaman risiko, dan keinginan mengembalikan uang yang sudah hilang.'},
        {id:'REF-03',question:'Faktor apa saja yang mungkin memengaruhinya?',answer:'Faktornya dapat berupa keinginan mendapatkan uang instan, tekanan teman sebaya, iklan atau promosi, kurangnya pengetahuan, rasa ingin mencoba, masalah pribadi, dan tekanan ekonomi.'},
        {id:'REF-04',question:'Apa dampak negatif yang terlihat dalam film?',answer:'Dampaknya dapat berupa kerugian finansial, utang, stres, takut, rasa bersalah, kebohongan, rusaknya hubungan keluarga, terganggunya belajar, dan terhambatnya masa depan.'},
        {id:'REF-05',question:'Apabila kamu atau temanmu berada dalam situasi serupa, tindakan apa yang akan kamu lakukan?',answer:'Berhenti bermain dan tidak mengirim uang, menjauh dari tautan atau akun, menyimpan bukti seperlunya, mengajak teman mencari bantuan, serta tidak menyelesaikan masalah sendirian.'},
        {id:'REF-06',question:'Siapa yang harus kamu mintai bantuan atau nasihat?',answer:'Mintalah bantuan kepada orang tua atau wali, guru, wali kelas, guru BK atau konselor sekolah, dan pihak berwenang bila diperlukan.'}
      ],
      key_message:'Mencari bantuan bukan tanda kelemahan. Berhenti, jangan mengirim uang, simpan bukti seperlunya, blokir akun mencurigakan, dan segera ceritakan kepada orang dewasa tepercaya.'
    },
    {
      content_id:'P-D5', session_id:'DIGI-WED', display_order:5,
      activity:'KEGIATAN 3', activity_title:'Kampanye 3S: Screen Time, Screen Zone, Screen Break',
      type:'poll', template:'habit_check', title:'Cek Kebiasaan Digital Kelas',
      body:'Guru membacakan pernyataan. Murid mengangkat tangan apabila pernah melakukannya. Tekankan bahwa kegiatan ini bukan untuk mempermalukan siapa pun, melainkan untuk mengenali kebiasaan dan memilih perubahan kecil yang realistis.',
      duration_minutes:3, icon:'🙋', accent:'orange', action:'habit_poll', action_label:'Mulai Cek Kebiasaan', media_url:'', is_active:true,
      statements:['Main gawai sampai lupa waktu.','Tidur sambil membawa gawai.','Makan sambil menonton video atau televisi.','Belajar sambil membuka banyak aktivitas.']
    },
    {
      content_id:'P-D6', session_id:'DIGI-WED', display_order:6,
      activity:'KEGIATAN 3', activity_title:'Kampanye 3S: Screen Time, Screen Zone, Screen Break',
      type:'info', template:'three_s_material', title:'Kenali Prinsip 3S',
      body:'Screen Time adalah waktu yang dihabiskan menatap layar. Screen Zone adalah kesepakatan tentang tempat dan situasi penggunaan gawai. Screen Break adalah jeda dari layar untuk bergerak, berinteraksi, dan melakukan kegiatan bermakna.',
      duration_minutes:4, icon:'3S', accent:'cyan', action:'open_3s_material', action_label:'Tampilkan Materi 3S',
      media_url:'https://drive.google.com/file/d/1kyTPhTxoRpRaxnhEmQnfvduz5P6aVSd2/view', image_url:'./assets/materi-prinsip-3s.jpg', is_active:true,
      teacher_cue:'Jelaskan bahwa 3S bukan larangan total menggunakan teknologi. Tujuannya adalah agar penggunaan gawai lebih sehat, aman, dan seimbang.'
    },
    {
      content_id:'P-D7', session_id:'DIGI-WED', display_order:7,
      activity:'KEGIATAN 3', activity_title:'Kampanye 3S: Screen Time, Screen Zone, Screen Break',
      type:'group_task', template:'group_builder', title:'Bagi Murid Menjadi Kelompok',
      body:'Atur jumlah kelompok, nama kelompok, jumlah murid, dan warna bola. Aplikasi akan membagi anggota secara merata. Panggil murid satu per satu, lalu tekan tombol Ambil Bola untuk menunjukkan kelompoknya.',
      duration_minutes:4, icon:'🎨', accent:'violet', action:'group_builder', action_label:'Buka Pembagi Kelompok', media_url:'', is_active:true,
      suggested_groups:['Screen Time','Screen Zone','Screen Break']
    },
    {
      content_id:'P-D8', session_id:'DIGI-WED', display_order:8,
      activity:'KEGIATAN 3', activity_title:'Kampanye 3S: Screen Time, Screen Zone, Screen Break',
      type:'group_task', template:'poster_workshop', title:'Lokakarya Poster Kampanye 3S',
      body:'Setiap kelompok membuat poster sesuai misinya. Kelompok Screen Time membuat aturan waktu layar. Kelompok Screen Zone membuat aturan tempat dan situasi penggunaan gawai. Kelompok Screen Break membuat daftar kegiatan bermakna selain menatap layar.',
      duration_minutes:10, icon:'🖍️', accent:'orange', action:'poster_workshop', action_label:'Mulai Lokakarya Poster', media_url:'', is_active:true,
      materials:['Kertas karton','Pensil warna, spidol, atau crayon','Selotip atau perekat kertas'],
      poster_steps:['Tentukan pesan utama.','Tuliskan 3–5 contoh tindakan nyata.','Buat judul dan gambar yang mudah dibaca.','Pastikan seluruh anggota mendapat peran.']
    },
    {
      content_id:'P-D9', session_id:'DIGI-WED', display_order:9,
      activity:'KEGIATAN 3', activity_title:'Kampanye 3S: Screen Time, Screen Zone, Screen Break',
      type:'presentation', template:'group_presentations', title:'Presentasi Poster di Depan Kelas',
      body:'Masing-masing kelompok mempresentasikan posternya. Kelompok lain mendengarkan, memberi satu apresiasi, dan satu saran perbaikan. Guru menegaskan kembali pesan inti dari setiap prinsip 3S.',
      duration_minutes:7, icon:'🎤', accent:'green', action:'group_presentations', action_label:'Mulai Presentasi Kelompok', media_url:'', is_active:true,
      presentation_prompts:['Apa aturan utama kelompok kalian?','Mengapa aturan itu penting?','Contoh penerapannya di rumah atau sekolah?','Apa tantangan yang mungkin muncul dan bagaimana mengatasinya?']
    },
    {
      content_id:'P-D10', session_id:'DIGI-WED', display_order:10,
      activity:'PENUTUP', activity_title:'Pesan Moral dan Penguatan',
      type:'closing', template:'moral_closing', title:'Jadilah Pengguna Digital yang Cerdas dan Berani',
      body:'Teknologi seharusnya membantu kita belajar dan bertumbuh, bukan mengendalikan hidup kita. Tawaran uang instan dapat menjadi jebakan. Mengatur waktu, tempat, dan jeda layar adalah bentuk menjaga diri. Ketika menghadapi masalah digital, berani berkata tidak dan meminta bantuan adalah kemenangan sejati.',
      duration_minutes:2, icon:'🌟', accent:'green', action:'moral_closing', action_label:'Tampilkan Pesan Penguatan', media_url:'', is_active:true,
      morals:[
        'Tidak semua yang menarik di internet aman untuk diikuti.',
        'Uang instan dan bonus besar dapat menjadi pintu masuk jebakan.',
        'Screen Time, Screen Zone, dan Screen Break membantu menjaga kesehatan, belajar, dan hubungan dengan orang lain.',
        'Berani menolak, berhenti, dan meminta bantuan adalah tindakan yang kuat.',
        'Kemenangan sejati adalah mampu mengendalikan pilihan dan menjaga masa depan.'
      ]
    }
  ];

  window.MPLS_PRESENTATION_DATA = Object.freeze({
    version:'1.3.0',
    sessions:{
      'DIGI-WED':{
        session_id:'DIGI-WED', day_label:'Rabu', title:'Literasi Digital',
        subtitle:'Pencegahan Judi Online dan Kampanye 3S', duration_minutes:60,
        icon:'🛡️', accent:'cyan', display_order:1, is_active:true,
        objectives:'Mengenali bahaya judi online, berani mencari bantuan, dan menerapkan Screen Time, Screen Zone, serta Screen Break.'
      }
    },
    content:{'DIGI-WED':digitalPresentation}
  });
})();
