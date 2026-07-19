import { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export function useWatchlist() {
  return useContext(WatchlistContext);
}

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('Cineverse_watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  const addToWatchlist = (movie) => {
    setWatchlist((prev) => {
      const updated = [...prev, movie];
      localStorage.setItem('Cineverse_watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => {
      const updated = prev.filter(m => m.id !== movieId);
      localStorage.setItem('Cineverse_watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some(m => m.id === movieId);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}
