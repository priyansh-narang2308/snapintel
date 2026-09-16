import Navbar from "@/components/landing-page/navbar/navbar";
import Footer from "@/components/landing-page/footer/footer";
import SnapIntelAnalyzer from "@/components/landing-page/hero/analyzer";

export default function AppPage() {
  return (
    <div className="min-h-screen bg-[#f9efe3] text-zinc-900 selection:bg-[#FF2F00] selection:text-white flex flex-col justify-between">

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 flex-1">
        <div className="max-w-4xl mx-auto text-center px-4 mb-10 flex flex-col items-center gap-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900">
            Visual Market Intelligence
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base max-w-xl">
            Upload an image, paste an image link, or select any pre-cached demo
            to generate an instant multi-engine intelligence dossier.
          </p>
        </div>

        {/* Analyzer Card & Results (White themed, no icons) */}
        <SnapIntelAnalyzer />
      </main>

      <Footer />
    </div>
  );
}
