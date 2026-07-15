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
      student_tasks:[{content_id:'D-01',title:'Misi Literasi Digital',type:'view'}],
      teacher_message:'Buka Misi Literasi Digital dan simak pengantar dari guru.',
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
      student_tasks:[{content_id:'D-02',title:'Target Petualangan',type:'view'}],
      teacher_message:'Baca target pembelajaran. Tetap di tahap ini sampai guru melanjutkan.',
      teacher_cue:'Setelah setiap pertanyaan, beri jeda 20–30 detik dan kesempatan kepada 2–3 murid untuk menjawab. Tanggapi dengan apresiasi, bukan penghakiman.'
    },
    {
      content_id:'P-D3', session_id:'DIGI-WED', display_order:3,
      activity:'KEGIATAN 1', activity_title:'Nonton Bersama Film Pencegahan Judi Online',
      type:'video', template:'film', title:'FILM PENDEK “KEMENANGAN SEJATI”',
      body:'Saksikan film dari awal hingga akhir. Ajak murid memperhatikan tiga hal: bagaimana tokoh mulai terlibat, dampak yang muncul, dan keputusan aman yang seharusnya dapat diambil.',
      duration_minutes:17, icon:'🎬', accent:'pink', action:'open_film', action_label:'Putar Film Kemenangan Sejati',
      media_url:'https://youtu.be/xJD37cmYPws', youtube_id:'xJD37cmYPws', is_active:true,
      student_tasks:[{content_id:'D-04',title:'Film Kemenangan Sejati',type:'video'}],
      teacher_message:'Film sudah dibuka. Saksikan bersama dan perhatikan tiga fokus pengamatan.',
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
      student_tasks:[{content_id:'D-05',title:'Refleksi Film',type:'discussion'}],
      teacher_message:'Ikuti diskusi dan siapkan jawaban. Guru akan memberi kesempatan menjawab.',
      key_message:'Mencari bantuan bukan tanda kelemahan. Berhenti, jangan mengirim uang, simpan bukti seperlunya, blokir akun mencurigakan, dan segera ceritakan kepada orang dewasa tepercaya.'
    },
    {
      content_id:'P-D5', session_id:'DIGI-WED', display_order:5,
      activity:'KEGIATAN 2', activity_title:'Aktivitas HP Siswa: Quiz Aman Digital',
      type:'activity', template:'student_activity', title:'Saatnya Quiz Aman Digital di HP Siswa',
      body:'Arahkan murid membuka tahap Quiz Aman Digital pada HP. Soal menguji pengenalan risiko, tindakan aman, dan prinsip 3S. Nilai jawaban otomatis masuk ke Panel Guru. Murid yang tidak memiliki HP tetap dapat dinilai melalui observasi atau nilai manual.',
      duration_minutes:7, icon:'🎮', accent:'blue', action:'none', action_label:'', media_url:'', is_active:true,
      student_tasks:[
        {content_id:'D-06',title:'Quiz Aman Digital',type:'quiz'},
        {content_id:'D-07',title:'Berani Mencari Bantuan',type:'view'}
      ],
      teacher_message:'Kerjakan Quiz Aman Digital sekarang. Setelah selesai, baca langkah berani mencari bantuan.',
      teacher_cue:'Klik Buka Quiz di HP Siswa. Pantau jumlah murid yang sudah membuka dan menyelesaikan. Setelah mayoritas selesai, buka tahap Berani Mencari Bantuan.'
    },
    {
      content_id:'P-D6', session_id:'DIGI-WED', display_order:6,
      activity:'KEGIATAN 3', activity_title:'Kampanye 3S: Screen Time, Screen Zone, Screen Break',
      type:'poll', template:'habit_check', title:'Cek Kebiasaan Digital Kelas',
      body:'Guru membacakan pernyataan. Murid mengangkat tangan apabila pernah melakukannya. Tekankan bahwa kegiatan ini bukan untuk mempermalukan siapa pun, melainkan untuk mengenali kebiasaan dan memilih perubahan kecil yang realistis.',
      duration_minutes:3, icon:'🙋', accent:'orange', action:'habit_poll', action_label:'Mulai Cek Kebiasaan', media_url:'', is_active:true,
      statements:['Main gawai sampai lupa waktu.','Tidur sambil membawa gawai.','Makan sambil menonton video atau televisi.','Belajar sambil membuka banyak aktivitas.'],
      student_tasks:[{content_id:'D-03',title:'Cek Kebiasaan Digital',type:'poll'}],
      teacher_message:'Ikuti cek kebiasaan digital dengan jujur. Jawaban tidak digunakan untuk mempermalukan siapa pun.'
    },
    {
      content_id:'P-D7', session_id:'DIGI-WED', display_order:7,
      activity:'KEGIATAN 3', activity_title:'Kampanye 3S: Screen Time, Screen Zone, Screen Break',
      type:'info', template:'three_s_material', title:'Kenali Prinsip 3S',
      body:'Screen Time adalah waktu yang dihabiskan menatap layar. Screen Zone adalah kesepakatan tentang tempat dan situasi penggunaan gawai. Screen Break adalah jeda dari layar untuk bergerak, berinteraksi, dan melakukan kegiatan bermakna.',
      duration_minutes:4, icon:'3S', accent:'cyan', action:'open_3s_material', action_label:'Tampilkan Materi 3S',
      media_url:'https://drive.google.com/file/d/1kyTPhTxoRpRaxnhEmQnfvduz5P6aVSd2/view', image_url:'./assets/materi-prinsip-3s.jpg', is_active:true,
      student_tasks:[{content_id:'D-08',title:'Prinsip 3S',type:'view'}],
      teacher_message:'Buka kartu Prinsip 3S dan simak penjelasan guru.',
      teacher_cue:'Jelaskan bahwa 3S bukan larangan total menggunakan teknologi. Tujuannya adalah agar penggunaan gawai lebih sehat, aman, dan seimbang.'
    },
    {
      content_id:'P-D8', session_id:'DIGI-WED', display_order:8,
      activity:'KEGIATAN 3', activity_title:'Kampanye 3S: Screen Time, Screen Zone, Screen Break',
      type:'group_task', template:'group_builder', title:'Bagi Murid Menjadi Kelompok',
      body:'Atur jumlah kelompok, nama kelompok, jumlah murid, dan warna bola. Aplikasi akan membagi anggota secara merata. Panggil murid satu per satu, lalu tekan tombol Ambil Bola untuk menunjukkan kelompoknya.',
      duration_minutes:4, icon:'🎨', accent:'violet', action:'group_builder', action_label:'Buka Pembagi Kelompok', media_url:'', is_active:true,
      suggested_groups:['Screen Time','Screen Zone','Screen Break'],
      student_tasks:[{content_id:'D-09',title:'Kampanye 3S',type:'group'}],
      teacher_message:'Perhatikan pembagian kelompok dan tugas kampanye 3S.'
    },
    {
      content_id:'P-D9', session_id:'DIGI-WED', display_order:9,
      activity:'KEGIATAN 3', activity_title:'Kampanye 3S: Screen Time, Screen Zone, Screen Break',
      type:'group_task', template:'poster_workshop', title:'Lokakarya Poster Kampanye 3S',
      body:'Setiap kelompok membuat poster sesuai misinya. Kelompok Screen Time membuat aturan waktu layar. Kelompok Screen Zone membuat aturan tempat dan situasi penggunaan gawai. Kelompok Screen Break membuat daftar kegiatan bermakna selain menatap layar.',
      duration_minutes:10, icon:'🖍️', accent:'orange', action:'poster_workshop', action_label:'Mulai Lokakarya Poster', media_url:'', is_active:true,
      materials:['Kertas karton','Pensil warna, spidol, atau crayon','Selotip atau perekat kertas'],
      poster_steps:['Tentukan pesan utama.','Tuliskan 3–5 contoh tindakan nyata.','Buat judul dan gambar yang mudah dibaca.','Pastikan seluruh anggota mendapat peran.'],
      student_tasks:[{content_id:'D-09',title:'Kampanye 3S',type:'group'}],
      teacher_message:'Kerjakan poster sesuai kelompok. Pastikan semua anggota mendapat peran.'
    },
    {
      content_id:'P-D10', session_id:'DIGI-WED', display_order:10,
      activity:'KEGIATAN 3', activity_title:'Kampanye 3S: Screen Time, Screen Zone, Screen Break',
      type:'presentation', template:'group_presentations', title:'Presentasi Poster di Depan Kelas',
      body:'Masing-masing kelompok mempresentasikan posternya. Kelompok lain mendengarkan, memberi satu apresiasi, dan satu saran perbaikan. Guru menegaskan kembali pesan inti dari setiap prinsip 3S.',
      duration_minutes:7, icon:'🎤', accent:'green', action:'group_presentations', action_label:'Mulai Presentasi Kelompok', media_url:'', is_active:true,
      presentation_prompts:['Apa aturan utama kelompok kalian?','Mengapa aturan itu penting?','Contoh penerapannya di rumah atau sekolah?','Apa tantangan yang mungkin muncul dan bagaimana mengatasinya?'],
      student_tasks:[{content_id:'D-10',title:'Galeri Kampanye',type:'presentation'}],
      teacher_message:'Simak presentasi kelompok dan siapkan satu apresiasi serta satu saran.'
    },
    {
      content_id:'P-D11', session_id:'DIGI-WED', display_order:11,
      activity:'PENUTUP', activity_title:'Pesan Moral dan Penguatan',
      type:'closing', template:'moral_closing', title:'Jadilah Pengguna Digital yang Cerdas dan Berani',
      body:'Teknologi seharusnya membantu kita belajar dan bertumbuh, bukan mengendalikan hidup kita. Tawaran uang instan dapat menjadi jebakan. Mengatur waktu, tempat, dan jeda layar adalah bentuk menjaga diri. Ketika menghadapi masalah digital, berani berkata tidak dan meminta bantuan adalah kemenangan sejati.',
      duration_minutes:2, icon:'🌟', accent:'green', action:'moral_closing', action_label:'Tampilkan Pesan Penguatan', media_url:'', is_active:true,
      student_tasks:[{content_id:'D-11',title:'Komitmen Digital Sehat',type:'reflection'}],
      teacher_message:'Isi komitmen digital sehat setelah pesan penguatan selesai.',
      morals:[
        'Tidak semua yang menarik di internet aman untuk diikuti.',
        'Uang instan dan bonus besar dapat menjadi pintu masuk jebakan.',
        'Screen Time, Screen Zone, dan Screen Break membantu menjaga kesehatan, belajar, dan hubungan dengan orang lain.',
        'Berani menolak, berhenti, dan meminta bantuan adalah tindakan yang kuat.',
        'Kemenangan sejati adalah mampu mengendalikan pilihan dan menjaga masa depan.'
      ]
    }
  ];


  const curriculumPresentation = [
  {
    "content_id": "P-C1",
    "session_id": "CURR-THU",
    "display_order": 1,
    "activity": "KEGIATAN 1",
    "activity_title": "Mengenal Mata Pelajaran Wajib, Pilihan, Kokurikuler, dan Ekstrakurikuler",
    "type": "presentation",
    "template": "curriculum_opening",
    "title": "Kurikulum adalah Peta Perjalanan Belajar",
    "body": "Sesi ini membantu murid baru memahami peta belajar di SMP Negeri 38 Maluku Tengah: apa yang dipelajari, siapa yang mendampingi, kegiatan pengembangan diri yang tersedia, dan cara merencanakan perjalanan belajar.",
    "duration_minutes": 2,
    "icon": "🧭",
    "accent": "violet",
    "action": "none",
    "action_label": "",
    "media_url": "",
    "is_active": true,
    "route": [
      {
        "icon": "📚",
        "title": "Kenali Kurikulum",
        "text": "Mata pelajaran, guru pengampu, kokurikuler, dan ekstrakurikuler."
      },
      {
        "icon": "🔥",
        "title": "Temukan Motivasi",
        "text": "Kenali alasan belajar dan buat tujuan pribadi."
      },
      {
        "icon": "🛠️",
        "title": "Pilih Strategi",
        "text": "Gabungkan cara belajar sesuai tujuan dan materi."
      },
      {
        "icon": "🧗",
        "title": "Hadapi Tantangan",
        "text": "Refleksi, minta bantuan, dan coba langkah berikutnya."
      }
    ],
    "student_tasks": [
      {
        "content_id": "C-01",
        "title": "Peta Belajar di SMP",
        "type": "view"
      }
    ],
    "teacher_message": "Buka Peta Belajar di SMP dan simak pengantar guru.",
    "teacher_cue": "Sampaikan bahwa kurikulum bukan sekadar daftar pelajaran, melainkan keseluruhan pengalaman belajar dan pengembangan murid."
  },
  {
    "content_id": "P-C2",
    "session_id": "CURR-THU",
    "display_order": 2,
    "activity": "KEGIATAN 1",
    "activity_title": "Mengenal Mata Pelajaran Wajib, Pilihan, Kokurikuler, dan Ekstrakurikuler",
    "type": "presentation",
    "template": "school_welcome",
    "title": "Kenali SMP Negeri 38 Maluku Tengah",
    "body": "Sekolah adalah lingkungan belajar bersama. Kepala sekolah memimpin pengelolaan sekolah, guru mendampingi proses belajar, dan setiap murid ikut menjaga suasana yang aman, tertib, ramah, serta saling menghargai.",
    "duration_minutes": 2,
    "icon": "🏫",
    "accent": "blue",
    "action": "school_directory",
    "action_label": "Buka Profil Sekolah dan Direktori",
    "media_url": "",
    "is_active": true,
    "principal": {
      "name": "LINJIE C. PATTY, S.Pd., M.Si",
      "role": "Kepala Sekolah"
    },
    "student_tasks": [
      {
        "content_id": "C-02",
        "title": "Kenali Sekolah dan Kepala Sekolah",
        "type": "view"
      }
    ],
    "teacher_message": "Kenali sekolah dan kepala sekolah. Tetap di tahap ini sampai guru melanjutkan.",
    "teacher_cue": "Perkenalkan kepala sekolah dengan hormat. Tekankan bahwa semua warga sekolah saling bekerja sama untuk mendukung perkembangan murid."
  },
  {
    "content_id": "P-C3",
    "session_id": "CURR-THU",
    "display_order": 3,
    "activity": "KEGIATAN 1",
    "activity_title": "Mengenal Mata Pelajaran Wajib, Pilihan, Kokurikuler, dan Ekstrakurikuler",
    "type": "presentation",
    "template": "school_directory",
    "title": "Mata Pelajaran dan Guru Pengampu",
    "body": "Berdasarkan jadwal Semester Genap TP 2025/2026, sekolah memiliki dua belas kelompok mata pelajaran. Klik direktori untuk melihat guru pengampu setiap mata pelajaran dan jenjang kelas yang didampingi.",
    "duration_minutes": 4,
    "icon": "📚",
    "accent": "cyan",
    "action": "school_directory",
    "action_label": "Tampilkan Direktori Lengkap",
    "media_url": "",
    "is_active": true,
    "student_tasks": [
      {
        "content_id": "C-03",
        "title": "Mata Pelajaran dan Guru Pengampu",
        "type": "view"
      }
    ],
    "teacher_message": "Buka direktori mata pelajaran di HP dan kenali guru pengampunya.",
    "teacher_cue": "Tidak perlu membacakan seluruh nama satu per satu. Tampilkan berdasarkan mata pelajaran, lalu beri kesempatan murid bertanya tentang pelajaran yang belum mereka kenal."
  },
  {
    "content_id": "P-C3Q",
    "session_id": "CURR-THU",
    "display_order": 4,
    "activity": "KEGIATAN 1",
    "activity_title": "Mengenal Mata Pelajaran Wajib, Pilihan, Kokurikuler, dan Ekstrakurikuler",
    "type": "activity",
    "template": "directory_quiz_bridge",
    "title": "Tantangan Cepat: Kenal Mapel & Guru",
    "body": "Sekarang saatnya memastikan kita sudah mengenal beberapa mata pelajaran, kepala sekolah, dan guru pengampu. Quiz ini singkat. Baca setiap soal dengan teliti, pilih jawaban, pelajari penguatannya, lalu tunggu arahan guru setelah selesai.",
    "duration_minutes": 4,
    "icon": "🧠",
    "accent": "violet",
    "action": "quiz:school_directory",
    "action_label": "Simulasi Quiz Kenal Mapel & Guru",
    "media_url": "",
    "is_active": true,
    "student_tasks": [
      {
        "content_id": "C-03Q",
        "title": "Quiz Kenal Mata Pelajaran & Guru",
        "type": "quiz"
      }
    ],
    "teacher_message": "Kerjakan Quiz Kenal Mata Pelajaran & Guru sekarang. Setelah selesai, tetap tunggu arahan guru.",
    "teacher_cue": "Buka quiz pada HP siswa melalui panel Sinkron Kelas. Pantau jumlah yang membuka dan selesai. Setelah quiz, beri penguatan bahwa daftar guru mengikuti jadwal referensi dan dapat diperbarui bila ada pembagian tugas baru."
  },
  {
    "content_id": "P-C4",
    "session_id": "CURR-THU",
    "display_order": 5,
    "activity": "KEGIATAN 1",
    "activity_title": "Mengenal Mata Pelajaran Wajib, Pilihan, Kokurikuler, dan Ekstrakurikuler",
    "type": "activity",
    "template": "curriculum_structure",
    "title": "Wajib, Pilihan, Kokurikuler, dan Ekstrakurikuler",
    "body": "Mata pelajaran wajib membangun kompetensi dasar. Mata pelajaran pilihan—bila tersedia—memberi ruang sesuai minat. Kokurikuler memperkuat pembelajaran melalui pengalaman nyata. Ekstrakurikuler membantu mengembangkan minat, bakat, kepemimpinan, kesehatan, dan kebersamaan.",
    "duration_minutes": 2,
    "icon": "🗺️",
    "accent": "green",
    "action": "quiz:curriculum_map",
    "action_label": "Simulasi Quiz Peta Kurikulum",
    "media_url": "",
    "is_active": true,
    "examples": [
      {
        "label": "Mata Pelajaran",
        "items": "Agama, Pancasila, Bahasa Indonesia, Matematika, IPA, IPS, Bahasa Inggris, Seni & Prakarya, PJOK, Informatika, BK, Koding/Mulok"
      },
      {
        "label": "Penguatan Jadwal",
        "items": "Literasi, Numerasi, Kokurikuler, Pembinaan Rohani"
      },
      {
        "label": "Pengembangan Diri",
        "items": "Pramuka dan kegiatan sekolah lain sesuai program resmi"
      }
    ],
    "student_tasks": [
      {
        "content_id": "C-04",
        "title": "Quiz Peta Kurikulum",
        "type": "quiz"
      }
    ],
    "teacher_message": "Kerjakan Quiz Peta Kurikulum sekarang. Setelah selesai, tunggu arahan guru.",
    "teacher_cue": "Buka quiz pada HP siswa melalui panel Sinkron Kelas. Pantau jumlah siswa yang membuka dan menyelesaikan."
  },
  {
    "content_id": "P-C5",
    "session_id": "CURR-THU",
    "display_order": 6,
    "activity": "KEGIATAN 2",
    "activity_title": "Mengenal Diri dan Membangkitkan Motivasi Murid",
    "type": "discussion",
    "template": "motivation_compass",
    "title": "Motivasi dari Dalam dan dari Luar",
    "body": "Motivasi intrinsik berasal dari dalam diri, seperti rasa ingin tahu, minat, makna, dan keinginan berkembang. Motivasi ekstrinsik berasal dari luar, seperti nilai, hadiah, pujian, atau kompetisi. Keduanya dapat membantu, tetapi tujuan pribadi yang bermakna membuat semangat lebih tahan lama.",
    "duration_minutes": 4,
    "icon": "🔥",
    "accent": "orange",
    "action": "guided_curriculum_prompts",
    "action_label": "Mulai Tanya Jawab Motivasi",
    "media_url": "",
    "is_active": true,
    "prompts": [
      {
        "id": "MOT-ORAL-01",
        "question": "Apa perbedaan motivasi intrinsik dan motivasi ekstrinsik?",
        "answer": "Motivasi intrinsik muncul dari dalam diri, seperti minat dan rasa ingin tahu. Motivasi ekstrinsik datang dari luar, seperti nilai, hadiah, pujian, atau kompetisi."
      },
      {
        "id": "MOT-ORAL-02",
        "question": "Berikan contoh kegiatan belajar yang kamu lakukan karena benar-benar tertarik.",
        "answer": "Jawaban dapat berupa membaca, berlatih, menulis, bereksperimen, atau mempelajari sesuatu karena penasaran dan ingin berkembang, bukan semata-mata karena hadiah."
      },
      {
        "id": "MOT-ORAL-03",
        "question": "Bagaimana cara membuat semangat belajar lebih bertahan lama?",
        "answer": "Hubungkan belajar dengan tujuan pribadi yang bermakna, pilih langkah kecil yang realistis, pantau kemajuan, dan minta dukungan ketika diperlukan."
      }
    ],
    "student_tasks": [
      {
        "content_id": "C-05",
        "title": "Detektif Motivasi",
        "type": "quiz"
      }
    ],
    "teacher_message": "Kerjakan Detektif Motivasi setelah tanya jawab kelas selesai.",
    "teacher_cue": "Pilih 2–3 murid untuk memberi contoh. Nilai kualitas alasan melalui tombol Cukup, Baik, atau Baik Sekali."
  },
  {
    "content_id": "P-C6",
    "session_id": "CURR-THU",
    "display_order": 7,
    "activity": "KEGIATAN 2",
    "activity_title": "Mengenal Diri dan Membangkitkan Motivasi Murid",
    "type": "activity",
    "template": "goal_model",
    "title": "Susun Tujuan Belajar Pribadi",
    "body": "Tujuan yang baik tidak harus besar. Tujuan perlu jelas, realistis, dapat dilakukan, dan dapat diperiksa kembali. Gunakan pola: apa yang ingin diperbaiki, mengapa penting, dan langkah kecil apa yang akan dilakukan.",
    "duration_minutes": 6,
    "icon": "🎯",
    "accent": "pink",
    "action": "goal_builder",
    "action_label": "Buat Contoh Kartu Tujuan",
    "media_url": "",
    "is_active": true,
    "student_tasks": [
      {
        "content_id": "C-06",
        "title": "Kartu Tujuan Belajar",
        "type": "activity"
      }
    ],
    "teacher_message": "Buat Kartu Tujuan Belajar pribadi. Simpan atau tuliskan kembali hasilnya.",
    "teacher_cue": "Berikan contoh tujuan yang terukur dan realistis. Hindari tujuan seperti “harus sempurna”."
  },
  {
    "content_id": "P-C7",
    "session_id": "CURR-THU",
    "display_order": 8,
    "activity": "KEGIATAN 3",
    "activity_title": "Teknik dan Strategi Belajar Efektif",
    "type": "activity",
    "template": "learning_preferences",
    "title": "Preferensi Belajar adalah Petunjuk, Bukan Label",
    "body": "Murid dapat terbantu dengan mendengar, melihat, membaca, menulis, berdiskusi, atau mencoba langsung. Jawaban tiga pertanyaan hanya membantu mengenali kecenderungan awal. Murid tidak boleh dikelompokkan atau dibatasi hanya berdasarkan satu hasil.",
    "duration_minutes": 4,
    "icon": "🧠",
    "accent": "violet",
    "action": "preference_quiz",
    "action_label": "Simulasi Cek Preferensi",
    "media_url": "",
    "is_active": true,
    "student_tasks": [
      {
        "content_id": "C-07",
        "title": "Cek Preferensi Belajar",
        "type": "activity"
      }
    ],
    "teacher_message": "Jawab tiga pertanyaan preferensi belajar. Hasilnya bukan label tetap.",
    "teacher_cue": "Tegaskan catatan pada materi: hasil tidak dapat menjadi satu-satunya acuan pengelompokan gaya belajar."
  },
  {
    "content_id": "P-C8",
    "session_id": "CURR-THU",
    "display_order": 9,
    "activity": "KEGIATAN 3",
    "activity_title": "Teknik dan Strategi Belajar Efektif",
    "type": "activity",
    "template": "study_strategy_lab",
    "title": "Laboratorium Strategi Belajar",
    "body": "Strategi belajar harus disesuaikan dengan tujuan dan materi. Murid dapat menggabungkan penjelasan lisan, gambar, catatan, diskusi, latihan dari ingatan, praktik langsung, pengulangan berkala, dan pengaturan lingkungan belajar.",
    "duration_minutes": 11,
    "icon": "🛠️",
    "accent": "cyan",
    "action": "quiz:study_strategy",
    "action_label": "Simulasi Tantangan Strategi",
    "media_url": "",
    "is_active": true,
    "strategies": [
      {
        "icon": "🧩",
        "title": "Pecah Tugas",
        "text": "Ubah tugas besar menjadi langkah kecil dan mulai dari langkah pertama."
      },
      {
        "icon": "🧠",
        "title": "Ambil dari Ingatan",
        "text": "Tutup buku lalu jelaskan inti materi tanpa melihat."
      },
      {
        "icon": "📆",
        "title": "Ulang Berkala",
        "text": "Belajar kembali pada hari yang berbeda, bukan sekaligus."
      },
      {
        "icon": "🖼️",
        "title": "Buat Hubungan",
        "text": "Gunakan gambar, contoh, peta konsep, atau pengalaman nyata."
      },
      {
        "icon": "❓",
        "title": "Bertanya",
        "text": "Tandai bagian yang belum dipahami dan cari bantuan."
      },
      {
        "icon": "🔕",
        "title": "Kurangi Gangguan",
        "text": "Atur tempat, waktu, dan perangkat agar fokus lebih mudah."
      }
    ],
    "student_tasks": [
      {
        "content_id": "C-08",
        "title": "Tantangan Strategi Belajar",
        "type": "quiz"
      }
    ],
    "teacher_message": "Pelajari strategi belajar lalu kerjakan tantangan pada HP.",
    "teacher_cue": "Setelah quiz, minta beberapa murid menyebutkan strategi yang akan mereka coba pada mata pelajaran tertentu."
  },
  {
    "content_id": "P-C9",
    "session_id": "CURR-THU",
    "display_order": 10,
    "activity": "KEGIATAN 4",
    "activity_title": "Mengatasi Tantangan Belajar dan Refleksi",
    "type": "scenario",
    "template": "challenge_clinic",
    "title": "Klinik Tantangan Belajar",
    "body": "Tantangan belajar dapat dihadapi dengan keterampilan berpikir kritis dan pemecahan masalah. Jangan langsung memberi label “saya tidak mampu”. Kenali masalahnya, pilih langkah, coba, minta bantuan, lalu evaluasi.",
    "duration_minutes": 5,
    "icon": "🧗",
    "accent": "red",
    "action": "quiz:curriculum_challenge",
    "action_label": "Simulasi Pecahkan Skenario",
    "media_url": "",
    "is_active": true,
    "student_tasks": [
      {
        "content_id": "C-09",
        "title": "Pecahkan Skenario Belajar",
        "type": "quiz"
      }
    ],
    "teacher_message": "Pecahkan skenario tantangan belajar dan pilih tindakan yang paling bertanggung jawab.",
    "teacher_cue": "Tekankan pola pikir berkembang: kegagalan adalah informasi untuk memperbaiki strategi, bukan akhir kemampuan."
  },
  {
    "content_id": "P-C10",
    "session_id": "CURR-THU",
    "display_order": 11,
    "activity": "KEGIATAN 4",
    "activity_title": "Mengatasi Tantangan Belajar dan Refleksi",
    "type": "reflection",
    "template": "reflection_3m1l",
    "title": "Refleksi 3M + 1L",
    "body": "Ajak murid mengevaluasi diri secara jujur: apa yang dipahami, apa yang masih mengganjal, bagian yang menarik atau sulit, dan langkah selanjutnya. Refleksi bukan mencari kesalahan, melainkan menentukan perbaikan.",
    "duration_minutes": 4,
    "icon": "🪞",
    "accent": "green",
    "action": "reflection",
    "action_label": "Tampilkan Pertanyaan Refleksi",
    "media_url": "",
    "is_active": true,
    "student_tasks": [
      {
        "content_id": "C-10",
        "title": "Refleksi 3M + 1L",
        "type": "reflection"
      }
    ],
    "teacher_message": "Isi Refleksi 3M + 1L. Jawaban membantu kamu menentukan langkah belajar berikutnya.",
    "teacher_cue": "Murid dengan HP mengirim refleksi melalui aplikasi. Murid tanpa HP dapat menulis pada kertas HVS atau dicatat guru."
  },
  {
    "content_id": "P-C11",
    "session_id": "CURR-THU",
    "display_order": 12,
    "activity": "KEGIATAN 4 · PENUTUP",
    "activity_title": "Mengatasi Tantangan Belajar dan Refleksi",
    "type": "closing",
    "template": "curriculum_closing",
    "title": "Saya Siap Menjadi Pelajar Tangguh",
    "body": "Belajar adalah perjalanan. Murid tidak harus langsung mahir, tetapi perlu berani mencoba, jujur mengevaluasi diri, menggunakan strategi yang tepat, meminta bantuan, dan terus memperbaiki langkah.",
    "duration_minutes": 1,
    "icon": "🌟",
    "accent": "orange",
    "action": "curriculum_closing",
    "action_label": "Tampilkan Komitmen Pelajar",
    "media_url": "",
    "is_active": true,
    "student_tasks": [
      {
        "content_id": "C-11",
        "title": "Komitmen Pelajar Tangguh",
        "type": "view"
      }
    ],
    "teacher_message": "Baca pesan penutup dan komitmen pelajar tangguh bersama-sama.",
    "morals": [
      "Kurikulum adalah peta, tetapi muridlah yang menjalani perjalanannya.",
      "Motivasi yang kuat tumbuh ketika belajar mempunyai tujuan dan makna.",
      "Tidak ada satu cara belajar yang paling benar untuk semua materi.",
      "Kesulitan adalah tanda untuk mencoba strategi lain dan meminta bantuan.",
      "Kemajuan kecil yang dilakukan konsisten akan menghasilkan perubahan besar."
    ]
  }
];

  window.MPLS_PRESENTATION_DATA = Object.freeze({
    version:'1.10.0',
    sessions:{
      'DIGI-WED':{
        session_id:'DIGI-WED', day_label:'Rabu', title:'Literasi Digital',
        subtitle:'Pencegahan Judi Online dan Kampanye 3S', duration_minutes:60,
        icon:'🛡️', accent:'cyan', display_order:1, is_active:true,
        objectives:'Mengenali bahaya judi online, berani mencari bantuan, dan menerapkan Screen Time, Screen Zone, serta Screen Break.'
      },
      'CURR-THU':{
        session_id:'CURR-THU', day_label:'Kamis', title:'Pengenalan Kurikulum',
        subtitle:'Peta Belajar, Motivasi, Strategi, dan Ketangguhan', duration_minutes:45,
        icon:'🧭', accent:'violet', display_order:2, is_active:true,
        objectives:'Mengenal kurikulum dan warga sekolah, membangun motivasi, memilih strategi belajar, serta menghadapi tantangan secara mandiri dan bertanggung jawab.'
      }
    },
    content:{'DIGI-WED':digitalPresentation,'CURR-THU':curriculumPresentation}
  });
})();
