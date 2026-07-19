import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, PlayCircle, Star } from 'lucide-react';
import { API } from '../api';
import { useTrailer } from '../contexts/TrailerContext';

export default function HeroCarousel({ movies }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { openTrailer } = useTrailer();

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) return null;

  const topMovies = movies.slice(0, 3);
  const currentMovie = topMovies[currentIndex];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-10">
      <div className="w-full md:w-3/4 relative h-[400px] md:h-[500px] bg-black">
        {topMovies.map((movie, idx) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img 
              src={API.getImageUrl(movie.backdrop_path, true)} 
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent p-6 md:p-10 flex flex-col justify-end">
              <div className="flex items-end gap-4">
                <img 
                  src={API.getImageUrl(movie.poster_path)} 
                  alt={movie.title}
                  className="hidden md:block w-32 rounded shadow-2xl"
                />
                <div>
                  <h2 className="text-3xl md:text-4xl font-normal text-white mb-2 shadow-black drop-shadow-md">{movie.title}</h2>
                  <p className="text-gray-300 line-clamp-2 max-w-2xl drop-shadow-md">{movie.overview}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <button 
          onClick={() => setCurrentIndex((prev) => (prev === 0 ? 2 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md hover:bg-black/60 text-white p-3 border border-white/20 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setCurrentIndex((prev) => (prev + 1) % 3)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md hover:bg-black/60 text-white p-3 border border-white/20 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="w-full md:w-1/4 flex flex-col">
        <h5 className="text-cineverse-cyan font-bold text-xl mb-4 tracking-wide">Up next</h5>
        <div className="bg-[#111]/80 backdrop-blur-lg p-5 rounded-xl border border-white/5 flex flex-col gap-5 flex-grow shadow-2xl">
          {topMovies.map((movie, idx) => (
            <div key={movie.id} className="flex gap-4 group cursor-pointer" onClick={() => openTrailer(movie.id)}>
              <div className="relative overflow-hidden rounded-md">
                <img src={API.getImageUrl(movie.poster_path)} className="w-20 h-28 object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt="Up Next" />
              </div>
              <div className="flex-grow pt-1">
                <PlayCircle className="text-white w-8 h-8 mb-1 group-hover:text-cineverse-cyan transition" />
                <div className="text-gray-400 text-sm mb-1">{movie.release_date?.substring(0,4)}</div>
                <h6 className="text-white text-sm line-clamp-2 group-hover:underline">{movie.title}</h6>
              </div>
            </div>
          ))}
          <a href="#" className="text-white hover:underline mt-auto font-medium text-sm flex items-center">
            Browse trailers <ChevronRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
