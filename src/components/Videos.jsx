import { useState } from "react";
import { Play } from "lucide-react";
import { videos } from "../data.js";
import { useReveal } from "../hooks.js";
import { youtubeId } from "../youtube.js";

const items = videos
  .map((video, index) => ({
    index,
    id: youtubeId(video.youtube || video.url || video.id),
    title: String(video.title || "").trim(),
  }))
  .filter((video) => video.id);

export default function Videos() {
  const [playing, setPlaying] = useState(null);
  useReveal([items.length]);

  const layout =
    items.length === 1
      ? "mt-8 max-w-4xl sm:mt-10"
      : items.length === 2
        ? "mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5"
        : "mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3";

  return (
    <section id="videos" className="border-t border-border py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="reveal">
          <p className="eyebrow">Відео</p>
          <h2 className="mt-3 font-display text-[2.15rem] leading-[0.95] sm:text-6xl md:text-[5vw]">
            Записи процедур
          </h2>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground">
            {items.length
              ? "Натисніть на кадр, щоб відтворити ролик прямо на сторінці."
              : "Короткі записи з кабінету відкриваються прямо на цій сторінці."}
          </p>
        </div>
        {items.length ? (
          <ul className={layout}>
            {items.map((video) => (
              <li key={`${video.id}-${video.index}`} className="reveal">
                <VideoCard
                  video={video}
                  active={playing === video.index}
                  onPlay={() => setPlaying(video.index)}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function VideoCard({ video, active, onPlay }) {
  const [thumb, setThumb] = useState(true);
  const label = video.title ? `Відтворити: ${video.title}` : "Відтворити відео";

  return (
    <figure className="bento-card bento-card-hover h-full">
      <div className="relative aspect-video bg-secondary">
        {active ? (
          <iframe
            title={video.title || "Відео"}
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button type="button" onClick={onPlay} aria-label={label} className="group absolute inset-0 block">
            {thumb ? (
              <img
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onLoad={(event) => {
                  if (event.currentTarget.naturalWidth < 200) setThumb(false);
                }}
                onError={() => setThumb(false)}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            ) : (
              <span
                className="absolute inset-0"
                style={{ background: "var(--gradient-champagne)" }}
              />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent" />
            <span className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 group-hover:scale-105">
              <Play className="ml-0.5 h-5 w-5" fill="currentColor" strokeWidth={1.5} />
            </span>
          </button>
        )}
      </div>
      {video.title ? (
        <figcaption className="px-4 py-3.5 text-sm sm:px-5 sm:py-4">{video.title}</figcaption>
      ) : null}
    </figure>
  );
}
