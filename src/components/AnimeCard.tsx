import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Play } from 'lucide-react';
import { Anime } from '../types/anime';

interface AnimeCardProps {
  anime: Anime;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="group block bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
    >
      <div className="relative overflow-hidden">
        <img
          src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
          alt={anime.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 left-2">
          {anime.score && (
            <div className="bg-yellow-500/90 backdrop-blur text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
              <Star className="w-3 h-3 fill-current" />
              <span>{anime.score}</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-purple-500/90 backdrop-blur p-2 rounded-full">
            <Play className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
          {anime.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-white/60 mb-2">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{anime.year || 'N/A'}</span>
          </div>
          <span className="bg-purple-500/20 px-2 py-1 rounded-full text-xs">
            {anime.status}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {anime.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre.mal_id}
              className="bg-white/10 px-2 py-1 rounded-full text-xs text-white/80"
            >
              {genre.name}
            </span>
          ))}
        </div>
        
        {anime.synopsis && (
          <p className="text-white/60 text-sm line-clamp-3">
            {anime.synopsis}
          </p>
        )}
      </div>
    </Link>
  );
};