"use client"

import { useEffect, useRef } from "react"

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <div className="video-background">
      <video ref={videoRef} autoPlay muted loop playsInline preload="metadata">
        <source src="/videos/index_video.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
