import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, BookmarkPlus } from 'lucide-react';
import { API } from '../api';
import { useWatchlist } from '../contexts/WatchlistContext';
import SidebarMenu from './SidebarMenu';
import CineverseLogo from './CineverseLogo';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        const res = await API.multiSearch(query);
        const sortedResults = res.results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        setResults(sortedResults.slice(0, 5));
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <nav className="bg-Cineverse-gray/90 backdrop-blur-xl border-b border-white/10 py-2 sm:py-3 px-2 sm:px-4 sticky top-0 z-50 flex items-center gap-2 sm:gap-4 text-sm font-medium shadow-2xl shadow-black/50 transition-all duration-300">
      <Link to="/" className="shrink-0">
        <CineverseLogo className="h-6 sm:h-8 lg:h-10" />
      </Link>
      
      <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-1 hover:bg-Cineverse-hover px-2 sm:px-3 py-1.5 rounded transition shrink-0">
        <Menu className="w-5 h-5 sm:w-6 sm:h-6" /> <span className="hidden sm:inline">Menu</span>
      </button>

      <div className="flex-grow relative flex min-w-0" ref={dropdownRef}>
        <button className="bg-white text-black px-3 rounded-l font-semibold border-r border-gray-300 hidden md:block shrink-0">
          All ▾
        </button>
        <input 
          type="text"
          placeholder="Search Cineverse"
          className="flex-grow min-w-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 focus:bg-white text-black outline-none rounded-l md:rounded-none transition-all shadow-inner focus:ring-2 focus:ring-cineverse-cyan/50 text-sm sm:text-base placeholder-gray-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if(results.length > 0) setShowDropdown(true) }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              setShowDropdown(false);
              navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            }
          }}
        />
        <button 
          onClick={() => {
            if (query.trim()) {
              setShowDropdown(false);
              navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            } else {
              document.querySelector('input[placeholder="Search Cineverse"]').focus();
            }
          }} 
          className="bg-cineverse-cyan hover:bg-cineverse-cyan-hover text-black px-3 sm:px-5 rounded-r transition-colors shadow-md shrink-0 flex items-center justify-center"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {showDropdown && results.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-Cineverse-card border border-gray-700 shadow-xl rounded max-h-96 overflow-y-auto z-50">
            {results.map(item => {
              const link = item.media_type === 'tv' ? `/tv/${item.id}` : item.media_type === 'person' ? `/person/${item.id}` : `/movie/${item.id}`;
              const title = item.title || item.name;
              const year = item.release_date ? item.release_date.substring(0,4) : item.first_air_date ? item.first_air_date.substring(0,4) : '';
              
              return (
                <Link 
                  key={item.id}
                  to={link}
                  className="flex items-center gap-3 p-2 border-b border-gray-800 hover:bg-Cineverse-hover transition"
                  onClick={() => { setShowDropdown(false); setQuery(''); }}
                >
                  <img 
                    src={API.getImageUrl(item.poster_path || item.profile_path)} 
                    alt={title} 
                    className="w-10 h-14 object-cover rounded shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{title}</div>
                    <div className="text-xs text-gray-400 flex flex-wrap gap-1">
                      {item.media_type && <span className="capitalize text-cineverse-cyan">{item.media_type}</span>}
                      {year && <span>• {year}</span>}
                      {item.vote_average > 0 && <span>• ⭐ {item.vote_average.toFixed(1)}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden lg:flex items-center gap-4 shrink-0">
        <Link to="#" className="font-bold text-cineverse-cyan hover:underline whitespace-nowrap">CineversePro</Link>
        <div className="w-px h-5 bg-gray-600"></div>
        <Link to="/watchlist" className="flex items-center gap-1 hover:bg-Cineverse-hover px-3 py-1.5 rounded transition font-semibold whitespace-nowrap">
          <BookmarkPlus size={20} /> Watchlist 
          {watchlist.length > 0 && (
            <span className="bg-cineverse-cyan text-black text-xs font-bold px-1.5 py-0.5 rounded ml-1">
              {watchlist.length}
            </span>
          )}
        </Link>
      </div>

      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </nav>
  );
}
