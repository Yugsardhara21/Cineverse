import { useState, useEffect } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import MovieCard from '../components/MovieCard';
import PersonCard from '../components/PersonCard';
import { API } from '../api';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const m = await API.getTrendingMovies();
      const tr = await API.getTopRatedMovies();
      const np = await API.getNowPlayingMovies();
      const tv = await API.getTrendingTV();
      const p = await API.getTrendingPeople();
      setMovies(m);
      setTopRated(tr);
      setNowPlaying(np);
      setTvShows(tv);
      setPeople(p);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-cineverse-cyan">Loading...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="container mx-auto px-4 py-6 max-w-[1280px]"
    >
      <HeroCarousel movies={movies} />

      <div className="mb-14">
        <h2 className="text-cineverse-cyan text-3xl font-bold flex items-center mb-1 tracking-tight">
          <div className="w-1.5 h-7 bg-cineverse-cyan rounded-full mr-3 shadow-[0_0_10px_rgba(0,242,254,0.5)]"></div>
          Top Picks <ChevronRight size={32} className="text-white/50 hover:text-cineverse-cyan cursor-pointer ml-1 transition-colors" />
        </h2>
        <h6 className="text-gray-400 mb-4 ml-3">TV shows and movies just for you</h6>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.slice(3, 9).map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <div className="mb-14">
        <h2 className="text-cineverse-cyan text-3xl font-bold flex items-center mb-6 tracking-tight">
          <div className="w-1.5 h-7 bg-cineverse-cyan rounded-full mr-3 shadow-[0_0_10px_rgba(0,242,254,0.5)]"></div>
          Most Popular Celebrities <ChevronRight size={32} className="text-white/50 hover:text-cineverse-cyan cursor-pointer ml-1 transition-colors" />
        </h2>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-gray-600">
          {people.slice(0, 10).map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </div>

      <div className="mb-14">
        <h2 className="text-cineverse-cyan text-3xl font-bold flex items-center mb-6 tracking-tight">
          <div className="w-1.5 h-7 bg-cineverse-cyan rounded-full mr-3 shadow-[0_0_10px_rgba(0,242,254,0.5)]"></div>
          In Theaters <ChevronRight size={32} className="text-white/50 hover:text-cineverse-cyan cursor-pointer ml-1 transition-colors" />
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {nowPlaying.slice(0, 6).map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <div className="mb-14">
        <h2 className="text-cineverse-cyan text-3xl font-bold flex items-center mb-6 tracking-tight">
          <div className="w-1.5 h-7 bg-cineverse-cyan rounded-full mr-3 shadow-[0_0_10px_rgba(0,242,254,0.5)]"></div>
          Editor's Picks <ChevronRight size={32} className="text-white/50 hover:text-cineverse-cyan cursor-pointer ml-1 transition-colors" />
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.slice(9, 15).map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <div className="mb-14">
        <h2 className="text-cineverse-cyan text-3xl font-bold flex items-center mb-6 tracking-tight">
          <div className="w-1.5 h-7 bg-cineverse-cyan rounded-full mr-3 shadow-[0_0_10px_rgba(0,242,254,0.5)]"></div>
          Top 250 Movies <ChevronRight size={32} className="text-white/50 hover:text-cineverse-cyan cursor-pointer ml-1 transition-colors" />
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {topRated.slice(0, 12).map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
      <div className="mb-14">
        <h2 className="text-cineverse-cyan text-3xl font-bold flex items-center mb-6 tracking-tight">
          <div className="w-1.5 h-7 bg-cineverse-cyan rounded-full mr-3 shadow-[0_0_10px_rgba(0,242,254,0.5)]"></div>
          Trending TV Shows <ChevronRight size={32} className="text-white/50 hover:text-cineverse-cyan cursor-pointer ml-1 transition-colors" />
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {tvShows.slice(0, 12).map(show => (
            <MovieCard key={show.id} movie={show} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
