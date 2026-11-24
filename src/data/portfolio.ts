// Portfolio content — single source of truth (PRD FR-03).
// All profile data below comes from the owner's real CV
// (DAFTAR_RIWAYAT_HIDUP.pdf, confirmed by the owner on 2026-11-24)
// and from real projects built together with the owner.
// Do not add invented projects, links, wallet addresses, or credentials.

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: "Web3" | "FullStack" | "Mobile";
  summary: string;
  description: string;
  thumbnailIpfsHash: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  contractAddress?: `0x${string}`;
  chainId?: number;
  featured: boolean;
  caseStudy?: {
    problem: string;
    architecture: string;
    solution: string;
  };
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | "Present";
  highlights: string[];
  technologies: string[];
}

export interface SkillCategory {
  category: string;
  items: {
    name: string;
    icon: string;
    proficiency: "Core" | "Advanced" | "Familiar";
  }[];
}

export interface Education {
  id: string;
  title: string;
  institution: string;
  period: string;
  note?: string;
}

export const profile = {
  name: "Yuga Adi Kusuma",
  role: "Full Stack Developer",
  location: "Jombang, Jawa Timur, Indonesia",
  email: "yogaadikusuma9@gmail.com",
  phone: "+62 812-1735-1613",
  bio: "Programmer dengan pengalaman kurang lebih 4 tahun dalam pengembangan web full stack. Menguasai beberapa bahasa pemrograman dan manajemen database, dan saat ini bekerja sebagai IT Developer dengan fokus pada sistem data berbasis PostgreSQL.",
  languages: ["Bahasa Indonesia"],
  socials: {
    github: "https://github.com/yoga777",
    // LinkedIn / X are not documented in the owner's CV, so they are left unset
    // and hidden in the UI rather than filled with guessed URLs.
    linkedin: undefined as string | undefined,
    twitter: undefined as string | undefined,
  },
  // Owner's Web3 identity is not set yet: no ENS name and no owner wallet
  // address have been provided, so verification UI stays hidden until real
  // values are configured.
  ensName: undefined as string | undefined,
  ownerWallet: undefined as `0x${string}` | undefined,
  // IPFS CID of the CV file — set via NEXT_PUBLIC_CV_IPFS_CID once uploaded to IPFS.
  cvIpfsCid: process.env.NEXT_PUBLIC_CV_IPFS_CID || undefined,
};

export const skillCategories: SkillCategory[] = [
  {
    category: "Frontend",
    items: [
      { name: "HTML", icon: "🌐", proficiency: "Core" },
      { name: "CSS", icon: "🎨", proficiency: "Core" },
      { name: "JavaScript", icon: "🟨", proficiency: "Advanced" },
      { name: "Flutter", icon: "📱", proficiency: "Familiar" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "PHP", icon: "🐘", proficiency: "Advanced" },
      { name: "Python", icon: "🐍", proficiency: "Advanced" },
      { name: "Fullstack Web Development", icon: "🧩", proficiency: "Core" },
    ],
  },
  {
    category: "Database & Infra",
    items: [
      { name: "PostgreSQL", icon: "🐘", proficiency: "Advanced" },
      { name: "Database Management", icon: "🗄️", proficiency: "Core" },
    ],
  },
  {
    // Honest level: Web3/Solidity is not part of the owner's documented CV
    // experience yet, so it is listed as Familiar only.
    category: "Web3 / Smart Contract",
    items: [
      { name: "Solidity", icon: "⬡", proficiency: "Familiar" },
      { name: "Web3 / dApp Development", icon: "🔗", proficiency: "Familiar" },
    ],
  },
];

export const experiences: Experience[] = [
  {
    id: "nusantara-jaya-raya-mujur",
    role: "IT Developer",
    company: "PT Nusantara Jaya Raya Mujur",
    location: "Indonesia",
    startDate: "Feb 2025",
    endDate: "Present",
    highlights: [
      "Mengembangkan dan memelihara sistem data internal berbasis PostgreSQL, termasuk sistem perjalanan dinas (lihat proyek Sistem Perjalanan Dinas).",
    ],
    technologies: ["PostgreSQL", "PHP", "JavaScript"],
  },
  {
    id: "educa-sisfomedia",
    role: "Full Stack Developer",
    company: "PT Educa Sisfomedia Indonesia",
    location: "Indonesia",
    startDate: "Jan 2023",
    endDate: "Jan 2025",
    highlights: [
      "Mengembangkan aplikasi web full stack dari sisi frontend hingga backend dan database.",
    ],
    technologies: ["PHP", "JavaScript", "Python", "HTML", "CSS"],
  },
  {
    id: "indomarco-prismatama",
    role: "Senior Store Leader",
    company: "Indomarco Prismatama",
    location: "Indonesia",
    startDate: "Nov 2016",
    endDate: "Oct 2022",
    highlights: [
      "Memimpin operasional toko ritel sebagai Senior Store Leader selama kurang lebih 6 tahun sebelum beralih ke bidang pemrograman.",
    ],
    technologies: [],
  },
];

export const education: Education[] = [
  {
    id: "unhasy-tebuireng",
    title: "S1 Teknik Informatika",
    institution: "Universitas Hasyim Asy'ari Tebuireng Jombang",
    period: "2017 – 2022",
    note: "Lulus tahun 2022.",
  },
  {
    id: "gamelab-bootcamp",
    title: "Sertifikat Bootcamp",
    institution: "Gamelab Indonesia",
    period: "Des 2022",
  },
];

export const projects: Project[] = [
  {
    id: "auto-clipper",
    title: "Auto-Clipper & YouTube Uploader",
    slug: "auto-clipper-youtube-uploader",
    category: "FullStack",
    summary:
      "Aplikasi web yang otomatis memotong video panjang menjadi klip pendek berpotensi viral dan mengunggahnya ke YouTube.",
    description:
      "Pipeline otomatis: unduh video, transkripsi AI (faster-whisper), virality scoring, auto-reframe 9:16 dan auto-caption, pembuatan metadata, lalu unggah terjadwal ke YouTube lewat YouTube Data API v3 (OAuth 2.0) dengan mode Full-Auto atau Approval. Catatan: aplikasi live bersifat login-protected (memerlukan login admin), jadi tautan demo tidak terbuka untuk publik.",
    thumbnailIpfsHash: "",
    techStack: ["Python", "FastAPI", "faster-whisper", "FFmpeg", "YouTube Data API v3", "SQLite"],
    liveUrl: "https://it-nusantara.tail11fa06.ts.net",
    featured: true,
    caseStudy: {
      problem:
        "Membuat klip Shorts dari video panjang secara manual memakan waktu: mencari momen menarik, memotong, memberi caption, dan mengunggah satu per satu.",
      architecture:
        "Backend FastAPI + SQLite dengan worker antrean job per tahap (unduh → transkrip → skor viralitas → render FFmpeg → unggah), token OAuth YouTube terenkripsi, dan frontend tanpa build step dengan progres per tahap + ETA.",
      solution:
        "Video 1 jam diproses menjadi beberapa klip siap unggah dengan mode Full-Auto atau Approval, lengkap dengan anti-duplikat URL/file, tombol stop antrean, dan proses ulang dari log.",
    },
  },
  {
    id: "lowongan-it",
    title: "Lowongan IT Seluruh Indonesia",
    slug: "lowongan-it-indonesia",
    category: "FullStack",
    summary:
      "Situs lowongan IT seluruh Indonesia dengan data lowongan individual asli yang diperbarui otomatis setiap jam.",
    description:
      "Situs statis di GitHub Pages yang menampilkan lowongan IT dari API pencarian publik Jobstreet/SEEK (klasifikasi Teknologi Informasi) per kota, dilengkapi filter lokasi (termasuk pencarian kota/kabupaten dari API wilayah Indonesia), filter gaji minimum, tipe pekerjaan, dan pagination. Data diperbarui otomatis tiap jam lewat GitHub Actions.",
    thumbnailIpfsHash: "",
    techStack: ["HTML", "CSS", "JavaScript", "Python", "GitHub Actions", "GitHub Pages"],
    liveUrl: "https://yoga777.github.io/lowongan-it-surabaya-sidoarjo/",
    githubUrl: "https://github.com/yoga777/lowongan-it-surabaya-sidoarjo",
    featured: true,
    caseStudy: {
      problem:
        "Hasil pencarian lowongan dari mesin pencari kebanyakan berupa halaman daftar portal, bukan lowongan individual, dan sering tercampur lowongan non-IT.",
      architecture:
        "Script Python (scripts/update_jobs.py) mengambil data dari API Jobstreet/SEEK per kota, menormalisasi gaji dan tipe pekerjaan, menyaring relevansi peran IT dua lapis, lalu menulis data/jobs.json yang dirender situs statis.",
      solution:
        "Workflow GitHub Actions berjalan tiap jam: data live selalu berupa lowongan individual asli dengan perusahaan, label waktu posting, dan tautan detail yang valid.",
    },
  },
  {
    id: "sistem-perjalanan-dinas",
    title: "Sistem Perjalanan Dinas",
    slug: "sistem-perjalanan-dinas",
    category: "FullStack",
    summary:
      "Sistem data perjalanan dinas berbasis PostgreSQL dengan view terpadu dari tabel transaksi dan master.",
    description:
      "Sistem pengelolaan data perjalanan dinas (sistem internal perusahaan, tidak ada tautan publik). Inti datanya adalah view PostgreSQL sc_trx.v_dinas di atas tabel sc_trx.dinas yang di-join ke tabel master sc_mst (karyawan, departemen, subdepartemen, jabatan, trxtype, kategori, destination_type, kotakab). View ini dioptimasi agar query data dinas tetap cepat.",
    thumbnailIpfsHash: "",
    techStack: ["PostgreSQL", "SQL"],
    featured: false,
    caseStudy: {
      problem:
        "Data perjalanan dinas tersebar di tabel transaksi dan banyak tabel master, sehingga query laporan menjadi berat dan lambat.",
      architecture:
        "Satu view terpadu sc_trx.v_dinas menggabungkan sc_trx.dinas dengan seluruh tabel master sc_mst yang relevan.",
      solution:
        "Query view dioptimasi (struktur join dan pemilihan kolom) sehingga pengambilan data dinas untuk kebutuhan laporan menjadi jauh lebih efisien.",
    },
  },
];
