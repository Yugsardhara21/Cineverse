import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../api';
import MovieCard from '../components/MovieCard';
import { ChevronRight } from 'lucide-react';

export default function Person() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await API.getPersonDetails(id);
      setPerson(data);
      setLoading(false);
    };
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="text-center py-20 text-cineverse-cyan">Loading...</div>;
  if (!person) return <div className="text-center py-20">Person not found.</div>;

  const movies = person.movie_credits?.cast || [];
  const tv = person.tv_credits?.cast || [];
  const allCredits = [...movies, ...tv].filter(c => c.release_date || c.first_air_date);
  
  // Sort credits by year descending
  allCredits.sort((a, b) => {
    const dateA = a.release_date || a.first_air_date || '0000';
    const dateB = b.release_date || b.first_air_date || '0000';
    return dateB.localeCompare(dateA);
  });

  const knownFor = [...movies, ...tv].sort((a, b) => b.popularity - a.popularity).slice(0, 12);

  const socials = person.external_ids || {};

  return (
    <div className="container mx-auto px-4 max-w-[1280px] py-10">
      <div className="flex flex-col md:flex-row gap-8 mb-16">
        <div className="w-full md:w-1/4 lg:w-1/5">
          <img 
            src={API.getImageUrl(person.profile_path)} 
            className="w-full rounded shadow-lg border border-gray-800" 
            alt={person.name} 
          />
        </div>
        
        <div className="w-full md:w-3/4 lg:w-4/5">
          <h1 className="text-4xl md:text-5xl font-normal mb-2">{person.name}</h1>
          <div className="text-gray-400 text-lg mb-6 flex gap-3">
            <span>{person.known_for_department}</span>
            {person.birthday && (
              <>
                <span>•</span>
                <span>Born: {person.birthday}</span>
              </>
            )}
            {person.place_of_birth && (
              <>
                <span>•</span>
                <span>{person.place_of_birth}</span>
              </>
            )}
          </div>
          
          <h5 className="font-bold text-white mb-2 text-xl">Biography</h5>
          <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line max-w-4xl">
            {person.biography ? (
              person.biography.length > 1000 
                ? person.biography.substring(0, 1000) + '...' 
                : person.biography
            ) : 'No biography available.'}
          </p>

          <div className="flex gap-4 mt-6">
            {socials.instagram_id && (
              <a href={`https://instagram.com/${socials.instagram_id}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">Instagram</a>
            )}
            {socials.twitter_id && (
              <a href={`https://twitter.com/${socials.twitter_id}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">Twitter (X)</a>
            )}
            {socials.Cineverse_id && (
              <a href={`https://www.Cineverse.com/name/${socials.Cineverse_id}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">Cineverse</a>
            )}
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h3 className="text-cineverse-cyan text-2xl font-bold flex items-center mb-6">
          <div className="w-1 h-6 bg-cineverse-cyan rounded-sm mr-2"></div>
          Known For <ChevronRight size={28} className="text-white hover:text-cineverse-cyan cursor-pointer ml-1" />
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {knownFor.map(movie => (
            <div key={`${movie.id}-${movie.credit_id}`} className="relative group">
              <MovieCard movie={movie} />
              <div className="absolute inset-x-0 bottom-0 bg-black/90 p-2 text-center text-xs text-gray-300 border-t border-gray-800 opacity-0 group-hover:opacity-100 transition">
                as {movie.character || 'Unknown'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-cineverse-cyan text-2xl font-bold flex items-center mb-6">
          <div className="w-1 h-6 bg-cineverse-cyan rounded-sm mr-2"></div>
          Filmography
        </h3>
        <div className="bg-Cineverse-card border border-gray-800 rounded shadow-xl overflow-hidden max-w-4xl">
          <div className="flex flex-col">
            {allCredits.map(credit => {
              const year = (credit.release_date || credit.first_air_date || '').substring(0,4);
              const title = credit.title || credit.name;
              const link = credit.media_type === 'tv' || credit.first_air_date ? `/tv/${credit.id}` : `/movie/${credit.id}`;
              
              return (
                <div key={`${credit.id}-${credit.credit_id}`} className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-800 hover:bg-white/5 transition">
                  <div className="w-12 font-bold text-gray-400 pt-1">{year || 'TBA'}</div>
                  <div>
                    <a href={link} className="font-bold text-white hover:underline text-lg">{title}</a>
                    <div className="text-sm text-gray-400 mt-1">
                      {credit.character ? (
                        <>as <span className="text-gray-300">{credit.character}</span></>
                      ) : 'Unknown Role'}
                      {credit.episode_count ? ` • ${credit.episode_count} episodes` : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
