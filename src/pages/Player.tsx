import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Volume2, Maximize, Settings } from 'lucide-react';
import { Anime } from '../types/anime';
import { jikanApi } from '../services/jikanApi';
import { getEpisodeStream } from '../services/wajikApi';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Player: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState('server1');
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await jikanApi.getAnimeById(parseInt(id));
        setAnime(response.data);
        const episodesResponse = await jikanApi.getAnimeEpisodes(parseInt(id));
        setEpisodes(episodesResponse.data || []);
        if (episodesResponse.data && episodesResponse.data.length > 0) {
          setSelectedEpisodeIndex(0);
        }
      } catch (err) {
        setError('Failed to fetch anime details. Please try again later.');
        console.error('Error fetching anime details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeDetail();
  }, [id]);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      if (episodes.length === 0) return;
      const episode = episodes[selectedEpisodeIndex];
      if (!episode) return;
      try {
        setLoadingVideo(true);
        setError(null);
        let episodeId = null;
        if (episode.url) {
          const parts = episode.url.split('/');
          episodeId = parts[parts.length - 1];
        }
        if (!episodeId && episode.mal_id) {
          episodeId = episode.mal_id.toString();
        }
        if (!episodeId && episode.id) {
          episodeId = episode.id.toString();
        }
        console.log('Fetching video for episodeId:', episodeId);
        if (!episodeId) {
          setError('Episode ID tidak ditemukan untuk streaming.');
          setVideoUrl(null);
          return;
        }
        const streamData = await getEpisodeStream(episodeId);
        console.log('Stream data:', streamData);
        if (streamData && streamData.url) {
          setVideoUrl(streamData.url);
        } else {
          setError('Tidak ada sumber streaming yang tersedia.');
          setVideoUrl(null);
        }
      } catch (err) {
        setError('Failed to fetch video stream. Please try again later.');
        console.error('Error fetching video stream:', err);
        setVideoUrl(null);
      } finally {
        setLoadingVideo(false);
      }
    };
    fetchVideoUrl();
  }, [episodes, selectedEpisodeIndex, selectedServer]);

  if (loading) return <LoadingSpinner />;

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
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Link
          to={`/anime/${anime.mal_id}`}
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Details</span>
        </Link>
        <div className="text-white/60">|</div>
        <h1 className="text-xl font-semibold text-white truncate">
          {anime.title} - Episode {selectedEpisodeIndex + 1}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-black rounded-xl overflow-hidden border border-white/20">
            <div className="bg-white/10 backdrop-blur-sm p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-semibold">{anime.title}</h2>
                  <p className="text-white/60 text-sm">Episode {selectedEpisodeIndex + 1}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-white/80" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Maximize className="w-5 h-5 text-white/80" />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative aspect-video">
              {loadingVideo ? (
                <div className="flex items-center justify-center h-full bg-gray-800">
                  <LoadingSpinner />
                </div>
              ) : videoUrl ? (
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  frameBorder="0"
                  title={`${anime.title} - Episode ${selectedEpisodeIndex + 1}`}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-800">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">Tidak ada sumber streaming yang tersedia.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Play className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Volume2 className="w-5 h-5 text-white" />
                  </button>
                  <div className="text-white/80 text-sm">00:00 / 24:00</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white/60 text-sm">Quality:</span>
                  <select className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm">
                    <option value="1080p">1080p</option>
                    <option value="720p">720p</option>
                    <option value="480p">480p</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Episode {selectedEpisodeIndex + 1}</h3>
            <p className="text-white/80 leading-relaxed">
              {anime.synopsis || 'Watch the episode and enjoy the story!'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Streaming Servers</h3>
            <div className="space-y-2">
              {['server1', 'server2', 'server3'].map((server) => (
                <button
                  key={server}
                  onClick={() => setSelectedServer(server)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedServer === server
                      ? 'bg-purple-500/30 border border-purple-400/50 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{server}</span>
                    {selectedServer === server && (
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Episodes</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {episodes.map((episode, index) => (
                <button
                  key={episode.mal_id || episode.id || index}
                  onClick={() => setSelectedEpisodeIndex(index)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedEpisodeIndex === index
                      ? 'bg-purple-500/30 border border-purple-400/50 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Episode {index + 1}</span>
                    {selectedEpisodeIndex === index && (
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="aspect-[3/4] mb-4">
              <img
                src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                alt={anime.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{anime.title}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Status:</span>
                <span className="text-white">{anime.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Episodes:</span>
                <span className="text-white">{anime.episodes || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Score:</span>
                <span className="text-white">{anime.score || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
