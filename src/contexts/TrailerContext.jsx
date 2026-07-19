import { createContext, useContext, useState } from 'react';
import TrailerModal from '../components/TrailerModal';
import { API } from '../api';

const TrailerContext = createContext();

export function useTrailer() {
  return useContext(TrailerContext);
}

export function TrailerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  const openTrailer = async (movieId) => {
    try {
      const details = await API.getMovieDetails(movieId);
      if (details?.videos?.results) {
        const trailer = details.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer') 
                     || details.videos.results.find(v => v.site === 'YouTube');
        
        if (trailer) {
          setTrailerKey(trailer.key);
          setIsOpen(true);
          return;
        }
      }
      alert("No trailer available for this title.");
    } catch (e) {
      console.error(e);
      alert("Failed to load trailer.");
    }
  };

  const closeTrailer = () => {
    setIsOpen(false);
    setTrailerKey(null);
  };

  return (
    <TrailerContext.Provider value={{ openTrailer }}>
      {children}
      <TrailerModal isOpen={isOpen} onClose={closeTrailer} trailerKey={trailerKey} />
    </TrailerContext.Provider>
  );
}
