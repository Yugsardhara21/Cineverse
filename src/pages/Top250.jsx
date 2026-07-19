import { useState, useEffect } from 'react';
import { API } from '../api';
import MovieCard from '../components/MovieCard';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Top250() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllTopRated = async () => {
      setLoading(true);
      // Fetch multiple pages to get a good chunk of Top 250
      const pages = await Promise.all([
        API.getTopRatedMovies(1),
        API.getTopRatedMovies(2),
        API.getTopRatedMovies(3),
        API.getTopRatedMovies(4),
        API.getTopRatedMovies(5),
        API.getTopRatedMovies(6),
        API.getTopRatedMovies(7),
        API.getTopRatedMovies(8),
        API.getTopRatedMovies(9),
        API.getTopRatedMovies(10),
        API.getTopRatedMovies(11),
        API.getTopRatedMovies(12),
        API.getTopRatedMovies(13)
      ]);
      
      const combined = pages.flatMap(p => p).filter(m => m.vote_count > 300);
      combined.sort((a, b) => b.vote_average - a.vote_average);
      
      setMovies(combined.slice(0, 250));
      setLoading(false);
    };
    loadAllTopRated();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 max-w-[1000px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cineverse Top 250 Movies</h1>
        <p className="text-gray-400">Cineverse Top 250 as rated by regular Cineverse voters.</p>
      </div>
      
      {loading ? (
        <div className="text-center py-20 text-cineverse-cyan">Loading Top 250...</div>
      ) : (
        <div className="bg-Cineverse-card border border-gray-800 rounded shadow-xl overflow-hidden">
          <div className="flex flex-col">
            {movies.map((movie, idx) => (
              <div key={movie.id} className="flex gap-4 p-4 border-b border-gray-800 hover:bg-white/5 transition">
                <div className="w-16 flex-shrink-0">
                  <img src={API.getImageUrl(movie.poster_path)} className="w-full rounded" alt={movie.title} />
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-400 font-bold">{idx + 1}.</span>
                    <Link to={`/movie/${movie.id}`} className="font-bold text-white hover:underline text-lg">{movie.title}</Link>
                    <span className="text-gray-400 text-sm">({movie.release_date?.substring(0,4)})</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-bold text-lg w-20 justify-end">
                  <Star className="text-cineverse-cyan w-5 h-5 fill-current" />
                  {movie.vote_average?.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
