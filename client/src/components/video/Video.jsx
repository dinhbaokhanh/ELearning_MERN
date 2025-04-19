import { useCallback, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Slider } from '../ui/slider'
import { Button } from '../ui/button'
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from 'lucide-react'

const VideoPlayer = ({
  width = '100%',
  height = '100%',
  url,
  onProgressUpdate,
  progressData,
}) => {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showControls, setShowControls] = useState(true)

  const playerRef = useRef(null)
  const playerContainerRef = useRef(null)
  const controlsTimeoutRef = useRef(null)

  const handlePlayAndPause = () => setPlaying(!playing)
  const handleRewind = () =>
    playerRef?.current?.seekTo(playerRef.current.getCurrentTime() - 5)
  const handleForward = () =>
    playerRef?.current?.seekTo(playerRef.current.getCurrentTime() + 5)
  const handleToggleMute = () => setMuted(!muted)
  const handleSeekChange = (value) => {
    setPlayed(value[0])
    setSeeking(true)
  }
  const handleSeekMouseUp = () => {
    setSeeking(false)
    playerRef.current?.seekTo(played)
  }
  const handleVolumeChange = (value) => setVolume(value[0])
  const handleProgress = (state) => {
    if (!seeking) setPlayed(state.played)
  }

  const pad = (str) => ('0' + str).slice(-2)
  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = pad(date.getUTCSeconds())
    return hh ? `${hh}:${pad(mm)}:${ss}` : `${mm}:${ss}`
  }

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      playerContainerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen?.()
    }
  }, [isFullScreen])

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2500)
  }

  useEffect(() => {
    const handleFullScreenChange = () =>
      setIsFullScreen(document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
  }, [])

  useEffect(() => {
    if (played === 1) {
      onProgressUpdate({ ...progressData, progressValue: played })
    }
  }, [played])

  return (
    <div
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      className={`relative rounded-lg overflow-hidden bg-black transition-all duration-300 ease-in-out ${
        isFullScreen ? 'w-screen h-screen' : ''
      }`}
      style={{ width, height }}
    >
      {url ? (
        <ReactPlayer
          ref={playerRef}
          className="absolute top-0 left-0"
          width="100%"
          height="100%"
          url={url}
          playing={playing}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
        />
      ) : (
        <div className="text-white text-center p-4">No video available</div>
      )}

      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-zinc-800/80 px-4 py-3 space-y-3 transition-opacity duration-300">
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={(v) => handleSeekChange([v[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className="w-full"
          />
          <div className="flex items-center justify-between text-zinc-100">
            <div className="flex items-center gap-2">
              <IconBtn onClick={handlePlayAndPause}>
                {playing ? <Pause /> : <Play />}
              </IconBtn>
              <IconBtn onClick={handleRewind}>
                <RotateCcw />
              </IconBtn>
              <IconBtn onClick={handleForward}>
                <RotateCw />
              </IconBtn>
              <IconBtn onClick={handleToggleMute}>
                {muted ? <VolumeX /> : <Volume2 />}
              </IconBtn>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(v) => handleVolumeChange([v[0] / 100])}
                className="w-24"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-mono">
                {formatTime(played * (playerRef.current?.getDuration() || 0))} /{' '}
                {formatTime(playerRef.current?.getDuration() || 0)}
              </span>
              <IconBtn onClick={handleFullScreen}>
                {isFullScreen ? <Minimize /> : <Maximize />}
              </IconBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function IconBtn({ onClick, children }) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      className="text-zinc-100 hover:bg-zinc-700/80 cursor-pointer"
    >
      {children}
    </Button>
  )
}

export default VideoPlayer
