import { useState, useEffect } from 'react';
import { API } from '../api';
import PersonCard from '../components/PersonCard';

export default function Celebs() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await API.getTrendingPeople();
      setPeople(data);
      setLoading(false);
    };
    loadData();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 max-w-[1280px] min-h-[60vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Trending Celebs</h1>
        <p className="text-gray-400">The most popular celebrities on Cineverse right now.</p>
      </div>
      
      {loading ? (
        <div className="text-center py-20 text-cineverse-cyan">Loading Celebrities...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {people.map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}
