"use client";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-100 p-6">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
          🔐 BetterQR
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-lg">
          Securely encrypt and share secret messages through QR codes.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="/encrypt"
            className="bg-indigo-600 hover:bg-indigo-500 transition-all text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/30"
          >
            Go to Encryptor
          </a>
          <a
            href="/decrypt"
            className="bg-green-600 hover:bg-green-500 transition-all text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-green-500/30"
          >
            Go to Decryptor
          </a>
        </div>

        <footer className="pt-10 text-sm text-gray-500">
          {new Date().getFullYear()} BetterQR — Built for a private university event.
        </footer>
      </div>
    </main>
  );
}
