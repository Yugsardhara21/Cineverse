import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movie from './pages/Movie';
import Person from './pages/Person';
import Watchlist from './pages/Watchlist';
import Search from './pages/Search';
import TVShow from './pages/TVShow';
import Genre from './pages/Genre';
import Credits from './pages/Credits';
import Top250 from './pages/Top250';
import Episode from './pages/Episode';
import Celebs from './pages/Celebs';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { TrailerProvider } from './contexts/TrailerContext';

function App() {
  return (
    <WatchlistProvider>
      <TrailerProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-Cineverse-black text-white font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<Movie />} />
                <Route path="/movie/:id/credits" element={<Credits type="movie" />} />
                <Route path="/tv/:id" element={<TVShow />} />
                <Route path="/tv/:id/credits" element={<Credits type="tv" />} />
                <Route path="/tv/:id/season/:season/episode/:episode" element={<Episode />} />
                <Route path="/person/:id" element={<Person />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/search" element={<Search />} />
                <Route path="/genre/:type/:id/:name" element={<Genre />} />
                <Route path="/top250" element={<Top250 />} />
                <Route path="/celebs" element={<Celebs />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TrailerProvider>
    </WatchlistProvider>
  );
}

export default App;
