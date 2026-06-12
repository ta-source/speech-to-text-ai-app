export default function Header() {
  return (
    <header className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          🎤 Speech-to-Text Application
        </h1>

        <p className="text-blue-100 mt-2 text-sm sm:text-base">
          Convert your voice into text instantly
        </p>
      </div>
    </header>
  );
}