"use client";

import { Play, Plus, Star } from "lucide-react";

import { useState } from "react";

import { MediaDetailsModal, type MediaType } from "./MediaDetailsModal";

import type { PosterItem } from "./types";

interface PosterCardProps {
  item: PosterItem;
  mediaType: MediaType;
}

export function PosterCard({ item, mediaType }: PosterCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const year = item.releaseDate
    ? new Date(item.releaseDate).getFullYear()
    : null;

  const genres = item.genres
    .slice(0, 2)
    .map((genre) => genre.name)
    .join(" • ");

  const handleAddToList = () => {
    console.log(`Add ${item.title} to My List`);
  };

  return (
    <>
      <article className="poster-card">
        <div className="poster-image-wrap">
          {item.posterUrl ? (
            <img
              src={item.posterUrl}
              alt={`${item.title} poster`}
              loading="lazy"
            />
          ) : (
            <div className="poster-placeholder">No poster</div>
          )}

          <div className="poster-hover">
            <button
              type="button"
              className="play-round"
              aria-label={`View ${item.title}`}
              onClick={() => setIsModalOpen(true)}
            >
              <Play size={16} fill="currentColor" />
            </button>

            <button
              type="button"
              className="save-round"
              aria-label={`Add ${item.title} to My List`}
              onClick={handleAddToList}
            >
              <Plus size={17} />
            </button>
          </div>
        </div>

        <div className="poster-info">
          <h3>{item.title}</h3>

          <span className="rating">
            <Star size={11} fill="currentColor" />
            {item.voteAverage.toFixed(1)}
          </span>
        </div>

        <p>
          {genres}
          {genres && year ? " • " : ""}
          {year}
        </p>
      </article>

      <MediaDetailsModal
        mediaId={isModalOpen ? item.id : null}
        mediaType={mediaType}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
