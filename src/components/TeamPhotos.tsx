"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TEAM_PHOTOS } from "@/data/teamPhotos";

// Helper to generate a shuffled array of indices from 1 to N-1
const generateShuffledPlaylist = (length: number): number[] => {
  if (length <= 1) return [];
  const indices = Array.from({ length: length - 1 }, (_, i) => i + 1);
  // Fisher-Yates Shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

export default function TeamPhotos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoplayOn, setAutoplayOn] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [playlist, setPlaylist] = useState<number[]>(() =>
    generateShuffledPlaylist(TEAM_PHOTOS.length),
  );
  const [_playlistIndex, setPlaylistIndex] = useState(-1);
  // Tracks whether the current photo's image failed to load, so we can show a
  // text fallback in the frame instead of an empty box. Resets per-photo below.
  const [imageFailed, setImageFailed] = useState(false);

  // Refs for lightbox focus management (move focus in on open, restore on close)
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Regenerate and shuffle the remaining playlist starting from a manual photo index
  const resetPlaylistForIndex = (index: number) => {
    if (TEAM_PHOTOS.length <= 1) {
      setPlaylist([]);
      setPlaylistIndex(-1);
      return;
    }
    // All indices except the current one
    const remainingIndices = Array.from(
      { length: TEAM_PHOTOS.length },
      (_, i) => i,
    ).filter((i) => i !== index);
    // Shuffle remaining
    for (let i = remainingIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingIndices[i], remainingIndices[j]] = [
        remainingIndices[j],
        remainingIndices[i],
      ];
    }
    setPlaylist(remainingIndices);
    setPlaylistIndex(-1);
  };

  // Honor the OS "reduce motion" setting: default autoplay off and gate the
  // timer so content never swaps on its own for users who opted out of motion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = (matches: boolean) => {
      setPrefersReducedMotion(matches);
      if (matches) setAutoplayOn(false);
    };
    apply(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!autoplayOn || isPaused || isModalOpen || prefersReducedMotion) return;

    // Random interval between 10-15 seconds (10000-15000ms)
    const getRandomInterval = () => Math.floor(Math.random() * 5000) + 10000;

    const shufflePhoto = () => {
      setPrevIndex(currentIndex);
      setImageFailed(false);

      setPlaylistIndex((prevPlaylistIdx) => {
        const nextPlaylistIdx = prevPlaylistIdx + 1;

        if (nextPlaylistIdx >= playlist.length) {
          // Playlist finished: Go back to the latest photo (index 0) and generate a new shuffle
          setCurrentIndex(0);
          setPlaylist(generateShuffledPlaylist(TEAM_PHOTOS.length));
          return -1;
        }
        // Show the next shuffled photo
        setCurrentIndex(playlist[nextPlaylistIdx]);
        return nextPlaylistIdx;
      });

      // Clear the background image after transition completes to clean up the DOM
      setTimeout(() => {
        setPrevIndex(null);
      }, 600); // matches the 0.6s fade-in duration
    };

    const intervalId = setTimeout(shufflePhoto, getRandomInterval());

    return () => clearTimeout(intervalId);
  }, [
    currentIndex,
    isPaused,
    isModalOpen,
    playlist,
    autoplayOn,
    prefersReducedMotion,
  ]);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPrevIndex(currentIndex);
    setImageFailed(false);

    const nextIndex = (currentIndex + 1) % TEAM_PHOTOS.length;
    setCurrentIndex(nextIndex);
    resetPlaylistForIndex(nextIndex);

    setTimeout(() => {
      setPrevIndex(null);
    }, 600);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPrevIndex(currentIndex);
    setImageFailed(false);

    const nextIndex =
      (currentIndex - 1 + TEAM_PHOTOS.length) % TEAM_PHOTOS.length;
    setCurrentIndex(nextIndex);
    resetPlaylistForIndex(nextIndex);

    setTimeout(() => {
      setPrevIndex(null);
    }, 600);
  };

  const handleNextRef = useRef(handleNext);
  const handlePrevRef = useRef(handlePrev);
  handleNextRef.current = handleNext;
  handlePrevRef.current = handlePrev;

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      } else if (e.key === "ArrowRight") {
        handleNextRef.current();
      } else if (e.key === "ArrowLeft") {
        handlePrevRef.current();
      } else if (e.key === "Tab") {
        // Trap focus within the lightbox so Tab can't leak to the page behind
        const focusables = modalRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled])",
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  // Move focus into the lightbox on open; restore it to the trigger on close
  useEffect(() => {
    if (!isModalOpen) return;
    const trigger = triggerRef.current;
    closeButtonRef.current?.focus();
    return () => {
      trigger?.focus();
    };
  }, [isModalOpen]);

  const currentPhoto = TEAM_PHOTOS[currentIndex];

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sleek rounded frame wrapper with thin border & slight shadow drop */}
      <div className="group relative overflow-hidden rounded-xl border border-border shadow-sm aspect-video bg-muted flex items-center justify-center select-none hover:border-foreground/20 transition-colors">
        {/* Background Layer (Outgoing/Static) */}
        {prevIndex !== null && (
          <div className="absolute inset-0 pointer-events-none z-0">
            <Image
              src={TEAM_PHOTOS[prevIndex].url}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Foreground Layer (Incoming/Transitioning) */}
        <div
          key={currentIndex}
          className="absolute inset-0 z-10 pointer-events-none animate-fade-in"
        >
          <Image
            src={currentPhoto.url}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 320px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
            onError={() => setImageFailed(true)}
          />
        </div>

        {/* Broken-image fallback: shown only when the current photo fails to load.
            Sits above the foreground image but below the overlay controls. */}
        {imageFailed && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted pointer-events-none px-4">
            <p className="text-muted-foreground text-xs text-center">
              {currentPhoto.location}
            </p>
          </div>
        )}

        {/* Open-lightbox trigger: a real button covering the frame, beneath the arrows.
            Carries the photo description so the decorative image above isn't announced twice. */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-label={`View team photo full screen: ${currentPhoto.location}, ${currentPhoto.date}`}
          className="absolute inset-0 z-10 cursor-pointer"
        />

        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-sm border border-white/10 text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 cursor-pointer shadow-sm hover:scale-105 flex items-center justify-center"
          aria-label="Previous photo"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-sm border border-white/10 text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 cursor-pointer shadow-sm hover:scale-105 flex items-center justify-center"
          aria-label="Next photo"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Autoplay Play/Pause Toggle. Kept at z-20 (above the full-frame
            trigger) and always in the tab order. Rests at opacity-70 — never
            fully hidden — so keyboard and touch users can always reach the
            rotation control (WCAG 2.2.2 Pause, Stop, Hide). */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setAutoplayOn((on) => !on);
          }}
          className="absolute bottom-2.5 right-2.5 z-20 p-1.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-sm border border-white/10 text-white opacity-70 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 transition-all duration-300 cursor-pointer shadow-sm hover:scale-105 flex items-center justify-center"
          aria-label={
            autoplayOn ? "Pause photo rotation" : "Resume photo rotation"
          }
        >
          {autoplayOn ? (
            <svg
              className="h-3.5 w-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5.14v13.72a1 1 0 001.54.84l10.79-6.86a1 1 0 000-1.68L9.54 4.3A1 1 0 008 5.14z" />
            </svg>
          )}
        </button>
      </div>

      {/* Caption Metadata & Counter */}
      <div className="relative h-10">
        {/* Outgoing Caption */}
        {prevIndex !== null && (
          <div className="absolute inset-x-0 top-0 flex justify-between items-start pointer-events-none z-0">
            <div>
              <p className="text-[11px] font-bold text-foreground leading-tight">
                {TEAM_PHOTOS[prevIndex].location}
              </p>
              <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                {TEAM_PHOTOS[prevIndex].date}
              </p>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground/60 bg-muted/40 border border-border/20 px-1.5 py-0.5 rounded-md">
              {prevIndex + 1} / {TEAM_PHOTOS.length}
            </span>
          </div>
        )}

        {/* Incoming Caption */}
        <div
          key={`caption-${currentIndex}`}
          className="absolute inset-x-0 top-0 flex justify-between items-start z-10 animate-fade-in"
        >
          <div>
            <p className="text-[11px] font-bold text-foreground leading-tight">
              {currentPhoto.location}
            </p>
            <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
              {currentPhoto.date}
            </p>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground/85 bg-muted/70 border border-border/40 px-1.5 py-0.5 rounded-md">
            {currentIndex + 1} / {TEAM_PHOTOS.length}
          </span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Team photo, full screen: ${currentPhoto.location}, ${currentPhoto.date}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            type="button"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close modal"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Left Arrow Button in Modal */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev(e);
            }}
            className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50 hover:scale-105 flex items-center justify-center"
            aria-label="Previous photo"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Right Arrow Button in Modal */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext(e);
            }}
            className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50 hover:scale-105 flex items-center justify-center"
            aria-label="Next photo"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Modal Content container */}
          <div
            className="relative w-[90vw] max-w-4xl max-h-[85vh] aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 flex items-center justify-center p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentPhoto.url}
              alt={`${currentPhoto.date} - ${currentPhoto.location}`}
              fill
              className="object-contain"
              unoptimized
            />
            {/* Modal Caption */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-white flex justify-between items-end">
              <div>
                <p className="text-sm font-bold">{currentPhoto.location}</p>
                <p className="text-xs text-gray-300 mt-0.5">
                  {currentPhoto.date}
                </p>
              </div>
              <span className="text-xs font-bold bg-white/10 border border-white/15 px-2 py-0.5 rounded-full select-none">
                {currentIndex + 1} / {TEAM_PHOTOS.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
