import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-10 text-center max-w-sm">
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-2xl font-bold text-white mb-3">
          Surah Tidak Ditemukan
        </h1>
        <p className="text-white/50 text-sm mb-6">
          Surah yang kamu cari tidak ada. Silakan periksa kembali URL-nya.
        </p>
        <Link
          href="/"
          className="inline-block glass-pill px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
