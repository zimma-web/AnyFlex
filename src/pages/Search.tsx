import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { AnimeCard } from '../components/AnimeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Anime } from '../types/anime';
import { jikanApi } from '../services/jikanApi';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await jikanApi.searchAnime(query);
      setAnimes(response.data);
    } catch (err) {
      setError('Failed to search anime. Please try again later.');
      console.error('Error searching anime:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Search Anime
        </h1>
        
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for anime titles..."
            className="w-full bg-white/10 backdrop-blur border border-white/20 rounded-full px-6 py-4 pl-12 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 text-lg transition-all"
          />
          <SearchIcon className="w-6 h-6 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {loading && <LoadingSpinner />}
      
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && animes.length === 0 && searchParams.get('q') && (
        <div className="text-center py-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
            <SearchIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/80 text-lg">No anime found for "{searchParams.get('q')}"</p>
            <p className="text-white/60 mt-2">Try different keywords or check your spelling.</p>
          </div>
        </div>
      )}

      {animes.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-xl text-white/80">
              Found {animes.length} results for "{searchParams.get('q')}"
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {animes.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};