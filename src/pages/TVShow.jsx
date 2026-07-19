import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API } from '../api';
import { Star, PlayCircle, UserCircle, Plus, Check } from 'lucide-react';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useTrailer } from '../contexts/TrailerContext';
import { motion } from 'framer-motion';

export default function TVShow() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seasonTrailer, setSeasonTrailer] = useState(null);
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
      const data = await API.getTVDetails(id);
      setShow(data);
      if (data?.seasons?.length > 0) {
        // default to season 1 or latest
        const firstValidSeason = data.seasons.find(s => s.season_number > 0) || data.seasons[0];
        setSelectedSeason(firstValidSeason.season_number);
      }
      setLoading(false);
    };
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!show || selectedSeason === null) return;
    const fetchSeason = async () => {
      setSeasonLoading(true);
      const data = await API.getSeasonDetails(id, selectedSeason);
      setEpisodes(data?.episodes || []);
      const sTrailer = data?.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer') || 
                       data?.videos?.results?.find(v => v.site === 'YouTube');
      setSeasonTrailer(sTrailer || null);
      setSeasonLoading(false);
    };
    fetchSeason();
  }, [selectedSeason, id, show]);

  if (loading) return <div className="text-center py-20 text-cineverse-cyan">Loading...</div>;
  if (!show) return <div className="text-center py-20">TV Show not found.</div>;

  const trailer = show.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer') || 
                  show.videos?.results?.find(v => v.site === 'YouTube');
  
  const activeTrailer = seasonTrailer || trailer;

  const watchProviders = show['watch/providers']?.results?.US || show['watch/providers']?.results?.IN;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Top Trailer Section */}
      {activeTrailer ? (
        <div className="w-full bg-black relative py-8">
          <div className="container mx-auto max-w-[1024px]">
            <div className="aspect-video w-full relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              {!isPlaying ? (
                <div 
                  className="w-full h-full relative cursor-pointer group"
                  onClick={() => setIsPlaying(true)}
                >
                  <img 
                    src={API.getImageUrl(show.backdrop_path, true)} 
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
                  src={`https://www.youtube.com/embed/${activeTrailer.key}?autoplay=1`} 
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
            <img src={API.getImageUrl(show.backdrop_path, true)} className="w-full h-full object-cover blur-[2px] opacity-40 scale-105" alt="Background" />
          </div>
        </div>
      )}

      <div className={`bg-cineverse-black ${trailer ? 'pt-8' : 'pt-0'} pb-16 relative overflow-hidden`}>
        <div className="container mx-auto px-4 max-w-[1280px] relative z-20 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
              <div className="relative group rounded-lg overflow-hidden shadow-2xl shadow-black ring-1 ring-white/10">
                <img 
                  src={API.getImageUrl(show.poster_path)} 
                  className="w-full object-cover" 
                  alt="Poster" 
                />
              </div>
            </div>
            
            <div className="w-full md:w-3/4 lg:w-4/5">
              <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight drop-shadow-lg">{show.name}</h1>
              
              {show.tagline && (
                <p className="text-xl text-gray-300 italic mb-4 font-light drop-shadow">"{show.tagline}"</p>
              )}
              
              <div className="text-gray-300 text-sm md:text-base mb-6 flex gap-3 font-medium flex-wrap items-center">
                <span className="bg-white/10 px-2 py-0.5 rounded text-white">TV Series</span>
                <span>•</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-white">{formatDate(show.first_air_date)}{show.status === 'Ended' ? ` – ${formatDate(show.last_air_date)}` : ' – Present'}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-white"><Star className="text-cineverse-cyan w-5 h-5 fill-current"/> {show.vote_average?.toFixed(1)} <span className="text-gray-400 text-xs font-normal">({show.vote_count})</span></span>
                <span>•</span>
                <span>{show.number_of_seasons} Seasons, {show.number_of_episodes} Episodes</span>
              </div>
              
              <div className="flex gap-2 mb-8 flex-wrap">
                {show.genres?.map(g => (
                  <span key={g.id} className="border border-white/20 hover:border-white/50 bg-white/5 rounded-full px-5 py-1.5 text-sm transition cursor-pointer backdrop-blur-sm">{g.name}</span>
                ))}
              </div>

              {show.next_episode_to_air && (
                <div className="mb-6 p-3 bg-cineverse-blue/10 border border-cineverse-blue/30 rounded text-cineverse-blue inline-block">
                  <span className="font-bold">Next Episode:</span> "{show.next_episode_to_air.name}" airs on {formatDate(show.next_episode_to_air.air_date)}
                </div>
              )}

              <div className="flex gap-4 mb-10">
                <button 
                  onClick={() => isInWatchlist(show.id) ? removeFromWatchlist(show.id) : addToWatchlist(show)}
                  className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold transition shadow-lg ${
                    isInWatchlist(show.id) ? 'bg-cineverse-cyan/20 text-cineverse-cyan hover:bg-cineverse-cyan/30 ring-1 ring-cineverse-cyan/50' : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
                  }`}
                >
                  {isInWatchlist(show.id) ? <Check size={22} /> : <Plus size={22} />} Watchlist
                </button>
              </div>

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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold mb-3 border-b border-white/10 pb-2">Overview</h3>
                  <p className="text-lg text-gray-200 leading-relaxed drop-shadow">
                    {show.overview}
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10 shadow-xl">
                  <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Status</span> <span className="font-semibold text-white">{show.status}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Language</span> <span className="font-semibold text-white uppercase">{show.original_language}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Type</span> <span className="font-semibold text-white">{show.type}</span></div>
                  </div>
                  
                  {show.created_by?.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <span className="text-gray-400 text-sm block mb-3">Created By</span>
                      <div className="flex flex-col gap-2">
                        {show.created_by.map(creator => (
                          <span key={creator.id} className="text-white font-semibold">{creator.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {show.networks?.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <span className="text-gray-400 text-sm block mb-3">Networks</span>
                      <div className="flex flex-wrap gap-2">
                        {show.networks.map(network => (
                          <span key={network.id} className="text-xs bg-white/10 px-2 py-1 rounded text-white">{network.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
            <span className="text-white font-bold text-lg">{show.status}</span>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-lg hover:bg-white/10 transition">
            <span className="block text-gray-400 text-sm mb-1">Type</span>
            <span className="text-white font-bold text-lg">{show.type}</span>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-lg hover:bg-white/10 transition">
            <span className="block text-gray-400 text-sm mb-1">Original Language</span>
            <span className="text-white font-bold text-lg uppercase">{show.original_language}</span>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-lg hover:bg-white/10 transition">
            <span className="block text-gray-400 text-sm mb-1">Spoken Languages</span>
            <span className="text-white font-bold text-lg line-clamp-1">{show.spoken_languages?.map(l => l.english_name).join(', ') || 'N/A'}</span>
          </div>
        </div>
        
        {show.production_companies?.length > 0 && (
          <div className="mt-6 bg-white/5 p-6 rounded-lg border border-white/10 shadow-lg hover:bg-white/10 transition">
            <span className="block text-gray-400 text-sm mb-4">Production Companies</span>
            <div className="flex flex-wrap gap-6 items-center">
              {show.production_companies.map(company => (
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
          <Link to={`/tv/${show.id}/credits`} className="text-cineverse-blue hover:underline font-semibold">
            See full cast & crew 
          </Link>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-gray-600">
          {show.credits?.cast?.slice(0, 15).map(c => (
            <Link to={`/person/${c.id}`} key={c.id} className="text-center flex-shrink-0 w-32 cursor-pointer hover:bg-white/5 p-2 rounded transition">
              <img src={API.getImageUrl(c.profile_path)} className="w-28 h-28 object-cover rounded-full mx-auto mb-3" alt={c.name} />
              <h6 className="text-white text-sm font-medium leading-tight mb-1">{c.name}</h6>
              <p className="text-gray-400 text-xs truncate" title={c.character}>{c.character}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1280px] py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h3 className="text-cineverse-cyan text-2xl font-bold flex items-center">
            <div className="w-1 h-6 bg-cineverse-cyan rounded-sm mr-2"></div>
            Episodes
          </h3>
          <select 
            className="bg-cineverse-card border border-gray-700 text-white px-4 py-2 rounded outline-none"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
          >
            {show.seasons?.map(s => (
              <option key={s.id} value={s.season_number}>{s.name}</option>
            ))}
          </select>
        </div>

        {seasonLoading ? (
          <div className="py-10 text-gray-400">Loading episodes...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {episodes.map(ep => (
              <Link 
                to={`/tv/${show.id}/season/${selectedSeason}/episode/${ep.episode_number}`}
                key={ep.id} 
                className="flex flex-col sm:flex-row gap-4 bg-cineverse-card border border-gray-800 rounded overflow-hidden p-4 hover:bg-white/5 transition group"
              >
                <img 
                  src={API.getImageUrl(ep.still_path)} 
                  alt={ep.name} 
                  className="w-full sm:w-48 h-28 object-cover rounded opacity-90 group-hover:opacity-100 transition" 
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-bold text-white text-lg group-hover:underline">{ep.episode_number}. {ep.name}</h5>
                    <div className="flex items-center gap-1 text-sm font-bold text-cineverse-cyan">
                      <Star size={14} className="fill-current" /> {ep.vote_average?.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    {formatDate(ep.air_date)} • {ep.runtime ? `${ep.runtime} min` : ''}
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2 md:line-clamp-3">
                    {ep.overview || "No overview available."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 max-w-[1280px] py-10">
        <h3 className="text-cineverse-cyan text-2xl font-bold flex items-center mb-6">
          <div className="w-1 h-6 bg-cineverse-cyan rounded-sm mr-2"></div>
          More Like This
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-600">
          {show.similar?.results?.slice(0, 10).map((similarShow) => (
            <div key={similarShow.id} className="w-48 flex-shrink-0">
               <Link to={`/tv/${similarShow.id}`}>
                 <img src={API.getImageUrl(similarShow.poster_path)} className="w-full h-72 object-cover rounded hover:opacity-80 transition" alt={similarShow.name} />
                 <h6 className="text-white text-sm font-medium mt-2 line-clamp-1">{similarShow.name}</h6>
               </Link>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
