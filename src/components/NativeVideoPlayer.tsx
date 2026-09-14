import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  RotateCcw,
  FastForward,
  Loader2,
  AlertCircle,
  Film,
  ExternalLink,
  Sparkles,
  Settings,
  Tv
} from 'lucide-react';
import { OsceVideo } from '../types';

interface NativeVideoPlayerProps {
  video: OsceVideo;
  onSwitchToYouTube?: () => void;
}

export const NativeVideoPlayer: React.FC<NativeVideoPlayerProps> = ({
  video,
  onSwitchToYouTube
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [selectedMirror, setSelectedMirror] = useState<number>(0);
  const [autoplayBlockedNotice, setAutoplayBlockedNotice] = useState(false);

  // Available stream fallback mirrors
  const streamMirrors = [
    video.streamUrl,
    // Reliable backup mirrors if cloud stream URL is slow or throttled
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
  ].filter(Boolean);

  const currentStreamUrl = streamMirrors[selectedMirror] || video.streamUrl;

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset states on video change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setHasError(false);
    setIsBuffering(false);
    setSelectedMirror(0);
    setAutoplayBlockedNotice(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      // Attempt gentle playback on mount
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlockedNotice(false);
          })
          .catch(() => {
            // Autoplay with audio was prevented by browser policy (expected)
            setIsPlaying(false);
            setAutoplayBlockedNotice(true);
          });
      }
    }
  }, [video.id]);

  // Handle Play/Pause Toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    setAutoplayBlockedNotice(false);

    if (videoRef.current.paused || videoRef.current.ended) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Playback gesture error:', err);
            // Fallback: mute and try again if browser requires mute for initial play
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true));
            }
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle Timeline Scrubbing
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Handle Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      setVolume(0.8);
      videoRef.current.volume = 0.8;
    }
  };

  // Handle Speed Change
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Handle Fullscreen Toggle
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (e) {
        console.warn('Fullscreen error:', e);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      } catch (e) {
        console.warn('Exit fullscreen error:', e);
      }
    }
  };

  // Switch Stream Mirror
  const handleSwitchMirror = () => {
    const nextIndex = (selectedMirror + 1) % streamMirrors.length;
    setSelectedMirror(nextIndex);
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Picture in Picture
  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP error:', e);
    }
  };

  return (
    <div
      ref={containerRef}
      id={`native-hd-player-${video.id}`}
      className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl group select-none flex flex-col justify-between"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={(e) => {
        // Only toggle play if clicking outside controls
        if ((e.target as HTMLElement).closest('.player-controls-bar')) return;
        togglePlay();
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={currentStreamUrl}
        poster={video.thumbnailUrl}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        className="w-full h-full object-cover cursor-pointer"
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setHasError(false);
          }
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
          setHasError(false);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          console.warn('Native video stream error on source:', currentStreamUrl);
          setIsBuffering(false);
          setHasError(true);
        }}
      >
        <source src={currentStreamUrl} type="video/mp4" />
        Your browser does not support HTML5 video streaming.
      </video>

      {/* Top Overlay Badge Bar */}
      <div
        className={`absolute top-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-20 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Native HD Stream (1080p)
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-zinc-300 border border-zinc-700 hidden sm:inline">
            Server {selectedMirror + 1} of {streamMirrors.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSwitchMirror();
            }}
            className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-[11px] font-bold text-zinc-200 border border-zinc-700 flex items-center gap-1 transition-colors cursor-pointer"
            title="Switch video server stream mirror"
          >
            <RotateCcw className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Switch Stream Server</span>
          </button>

          {onSwitchToYouTube && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToYouTube();
              }}
              className="px-2.5 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-[11px] font-bold text-white flex items-center gap-1 transition-colors cursor-pointer"
              title="Switch to YouTube Embed Player"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">YouTube Player</span>
            </button>
          )}
        </div>
      </div>

      {/* Buffering Spinner Overlay */}
      {isBuffering && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] z-10 pointer-events-none">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
          <span className="text-xs font-bold text-white mt-2 drop-shadow-md">Buffering HD Stream...</span>
        </div>
      )}

      {/* Big Central Play / Pause Button Overlay */}
      {!isPlaying && !isBuffering && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="relative group-hover:scale-110 transition-transform duration-200">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-2xl border border-emerald-400/40 backdrop-blur-sm">
              <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" />
            </div>
            {autoplayBlockedNotice && (
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-black/80 border border-emerald-500/40 text-[11px] font-semibold text-emerald-300 shadow-lg">
                Click anywhere to Play with Audio
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Fallback Box */}
      {hasError && (
        <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
          <AlertCircle className="h-10 w-10 text-amber-400" />
          <h4 className="font-black text-sm text-white">Stream Buffering Notice</h4>
          <p className="text-xs text-zinc-400 max-w-md">
            This stream mirror is experiencing network latency. You can switch to backup servers or stream via YouTube.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSwitchMirror();
              }}
              className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 cursor-pointer shadow-lg"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Try Next Stream Mirror</span>
            </button>
            {onSwitchToYouTube && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchToYouTube();
                }}
                className="px-4 py-2 rounded-full text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center space-x-1.5 cursor-pointer"
              >
                <Film className="h-3.5 w-3.5 text-red-400" />
                <span>Switch to YouTube Player</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div
        className={`player-controls-bar absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 sm:p-4 transition-opacity duration-300 z-20 space-y-2 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Timeline Progress Scrubber */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-white">
          {/* Left Controls: Play/Pause, Volume, Time */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none hidden xs:block"
              />
            </div>

            {/* Time Stamp */}
            <span className="font-mono text-[11px] text-zinc-300">
              {formatTime(currentTime)} <span className="text-zinc-500">/</span> {formatTime(duration || 0)}
            </span>
          </div>

          {/* Right Controls: Playback Speed, PiP, Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Speed Selector */}
            <div className="flex items-center bg-zinc-800/80 rounded-lg p-0.5 border border-zinc-700 text-[10px] font-bold">
              {[0.75, 1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-emerald-600 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Picture in Picture */}
            <button
              onClick={togglePiP}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer hidden sm:block"
              title="Picture in Picture"
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
