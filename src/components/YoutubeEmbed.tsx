"use client";

import { useState } from "react";

interface YoutubeEmbedProps {
  videoId: string;
  title?: string;
}

export default function YoutubeEmbed({
  videoId,
  title = "Video YouTube",
}: YoutubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className="yt-wrapper">
      {isLoaded ? (
        <iframe
          className="yt-iframe"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          className="yt-facade"
          onClick={() => setIsLoaded(true)}
          aria-label={`Putar video: ${title}`}
          style={{ background: "#1a1a2e" }}
        >
          {/* Thumbnail via native img agar tidak perlu konfigurasi domain */}
          {!thumbError && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={`Thumbnail: ${title}`}
              className="yt-thumbnail-img"
              onError={() => setThumbError(true)}
            />
          )}
          {/* Dark overlay */}
          <span className="yt-overlay" />
          {/* Play button */}
          <span className="yt-play-btn" aria-hidden="true">
            <svg viewBox="0 0 68 48" width="80" height="60">
              <path
                className="yt-play-bg"
                d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
              />
              <path className="yt-play-arrow" d="M45 24 27 14v20" />
            </svg>
          </span>
          <span className="yt-play-label">▶ Klik untuk memutar video</span>
        </button>
      )}
    </div>
  );
}
