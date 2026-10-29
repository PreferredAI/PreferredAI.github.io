"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TEAM_PHOTOS } from "@/data/teamPhotos";

interface TeamPhotosProps {
  /**
   * "compact": minimal footprint card with overlaid caption that stretches to match a sibling hero card (used on `/`).
   * "feature": larger gallery showcase card with high-res sizing and full caption bar (used on `/people`).
   */
  variant?: "compact" | "feature";
  /** Optional override for rotation interval in ms (defaults to 8000ms for compact, 5500ms for feature). */
  intervalMs?: number;
  headerLabel?: string;
  headerHref?: string;
  headerLinkLabel?: string;
}

const extractYear = (dateStr: string): number => {
  const match = dateStr.match(/\b(19|20)\d{2}\b/);
  return match ? Number.parseInt(match[0], 10) : 0;
};

const shuffleIndices = (indices: number[]): number[] => {
  const copy = [...indices];
  // Fisher-Yates Shuffle
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Build a recency-tiered playlist excluding `excludeIndex` (defaults to 0, the initial latest photo):
// Tier 1: Recent cohort photos within 2 years of the newest photo (e.g. 2024–2026), shuffled.
// Tier 2: Older archive photos (e.g. 2013–2023), shuffled.
const generateTieredPlaylist = (excludeIndex = 0): number[] => {
  if (TEAM_PHOTOS.length <= 1) return [];

  const latestYear = extractYear(TEAM_PHOTOS[0].date);
  const recentCutoffYear = latestYear - 2;

  const recentIndices: number[] = [];
  const archiveIndices: number[] = [];

  for (let i = 0; i < TEAM_PHOTOS.length; i++) {
    if (i === excludeIndex) continue;
    if (i === 0 || extractYear(TEAM_PHOTOS[i].date) >= recentCutoffYear) {
      recentIndices.push(i);
    } else {
      archiveIndices.push(i);
    }
  }

  return [...shuffleIndices(recentIndices), ...shuffleIndices(archiveIndices)];
};

export default function TeamPhotos({
  variant = "feature",
  intervalMs,
  headerLabel,
  headerHref,
  headerLinkLabel,
}: TeamPhotosProps = {}) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [autoplayOn, setAutoplayOn] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [playlist, setPlaylist] = useState<number[]>(() =>
    generateTieredPlaylist(0),
  );
  const [playlistIndex, setPlaylistIndex] = useState(-1);
  // Tracks whether the current photo's image failed to load, so we can show a
  // text fallback in the frame instead of an empty box. Resets per-photo below.
  const [imageFailed, setImageFailed] = useState(false);

  // Refs for visibility observation and lightbox focus management (move focus in on open, restore on close)
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isCompact = variant === "compact";
  const rotationIntervalMs = intervalMs ?? (isCompact ? 8000 : 5500);

  // Regenerate and shuffle the remaining tiered playlist starting from a manual photo index
  const resetPlaylistForIndex = (index: number) => {
    setPlaylist(generateTieredPlaylist(index));
    setPlaylistIndex(-1);
  };

  // Honor the OS "reduce motion" setting: default autoplay off and gate the
  // timer so content never swaps on its own for users who opted out of motion.
  useEffect(() => {
    setMounted(true);
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

  // Pause rotation when scrolled off-screen or when browser tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);

    const el = containerRef.current;
    let observer: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        { threshold: 0.15 },
      );
      observer.observe(el);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (
      TEAM_PHOTOS.length <= 1 ||
      !autoplayOn ||
      isPaused ||
      isModalOpen ||
      prefersReducedMotion ||
      !isInView ||
      !isTabVisible
    ) {
      return;
    }

    const advancePhoto = () => {
      setPrevIndex(currentIndex);
      setImageFailed(false);

      const nextPlaylistIdx = playlistIndex + 1;
      if (nextPlaylistIdx >= playlist.length) {
        // Playlist finished: Return to the latest photo (index 0) and generate a new tiered shuffle
        setCurrentIndex(0);
        setPlaylist(generateTieredPlaylist(0));
        setPlaylistIndex(-1);
      } else {
        setCurrentIndex(playlist[nextPlaylistIdx]);
        setPlaylistIndex(nextPlaylistIdx);
      }

      // Clear the background image after transition completes to clean up the DOM
      setTimeout(() => {
        setPrevIndex(null);
      }, 600); // matches the 0.6s fade-in duration
    };

    const intervalId = setTimeout(advancePhoto, rotationIntervalMs);

    return () => clearTimeout(intervalId);
  }, [
    currentIndex,
    isPaused,
    isModalOpen,
    isInView,
    isTabVisible,
    playlist,
    playlistIndex,
    autoplayOn,
    prefersReducedMotion,
    rotationIntervalMs,
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const currentPhoto = TEAM_PHOTOS[currentIndex];
  const hasHeader = Boolean(headerLabel || (headerHref && headerLinkLabel));
  const imageSizes = isCompact
    ? "(max-width: 1024px) 100vw, 440px"
    : "(max-width: 1024px) 100vw, 960px";

  const nextPlaylistIdx = playlistIndex + 1;
  const nextUpIndex =
    TEAM_PHOTOS.length <= 1
      ? null
      : nextPlaylistIdx >= playlist.length
        ? 0
        : playlist[nextPlaylistIdx];

  return (
    <div
      ref={containerRef}
      className={`w-full bg-card border border-border/80 rounded-2xl shadow-xs ${
        isCompact
          ? "h-full flex flex-col p-3 sm:p-3.5"
          : "p-4 sm:p-5 space-y-3.5"
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Card Header */}
      {hasHeader && (
        <div
          className={`flex items-center justify-between gap-3 ${
            isCompact ? "mb-2.5 px-0.5" : ""
          }`}
        >
          {headerLabel && (
            <h2 className="mb-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground/80 select-none">
              {headerLabel}
            </h2>
          )}
          {headerHref && headerLinkLabel && (
            <Link
              href={headerHref}
              className="ml-auto text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors select-none"
            >
              {headerLinkLabel}
            </Link>
          )}
        </div>
      )}

      {/* Sleek rounded frame wrapper with thin border & slight shadow drop */}
      <div
        className={`group relative overflow-hidden rounded-xl border border-border shadow-sm bg-muted flex items-center justify-center select-none hover:border-foreground/20 transition-colors ${
          isCompact
            ? "flex-1 min-h-[210px] sm:min-h-[240px] lg:min-h-0 aspect-[16/10] lg:aspect-auto"
            : "aspect-video"
        }`}
      >
        {/* Preload next scheduled photo at matching responsive width so crossfades never flash */}
        {mounted &&
          autoplayOn &&
          !prefersReducedMotion &&
          isInView &&
          nextUpIndex !== null &&
          nextUpIndex !== currentIndex && (
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-0 pointer-events-none -z-10"
            >
              <Image
                src={TEAM_PHOTOS[nextUpIndex].url}
                alt=""
                fill
                sizes={imageSizes}
                className="object-cover"
                loading="eager"
              />
            </div>
          )}

        {/* Background Layer (Outgoing/Static) */}
        {prevIndex !== null && (
          <div className="absolute inset-0 pointer-events-none z-0">
            <Image
              src={TEAM_PHOTOS[prevIndex].url}
              alt=""
              fill
              sizes={imageSizes}
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
            sizes={imageSizes}
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

        {/* Compact variant: overlaid bottom gradient caption to save vertical space */}
        {isCompact && (
          <div className="absolute inset-x-0 bottom-0 z-[15] pointer-events-none bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3.5 pt-10 pb-2.5 pr-12">
            <div
              key={`compact-caption-${currentIndex}`}
              className="animate-fade-in"
            >
              <p className="text-xs font-semibold text-white leading-snug drop-shadow-xs line-clamp-1">
                {currentPhoto.location}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] font-mono text-white/80">
                <span>{currentPhoto.date}</span>
                <span aria-hidden="true" className="text-white/40">
                  &middot;
                </span>
                <span>
                  {currentIndex + 1}/{TEAM_PHOTOS.length}
                </span>
              </div>
            </div>
          </div>
        )}

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

      {/* Caption Metadata & Counter (Feature variant) */}
      {!isCompact && (
        <div className="relative min-h-[42px] pt-0.5">
          {/* Outgoing Caption */}
          {prevIndex !== null && (
            <div className="absolute inset-x-0 top-0.5 flex justify-between items-start pointer-events-none z-0">
              <div className="pr-3">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {TEAM_PHOTOS[prevIndex].location}
                </p>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">
                  {TEAM_PHOTOS[prevIndex].date}
                </p>
              </div>
              <span className="shrink-0 text-[11px] font-mono text-muted-foreground bg-muted border border-border/50 px-2 py-0.5 rounded-md">
                {prevIndex + 1} / {TEAM_PHOTOS.length}
              </span>
            </div>
          )}

          {/* Incoming Caption */}
          <div
            key={`caption-${currentIndex}`}
            className="absolute inset-x-0 top-0.5 flex justify-between items-start z-10 animate-fade-in"
          >
            <div className="pr-3">
              <p className="text-sm font-semibold text-foreground leading-tight">
                {currentPhoto.location}
              </p>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                {currentPhoto.date}
              </p>
            </div>
            <span className="shrink-0 text-[11px] font-mono text-muted-foreground bg-muted border border-border/50 px-2 py-0.5 rounded-md">
              {currentIndex + 1} / {TEAM_PHOTOS.length}
            </span>
          </div>
        </div>
      )}

      {/* Lightbox Modal (portaled directly to document.body to avoid parent stacking context traps) */}
      {mounted &&
        isModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Team photo, full screen: ${currentPhoto.location}, ${currentPhoto.date}`}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md transition-opacity duration-300 p-4 sm:p-6"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-all cursor-pointer z-[110] hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md"
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
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-all cursor-pointer z-[110] hover:scale-110 active:scale-95 flex items-center justify-center shadow-lg backdrop-blur-md"
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
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-all cursor-pointer z-[110] hover:scale-110 active:scale-95 flex items-center justify-center shadow-lg backdrop-blur-md"
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

            {/* Modal Content container: immersive max-w-7xl (1280px matching native photo resolution) with smooth rounded corners, zero padding, and seamless photo fill */}
            <div
              className="relative w-[94vw] max-w-7xl aspect-video max-h-[86vh] rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/80 bg-zinc-950 flex items-center justify-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentPhoto.url}
                alt={`${currentPhoto.date} - ${currentPhoto.location}`}
                fill
                className="object-cover"
                unoptimized
                sizes="(max-width: 1280px) 94vw, 1280px"
                priority
              />
              {/* Modal Caption smoothly overlaid at the bottom of the photo */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 sm:p-6 text-white flex justify-between items-end pointer-events-none">
                <div className="pr-4">
                  <p className="text-sm sm:text-base md:text-lg font-bold text-white drop-shadow-sm leading-snug">
                    {currentPhoto.location}
                  </p>
                  <p className="text-xs sm:text-sm text-white/75 font-mono mt-0.5">
                    {currentPhoto.date}
                  </p>
                </div>
                <span className="shrink-0 text-xs sm:text-sm font-mono font-medium text-white/90 bg-white/15 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full select-none shadow-xs">
                  {currentIndex + 1} / {TEAM_PHOTOS.length}
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
