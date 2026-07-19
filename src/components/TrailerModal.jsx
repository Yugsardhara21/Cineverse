import { X } from 'lucide-react';

export default function TrailerModal({ isOpen, onClose, trailerKey }) {
  if (!isOpen || !trailerKey) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded overflow-hidden shadow-2xl border border-gray-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition"
        >
          <X size={24} />
        </button>
        <iframe 
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} 
          className="w-full h-full"
          frameBorder="0" 
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
