import { Link } from 'react-router-dom';
import { API } from '../api';
import { motion } from 'framer-motion';

export default function PersonCard({ person }) {
  const knownFor = person.known_for?.map(m => m.title || m.name).join(', ') || '';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.4, type: 'spring' }}
    >
      <Link to={`/person/${person.id}`} className="block text-center flex-shrink-0 w-36 cursor-pointer group">
        <div className="relative inline-block mb-3">
          <img 
            src={API.getImageUrl(person.profile_path)} 
            alt={person.name} 
            className="w-36 h-36 object-cover rounded-full shadow-lg shadow-black/50 group-hover:shadow-xl group-hover:shadow-cineverse-cyan/20 group-hover:ring-4 ring-cineverse-cyan/30 transition-all duration-300 group-hover:scale-105"
          />
        </div>
        <h6 className="text-white text-[15px] leading-tight mb-1 font-medium group-hover:text-cineverse-cyan transition-colors">{person.name}</h6>
        <p className="text-gray-400 text-[13px] truncate" title={knownFor}>{knownFor}</p>
      </Link>
    </motion.div>
  );
}
