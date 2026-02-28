"use client"

import { useState, useRef, useEffect } from "react"

export default function MusicControl() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.5

    const playAudio = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch(() => {
          const handleUserInteraction = () => {
            if (!isPlaying) {
              toggleMusic()
            }
          }

          document.addEventListener("click", handleUserInteraction, { once: true })
          document.addEventListener("keydown", handleUserInteraction, { once: true })
          document.addEventListener("touchstart", handleUserInteraction, { once: true })
        })
    }

    playAudio()
  }, [])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
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
