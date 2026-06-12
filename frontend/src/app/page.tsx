import Link from "next/link";
import RecorderPanel from "@/components/RecorderPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <div>
            <h1 className="text-3xl md:text-5xl font-bold">
              🎤 Speech-to-Text Application
            </h1>

            <p className="mt-3 text-lg text-blue-100">
              Convert your voice into text instantly
            </p>
          </div>

          <Link
            href="/history"
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            📜 History
          </Link>

        </div>
      </div>

      {/* Recorder */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <RecorderPanel />
      </div>

    </main>
  );
}