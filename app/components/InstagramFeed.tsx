import styles from "./InstagramFeed.module.css";

type InstagramMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

export default async function InstagramFeed() {
  const token = process.env.IG_ACCESS_TOKEN;
  let posts: InstagramMedia[] = [];
  let error = false;

  if (token) {
    try {
      // ─── Fetch media langsung dari Instagram Graph API (Instagram Login) ───
      const mediaRes = await fetch(
        `https://graph.instagram.com/v21.0/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=8&access_token=${token}`,
        { next: { revalidate: 3600 } }
      );
      const mediaData = await mediaRes.json();

      if (!mediaRes.ok || mediaData.error) {
        console.error("[InstagramFeed] Media Error:", JSON.stringify(mediaData.error ?? mediaData, null, 2));
        error = true;
      } else {
        posts = mediaData.data || [];
      }
    } catch (e) {
      console.error("[InstagramFeed] Fetch exception:", e);
      error = true;
    }
  }

  const renderFallback = () => (
    <div className={styles.fallback}>
      <div className={styles.fallbackIcon}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </div>
      <h3>Ikuti Kami di Instagram</h3>
      <p>Lihat update terbaru dan momen seru lainnya langsung di Instagram resmi ESPEMA.</p>
    </div>
  );

  return (
    <section className={styles.section} id="instagram">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>Media Sosial</div>
        <h2>
          Lihat keseharian <span className={styles.highlight}>ESPEMA</span> dari dekat
        </h2>
        <p>
          Prestasi, kegiatan seru, dan momen tak terlupakan para siswa — semuanya ada di Instagram kami.
        </p>
      </div>

      {!token || error || posts.length === 0 ? (
        renderFallback()
      ) : (
        <div className={styles.grid}>
          {posts.map((post) => (
            <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" className={styles.card}>
              <div className={styles.imageWrap}>
                <img
                  src={post.media_type === "VIDEO" ? post.thumbnail_url || post.media_url : post.media_url}
                  alt={post.caption?.slice(0, 50) || "Instagram post"}
                  loading="lazy"
                />
                
                {post.media_type === "VIDEO" && (
                  <div className={styles.videoIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </div>
                )}
                {post.media_type === "CAROUSEL_ALBUM" && (
                  <div className={styles.carouselIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                  </div>
                )}

                <div className={styles.overlay}>
                  <span className={styles.overlayText}>
                    {post.caption?.length ? (post.caption.length > 100 ? post.caption.slice(0, 100) + "..." : post.caption) : ""}
                  </span>
                </div>
              </div>
              <div className={styles.meta}>
                <span className={styles.time}>
                  {new Date(post.timestamp).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Follow Button */}
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
    </section>
  );
}
