import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API } from '../api';
import MovieCard from '../components/MovieCard';
import PersonCard from '../components/PersonCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    API.multiSearch(query, 1).then(data => {
      setResults(data.results);
      setTotalPages(data.total_pages);
      setPage(1);
      setLoading(false);
    });
  }, [query]);

  const loadMore = async () => {
    if (page >= totalPages) return;
    const nextPage = page + 1;
    const data = await API.multiSearch(query, nextPage);
    setResults(prev => [...prev, ...data.results]);
    setPage(nextPage);
  };

  if (!query) return <div className="text-center py-20">Please enter a search term.</div>;

  const movies = results.filter(r => r.media_type === 'movie' || r.media_type === 'tv');
  const people = results.filter(r => r.media_type === 'person');

  return (
    <div className="container mx-auto px-4 py-10 max-w-[1280px]">
      <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>
      
      {loading && page === 1 ? (
        <div className="text-center py-10 text-cineverse-cyan">Searching...</div>
      ) : (
        <>
          {people.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold mb-4 border-l-4 border-cineverse-cyan pl-2">People</h3>
              <div className="flex overflow-x-auto gap-6 pb-4">
                {people.map(person => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            </div>
          )}

          {movies.length > 0 ? (
            <div>
              <h3 className="text-xl font-bold mb-4 border-l-4 border-cineverse-cyan pl-2">Titles</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map(movie => (
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
            </div>
          ) : (
            people.length === 0 && <div className="text-gray-400">No results found.</div>
          )}
        </>
      )}
    </div>
  );
}
