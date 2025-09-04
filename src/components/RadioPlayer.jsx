import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  MoreVertical,
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Loader
} from 'lucide-react';

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const audioRef = useRef(null);
  const streamUrl = 'https://terranoradio-serveur.terranoweb.com/letempsdedieu';

  // Autoplay attempt on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const attemptAutoplay = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await audio.play();
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          setAutoplayBlocked(true);
        } else {
          setError("Erreur de connexion au flux.");
        }
        setIsPlaying(false);
        setIsLoading(false);
      }
    };

    attemptAutoplay();
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setAutoplayBlocked(false);
      setError(null);
    };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onError = () => {
      setError("Impossible de charger le flux radio.");
      setIsPlaying(false);
      setIsLoading(false);
    };
    const onEnded = () => {
      // Try to reconnect on stream end
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch(() => {});
        }
      }, 2000);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('playing', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('playing', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.load(); // Reload to ensure fresh connection for live stream
      audioRef.current.play().catch(err => {
        setError("Erreur lors de la lecture.");
        console.error("Play error:", err);
      });
    }
  };

  const albumArtUrl = "https://res.cloudinary.com/dxy0fiahv/image/upload/v1747408243/LOGO_Temps1_ahewfw.png";

  return (
    <div className="bg-player-dark text-white h-full flex flex-col p-4 space-y-6 overflow-y-auto">
      {/* Header */}
      <header className="flex-shrink-0 flex justify-between items-center">
        <button className="p-2 text-player-text-secondary hover:text-white transition-colors">
          <ChevronDown size={24} />
        </button>
        <div className="text-center">
          <p className="text-xs uppercase text-player-text-secondary tracking-wider">En direct</p>
          <h2 className="font-semibold">Le Temps de Dieu</h2>
        </div>
        <button className="p-2 text-player-text-secondary hover:text-white transition-colors">
          <MoreVertical size={24} />
        </button>
      </header>

      {/* Album Art */}
      <div className="flex-grow flex items-center justify-center">
        <div className="relative w-64 h-64">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 transition-all duration-500 ${isPlaying ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-1 bg-player-dark rounded-full p-4">
              <img
                src={albumArtUrl}
                alt="Logo Le Temps de Dieu"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
          <div className="absolute bottom-6 right-6 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg uppercase tracking-wider">
            Live
          </div>
        </div>
      </div>
      
      {/* Stream Info & Like button */}
      <div className="flex-shrink-0 flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-2xl font-bold">Passage</h1>
          <p className="text-player-text-secondary">Roary</p>
        </div>
        <button className="p-2 text-player-text-secondary hover:text-red-500 transition-colors">
            <Heart size={22} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 flex justify-around items-center text-player-text-secondary">
        <button className="p-2 hover:text-white transition-colors">
          <Shuffle size={20} />
        </button>
        <button className="p-2 hover:text-white transition-colors">
          <SkipBack size={24} />
        </button>
        <button
          onClick={togglePlay}
          className="w-16 h-16 bg-white text-player-dark rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform"
          disabled={isLoading && autoplayBlocked}
        >
          {isLoading && !autoplayBlocked ? (
            <Loader className="animate-spin" size={28} />
          ) : isPlaying ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play className="ml-1" size={28} fill="currentColor" />
          )}
        </button>
        <button className="p-2 hover:text-white transition-colors">
          <SkipForward size={24} />
        </button>
        <button className="p-2 hover:text-white transition-colors">
          <Repeat size={20} />
        </button>
      </div>
      
      {/* Placeholder for "Next Songs" */}
      <div className="flex-shrink-0 pt-4">
        <h3 className="text-lg font-semibold mb-2">À suivre</h3>
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-player-light transition-colors cursor-pointer">
          <div className="flex items-center space-x-4">
            <img src="https://res.cloudinary.com/dxy0fiahv/image/upload/v1747408243/LOGO_Temps1_ahewfw.png" className="w-12 h-12 rounded-md object-contain bg-slate-700 p-1" alt="Logo Le Temps de Dieu" />
            <div>
              <p className="font-semibold">Prière du matin</p>
              <p className="text-sm text-player-text-secondary">Méditation</p>
            </div>
          </div>
          <p className="text-sm text-player-text-secondary">8:00</p>
        </div>
      </div>
      
      <audio ref={audioRef} preload="auto" className="hidden">
        <source src={streamUrl} type="audio/mpeg" />
        <source src={streamUrl} type="audio/aac" />
        <source src={streamUrl} />
        Votre navigateur ne supporte pas la lecture audio.
      </audio>
    </div>
  );
};

export default RadioPlayer;
