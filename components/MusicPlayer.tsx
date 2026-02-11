
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';

interface MusicPlayerProps {
  src: string;
  autoPlay?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ src, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay was prevented by browser:", error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      // Attempt autoplay. Browsers usually block this unless there's an interaction.
      // If the memory is private, the password button click counts as interaction.
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.log("Autoplay was prevented by browser policy:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [autoPlay, src]);

  return (
    <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
      <button 
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center bg-white text-rose-500 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
      </button>
      <div className="flex-1 overflow-hidden">
        <div className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">Now Playing</div>
        <div className="text-sm text-white font-medium truncate">Music for Memories</div>
      </div>
      <Music className="text-white/50 animate-pulse" size={20} />
      <audio ref={audioRef} src={src} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
    </div>
  );
};
