"use client"

import { useState, useRef, useEffect } from "react"
import VideoBackground from "@/components/video-background"
import MusicControl from "@/components/music-control"
import VideoModal from "@/components/video-modal"

type ContentType = "home" | "contact"
type CompositionType = "originals" | "scenes" | "advertisements"

interface VideoItem {
  id: string
  title: string
  thumbnail: string
}

const CATEGORY_HASH: Record<CompositionType, string> = {
  originals: "originals-page",
  scenes: "scenes-page",
  advertisements: "advertisements-page",
}

const PREVIEW_LAYOUT_CYCLE = [
  "preview-hero",
  "preview-portrait",
  "preview-wide",
  "preview-strip",
  "preview-tall",
  "preview-feature",
  "preview-card",
  "preview-strip",
] as const

const VIDEO_DATA: Record<CompositionType, VideoItem[]> = {
  originals: [
    { id: "S_MbbWreC2E", title: "Original 1", thumbnail: "https://img.youtube.com/vi/S_MbbWreC2E/maxresdefault.jpg" },
    { id: "2uMHg_rMs5I", title: "Original 2", thumbnail: "https://img.youtube.com/vi/2uMHg_rMs5I/maxresdefault.jpg" },
    { id: "la9_GITuvSw", title: "Original 3", thumbnail: "https://img.youtube.com/vi/la9_GITuvSw/maxresdefault.jpg" },
    { id: "lOE9iBBehlI", title: "Original 4", thumbnail: "https://img.youtube.com/vi/lOE9iBBehlI/maxresdefault.jpg" },
    { id: "ieq1iRQ8NeE", title: "Original 5", thumbnail: "https://img.youtube.com/vi/ieq1iRQ8NeE/maxresdefault.jpg" },
    { id: "ZKHF7wzRWFk", title: "Original 6", thumbnail: "https://img.youtube.com/vi/ZKHF7wzRWFk/maxresdefault.jpg" },
    { id: "6ARS_zFoReA", title: "Original 7", thumbnail: "https://img.youtube.com/vi/6ARS_zFoReA/maxresdefault.jpg" },
    { id: "BbDb0F1BMx8", title: "Original 8", thumbnail: "https://img.youtube.com/vi/BbDb0F1BMx8/maxresdefault.jpg" },
    { id: "i30AM2wM3CI", title: "Original 9", thumbnail: "https://img.youtube.com/vi/i30AM2wM3CI/maxresdefault.jpg" },
    { id: "t-1vM7OlWzw", title: "Original 10", thumbnail: "https://img.youtube.com/vi/t-1vM7OlWzw/maxresdefault.jpg" },
    { id: "UKorp1P3jGw", title: "Original 11", thumbnail: "https://img.youtube.com/vi/UKorp1P3jGw/maxresdefault.jpg" },
    { id: "ZPvqr6FYbYY", title: "Original 12", thumbnail: "https://img.youtube.com/vi/ZPvqr6FYbYY/maxresdefault.jpg" },
    { id: "SgjiSy9hxaA", title: "Original 13", thumbnail: "https://img.youtube.com/vi/SgjiSy9hxaA/maxresdefault.jpg" },
  ],
  scenes: [
    { id: "6WqBUVz7JTw", title: "Scene 1", thumbnail: "https://img.youtube.com/vi/6WqBUVz7JTw/maxresdefault.jpg" },
    { id: "RN-52YFMpmc", title: "Scene 2", thumbnail: "https://img.youtube.com/vi/RN-52YFMpmc/maxresdefault.jpg" },
    { id: "Hl1FdWL0ILE", title: "Scene 3", thumbnail: "https://img.youtube.com/vi/Hl1FdWL0ILE/maxresdefault.jpg" },
    { id: "93HIiEuBwmo", title: "Scene 4", thumbnail: "https://img.youtube.com/vi/93HIiEuBwmo/maxresdefault.jpg" },
  ],
  advertisements: [
    { id: "0Xj1_vruRBs", title: "Advertisement 1", thumbnail: "https://img.youtube.com/vi/0Xj1_vruRBs/maxresdefault.jpg" },
    { id: "RNa04QjtnPI", title: "Advertisement 2", thumbnail: "https://img.youtube.com/vi/RNa04QjtnPI/maxresdefault.jpg" },
    { id: "TNqOpCY4kfA", title: "Advertisement 3", thumbnail: "https://img.youtube.com/vi/TNqOpCY4kfA/maxresdefault.jpg" },
    { id: "bFfD6p8LCX8", title: "Advertisement 4", thumbnail: "https://img.youtube.com/vi/bFfD6p8LCX8/maxresdefault.jpg" },
  ],
}

export default function Home() {
  const [currentContent, setCurrentContent] = useState<ContentType>("home")
  const [currentComposition, setCurrentComposition] = useState<CompositionType | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; videoId: string }>({
    isOpen: false,
    videoId: "",
  })
  const [isContactSubmitting, setIsContactSubmitting] = useState(false)
  const [contactFeedback, setContactFeedback] = useState<{
    type: "success" | "error" | null
    message: string
  }>({
    type: null,
    message: "",
  })

  useEffect(() => {
    if (contactFeedback.type !== "success" || !contactFeedback.message) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setContactFeedback({ type: null, message: "" })
    }, 4500)

    return () => window.clearTimeout(timeoutId)
  }, [contactFeedback.type, contactFeedback.message])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    const applyHashState = () => {
      const hash = window.location.hash.replace("#", "")
      const matched = (Object.keys(CATEGORY_HASH) as CompositionType[]).find((key) => CATEGORY_HASH[key] === hash)

      if (matched) {
        setCurrentComposition(matched)
        setCurrentContent("home")
      } else if (!hash) {
        setCurrentComposition(null)
      }
    }

    applyHashState()
    window.addEventListener("hashchange", applyHashState)
    return () => window.removeEventListener("hashchange", applyHashState)
  }, [])

  const showContent = (contentId: ContentType) => {
    setCurrentContent(contentId)
    setCurrentComposition(null)
    setIsDropdownOpen(false)

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search)
    }
  }

  const showComposition = (composition: CompositionType) => {
    setCurrentComposition(composition)
    setCurrentContent("home")
    setIsDropdownOpen(false)
    window.history.replaceState(null, "", `#${CATEGORY_HASH[composition]}`)
  }

  const openVideoModal = (videoId: string) => {
    setVideoModal({ isOpen: true, videoId })
    document.body.style.overflow = "hidden"

    // pause background music if playing
    const audio = document.querySelector('audio')
    if (audio && !audio.paused) {
      audio.pause()
    }
  }

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, videoId: "" })
    document.body.style.overflow = ""
  }

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nativeEvent = e.nativeEvent as Event & {
      stopImmediatePropagation?: () => void
    }
    nativeEvent.stopImmediatePropagation?.()
    const form = e.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const message = String(formData.get("message") ?? "").trim()

    if (!name || !email || !message) {
      setContactFeedback({
        type: "error",
        message: "Please fill in all fields.",
      })
      return
    }

    setIsContactSubmitting(true)
    setContactFeedback({ type: null, message: "" })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      const result = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        setContactFeedback({
          type: "error",
          message: result?.error ?? "Message could not be sent.",
        })
        return
      }

      form.reset()
      setContactFeedback({
        type: "success",
        message: "Thanks, your message has been sent.",
      })
    } catch {
      setContactFeedback({
        type: "error",
        message: "Network error, please try again.",
      })
    } finally {
      setIsContactSubmitting(false)
    }
  }

  const renderCompositionGrid = (videos: VideoItem[]) => (
    <div className="video-grid">
      {videos.map((video, index) => {
        const previewLayout = PREVIEW_LAYOUT_CYCLE[index % PREVIEW_LAYOUT_CYCLE.length]

        return (
          <div key={video.id} className={`video-item ${previewLayout}`}>
          <div className="video-thumbnail" data-video-id={video.id} onClick={() => openVideoModal(video.id)}>
            <img
              src={video.thumbnail || "/placeholder.svg"}
              alt={video.title}
              loading="lazy"
              decoding="async"
            />
            <div className="play-overlay">
              <i className="play-icon fas fa-play" />
            </div>
          </div>
          </div>
        )
      })}
    </div>
  )

  const currentCompositionMeta = currentComposition
    ? { title: currentComposition.charAt(0).toUpperCase() + currentComposition.slice(1) }
    : null
  const hasLeftPanelContent = currentContent === "contact" || Boolean(currentComposition)

  return (
    <>
      <VideoBackground />
      <MusicControl />
      
      <div className={`container ${hasLeftPanelContent ? "with-panel" : "home-view"}`}>
        <div className={`left-section ${hasLeftPanelContent ? "has-content" : "is-empty"}`}>
          {currentContent === "contact" && (
            <div className="content active" id="about">
              <div className="contact-section">
                <h3 style={{ fontFamily: "'Montserrat', sans-serif" }}>"Music is My Soul"</h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontStyle: "italic" }}>-doermusic</p>
                <div className="contact-info">
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <span>info@docstudios.eu</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Prague, Czechia</span>
                  </div>
                </div>

                <div className="contact-form">
                  <form onSubmitCapture={handleContactSubmit}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      disabled={isContactSubmitting}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      disabled={isContactSubmitting}
                      required
                    />
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      disabled={isContactSubmitting}
                      required
                    />
                    <button type="submit" disabled={isContactSubmitting}>
                      {isContactSubmitting ? "Sending..." : "Send Message"}
                    </button>
                    {contactFeedback.message && (
                      <div
                        className={`contact-feedback ${
                          contactFeedback.type === "error"
                            ? "is-error"
                            : "is-success"
                        }`}
                        role="status"
                        aria-live="polite"
                      >
                        <i
                          className={`fas ${
                            contactFeedback.type === "error"
                              ? "fa-triangle-exclamation"
                              : "fa-circle-check"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="contact-feedback-text">
                          {contactFeedback.message}
                        </span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          )}

          {currentComposition && (
            <section className="category-page active" id={CATEGORY_HASH[currentComposition]}>
              <header className="category-header">
                <button className="back-button" onClick={() => showContent("home")} type="button">
                  <img src="/images/back-arrow.png" alt="Back" />
                </button>
                <h2>{currentCompositionMeta?.title}</h2>
              </header>

              <div className="category-content">{renderCompositionGrid(VIDEO_DATA[currentComposition])}</div>
            </section>
          )}
        </div>

        <div className="right-section">
          <nav className="navigation">
            <button className="nav-item" onClick={() => showContent("home")} type="button">
              Home
            </button>

            <div
              className={`dropdown ${isDropdownOpen ? "open" : ""}`}
              ref={dropdownRef}
            >
              <button
                className="nav-item dropdown-toggle"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDropdownOpen(!isDropdownOpen)
                }}
                type="button"
              >
                Categories
              </button>

              <div className="dropdown-menu">
                <a
                  className="dropdown-item"
                  href={`#${CATEGORY_HASH.originals}`}
                  onClick={(e) => {
                    e.preventDefault()
                    showComposition("originals")
                  }}
                >
                  Originals
                </a>
                <a
                  className="dropdown-item"
                  href={`#${CATEGORY_HASH.scenes}`}
                  onClick={(e) => {
                    e.preventDefault()
                    showComposition("scenes")
                  }}
                >
                  Scenes
                </a>
                <a
                  className="dropdown-item"
                  href={`#${CATEGORY_HASH.advertisements}`}
                  onClick={(e) => {
                    e.preventDefault()
                    showComposition("advertisements")
                  }}
                >
                  Advertisements
                </a>
              </div>
            </div>

            <button className="nav-item" onClick={() => showContent("contact")} type="button">
              Contact
            </button>
          </nav>

          <div className="logo-container">
            <div className="logo-text">
              <span className="doermusic">doermusic</span>
            </div>
          </div>

          <div className="studio-credit">
            <span>
              Sound crafted in the atelier of{" "}
              <a href="https://docstudios.eu" target="_blank" rel="noopener noreferrer">
                <img src="/images/doc.png" alt="DOC Studios logo" className="studio-logo" />
                DOC Studios
              </a>
            </span>
          </div>
        </div>
      </div>

      {hasLeftPanelContent && (
        <footer className="mobile-page-signature">
          <span className="mobile-signature-brand">doermusic</span>
          <span className="mobile-signature-text">
            Sound crafted in the atelier of{" "}
            <a href="https://docstudios.eu" target="_blank" rel="noopener noreferrer">
              DOC Studios
            </a>
          </span>
        </footer>
      )}

      <VideoModal isOpen={videoModal.isOpen} videoId={videoModal.videoId} onClose={closeVideoModal} />
    </>
  )
}
