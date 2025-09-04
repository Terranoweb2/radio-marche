import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Loader, AlertCircle } from 'lucide-react';

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('initializing');
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const audioRef = useRef(null);

  const streamUrl = 'https://terranoradio-serveur.terranoweb.com/letempsdedieu';

  // Tentative d'autoplay au chargement
  useEffect(() => {
    const startAutoPlay = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        setIsLoading(true);
        setConnectionStatus('connecting');
        setError(null);
        
        // Configuration audio
        audio.volume = volume;
        audio.load();
        
        // Attendre un peu puis essayer de jouer
        setTimeout(async () => {
          try {
            await audio.play();
            console.log('Autoplay réussi !');
            setAutoplayBlocked(false);
          } catch (autoplayError) {
            console.log('Autoplay bloqué par le navigateur:', autoplayError);
            setAutoplayBlocked(true);
            setIsLoading(false);
            setConnectionStatus('ready');
            setError('Cliquez sur le bouton de lecture pour commencer l\'écoute');
          }
        }, 1000);
      } catch (err) {
        console.error('Erreur lors de l\'autoplay:', err);
        setAutoplayBlocked(true);
        setIsLoading(false);
        setConnectionStatus('error');
        setError('Erreur de connexion au flux');
      }
    };

    startAutoPlay();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      console.log('Audio: Load start');
      setIsLoading(true);
      setConnectionStatus('connecting');
      setError(null);
    };

    const handleLoadedData = () => {
      console.log('Audio: Loaded data');
      setConnectionStatus('connected');
    };

    const handleCanPlay = () => {
      console.log('Audio: Can play');
      setIsLoading(false);
      setConnectionStatus('ready');
    };

    const handlePlaying = () => {
      console.log('Audio: Playing');
      setIsPlaying(true);
      setIsLoading(false);
      setConnectionStatus('playing');
      setError(null);
      setAutoplayBlocked(false);
    };

    const handlePause = () => {
      console.log('Audio: Paused');
      setIsPlaying(false);
      setConnectionStatus('paused');
    };

    const handleError = (e) => {
      console.error('Audio error:', e, audio.error);
      setIsLoading(false);
      setIsPlaying(false);
      setConnectionStatus('error');
      
      const errorCode = audio.error?.code;
      let errorMessage = 'Erreur lors du chargement du flux audio';
      
      switch (errorCode) {
        case 1:
          errorMessage = 'Lecture interrompue';
          break;
        case 2:
          errorMessage = 'Erreur réseau - Vérifiez votre connexion internet';
          break;
        case 3:
          errorMessage = 'Format audio non supporté par ce navigateur';
          break;
        case 4:
          errorMessage = 'Flux radio temporairement indisponible';
          break;
        default:
          errorMessage = 'Impossible de se connecter au flux radio';
      }
      
      setError(errorMessage);
    };

    const handleEnded = () => {
      console.log('Audio: Ended - Reconnexion automatique...');
      // Reconnexion automatique pour un flux en direct
      setTimeout(() => {
        playStream();
      }, 2000);
    };

    const handleWaiting = () => {
      console.log('Audio: Waiting/Buffering');
      setConnectionStatus('buffering');
    };

    const handleStalled = () => {
      console.log('Audio: Stalled - Tentative de reconnexion...');
      setConnectionStatus('reconnecting');
      // Essayer de relancer automatiquement
      setTimeout(() => {
        if (!isPlaying) {
          playStream();
        }
      }, 3000);
    };

    // Add all event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('stalled', handleStalled);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('stalled', handleStalled);
    };
  }, [isPlaying]);

  const playStream = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      setError(null);
      setIsLoading(true);
      setConnectionStatus('connecting');
      
      // Recharger le flux
      audio.load();
      
      // Lancer la lecture
      setTimeout(async () => {
        try {
          await audio.play();
          setAutoplayBlocked(false);
        } catch (playError) {
          console.error('Play error:', playError);
          setIsLoading(false);
          
          if (playError.name === 'NotAllowedError') {
            setAutoplayBlocked(true);
            setError('Cliquez sur le bouton de lecture pour commencer');
            setConnectionStatus('ready');
          } else {
            setError('Erreur de connexion au flux');
            setConnectionStatus('error');
          }
        }
      }, 500);
    } catch (err) {
      setIsLoading(false);
      setError('Erreur lors de la connexion au flux');
      setConnectionStatus('error');
      console.error('Stream play error:', err);
    }
  };

  const stopStream = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
    setConnectionStatus('paused');
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopStream();
    } else {
      playStream();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const getStatusDisplay = () => {
    switch (connectionStatus) {
      case 'initializing':
        return { text: 'Démarrage automatique...', color: 'text-blue-600', dot: 'bg-blue-500 animate-pulse' };
      case 'connecting':
        return { text: 'Connexion en cours...', color: 'text-yellow-600', dot: 'bg-yellow-500 animate-pulse' };
      case 'buffering':
        return { text: 'Mise en mémoire tampon...', color: 'text-blue-600', dot: 'bg-blue-500 animate-pulse' };
      case 'playing':
        return { text: '🔴 EN DIRECT', color: 'text-green-600', dot: 'bg-green-500 animate-pulse' };
      case 'paused':
        return { text: 'En pause', color: 'text-gray-600', dot: 'bg-gray-400' };
      case 'ready':
        return autoplayBlocked ? 
          { text: 'Prêt à diffuser', color: 'text-blue-600', dot: 'bg-blue-500' } :
          { text: 'Connexion...', color: 'text-blue-600', dot: 'bg-blue-500 animate-pulse' };
      case 'reconnecting':
        return { text: 'Reconnexion automatique...', color: 'text-orange-600', dot: 'bg-orange-500 animate-pulse' };
      case 'connected':
        return { text: 'Connecté - Lecture imminente', color: 'text-blue-600', dot: 'bg-blue-500 animate-pulse' };
      case 'error':
        return { text: 'Erreur de connexion', color: 'text-red-600', dot: 'bg-red-500' };
      default:
        return { text: 'Initialisation...', color: 'text-gray-600', dot: 'bg-gray-300 animate-pulse' };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white/20 rounded-full">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Le Temps de Dieu</h1>
            <p className="text-blue-100 text-sm">Radio spirituelle • Lecture automatique</p>
          </div>
        </div>
      </div>

      {/* Player Controls */}
      <div className="p-6">
        {/* Status */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className={`w-3 h-3 rounded-full ${status.dot}`}></div>
            <span className={`text-lg font-semibold ${status.color}`}>
              {status.text}
            </span>
          </div>
          
          {error && autoplayBlocked && (
            <div className="text-blue-600 text-sm bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
              <div className="flex items-center justify-center space-x-2">
                <Radio className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {error && !autoplayBlocked && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 mt-2">
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {!error && !isPlaying && connectionStatus === 'initializing' && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200 mt-2">
              <div className="flex items-center justify-center space-x-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Lancement automatique de la diffusion...</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Play Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={togglePlay}
            disabled={isLoading && !autoplayBlocked}
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                     disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                     text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl 
                     transform hover:scale-105 disabled:hover:scale-100 transition-all duration-200
                     focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {isLoading && !autoplayBlocked ? (
              <Loader className="w-8 h-8 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMute}
            className="p-3 text-gray-600 hover:text-blue-600 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
          
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                       [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:bg-blue-600
                       [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-0"
            />
          </div>
          
          <span className="text-sm text-gray-600 w-12 text-right font-medium">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>

        {/* Audio Element avec autoplay */}
        <audio
          ref={audioRef}
          autoPlay
          preload="auto"
        >
          <source src={streamUrl} type="audio/mpeg" />
          <source src={streamUrl} type="audio/aac" />
          <source src={streamUrl} />
          Votre navigateur ne supporte pas la lecture audio.
        </audio>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1 font-medium">
            Diffusion continue • Reconnexion automatique
          </p>
          <div className="text-xs text-gray-500">
            {isPlaying ? 'Diffusion en cours' : 
             isLoading ? 'Connexion au flux...' :
             autoplayBlocked ? 'Cliquez pour démarrer' :
             'Lecture automatique activée'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
