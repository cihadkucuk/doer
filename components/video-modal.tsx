"use client"

import type React from "react"

interface VideoModalProps {
  isOpen: boolean
  videoId: string
  onClose: () => void
}

export default function VideoModal({ isOpen, videoId, onClose }: VideoModalProps) {
  if (!isOpen) return null

  const handleClose = () => {
    onClose()
    document.body.style.overflow = ""
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div className={`video-modal ${isOpen ? "active" : ""}`} onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="close-modal" onClick={handleClose} type="button">
          &times;
        </button>
        <div className="video-container">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}
