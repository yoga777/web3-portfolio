# Web3 Decentralized Developer Portfolio

Portofolio personal berbasis Web3 milik **Yuga Adi Kusuma** (Full Stack Developer, Jombang) —
dibangun sesuai PRD `web3_portfolio_prd.md` v1.1: Next.js 15 (App Router, TypeScript strict),
Tailwind CSS v4, wagmi v2 + viem + RainbowKit, React Query, Framer Motion, dan smart contract
`PortfolioRegistry.sol` (Solidity ^0.8.24) untuk guestbook on-chain + endorsement skill.

Semua data profil, skill, pengalaman, dan proyek di `src/data/portfolio.ts` adalah data asli
pemilik (dari CV `DAFTAR_RIWAYAT_HIDUP.pdf` dan proyek nyata). Tidak ada proyek, tautan,
alamat wallet, ENS, atau kredensial karangan.

## Status saat ini

- ✅ Website selesai dan lolos `npm run build`.
- ⏳ **Smart contract BELUM di-deploy.** `NEXT_PUBLIC_CONTRACT_ADDRESS` masih alamat nol,
  sehingga tombol Endorse Skill dan form Guestbook menampilkan status jujur
  "Smart contract belum di-deploy" dan nonaktif. Ikuti langkah deploy kontrak di bawah
  untuk mengaktifkannya.
- ⏳ ENS name, alamat wallet pemilik, dan CID IPFS untuk CV belum diisi (belum ada nilainya),
  jadi badge verifikasi on-chain, tautan Etherscan pemilik, dan tombol "Download CV (IPFS)"
  sengaja disembunyikan sampai nilai aslinya tersedia.

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env.local   # isi nilai yang sudah kamu punya
npm run dev                  # http://localhost:3000
npm run build && npm start   # mode produksi
```

## Environment variables

| Variable | Wajib? | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Untuk deploy publik | Project ID gratis dari [Reown Cloud](https://cloud.reown.com). Tanpa ini, WalletConnect tidak bekerja di produksi (build lokal tetap jalan dengan placeholder). |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Opsional | API key Alchemy (free tier) untuk RPC Base yang lebih stabil. Kosong = public RPC. |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Setelah kontrak di-deploy | Alamat `PortfolioRegistry` hasil deploy. Default alamat nol = fitur on-chain nonaktif. |
| `NEXT_PUBLIC_CHAIN_ID` | Ya | `84532` = Base Sepolia (testnet), `8453` = Base Mainnet. |
| `NEXT_PUBLIC_BUILD_IPFS_CID` | Opsional | CID IPFS build saat ini, ditampilkan di footer. |
| `NEXT_PUBLIC_CV_IPFS_CID` | Opsional | CID file CV di IPFS (mis. lewat Pinata free tier), mengaktifkan tombol Download CV (IPFS) di hero. |

## Deploy smart contract ke Base Sepolia (Foundry)

1. Install Foundry: `curl -L https://foundry.paradigm.xyz | bash && foundryup`
2. Siapkan wallet testnet dan isi ETH Base Sepolia dari faucet
   (mis. https://www.alchemy.com/faucets/base-sepolia).
3. Compile & test:
   ```bash
   forge build --contracts contracts/PortfolioRegistry.sol  # atau salin ke project Foundry
   forge test
   ```
   Alternatif tanpa Foundry: buka `contracts/PortfolioRegistry.sol` di
   [Remix](https://remix.ethereum.org), compile dengan Solidity 0.8.24, lalu deploy
   dengan Injected Provider (MetaMask di jaringan Base Sepolia).
4. Deploy:
   ```bash
   forge create contracts/PortfolioRegistry.sol:PortfolioRegistry \
     --rpc-url https://sepolia.base.org \
     --private-key <PRIVATE_KEY_WALLET_DEPLOYER>
   ```
   (Jangan pernah membagikan/commit private key. Gunakan wallet khusus deploy.)
5. Salin alamat kontrak hasil deploy ke `.env.local` / env Vercel:
   `NEXT_PUBLIC_CONTRACT_ADDRESS=0x...`, lalu build ulang.
6. Verifikasi opsional di https://sepolia.basescan.org (Contract → Verify and Publish).

Untuk mainnet: ulangi langkah yang sama dengan RPC Base Mainnet (`https://mainnet.base.org`),
`NEXT_PUBLIC_CHAIN_ID=8453`, dan ETH asli untuk gas.

ABI di `src/contracts/abi.ts` sudah sesuai dengan `PortfolioRegistry.sol`
(`signGuestbook` payable maks 280 karakter + event `NewGuestbookEntry`,
`endorseSkill` satu kali per wallet per skill, `getGuestbookEntries`).

## Deploy website ke Vercel (gratis, Hobby tier)

1. Push repo ini ke GitHub (manual oleh pemilik repo).
2. Di Vercel: **Add New → Project → Import** repo tersebut (framework terdeteksi Next.js).
3. Isi Environment Variables sesuai tabel di atas.
4. Deploy. Setiap push berikutnya akan otomatis ter-deploy.

Alternatif GitHub Pages: situs ini memakai fitur App Router standar; untuk ekspor statis
tambahkan `output: "export"` di `next.config.ts` (fitur Web3 tetap client-side), lalu
publikasikan folder `out/` lewat GitHub Actions/Pages.

## Catatan implementasi

- **Shadcn/UI:** CLI shadcn interaktif tidak dijalankan; komponen UI minimal ditulis manual
  dengan gaya shadcn di `src/components/ui/` (`button`, `card`, `badge`, `modal`, `toast`).
- **Hydration (PRD 5.1):** semua komponen yang membaca state wallet memakai hook
  `useIsMounted()` dan/atau `'use client'`, dan wagmi dikonfigurasi `ssr: true`.
- **Status transaksi (PRD 5.2):** setiap penulisan kontrak menampilkan toast 4 tahap —
  menunggu tanda tangan wallet → pending (dengan link Block Explorer) → sukses → error
  dengan pesan ramah (lihat `src/hooks/useTxLifecycle.ts`).
- **IPFS (FR-04):** `src/lib/ipfs.ts` mengubah `ipfs://` menjadi URL HTTPS dengan fallback
  multi-gateway (ipfs.io → Pinata → Cloudflare) saat gambar gagal dimuat.
- **Struktur folder** mengikuti PRD bagian 6 persis.
