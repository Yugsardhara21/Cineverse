import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API } from '../api';
import { ArrowLeft } from 'lucide-react';

export default function Credits({ type = 'movie' }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const credits = await API.getCredits(id, type);
      const details = type === 'movie' ? await API.getMovieDetails(id) : await API.getTVDetails(id);
      setData({ credits, details });
      setLoading(false);
    };
    loadData();
    window.scrollTo(0, 0);
  }, [id, type]);

  if (loading) return <div className="text-center py-20 text-cineverse-cyan">Loading...</div>;
  if (!data || !data.credits) return <div className="text-center py-20">Data not found.</div>;

  const { cast, crew } = data.credits;
  const title = data.details?.title || data.details?.name;
  const year = data.details?.release_date?.substring(0,4) || data.details?.first_air_date?.substring(0,4);

  return (
    <div className="container mx-auto px-4 py-10 max-w-[1000px] bg-Cineverse-gray mt-8 rounded shadow-2xl">
      <div className="mb-8 border-b border-gray-800 pb-4">
        <Link to={`/${type}/${id}`} className="text-Cineverse-blue hover:underline flex items-center gap-1 mb-2">
          <ArrowLeft size={16} /> Back to {title}
        </Link>
        <h1 className="text-3xl font-bold">{title} {year ? `(${year})` : ''}</h1>
        <h2 className="text-xl text-gray-400 mt-1">Full Cast & Crew</h2>
      </div>

      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-6 text-white bg-[#222] p-3 rounded">Cast</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cast.map((c, i) => (
            <Link to={`/person/${c.id}`} key={`${c.id}-${i}`} className="flex items-center gap-4 hover:bg-white/5 p-2 rounded transition">
              <img 
                src={API.getImageUrl(c.profile_path)} 
                alt={c.name} 
                className="w-16 h-16 object-cover rounded-full"
              />
              <div>
                <div className="font-bold text-white">{c.name}</div>
                <div className="text-sm text-gray-400">{c.character}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6 text-white bg-[#222] p-3 rounded">Crew</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crew.slice(0, 100).map((c, i) => (
            <Link to={`/person/${c.id}`} key={`${c.id}-${i}`} className="flex items-center gap-4 hover:bg-white/5 p-2 rounded transition">
              <img 
                src={API.getImageUrl(c.profile_path)} 
                alt={c.name} 
                className="w-12 h-12 object-cover rounded-full"
              />
              <div>
                <div className="font-bold text-white">{c.name}</div>
                <div className="text-sm text-gray-400">{c.job} ({c.department})</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
