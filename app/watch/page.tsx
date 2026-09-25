"use client";

import {
  ArrowLeft,
  Check,
  Maximize,
  Pause,
  Play,
  Plus,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useMediaDetails } from "@/hooks/queries/useMediaDetails";
import { useMovieRecommendations } from "@/hooks/queries/useMovieRecommendations";
import { useSeriesRecommendations } from "@/hooks/queries/useSeriesRecommendations";

import "./watch.css";

type MediaType = "movie" | "series";

interface WatchListItem {
  id: number;
  type: MediaType;
}

const WATCH_LIST_KEY = "motitv-my-list";

export default function WatchPage() {
  const searchParams = useSearchParams();

  const movieParam = searchParams.get("movie");
  const seriesParam = searchParams.get("series");

  const mediaType: MediaType | null = movieParam
    ? "movie"
    : seriesParam
      ? "series"
      : null;

  const mediaId = movieParam ?? seriesParam;

  const parsedMediaId = Number(mediaId);

  const validMediaId =
    mediaType && Number.isFinite(parsedMediaId) && parsedMediaId > 0
      ? parsedMediaId
      : null;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<HTMLElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInList, setIsInList] = useState(false);

  /* =========================================
     MEDIA DETAILS
  ========================================= */

  const {
    data: media,
    isLoading: mediaLoading,
    isError: mediaError,
  } = useMediaDetails(validMediaId, mediaType ?? "movie");

  /* =========================================
     MOVIE RECOMMENDATIONS
  ========================================= */

  const { data: movieRecommendations, isLoading: movieRecommendationsLoading } =
    useMovieRecommendations(mediaType === "movie" ? validMediaId : null);

  /* =========================================
     SERIES RECOMMENDATIONS
  ========================================= */

  const {
    data: seriesRecommendations,
    isLoading: seriesRecommendationsLoading,
  } = useSeriesRecommendations(mediaType === "series" ? validMediaId : null);

  /* =========================================
     MY LIST
  ========================================= */

  useEffect(() => {
    if (!media || !mediaType) {
      return;
    }

    try {
      const savedList = JSON.parse(
        localStorage.getItem(WATCH_LIST_KEY) ?? "[]",
      ) as WatchListItem[];

      const exists = savedList.some(
        (item) => item.id === media.id && item.type === mediaType,
      );

      setIsInList(exists);
    } catch {
      setIsInList(false);
    }
  }, [media, mediaType]);

  const toggleList = () => {
    if (!media || !mediaType) {
      return;
    }

    try {
      const savedList = JSON.parse(
        localStorage.getItem(WATCH_LIST_KEY) ?? "[]",
      ) as WatchListItem[];

      const exists = savedList.some(
        (item) => item.id === media.id && item.type === mediaType,
      );

      if (exists) {
        const updatedList = savedList.filter(
          (item) => !(item.id === media.id && item.type === mediaType),
        );

        localStorage.setItem(WATCH_LIST_KEY, JSON.stringify(updatedList));

        setIsInList(false);

        return;
      }

      const updatedList: WatchListItem[] = [
        ...savedList,
        {
          id: media.id,
          type: mediaType,
        },
      ];

      localStorage.setItem(WATCH_LIST_KEY, JSON.stringify(updatedList));

      setIsInList(true);
    } catch {
      setIsInList(false);
    }
  };

  /* =========================================
     VIDEO EVENTS
  ========================================= */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleVolumeChange = () => {
      setIsMuted(video.muted);
    };

    video.addEventListener("play", handlePlay);

    video.addEventListener("pause", handlePause);

    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      video.removeEventListener("play", handlePlay);

      video.removeEventListener("pause", handlePause);

      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, []);

  /* =========================================
     FULLSCREEN EVENTS
  ========================================= */

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  /* =========================================
     PLAY / PAUSE
  ========================================= */

  const togglePlay = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      try {
        await video.play();
      } catch {
        // Browser blocked playback.
      }
    } else {
      video.pause();
    }
  };

  /* =========================================
     MUTE
  ========================================= */

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;

    setIsMuted(video.muted);
  };

  /* =========================================
     FULLSCREEN
  ========================================= */

  const toggleFullscreen = async () => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    if (!document.fullscreenElement) {
      try {
        await player.requestFullscreen();
      } catch {
        // Fullscreen unavailable.
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch {
        // Ignore.
      }
    }
  };

  /* =========================================
     INVALID MEDIA
  ========================================= */

  if (validMediaId === null || !mediaType) {
    return (
      <main className="watch-page">
        <div className="watch-empty">
          <div className="watch-empty-icon">
            <Play size={26} />
          </div>

          <h1>Media not found</h1>

          <p>The movie or series you're looking for could not be found.</p>

          <Link href="/" className="watch-back-link">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================
     LOADING
  ========================================= */

  if (mediaLoading) {
    return (
      <main className="watch-page">
        <div className="watch-player-container">
          <div className="watch-skeleton-back" />

          <div className="watch-skeleton-player">
            <div className="watch-skeleton-player-icon" />
          </div>
        </div>

        <div className="watch-content">
          <section className="watch-info">
            <div className="watch-info-main">
              <div className="watch-skeleton-title-row">
                <div className="watch-skeleton-title-content">
                  <div className="watch-skeleton-media-type" />

                  <div className="watch-skeleton-title" />
                </div>

                <div className="watch-skeleton-rating" />
              </div>

              <div className="watch-skeleton-meta">
                <span />
                <span />
                <span />
              </div>

              <div className="watch-skeleton-genres">
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="watch-skeleton-tagline" />

              <div className="watch-skeleton-overview">
                <div className="watch-skeleton-overview-heading" />

                <div className="watch-skeleton-line" />

                <div className="watch-skeleton-line watch-skeleton-line-short" />
              </div>
            </div>
          </section>

          {/* =========================================
              RECOMMENDATIONS
          ========================================= */}

          <section className="watch-recommendations watch-skeleton-recommendations">
            <div className="watch-section-heading">
              <div>
                <div className="watch-skeleton-section-label" />

                <div className="watch-skeleton-section-title" />

                <div className="watch-skeleton-section-description" />
              </div>
            </div>

            <div className="watch-movie-grid">
              {Array.from({
                length: 8,
              }).map((_, index) => (
                <div className="watch-movie-card" key={index}>
                  <div className="watch-movie-poster watch-skeleton-poster" />

                  <div className="watch-movie-card-info">
                    <div className="watch-skeleton-card-title" />

                    <div className="watch-skeleton-card-meta" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (mediaError || !media) {
    const browseHref = mediaType === "movie" ? "/movies" : "/series";

    const browseLabel =
      mediaType === "movie" ? "Back to Movies" : "Back to Series";

    return (
      <main className="watch-page">
        <div className="watch-empty">
          <div className="watch-empty-icon">
            <Play size={26} />
          </div>

          <h1>Unable to load {mediaType === "movie" ? "movie" : "series"}</h1>

          <p>Something went wrong while loading this title.</p>

          <Link href={browseHref} className="watch-back-link">
            <ArrowLeft size={18} />

            {browseLabel}
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================
     MEDIA DATA
  ========================================= */

  const isMovie = media.type === "movie";

  const isSeries = media.type === "series";

  const releaseYear = media.releaseDate
    ? new Date(media.releaseDate).getFullYear()
    : null;

  const browseHref = isMovie ? "/movies" : "/series";

  const browseLabel = isMovie ? "Back to Movies" : "Back to Series";

  /* =========================================
     RECOMMENDATIONS
  ========================================= */

  const recommendations = isMovie
    ? movieRecommendations
    : seriesRecommendations;

  const recommendationsLoading = isMovie
    ? movieRecommendationsLoading
    : seriesRecommendationsLoading;

  const recommendedItems =
    recommendations?.results
      ?.filter((item) => item.id !== media.id)
      .slice(0, 8) ?? [];

  /* =========================================
     RENDER
  ========================================= */

  return (
    <main className="watch-page">
      {/* =========================================
          PLAYER
      ========================================= */}

      <div className="watch-player-container">
        <Link href={browseHref} className="watch-back">
          <ArrowLeft size={18} />

          <span>{browseLabel}</span>
        </Link>

        <section ref={playerRef} className="watch-player">
          <div className="watch-video-placeholder">
            {media.backdropUrl && (
              <img src={media.backdropUrl} alt="" className="watch-backdrop" />
            )}

            <div className="watch-placeholder-overlay">
              <div className="watch-placeholder-content">
                <div className="watch-placeholder-play">
                  <Play size={32} fill="currentColor" />
                </div>

                <strong>{media.title}</strong>

                <span>
                  {isMovie
                    ? "Ready to watch"
                    : "Select an episode to start watching"}
                </span>
              </div>
            </div>
          </div>

          {/*
            Replace the placeholder above with your
            authorized stream when available:

            <video
              ref={videoRef}
              src={streamUrl}
              poster={media.backdropUrl ?? undefined}
              playsInline
            />
          */}

          <div className="watch-controls">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <button
              type="button"
              className="watch-fullscreen"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              <Maximize size={20} />
            </button>
          </div>
        </section>
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="watch-content">
        {/* =========================================
            MEDIA DETAILS
        ========================================= */}

        <section className="watch-info">
          <div className="watch-info-main">
            <div className="watch-title-row">
              <div className="watch-title-content">
                <span className="watch-media-type">
                  {isMovie ? "MOVIE" : "SERIES"}
                </span>

                <div className="watch-title-line">
                  <h1>{media.title}</h1>

                  {media.voteAverage > 0 && (
                    <div className="watch-rating">
                      <Star size={15} fill="currentColor" />

                      <span>{media.voteAverage.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                className={`watch-list-button ${isInList ? "is-added" : ""}`}
                onClick={toggleList}
                aria-pressed={isInList}
              >
                {isInList ? <Check size={17} /> : <Plus size={17} />}

                <span>{isInList ? "In My List" : "Add to List"}</span>
              </button>
            </div>

            {/* =========================================
                META
            ========================================= */}

            <div className="watch-meta">
              {releaseYear && <span>{releaseYear}</span>}

              {isMovie && media.runtime !== null && media.runtime > 0 && (
                <>
                  <span className="watch-dot">•</span>

                  <span>{media.runtime} min</span>
                </>
              )}

              {isSeries &&
                media.numberOfSeasons !== null &&
                media.numberOfSeasons > 0 && (
                  <>
                    <span className="watch-dot">•</span>

                    <span>
                      {media.numberOfSeasons}{" "}
                      {media.numberOfSeasons === 1 ? "Season" : "Seasons"}
                    </span>
                  </>
                )}

              {isSeries &&
                media.numberOfEpisodes !== null &&
                media.numberOfEpisodes > 0 && (
                  <>
                    <span className="watch-dot">•</span>

                    <span>
                      {media.numberOfEpisodes}{" "}
                      {media.numberOfEpisodes === 1 ? "Episode" : "Episodes"}
                    </span>
                  </>
                )}

              {media.status && (
                <>
                  <span className="watch-dot">•</span>

                  <span>{media.status}</span>
                </>
              )}
            </div>

            {/* =========================================
                GENRES
            ========================================= */}

            {media.genres.length > 0 && (
              <div className="watch-genres">
                {media.genres.map((genre) => (
                  <span key={genre.id}>{genre.name}</span>
                ))}
              </div>
            )}

            {/* =========================================
                TAGLINE
            ========================================= */}

            {media.tagline && <p className="watch-tagline">{media.tagline}</p>}

            {/* =========================================
                OVERVIEW
            ========================================= */}

            {media.overview && (
              <div className="watch-overview">
                <h2>Overview</h2>

                <p>{media.overview}</p>
              </div>
            )}
          </div>
        </section>

        {/* =========================================
            RECOMMENDATIONS
        ========================================= */}

        {(isMovie || isSeries) && (
          <section className="watch-recommendations">
            <div className="watch-section-heading">
              <div>
                <span className="watch-section-label">DISCOVER</span>

                <h2>More Like This</h2>

                <p>
                  {isMovie
                    ? "Movies you might also enjoy"
                    : "Series you might also enjoy"}
                </p>
              </div>
            </div>

            {recommendationsLoading ? (
              <div className="watch-recommendations-loading">
                <div className="watch-spinner" />
              </div>
            ) : recommendedItems.length > 0 ? (
              <div className="watch-movie-grid">
                {recommendedItems.map((item) => {
                  const year = item.releaseDate
                    ? new Date(item.releaseDate).getFullYear()
                    : null;

                  const watchHref = isMovie
                    ? `/watch?movie=${item.id}`
                    : `/watch?series=${item.id}`;

                  return (
                    <Link
                      key={item.id}
                      href={watchHref}
                      className="watch-movie-card"
                    >
                      <div className="watch-movie-poster">
                        {item.posterUrl ? (
                          <img src={item.posterUrl} alt={item.title} />
                        ) : (
                          <div className="watch-poster-placeholder">
                            No Image
                          </div>
                        )}

                        <div className="watch-card-overlay">
                          <div className="watch-card-play">
                            <Play size={20} fill="currentColor" />
                          </div>
                        </div>
                      </div>

                      <div className="watch-movie-card-info">
                        <h3>{item.title}</h3>

                        <div className="watch-movie-card-meta">
                          {year && <span>{year}</span>}

                          {item.voteAverage > 0 && (
                            <>
                              {year && <span className="watch-dot">•</span>}

                              <span className="watch-card-rating">
                                <Star size={13} fill="currentColor" />

                                {item.voteAverage.toFixed(1)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="watch-no-recommendations">
                {isMovie
                  ? "No similar movies available."
                  : "No similar series available."}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
