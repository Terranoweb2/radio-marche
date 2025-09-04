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
  Loader,
  Volume2,
  VolumeX,
  Settings,
  Sliders,
  X
} from 'lucide-react';

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const [balance, setBalance] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('default');
  const [equalizer, setEqualizer] = useState({
    bass: 0,
    mid: 0,
    treble: 0,
    lowMid: 0,
    highMid: 0
  });

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const pannerNodeRef = useRef(null);
  const filtersRef = useRef({});
  const streamUrl = 'https://terranoradio-serveur.terranoweb.com/letempsdedieu';
  const maxRetries = 3;

  // Audio presets
  const audioPresets = {
    default: { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0 },
    rock: { bass: 4, lowMid: 2, mid: -1, highMid: 3, treble: 5 },
    pop: { bass: 2, lowMid: 1, mid: 0, highMid: 2, treble: 3 },
    classical: { bass: -2, lowMid: -1, mid: 2, highMid: 3, treble: 2 },
    jazz: { bass: 3, lowMid: 1, mid: 1, highMid: 2, treble: 4 },
    electronic: { bass: 5, lowMid: 2, mid: -1, highMid: 4, treble: 6 },
    vocal: { bass: -1, lowMid: 2, mid: 4, highMid: 3, treble: 1 }
  };

  // Initialize Web Audio API (temporarily disabled due to CORS)
  const initializeAudioContext = () => {
    console.log('Web Audio API disabled due to CORS restrictions');
    // Fallback to basic audio element control
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  // Update equalizer (disabled due to CORS)
  const updateEqualizer = (newEqualizer) => {
    console.log('Equalizer update:', newEqualizer);
    // EQ functionality disabled due to CORS restrictions
  };

  // Update volume
  const updateVolume = (newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Update balance (disabled due to CORS)
  const updateBalance = (newBalance) => {
    console.log('Balance update:', newBalance);
    // Balance functionality disabled due to CORS restrictions
  };

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
      // Initialize audio context after play starts
      setTimeout(() => {
        initializeAudioContext();
      }, 100);
    };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onError = (e) => {
      console.error("Audio error:", e);
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(() => {});
          }
        }, 2000 * (retryCount + 1)); // Exponential backoff
      } else {
        setError("Impossible de charger le flux radio. Vérifiez votre connexion.");
      }
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

  // Update audio controls when values change
  useEffect(() => {
    updateVolume(volume);
  }, [volume]);

  useEffect(() => {
    updateBalance(balance);
  }, [balance]);

  useEffect(() => {
    updateEqualizer(equalizer);
  }, [equalizer]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const togglePlay = async () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      try {
        setIsLoading(true);
        setError(null);
        setRetryCount(0); // Reset retry count on manual play

        // Ensure audio element is ready
        if (audioRef.current) {
          audioRef.current.load(); // Reload to ensure fresh connection for live stream

          // Set basic volume before Web Audio API
          audioRef.current.volume = volume;

          await audioRef.current.play();
        }
      } catch (err) {
        console.error("Play error:", err);
        if (err.name === 'NotAllowedError') {
          setError("Veuillez cliquer sur le bouton play pour démarrer la lecture.");
        } else if (err.name === 'NotSupportedError') {
          setError("Format audio non supporté par votre navigateur.");
        } else if (err.name === 'NetworkError') {
          setError("Erreur réseau. Vérifiez votre connexion internet.");
        } else {
          setError("Erreur lors de la lecture. Réessayez dans quelques instants.");
        }
        setIsLoading(false);
        setIsPlaying(false);
      }
    }
  };

  // Volume control functions
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    updateVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume);
      updateVolume(previousVolume);
    } else {
      setIsMuted(true);
      setPreviousVolume(volume);
      setVolume(0);
      updateVolume(0);
    }
  };

  // Balance control
  const handleBalanceChange = (newBalance) => {
    setBalance(newBalance);
    updateBalance(newBalance);
  };

  // Equalizer control
  const handleEqualizerChange = (band, value) => {
    const newEqualizer = { ...equalizer, [band]: value };
    setEqualizer(newEqualizer);
    updateEqualizer(newEqualizer);
  };

  // Preset selection
  const applyPreset = (presetName) => {
    const preset = audioPresets[presetName];
    setSelectedPreset(presetName);
    setEqualizer(preset);
    updateEqualizer(preset);
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
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-player-text-secondary hover:text-white transition-colors"
        >
          <MoreVertical size={24} />
        </button>
      </header>

      {/* Audio Controls Menu */}
      {showMenu && (
        <div className="flex-shrink-0 bg-player-light rounded-lg p-4 mb-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings size={20} />
              Contrôles Audio
            </h3>
            <button
              onClick={() => setShowMenu(false)}
              className="p-1 text-player-text-secondary hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                Volume
              </label>
              <button
                onClick={toggleMute}
                className="p-1 text-player-text-secondary hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-player-text-secondary">0</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-xs text-player-text-secondary">100</span>
            </div>
            <div className="text-xs text-player-text-secondary text-center">
              {Math.round(volume * 100)}%
            </div>
          </div>

          {/* Balance Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Balance (L/R)</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-player-text-secondary">L</span>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={balance}
                onChange={(e) => handleBalanceChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-xs text-player-text-secondary">R</span>
            </div>
            <div className="text-xs text-player-text-secondary text-center">
              {balance === 0 ? 'Centre' : balance < 0 ? `L ${Math.abs(Math.round(balance * 100))}%` : `R ${Math.round(balance * 100)}%`}
            </div>
          </div>

          {/* Info Notice */}
          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-2 mb-4">
            <div className="text-blue-200 text-xs">
              <strong>Info:</strong> Égaliseur et balance disponibles prochainement.
            </div>
          </div>

          {/* Audio Presets */}
          <div className="space-y-2 opacity-50">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sliders size={16} />
              Préréglages Audio (Désactivé)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(audioPresets).map((preset) => (
                <button
                  key={preset}
                  onClick={() => applyPreset(preset)}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    selectedPreset === preset
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-player-text-secondary hover:bg-gray-600'
                  }`}
                >
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Equalizer */}
          <div className="space-y-3 opacity-50">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sliders size={16} />
              Égaliseur (Désactivé)
            </label>

            {/* Bass */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-player-text-secondary">Graves</span>
                <span className="text-xs text-player-text-secondary">{equalizer.bass > 0 ? '+' : ''}{equalizer.bass}dB</span>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={equalizer.bass}
                onChange={(e) => handleEqualizerChange('bass', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Low Mid */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-player-text-secondary">Médiums Bas</span>
                <span className="text-xs text-player-text-secondary">{equalizer.lowMid > 0 ? '+' : ''}{equalizer.lowMid}dB</span>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={equalizer.lowMid}
                onChange={(e) => handleEqualizerChange('lowMid', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Mid */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-player-text-secondary">Médiums</span>
                <span className="text-xs text-player-text-secondary">{equalizer.mid > 0 ? '+' : ''}{equalizer.mid}dB</span>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={equalizer.mid}
                onChange={(e) => handleEqualizerChange('mid', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* High Mid */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-player-text-secondary">Médiums Hauts</span>
                <span className="text-xs text-player-text-secondary">{equalizer.highMid > 0 ? '+' : ''}{equalizer.highMid}dB</span>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={equalizer.highMid}
                onChange={(e) => handleEqualizerChange('highMid', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Treble */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-player-text-secondary">Aigus</span>
                <span className="text-xs text-player-text-secondary">{equalizer.treble > 0 ? '+' : ''}{equalizer.treble}dB</span>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={equalizer.treble}
                onChange={(e) => handleEqualizerChange('treble', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>


        </div>
      )}

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
          {error && (
            <p className="text-red-400 text-sm mt-1">{error}</p>
          )}
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
      
      <audio
        ref={audioRef}
        preload="none"
        className="hidden"
        controls={false}
      >
        <source src={streamUrl} type="audio/mpeg" />
        <source src={streamUrl} type="audio/aac" />
        <source src={streamUrl} />
        Votre navigateur ne supporte pas la lecture audio.
      </audio>
    </div>
  );
};

export default RadioPlayer;
