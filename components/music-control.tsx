"use client"

import { useState, useRef, useEffect } from "react"

export default function MusicControl() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.5

    const cleanupUserInteractionListeners = () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }

    const startPlayback = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
        cleanupUserInteractionListeners()
      } catch {
        // Playback still blocked by browser policy.
      }
    }

    function handleUserInteraction() {
      void startPlayback()
    }

    const enablePlaybackOnInteraction = () => {
      const options = { once: true } as const
      document.addEventListener("click", handleUserInteraction, options)
      document.addEventListener("keydown", handleUserInteraction, options)
      document.addEventListener("touchstart", handleUserInteraction, options)
    }

    startPlayback().then(() => {
      if (!audio.paused) return
      enablePlaybackOnInteraction()
    })

    return cleanupUserInteractionListeners
  }, [])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch(() => {
          setIsPlaying(false)
        })
    }
  }

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/homepage-music.wav" type="audio/wav" />
      </audio>
      <button className={`music-control ${isPlaying ? "playing" : ""}`} onClick={toggleMusic} type="button">
        <i className="fas fa-music"></i>
      </button>
    </>
  )
}
