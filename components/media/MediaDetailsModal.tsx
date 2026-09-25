"use client";

import { Clock, Plus, Play, Star, Tv, Volume2, VolumeX, X } from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  type MediaType,
  useMediaDetails,
} from "@/hooks/queries/useMediaDetails";

export type { MediaType };

interface MediaDetailsModalProps {
  mediaId: number | null;
  mediaType: MediaType;
  onClose: () => void;
}

/* =========================================================
   YOUTUBE TYPES
   ========================================================= */

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  destroy: () => void;
}

interface YouTubePlayerOptions {
  videoId: string;

  playerVars?: {
    autoplay?: number;
    controls?: number;
    disablekb?: number;
    fs?: number;
    playsinline?: number;
    rel?: number;
    iv_load_policy?: number;
    origin?: string;
  };

  events?: {
    onReady?: () => void;
    onStateChange?: (event: { data: number }) => void;
    onAutoplayBlocked?: () => void;
  };
}

interface YouTubeAPI {
  Player: new (
    element: HTMLElement,
    options: YouTubePlayerOptions,
  ) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/* =========================================================
   YOUTUBE CONSTANTS
   ========================================================= */

/**
 * YouTube Player API state:
 *
 * -1 = unstarted
 *  0 = ended
 *  1 = playing
 *  2 = paused
 *  3 = buffering
 *  5 = video cued
 */
const YOUTUBE_ENDED = 0;

const YOUTUBE_API_URL = "https://www.youtube.com/iframe_api";

let youtubeApiPromise: Promise<void> | null = null;

/* =========================================================
   YOUTUBE API LOADER
   ========================================================= */

function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API requires a browser."));
  }

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${YOUTUBE_API_URL}"]`,
    );

    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");

    script.src = YOUTUBE_API_URL;
    script.async = true;

    script.onerror = () => {
      youtubeApiPromise = null;
      reject(new Error("Failed to load YouTube Player API."));
    };

    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}

/* =========================================================
   COMPONENT
   ========================================================= */

export function MediaDetailsModal({
  mediaId,
  mediaType,
  onClose,
}: MediaDetailsModalProps) {
  const router = useRouter();

  const playerContainerRef = useRef<HTMLDivElement>(null);

  const playerRef = useRef<YouTubePlayer | null>(null);

  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const [isMuted, setIsMuted] = useState(false);

  const { data, isLoading, isError } = useMediaDetails(mediaId, mediaType);

  /* =========================================================
     CLEANUP PLAYER
     ========================================================= */

  const destroyPlayer = useCallback(() => {
    if (!playerRef.current) {
      return;
    }

    try {
      playerRef.current.destroy();
    } catch {
      // Ignore cleanup errors.
    }

    playerRef.current = null;
  }, []);

  /* =========================================================
     ESCAPE + BODY SCROLL
     ========================================================= */

  useEffect(() => {
    if (mediaId === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousOverflow;
    };
  }, [mediaId, onClose]);

  /* =========================================================
     TRAILER
     ========================================================= */

  const trailerKey = data?.trailer?.key ?? null;

  useEffect(() => {
    if (!trailerKey || mediaId === null) {
      destroyPlayer();

      setIsPlayerReady(false);
      setIsMuted(false);

      return;
    }

    let cancelled = false;

    const createPlayer = async () => {
      try {
        await loadYouTubeAPI();

        if (cancelled) {
          return;
        }

        if (!playerContainerRef.current) {
          return;
        }

        if (!window.YT?.Player) {
          return;
        }

        destroyPlayer();

        setIsPlayerReady(false);
        setIsMuted(false);

        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          videoId: trailerKey,

          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
            rel: 0,
            iv_load_policy: 3,
            origin: window.location.origin,
          },

          events: {
            /* =====================================================
                   PLAYER READY
                   ===================================================== */

            onReady: () => {
              if (cancelled) {
                return;
              }

              setIsPlayerReady(true);
              setIsMuted(false);

              try {
                playerRef.current?.unMute();
                playerRef.current?.playVideo();
              } catch {
                // Ignore playback errors.
              }
            },

            /* =====================================================
                   LOOP TRAILER
                   ===================================================== */

            onStateChange: (event) => {
              if (cancelled) {
                return;
              }

              if (event.data === YOUTUBE_ENDED) {
                try {
                  playerRef.current?.playVideo();
                } catch {
                  // Ignore playback errors.
                }
              }
            },

            /* =====================================================
                   AUTOPLAY BLOCKED
                   ===================================================== */

            onAutoplayBlocked: () => {
              if (cancelled) {
                return;
              }

              setIsMuted(false);
            },
          },
        });
      } catch {
        if (!cancelled) {
          setIsPlayerReady(false);
        }
      }
    };

    void createPlayer();

    return () => {
      cancelled = true;

      destroyPlayer();

      setIsPlayerReady(false);
      setIsMuted(false);
    };
  }, [trailerKey, mediaId, destroyPlayer]);

  /* =========================================================
     MUTE / UNMUTE
     ========================================================= */

  const handleToggleMute = () => {
    if (!playerRef.current || !isPlayerReady) {
      return;
    }

    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }

      playerRef.current.playVideo();
    } catch {
      // Ignore playback errors.
    }
  };

  /* =========================================================
     PLAY
     ========================================================= */

  const handlePlay = () => {
    if (!data) {
      return;
    }

    if (data.type === "movie") {
      router.push(`/watch?movie=${data.id}`);

      return;
    }

    router.push(`/watch?series=${data.id}`);
  };

  /* =========================================================
     CLOSE
     ========================================================= */

  if (mediaId === null) {
    return null;
  }

  /* =========================================================
     DATA
     ========================================================= */

  const year = data?.releaseDate
    ? new Date(data.releaseDate).getFullYear()
    : null;

  const runtime = data?.runtime
    ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
    : null;

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div
      className="media-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="media-modal"
        role="dialog"
        aria-modal="true"
        aria-label={data?.title ?? "Media details"}
      >
        {/* =====================================================
            CLOSE
            ===================================================== */}

        <button
          type="button"
          className="media-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* =====================================================
            LOADING
            ===================================================== */}

        {isLoading && (
          <div className="media-modal-loading">
            <div className="modal-spinner" />

            <p>Loading details...</p>
          </div>
        )}

        {/* =====================================================
            ERROR
            ===================================================== */}

        {isError && (
          <div className="media-modal-error">
            <p>Failed to load details.</p>

            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        )}

        {/* =====================================================
            CONTENT
            ===================================================== */}

        {data && !isLoading && !isError && (
          <>
            {/* =================================================
                  TRAILER
                  ================================================= */}

            <div className="media-modal-trailer">
              {data.trailer ? (
                <>
                  <div className="youtube-player">
                    <div
                      ref={playerContainerRef}
                      className="youtube-player-inner"
                    />
                  </div>

                  <button
                    type="button"
                    className="youtube-mute-button"
                    onClick={handleToggleMute}
                    disabled={!isPlayerReady}
                    aria-label={isMuted ? "Unmute trailer" : "Mute trailer"}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </>
              ) : data.backdropUrl ? (
                <img
                  className="media-modal-backdrop-image"
                  src={data.backdropUrl}
                  alt=""
                />
              ) : data.posterUrl ? (
                <img
                  className="media-modal-backdrop-image"
                  src={data.posterUrl}
                  alt=""
                />
              ) : (
                <div className="modal-no-video">No trailer available</div>
              )}

              <div className="media-modal-gradient" />
            </div>

            {/* =================================================
                  DETAILS
                  ================================================= */}

            <div className="media-modal-content">
              {/* =================================================
                    HEADING
                    ================================================= */}

              <div className="media-modal-heading">
                <div>
                  <div className="modal-media-type">
                    {data.type === "movie" ? (
                      <>
                        <Play size={11} fill="currentColor" />
                        MOVIE
                      </>
                    ) : (
                      <>
                        <Tv size={11} />
                        SERIES
                      </>
                    )}
                  </div>

                  <h2>{data.title}</h2>

                  {data.tagline && (
                    <p className="modal-tagline">{data.tagline}</p>
                  )}
                </div>

                <div className="modal-rating">
                  <Star size={14} fill="currentColor" />

                  {data.voteAverage.toFixed(1)}
                </div>
              </div>

              {/* =================================================
                    META
                    ================================================= */}

              <div className="modal-meta">
                {year && <span>{year}</span>}

                {runtime && (
                  <span>
                    <Clock size={13} />
                    {runtime}
                  </span>
                )}

                {data.type === "series" && data.numberOfSeasons !== null && (
                  <span>
                    {data.numberOfSeasons}{" "}
                    {data.numberOfSeasons === 1 ? "Season" : "Seasons"}
                  </span>
                )}

                {data.genres.slice(0, 3).map((genre) => (
                  <span key={genre.id}>{genre.name}</span>
                ))}
              </div>

              {/* =================================================
                    ACTIONS
                    ================================================= */}

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-play-button"
                  onClick={handlePlay}
                >
                  <Play size={17} fill="currentColor" />
                  Play
                </button>

                <button type="button" className="modal-list-button">
                  <Plus size={18} />
                  Add to My List
                </button>
              </div>

              {/* =================================================
                    OVERVIEW
                    ================================================= */}

              <div className="modal-overview">
                <h3>Overview</h3>

                <p>{data.overview || "No overview available."}</p>
              </div>

              {/* =================================================
                    DIRECTOR / CREATOR
                    ================================================= */}

              {data.directors.length > 0 && (
                <div className="modal-section">
                  <h3>{data.type === "series" ? "Creators" : "Director"}</h3>

                  <div className="modal-people">
                    {data.directors.map((person, index) => (
                      <div
                        className="modal-person"
                        key={`${person.id}-${index}`}
                      >
                        {person.profilePath ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${person.profilePath}`}
                            alt={person.name}
                          />
                        ) : (
                          <div className="person-placeholder">?</div>
                        )}

                        <div>
                          <strong>{person.name}</strong>

                          <span>
                            {data.type === "series" ? "Creator" : "Director"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =================================================
                    CAST
                    ================================================= */}

              {data.cast.length > 0 && (
                <div className="modal-section">
                  <h3>Cast</h3>

                  <div className="modal-cast">
                    {data.cast.map((person) => (
                      <div className="modal-cast-person" key={person.id}>
                        {person.profilePath ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${person.profilePath}`}
                            alt={person.name}
                          />
                        ) : (
                          <div className="cast-placeholder">?</div>
                        )}

                        <strong>{person.name}</strong>

                        {person.character && <span>{person.character}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
