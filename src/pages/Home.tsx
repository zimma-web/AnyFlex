import React, { useState, useEffect } from 'react';
import { AnimeCard } from '../components/AnimeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Anime } from '../types/anime';
import { jikanApi } from '../services/jikanApi';
import { TrendingUp, Clock, Star } from 'lucide-react';

export const Home: React.FC = () => {
  const [popularAnimes, setPopularAnimes] = useState<Anime[]>([]);
  const [airingAnimes, setAiringAnimes] = useState<Anime[]>([]);
  const [topAnimes, setTopAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Make API calls sequentially to respect rate limits
        const popularResponse = await jikanApi.getPopularAnime(currentPage);
        setPopularAnimes(popularResponse.data);
        
        const airingResponse = await jikanApi.getAiringAnime();
        setAiringAnimes(airingResponse.data);
        
        const topResponse = await jikanApi.getTopAnime();
        setTopAnimes(topResponse.data);
      } catch (err) {
        setError('Failed to fetch anime data. Please try again later.');
        console.error('Error fetching anime data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, [currentPage]);

  if (loading && popularAnimes.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-6">
          Welcome to AnimFlex
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Discover and stream thousands of anime series and movies in high quality. 
          Your ultimate anime streaming destination.
        </p>
      </section>

      {/* Currently Airing */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Currently Airing</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {airingAnimes.slice(0, 12).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Popular Anime */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Popular Anime</h2>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-purple-500/20 rounded-lg text-white">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularAnimes.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
        
        {loading && (
          <div className="mt-8">
            <LoadingSpinner />
          </div>
        )}
      </section>

      {/* Top Rated */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Top Rated</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {topAnimes.slice(0, 12).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>
    </div>
  );
};