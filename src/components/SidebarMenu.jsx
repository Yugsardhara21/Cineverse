import { X, Film, Tv, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import CineverseLogo from './CineverseLogo';

export default function SidebarMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Sidebar Content */}
      <div className="relative w-full max-w-sm bg-[#121212] h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link to="/" onClick={onClose}>
            <CineverseLogo />
          </Link>
          <button onClick={onClose} className="p-2 bg-[#2b2b2b] hover:bg-white/20 rounded-full text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="mb-8">
            <h3 className="text-cineverse-cyan text-xl font-bold flex items-center gap-2 mb-4">
              <Film size={24} /> Movies
            </h3>
            <div className="flex flex-col gap-3 pl-8 text-gray-300">
              <Link to="/top250" onClick={onClose} className="hover:text-white hover:underline transition font-bold text-white mb-2">Cineverse Top 250 Movies</Link>
              <Link to="/genre/movie/28/Action" onClick={onClose} className="hover:text-white hover:underline transition">Top Action Movies</Link>
              <Link to="/genre/movie/35/Comedy" onClick={onClose} className="hover:text-white hover:underline transition">Top Comedy Movies</Link>
              <Link to="/genre/movie/878/Science-Fiction" onClick={onClose} className="hover:text-white hover:underline transition">Top Sci-Fi Movies</Link>
              <Link to="/genre/movie/27/Horror" onClick={onClose} className="hover:text-white hover:underline transition">Top Horror Movies</Link>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-cineverse-cyan text-xl font-bold flex items-center gap-2 mb-4">
              <Tv size={24} /> TV Shows
            </h3>
            <div className="flex flex-col gap-3 pl-8 text-gray-300">
              <Link to="/genre/tv/10759/Action-Adventure" onClick={onClose} className="hover:text-white hover:underline transition">Action & Adventure</Link>
              <Link to="/genre/tv/16/Animation" onClick={onClose} className="hover:text-white hover:underline transition">Animation</Link>
              <Link to="/genre/tv/35/Comedy" onClick={onClose} className="hover:text-white hover:underline transition">Comedy</Link>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-cineverse-cyan text-xl font-bold flex items-center gap-2 mb-4">
              <Users size={24} /> Celebs
            </h3>
            <div className="flex flex-col gap-3 pl-8 text-gray-300">
              <Link to="/celebs" onClick={onClose} className="hover:text-white hover:underline transition">Trending Celebs</Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
