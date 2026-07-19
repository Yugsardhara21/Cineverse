import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../api';
import MovieCard from '../components/MovieCard';

export default function Genre() {
  const { type, id, name } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    setLoading(true);
    API.getByGenre(type, id, 1, sortBy).then(data => {
      setResults(data.results);
      setTotalPages(data.total_pages);
      setPage(1);
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [type, id, sortBy]);

  const loadMore = async () => {
    if (page >= totalPages) return;
    const nextPage = page + 1;
    const data = await API.getByGenre(type, id, nextPage, sortBy);
    setResults(prev => [...prev, ...data.results]);
    setPage(nextPage);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-[1280px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 capitalize">{name} {type === 'movie' ? 'Movies' : 'TV Shows'}</h1>
          <p className="text-gray-400">Browsing top {name.toLowerCase()} titles.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 font-semibold text-sm">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-Cineverse-card border border-gray-700 text-white px-4 py-2 rounded outline-none"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="primary_release_date.desc">Newest First</option>
            <option value="revenue.desc">Highest Grossing</option>
          </select>
        </div>
      </div>
      
      {loading && page === 1 ? (
        <div className="text-center py-10 text-cineverse-cyan">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          {page < totalPages && (
            <div className="text-center mt-10">
              <button 
                onClick={loadMore}
                className="bg-Cineverse-card hover:bg-Cineverse-hover border border-gray-700 font-bold py-2 px-10 rounded transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
