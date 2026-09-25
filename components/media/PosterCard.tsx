"use client";

import { Bookmark, Play, Plus, Star } from "lucide-react";
import type { MediaItem } from "@/types/media";

type PosterCardProps = {
  item: MediaItem;
  saved?: boolean;
  onToggleSave?: () => void;
  onPlay?: () => void;
};

export function PosterCard({
  item,
  saved = false,
  onToggleSave,
  onPlay,
}: PosterCardProps) {
  return (
    <article className="poster-card">
      <div className="poster-image-wrap">
        <img src={item.poster} alt={`${item.title} poster`} />

        <div className="poster-hover">
          <button
            className="play-round"
            onClick={onPlay}
            aria-label={`Play ${item.title}`}
          >
            <Play size={16} fill="currentColor" />
          </button>

          <button
            className={`save-round ${saved ? "saved" : ""}`}
            onClick={onToggleSave}
            aria-label={
              saved
                ? `Remove ${item.title} from My List`
                : `Add ${item.title} to My List`
            }
          >
            {saved ? (
              <Bookmark size={15} fill="currentColor" />
            ) : (
              <Plus size={17} />
            )}
          </button>
        </div>
      </div>

      <div className="poster-info">
        <h3>{item.title}</h3>

        <span className="rating">
          <Star size={11} fill="currentColor" />
          {item.rating}
        </span>
      </div>

      <p>
        {item.genres.join(" • ")} • {item.year}
      </p>
    </article>
  );
}