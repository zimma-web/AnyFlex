import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Calendar, Clock, Users, BookOpen, ExternalLink } from 'lucide-react';
import { Anime } from '../types/anime';
import { jikanApi } from '../services/jikanApi';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AnimeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await jikanApi.getAnimeById(parseInt(id));
        setAnime(response.data);
      } catch (err) {
        setError('Failed to fetch anime details. Please try again later.');
        console.error('Error fetching anime details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetail();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !anime) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">{error || 'Anime not found'}</p>
          <Link
            to="/"
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition-colors inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <img
          src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
          alt={anime.title}
          className="w-full h-96 object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="p-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {anime.title}
              </h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-xl text-white/80 mb-4">{anime.title_english}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {anime.score && (
                  <div className="flex items-center space-x-1 bg-yellow-500/90 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-current text-black" />
                    <span className="text-black font-semibold">{anime.score}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4" />
                  <span>{anime.year || 'N/A'}</span>
                </div>
                
                {anime.episodes && (
                  <div className="flex items-center space-x-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                    <BookOpen className="w-4 h-4" />
                    <span>{anime.episodes} episodes</span>
                  </div>
                )}
                
                <div className="bg-purple-500/90 px-3 py-1 rounded-full">
                  <span className="font-semibold">{anime.status}</span>
                </div>
              </div>
              
              <Link
                to={`/player/${anime.mal_id}`}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2 group"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Watch Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Synopsis */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
            <p className="text-white/80 leading-relaxed">
              {anime.synopsis || 'No synopsis available.'}
            </p>
          </div>

          {/* Genres */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {anime.genres?.map((genre) => (
                <span
                  key={genre.mal_id}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Themes & Demographics */}
          {(anime.themes?.length || anime.demographics?.length) && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Additional Info</h2>
              <div className="space-y-4">
                {anime.themes?.length && (
                  <div>
                    <h3 className="text-white/80 font-semibold mb-2">Themes</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.themes.map((theme) => (
                        <span
                          key={theme.mal_id}
                          className="bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-sm"
                        >
                          {theme.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {anime.demographics?.length && (
                  <div>
                    <h3 className="text-white/80 font-semibold mb-2">Demographics</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.demographics.map((demo) => (
                        <span
                          key={demo.mal_id}
                          className="bg-green-500/20 border border-green-400/30 px-3 py-1 rounded-full text-sm"
                        >
                          {demo.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Statistics</h3>
            <div className="space-y-3">
              {anime.score && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Score</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{anime.score}</span>
                  </div>
                </div>
              )}
              
              {anime.scored_by && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Scored by</span>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-white">{anime.scored_by.toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              {anime.rank && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Rank</span>
                  <span className="text-white font-semibold">#{anime.rank}</span>
                </div>
              )}
              
              {anime.popularity && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Popularity</span>
                  <span className="text-white font-semibold">#{anime.popularity}</span>
                </div>
              )}
              
              {anime.duration && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Duration</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-white">{anime.duration}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* External Links */}
          {anime.external && anime.external.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">External Links</h3>
              <div className="space-y-2">
                {anime.external.slice(0, 5).map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <span className="text-white/80">{link.name}</span>
                    <ExternalLink className="w-4 h-4 text-white/60" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Link
            to={`/player/${anime.mal_id}`}
            className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-4 rounded-xl font-semibold text-center transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-center space-x-2">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Start Watching</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};