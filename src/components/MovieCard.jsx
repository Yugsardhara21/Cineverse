import { Link } from 'react-router-dom';
import { Star, Play, Plus, Check } from 'lucide-react';
import { API } from '../api';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useTrailer } from '../contexts/TrailerContext';
import { motion } from 'framer-motion';

export default function MovieCard({ movie }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { openTrailer } = useTrailer();
  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlist = (e) => {
    e.preventDefault();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleTrailer = (e) => {
    e.preventDefault();
    openTrailer(movie.id);
  };

  const isTV = movie.name && !movie.title;
  const linkPath = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const displayTitle = movie.title || movie.name;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-cineverse-card/80 backdrop-blur-sm border border-white/5 w-full flex flex-col rounded-xl transition-all duration-300 h-full shadow-2xl hover:shadow-cineverse-cyan/10 group overflow-hidden"
    >
      <Link to={linkPath} className="block h-56 sm:h-64 md:h-72 relative overflow-hidden">
        <img 
          src={API.getImageUrl(movie.poster_path)} 
          alt={displayTitle}
          className="w-full h-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2 text-sm text-gray-400">
          <Star className="text-cineverse-cyan w-4 h-4 fill-current" />
          <span className="text-white">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
          <Star className="text-Cineverse-blue w-4 h-4 ml-auto hover:bg-white/10 rounded cursor-pointer" />
        </div>
        <Link 
          to={linkPath} 
          className="text-white hover:underline line-clamp-2 mb-3"
        >
          {displayTitle}
        </Link>
        <div className="mt-auto">
          <button 
            onClick={handleWatchlist}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-300 mb-2 font-medium ${
              inWatchlist ? 'bg-cineverse-cyan/20 text-cineverse-cyan hover:bg-cineverse-cyan/30 border border-cineverse-cyan/30' : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10'
            }`}
          >
            {inWatchlist ? <Check size={18} /> : <Plus size={18} />} Watchlist
          </button>
          <button 
            onClick={handleTrailer}
            className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white py-2 rounded-lg transition-all duration-300 border border-transparent hover:border-white/10"
          >
            <Play size={18} className="fill-current" /> Trailer
          </button>
        </div>
      </div>
    </motion.div>
  );
}
