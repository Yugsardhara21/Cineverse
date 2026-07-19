import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API } from '../api';
import { Star, ArrowLeft } from 'lucide-react';

export default function Episode() {
  const { id, season, episode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const episodeData = await API.getEpisodeDetails(id, season, episode);
      setData(episodeData);
      setLoading(false);
    };
    loadData();
    window.scrollTo(0, 0);
  }, [id, season, episode]);

  if (loading) return <div className="text-center py-20 text-cineverse-cyan">Loading Episode...</div>;
  if (!data) return <div className="text-center py-20">Episode not found.</div>;

  return (
    <div>
      <div className="bg-Cineverse-black pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-[1280px]">
          <Link to={`/tv/${id}`} className="text-Cineverse-blue hover:underline flex items-center gap-1 mb-6">
            <ArrowLeft size={16} /> Back to Series
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <img 
                src={API.getImageUrl(data.still_path, true)} 
                className="w-full rounded border border-gray-800 shadow-2xl" 
                alt="Episode Still" 
              />
            </div>
            
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="text-cineverse-cyan font-bold text-lg mb-1">Season {season}, Episode {episode}</div>
              <h1 className="text-3xl md:text-5xl font-normal mb-2">{data.name}</h1>
              
              <div className="text-gray-400 text-base mb-6 flex items-center gap-3">
                <span>{data.air_date}</span>
                <span>•</span>
                <span>{data.runtime} min</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-white font-bold bg-white/10 px-2 py-0.5 rounded">
                  <Star className="text-cineverse-cyan w-4 h-4 fill-current"/> {data.vote_average?.toFixed(1)}
                </span>
              </div>

              <p className="text-lg text-gray-200 max-w-4xl leading-relaxed mb-8">
                {data.overview || "No overview available for this episode."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1280px] py-10">
        <h3 className="text-cineverse-cyan text-2xl font-bold flex items-center mb-6">
          <div className="w-1 h-6 bg-cineverse-cyan rounded-sm mr-2"></div>
          Episode Cast & Crew
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h4 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Guest Stars</h4>
            <div className="flex flex-col">
              {data.guest_stars?.map(person => (
                <Link to={`/person/${person.id}`} key={person.id} className="flex items-center gap-4 hover:bg-white/5 p-2 rounded transition border-b border-gray-800/50">
                  <img src={API.getImageUrl(person.profile_path)} className="w-12 h-12 rounded-full object-cover" alt={person.name} />
                  <div>
                    <div className="font-bold text-white">{person.name}</div>
                    <div className="text-sm text-gray-400">{person.character}</div>
                  </div>
                </Link>
              ))}
              {(!data.guest_stars || data.guest_stars.length === 0) && <p className="text-gray-500">No guest stars listed.</p>}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Crew</h4>
            <div className="flex flex-col">
              {data.crew?.slice(0, 20).map((person, idx) => (
                <Link to={`/person/${person.id}`} key={`${person.id}-${idx}`} className="flex items-center gap-4 hover:bg-white/5 p-2 rounded transition border-b border-gray-800/50">
                  <img src={API.getImageUrl(person.profile_path)} className="w-12 h-12 rounded-full object-cover" alt={person.name} />
                  <div>
                    <div className="font-bold text-white">{person.name}</div>
                    <div className="text-sm text-gray-400">{person.job} ({person.department})</div>
                  </div>
                </Link>
              ))}
               {(!data.crew || data.crew.length === 0) && <p className="text-gray-500">No crew listed.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
