import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API } from '../api';
import { Star, PlayCircle, UserCircle, Plus, Check } from 'lucide-react';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useTrailer } from '../contexts/TrailerContext';
import { motion } from 'framer-motion';

export default function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { openTrailer } = useTrailer();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await API.getMovieDetails(id);
      setMovie(data);
      setLoading(false);
    };
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="text-center py-20 text-cineverse-cyan">Loading...</div>;
  if (!movie) return <div className="text-center py-20">Movie not found.</div>;

  const trailer = movie.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer') || 
                  movie.videos?.results?.find(v => v.site === 'YouTube');
  
  const watchProviders = movie['watch/providers']?.results?.US || movie['watch/providers']?.results?.IN;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Top Trailer Section */}
      {trailer ? (
        <div className="w-full bg-black relative py-8">
          <div className="container mx-auto max-w-[1024px]">
            <div className="aspect-video w-full relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              {!isPlaying ? (
                <div 
                  className="w-full h-full relative cursor-pointer group"
                  onClick={() => setIsPlaying(true)}
                >
                  <img 
                    src={API.getImageUrl(movie.backdrop_path, true)} 
                    alt="Trailer Thumbnail" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm group-hover:scale-110 group-hover:bg-cineverse-cyan/20 transition-all duration-300 shadow-2xl">
                      <PlayCircle className="w-20 h-20 text-white group-hover:text-cineverse-cyan transition" />
                    </div>
                  </div>
                </div>
              ) : (
                <iframe 
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`} 
                  className="w-full h-full animate-fade-in"
                  frameBorder="0" 
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden pt-10 pb-16">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-t from-[#121212] via-black/80 to-transparent absolute inset-0 z-10"></div>
            <div className="w-full h-full bg-gradient-to-r from-[#121212] via-black/60 to-transparent absolute inset-0 z-10"></div>
            <img src={API.getImageUrl(movie.backdrop_path, true)} className="w-full h-full object-cover blur-[2px] opacity-40 scale-105" alt="Background" />
          </div>
        </div>
      )}

      <div className={`bg-Cineverse-black ${trailer ? 'pt-8' : 'pt-0'} pb-16 relative overflow-hidden`}>
        <div className="container mx-auto px-4 max-w-[1280px] relative z-20 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
              <div className="relative group rounded-lg overflow-hidden shadow-2xl shadow-black ring-1 ring-white/10">
                <img 
                  src={API.getImageUrl(movie.poster_path)} 
                  className="w-full object-cover" 
                  alt="Poster" 
                />
              </div>
            </div>
            
            <div className="w-full md:w-3/4 lg:w-4/5">
              <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight drop-shadow-lg">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-xl text-gray-300 italic mb-4 font-light drop-shadow">"{movie.tagline}"</p>
              )}
              
              <div className="text-gray-300 text-sm md:text-base mb-6 flex gap-3 font-medium flex-wrap items-center">
                <span className="bg-white/10 px-2 py-0.5 rounded text-white">{formatDate(movie.release_date)}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-white"><Star className="text-cineverse-cyan w-5 h-5 fill-current"/> {movie.vote_average?.toFixed(1)} <span className="text-gray-400 text-xs font-normal">({movie.vote_count})</span></span>
                <span>•</span>
                <span>{movie.runtime} min</span>
              </div>
              
              <div className="flex gap-2 mb-8 flex-wrap">
                {movie.genres?.map(g => (
                  <span key={g.id} className="border border-white/20 hover:border-white/50 bg-white/5 rounded-full px-5 py-1.5 text-sm transition cursor-pointer backdrop-blur-sm">{g.name}</span>
                ))}
              </div>

              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => isInWatchlist(movie.id) ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                  className={`flex items-center gap-2 px-6 py-2 rounded font-bold transition ${
                    isInWatchlist(movie.id) ? 'bg-cineverse-cyan/20 text-cineverse-cyan hover:bg-cineverse-cyan/30' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isInWatchlist(movie.id) ? <Check size={20} /> : <Plus size={20} />} Watchlist
                </button>
              </div>

              <h3 className="text-xl font-bold mb-2 text-white">Overview</h3>
              <p className="text-lg text-gray-200 max-w-4xl leading-relaxed mb-8">
                {movie.overview}
              </p>

              {watchProviders && (
                <div className="mb-8">
                   <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                     <div className="w-1 h-5 bg-cineverse-cyan rounded-sm"></div>
                     Where to Watch
                   </h3>
                   <div className="flex flex-wrap gap-6">
                     {watchProviders.flatrate && (
                       <div>
                         <h4 className="text-sm text-gray-400 mb-2">Stream</h4>
                         <div className="flex gap-2">
                           {watchProviders.flatrate.map(p => (
                             <img key={p.provider_id} src={API.getImageUrl(p.logo_path)} alt={p.provider_name} title={p.provider_name} className="w-10 h-10 rounded-lg shadow-md" />
                           ))}
                         </div>
                       </div>
                     )}
                     {watchProviders.rent && (
                       <div>
                         <h4 className="text-sm text-gray-400 mb-2">Rent</h4>
                         <div className="flex gap-2">
                           {watchProviders.rent.map(p => (
                             <img key={p.provider_id} src={API.getImageUrl(p.logo_path)} alt={p.provider_name} title={p.provider_name} className="w-10 h-10 rounded-lg shadow-md" />
                           ))}
                         </div>
                       </div>
                     )}
                     {watchProviders.buy && (
                       <div>
                         <h4 className="text-sm text-gray-400 mb-2">Buy</h4>
                         <div className="flex gap-2">
                           {watchProviders.buy.map(p => (
                             <img key={p.provider_id} src={API.getImageUrl(p.logo_path)} alt={p.provider_name} title={p.provider_name} className="w-10 h-10 rounded-lg shadow-md" />
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Deep Dive Metadata */}
      <div className="container mx-auto px-4 max-w-[1280px] py-10" style={{animationDelay: '0.1s'}}>
        <h3 className="text-cineverse-cyan text-2xl font-bold flex items-center mb-6">
          <div className="w-1 h-6 bg-cineverse-cyan rounded-sm mr-2"></div>
          Deep Dive Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-lg hover:bg-white/10 transition">
            <span className="block text-gray-400 text-sm mb-1">Status</span>
            <span className="text-white font-bold text-lg">{movie.status}</span>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-lg hover:bg-white/10 transition">
            <span className="block text-gray-400 text-sm mb-1">Budget</span>
            <span className="text-white font-bold text-lg">{movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</span>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-lg hover:bg-white/10 transition">
            <span className="block text-gray-400 text-sm mb-1">Revenue</span>
            <span className="text-white font-bold text-lg">{movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}</span>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-lg hover:bg-white/10 transition">
            <span className="block text-gray-400 text-sm mb-1">Spoken Languages</span>
            <span className="text-white font-bold text-lg line-clamp-1">{movie.spoken_languages?.map(l => l.english_name).join(', ') || 'N/A'}</span>
          </div>
        </div>
        
        {movie.production_companies?.length > 0 && (
          <div className="mt-6 bg-white/5 p-6 rounded-lg border border-white/10 shadow-lg hover:bg-white/10 transition">
            <span className="block text-gray-400 text-sm mb-4">Production Companies</span>
            <div className="flex flex-wrap gap-6 items-center">
              {movie.production_companies.map(company => (
                <div key={company.id} className="flex flex-col items-center gap-2">
                  {company.logo_path ? (
                    <div className="bg-white p-2 rounded h-12 flex items-center justify-center">
                      <img src={API.getImageUrl(company.logo_path)} alt={company.name} className="max-h-full object-contain" />
                    </div>
                  ) : (
                    <span className="text-white font-bold">{company.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 max-w-[1280px] py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-cineverse-cyan text-2xl font-bold flex items-center">
            <div className="w-1 h-6 bg-cineverse-cyan rounded-sm mr-2"></div>
            Top Cast
          </h3>
          <Link to={`/movie/${movie.id}/credits`} className="text-Cineverse-blue hover:underline font-semibold">
            See full cast & crew
          </Link>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-gray-600">
          {movie.credits?.cast?.slice(0, 15).map(c => (
            <Link to={`/person/${c.id}`} key={c.id} className="text-center flex-shrink-0 w-32 cursor-pointer hover:bg-white/5 p-2 rounded transition">
              <img src={API.getImageUrl(c.profile_path)} className="w-28 h-28 object-cover rounded-full mx-auto mb-3" alt={c.name} />
              <h6 className="text-white text-sm font-medium leading-tight mb-1">{c.name}</h6>
              <p className="text-gray-400 text-xs truncate" title={c.character}>{c.character}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1280px] py-10">
        <h3 className="text-cineverse-cyan text-2xl font-bold flex items-center mb-6">
          <div className="w-1 h-6 bg-cineverse-cyan rounded-sm mr-2"></div>
          Photos
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-600">
          {movie.images?.backdrops?.slice(0, 10).map((img, i) => (
            <img 
              key={i} 
              src={API.getImageUrl(img.file_path)} 
              alt="Backdrop" 
              className="w-80 h-44 object-cover rounded flex-shrink-0 cursor-pointer hover:opacity-80 transition"
              onClick={() => window.open(API.getImageUrl(img.file_path, true), '_blank')}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1280px] py-10">
        <h3 className="text-cineverse-cyan text-2xl font-bold flex items-center mb-6">
          <div className="w-1 h-6 bg-cineverse-cyan rounded-sm mr-2"></div>
          User Reviews
        </h3>
        <div className="grid gap-4">
          {movie.reviews?.results?.length > 0 ? (
            movie.reviews.results.slice(0, 5).map(r => (
              <div key={r.id} className="bg-[#1a1a1a] p-6 rounded border border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <UserCircle className="w-10 h-10 text-gray-500" />
                  <div>
                    <h6 className="text-white font-medium">A review by {r.author}</h6>
                    {r.author_details?.rating && (
                      <div className="text-cineverse-cyan text-sm font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> {r.author_details.rating}/10
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {r.content.length > 500 ? r.content.substring(0, 500) + '...' : r.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No user reviews available.</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1280px] py-10">
        <h3 className="text-cineverse-cyan text-2xl font-bold flex items-center mb-6">
          <div className="w-1 h-6 bg-cineverse-cyan rounded-sm mr-2"></div>
          More Like This
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-600">
          {movie.similar?.results?.slice(0, 10).map((similarMovie) => (
            <div key={similarMovie.id} className="w-48 flex-shrink-0">
               <Link to={`/movie/${similarMovie.id}`}>
                 <img src={API.getImageUrl(similarMovie.poster_path)} className="w-full h-72 object-cover rounded hover:opacity-80 transition" alt={similarMovie.title} />
                 <h6 className="text-white text-sm font-medium mt-2 line-clamp-1">{similarMovie.title}</h6>
               </Link>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
