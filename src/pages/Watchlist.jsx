import { useWatchlist } from '../contexts/WatchlistContext';
import MovieCard from '../components/MovieCard';

export default function Watchlist() {
  const { watchlist } = useWatchlist();

  return (
    <div className="container mx-auto px-4 py-10 max-w-[1280px] min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-2">Your Watchlist</h1>
      <p className="text-gray-400 mb-8">Movies and TV shows you have saved to watch later.</p>

      {watchlist.length === 0 ? (
        <div className="text-center py-20 bg-Cineverse-card border border-gray-800 rounded">
          <h4 className="text-xl text-gray-300 mb-2">Your Watchlist is empty</h4>
          <p className="text-gray-500">Save shows and movies to keep track of what you want to watch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
