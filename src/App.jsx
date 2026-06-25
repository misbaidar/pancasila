// src/App.jsx
import { useState } from 'react';
import { dataPertanyaan } from './dataPertanyaan';
import { Radar } from 'react-chartjs-2';
import garuda from './assets/garuda.png'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css';

// Registrasi komponen Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Ikon Garuda sederhana sebagai SVG dekoratif
const GarudaIcon = () => (
  <img src={garuda} alt="Garuda" className="w-16 h-16 md:w-20 md:h-20 mx-auto opacity-80" />
);

// Komponen Bintang dekoratif kecil
const StarDecor = ({ className }) => (
  <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="currentColor">
    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14 2 9.2h7.6z" />
  </svg>
);

function App() {
  // State Aplikasi
  const [step, setStep] = useState('landing'); // 'landing', 'kuis', 'hasil'
  const [nama, setNama] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [skorMentah, setSkorMentah] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  // Fungsi saat user memilih jawaban
  const handleJawaban = (poin, sila) => {
    // Tambahkan poin ke sila terkait
    setSkorMentah(prev => ({
      ...prev,
      [sila]: prev[sila] + poin
    }));

    // Lanjut ke soal berikutnya atau selesaikan kuis
    if (currentIndex < dataPertanyaan.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Jika nama diisi, simpan ke database (Simulasi Logika Kondisional)
      if (nama.trim() !== "") {
        console.log(`Menyimpan data ke database atas nama: ${nama}`, skorMentah);
        // Di sini kamu bisa selipkan fungsi Firebase / Fetch API ke backend
      }
      setStep('hasil');
    }
  };

  // Kalkulasi persentase skor untuk Radar Chart (Skor Maksimal per Sila = 15 jika ada 3 soal)
  // Rumus: (Skor Didapat / 15) * 100
  const dataPersentase = [
    (skorMentah[1] / 15) * 100,
    (skorMentah[2] / 15) * 100,
    (skorMentah[3] / 15) * 100,
    (skorMentah[4] / 15) * 100,
    (skorMentah[5] / 15) * 100,
  ];

  // Konfigurasi Data untuk Radar Chart — Themed for light theme (Red/Gold)
  const chartData = {
    labels: ['Sila 1: Ketuhanan', 'Sila 2: Kemanusiaan', 'Sila 3: Persatuan', 'Sila 4: Kerakyatan', 'Sila 5: Keadilan'],
    datasets: [
      {
        label: nama ? `Profil Pancasila: ${nama}` : 'Profil Pancasila Anda',
        data: dataPersentase,
        backgroundColor: 'rgba(215, 39, 39, 0.12)',
        borderColor: 'rgba(215, 39, 39, 0.85)',
        borderWidth: 2.5,
        pointBackgroundColor: '#d4a017',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointHoverBackgroundColor: '#b51d1d',
        pointHoverBorderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(15, 23, 42, 0.1)',
        },
        grid: {
          color: 'rgba(15, 23, 42, 0.08)',
        },
        pointLabels: {
          color: 'rgba(15, 23, 42, 0.75)',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
            weight: '600',
          },
        },
        ticks: {
          display: false,
          stepSize: 20,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgba(15, 23, 42, 0.75)',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 13,
            weight: '500',
          },
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 3,
          useBorderRadius: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#facc15',
        bodyColor: '#fff',
        borderColor: 'rgba(212, 160, 23, 0.3)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        titleFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          weight: '600',
        },
        bodyFont: {
          family: "'Plus Jakarta Sans', sans-serif",
        },
        callbacks: {
          label: (context) => ` ${context.parsed.r.toFixed(1)}%`,
        },
      },
    },
  };

  // Progress percentage
  const progressPercent = ((currentIndex + 1) / dataPertanyaan.length) * 100;

  // Pilihan Render Berdasarkan Step
  return (
    <div className="min-h-screen bg-gradient-to-b from-crimson-900 via-crimson-400 to-slate-50 text-slate-800 selection:bg-crimson-200 selection:text-crimson-900">

      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-crimson-200/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rose-100/40 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-100/35 rounded-full blur-[150px]" />
      </div>

      {/* Main content container */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-screen flex flex-col justify-center">

        {/* 1. HALAMAN LANDING */}
        {step === 'landing' && (
          <div className="animate-fade-in text-center">
            {/* Hero Section */}
            <div className="mb-8 sm:mb-12">
              <GarudaIcon />
              <div className="flex items-center justify-center gap-2 mt-6 mb-3">
                <StarDecor className="text-gold-600/70" />
                <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/80 font-medium drop-shadow-sm">
                  Refleksi Nilai Kebangsaan
                </span>
                <StarDecor className="text-gold-600/70" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 text-white drop-shadow-md">
                Tes Kepribadian
                <br />
                <span className="bg-gradient-to-r from-gold-300 via-gold-200 to-gold-400 bg-clip-text text-transparent drop-shadow-sm">
                  Pancasila
                </span>
              </h1>
              <p className="text-slate-100/90 text-sm sm:text-base max-w-md mx-auto leading-relaxed drop-shadow-sm">
                Kenali karakter dan kecenderungan nilai kebangsaanmu melalui refleksi 5 Sila Pancasila.
              </p>
            </div>

            {/* Input Card */}
            <div className="glass-card p-6 sm:p-8 mb-8 max-w-md mx-auto">
              <label
                htmlFor="input-nama"
                className="block text-sm font-semibold text-slate-700 mb-3 text-left"
              >
                Nama Anda
                <span className="text-slate-400 font-normal ml-1">(opsional)</span>
              </label>
              <input
                id="input-nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Kosongkan jika ingin anonim"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-crimson-500/40 focus:border-crimson-500/30
                           transition-all duration-300"
              />
            </div>

            {/* CTA Button */}
            <button
              id="btn-mulai-kuis"
              onClick={() => setStep('kuis')}
              className="btn-gradient px-10 py-4 text-base sm:text-lg tracking-wide"
            >
              <span className="flex items-center justify-center gap-2">
                Mulai Kuis
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            {/* Footer info */}
            <p className="mt-8 text-xs text-slate-500 font-medium">
              {dataPertanyaan.length} pertanyaan · ~3 menit
            </p>
          </div>
        )}

        {/* 2. HALAMAN KUIS (SOAL SATU PER SATU) */}
        {step === 'kuis' && (
          <div className="animate-fade-in">
            {/* Progress Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-semibold text-white/95 drop-shadow-sm">
                  Pertanyaan {currentIndex + 1}
                  <span className="text-white/60"> / {dataPertanyaan.length}</span>
                </span>
                <span className="text-xs font-bold text-gold-300 drop-shadow-sm">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                <div
                  className="h-full rounded-full progress-gradient transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="glass-card p-6 sm:p-8 mb-6">
              <div className="flex items-start gap-3 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-crimson-700 to-maroon-700 text-xs font-bold text-white flex-shrink-0 mt-0.5 shadow-sm">
                  {currentIndex + 1}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-crimson-600 font-bold pt-2">
                  Sila {dataPertanyaan[currentIndex].sila}
                </span>
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 leading-relaxed mt-4">
                {dataPertanyaan[currentIndex].teks}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="flex flex-col gap-3">
              {dataPertanyaan[currentIndex].pilihan.map((opsi, index) => (
                <button
                  key={index}
                  id={`btn-opsi-${currentIndex}-${index}`}
                  onClick={() => handleJawaban(opsi.poin, dataPertanyaan[currentIndex].sila)}
                  className="btn-option text-left px-5 py-4 sm:px-6 sm:py-5 text-sm sm:text-base animate-slide-in shadow-sm"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <span className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-crimson-700 flex-shrink-0 mt-0.5 border border-slate-200">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="leading-relaxed font-medium">{opsi.teks}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. HALAMAN HASIL */}
        {step === 'hasil' && (
          <div className="animate-fade-in text-center">
            {/* Result Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <GarudaIcon />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white drop-shadow-md">
                Hasil Analisis
              </h1>
              {nama && (
                <p className="text-slate-100/90 text-sm sm:text-base animate-slide-up drop-shadow-sm font-medium">
                  Terima kasih telah mengisi, <strong className="text-gold-300 font-bold">{nama}</strong>!
                </p>
              )}
            </div>

            {/* Chart Card */}
            <div className="glass-card p-4 sm:p-6 md:p-8 mb-8">
              <div className="max-w-md mx-auto">
                <Radar data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="glass-card p-5 sm:p-6 mb-8">
              <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                Rincian Skor
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { sila: 1, label: 'Ketuhanan', emoji: '🕊️' },
                  { sila: 2, label: 'Kemanusiaan', emoji: '🤝' },
                  { sila: 3, label: 'Persatuan', emoji: '🇮🇩' },
                  { sila: 4, label: 'Kerakyatan', emoji: '🏛️' },
                  { sila: 5, label: 'Keadilan', emoji: '⚖️' },
                ].map(({ sila, label, emoji }) => (
                  <div
                    key={sila}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors duration-200"
                  >
                    <span className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <span>{emoji}</span>
                      <span>Sila {sila}</span>
                      <span className="text-slate-400 hidden sm:inline">— {label}</span>
                    </span>
                    <span className="text-sm font-extrabold text-crimson-700">
                      {dataPersentase[sila - 1].toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              id="btn-ulangi-tes"
              onClick={() => window.location.reload()}
              className="btn-gradient px-8 py-3.5 text-sm sm:text-base"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Ulangi Tes
              </span>
            </button>

            <p className="mt-6 text-xs text-slate-500 font-medium">
              Bagikan hasilmu dan ajak teman
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;