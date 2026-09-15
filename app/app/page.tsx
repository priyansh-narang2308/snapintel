import Navbar from "@/components/landing-page/navbar/navbar";
import Footer from "@/components/landing-page/footer/footer";
import SnapIntelAnalyzer from "@/components/landing-page/hero/analyzer";

export default function AppPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF2F00] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 flex-1">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center px-4 mb-10 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs text-orange-400 font-mono uppercase tracking-wider">
            <span>Live Analysis Console</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Visual Market Intelligence
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
            Upload an image, paste an image link, or select any pre-cached demo to generate an instant multi-engine intelligence dossier.
          </p>
        </div>

        {/* Analyzer Card & Results */}
        <SnapIntelAnalyzer />
      </main>

      <Footer />
    </div>
  );
}
