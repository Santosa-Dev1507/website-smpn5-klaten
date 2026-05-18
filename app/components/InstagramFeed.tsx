"use client";

import { useEffect, useState } from "react";
import styles from "./InstagramFeed.module.css";

interface InstagramPost {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  timestamp: string;
  thumbnail_url?: string;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch(
          "https://v1.nocodeapi.com/espema/instagram/arhAIMWBzWMISCgd"
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        // NoCodeAPI returns { data: [...] } or direct array
        const items: InstagramPost[] = Array.isArray(data) ? data : data?.data ?? [];
        setPosts(items.slice(0, 8)); // Show max 8 posts
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  // Truncate caption for display
  const truncate = (text: string | undefined, max: number) => {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "…" : text;
  };

  // Format relative time
  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return "Hari ini";
    if (days < 7) return `${days} hari lalu`;
    if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
    if (days < 365) return `${Math.floor(days / 30)} bulan lalu`;
    return `${Math.floor(days / 365)} tahun lalu`;
  };

  return (
    <section className={styles.section} id="instagram">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>Media Sosial</div>
        <h2>
          Lihat keseharian <span className={styles.highlight}>ESPEMA</span> dari
          dekat
        </h2>
        <p>
          Prestasi, kegiatan seru, dan momen tak terlupakan para siswa —
          semuanya ada di Instagram kami.
        </p>
      </div>

      {/* Feed Grid */}
      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeleton}>
              <div className={styles.skeletonShimmer} />
            </div>
          ))}
        </div>
      ) : error ? (
        /* Fallback CTA if API fails */
        <div className={styles.fallback}>
          <div className={styles.fallbackIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </div>
          <h3>Ikuti kami di Instagram</h3>
          <p>Lihat kegiatan, prestasi, dan momen seru ESPEMA langsung di Instagram.</p>
          <a
            href="https://www.instagram.com/espema_klaten"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            Ikuti @espema_klaten
          </a>
        </div>
      ) : (
        <div className={styles.grid}>
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.imageWrap}>
                <img
                  src={
                    post.media_type === "VIDEO"
                      ? post.thumbnail_url || post.media_url
                      : post.media_url
                  }
                  alt={truncate(post.caption, 80) || "Instagram post ESPEMA"}
                  loading="lazy"
                />
                {post.media_type === "VIDEO" && (
                  <div className={styles.videoIcon}>▶</div>
                )}
                {post.media_type === "CAROUSEL_ALBUM" && (
                  <div className={styles.carouselIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                  </div>
                )}
                <div className={styles.overlay}>
                  <span className={styles.overlayText}>
                    {truncate(post.caption, 100)}
                  </span>
                </div>
              </div>
              <div className={styles.meta}>
                <span className={styles.time}>{timeAgo(post.timestamp)}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Follow Button */}
      {!loading && !error && posts.length > 0 && (
        <div className={styles.followWrap}>
          <a
            href="https://www.instagram.com/espema_klaten"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Ikuti @espema_klaten
          </a>
        </div>
      )}
    </section>
  );
}
