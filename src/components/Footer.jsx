export default function Footer() {
  return (
    <footer className="bg-black text-center pt-10 pb-6 mt-10">
      <div className="flex justify-center flex-wrap gap-4 mb-6">
        <div className="border border-gray-800 rounded p-4 w-64">
          <p className="mb-2">Follow Cineverse on social</p>
          <div className="flex justify-center gap-4 text-xl">
            <span className="cursor-pointer hover:text-white text-gray-400">📷</span>
            <span className="cursor-pointer hover:text-white text-gray-400">𝕏</span>
            <span className="cursor-pointer hover:text-white text-gray-400">▶</span>
            <span className="cursor-pointer hover:text-white text-gray-400">f</span>
          </div>
        </div>
        <div className="border border-gray-800 rounded p-4 w-64">
          <p className="mb-1">Get the Cineverse App</p>
          <small className="text-gray-400">For Android and iOS</small>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm text-white mb-6 max-w-4xl mx-auto">
        <a href="#" className="hover:underline">Help</a>
        <a href="#" className="hover:underline">Site Index</a>
        <a href="#" className="hover:underline">CineversePro</a>
        <a href="#" className="hover:underline">Box Office Mojo</a>
        <a href="#" className="hover:underline">License Cineverse Data</a>
        <a href="#" className="hover:underline">Press Room</a>
        <a href="#" className="hover:underline">Advertising</a>
        <a href="#" className="hover:underline">Jobs</a>
        <a href="#" className="hover:underline">Conditions of Use</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline flex items-center gap-1">
          Your Ads Privacy Choices
          <span className="bg-blue-600 px-2 rounded-full text-xs font-bold ml-1">✓</span>
        </a>
      </div>

      <div className="text-sm text-gray-400 mb-2">
        an Amazon company
      </div>
      <div className="text-xs text-gray-500">
        © 1990-2025 by Cineverse.com, Inc.
      </div>
    </footer>
  );
}
