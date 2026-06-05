"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
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
  const [playlist, setPlaylist] = useState<number[]>(() => 
    generateShuffledPlaylist(TEAM_PHOTOS.length)
  );
  const [playlistIndex, setPlaylistIndex] = useState(-1);

  // Regenerate and shuffle the remaining playlist starting from a manual photo index
  const resetPlaylistForIndex = (index: number) => {
    if (TEAM_PHOTOS.length <= 1) {
      setPlaylist([]);
      setPlaylistIndex(-1);
      return;
    }
    // All indices except the current one
    const remainingIndices = Array.from({ length: TEAM_PHOTOS.length }, (_, i) => i).filter(i => i !== index);
    // Shuffle remaining
    for (let i = remainingIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingIndices[i], remainingIndices[j]] = [remainingIndices[j], remainingIndices[i]];
    }
    setPlaylist(remainingIndices);
    setPlaylistIndex(-1);
  };

  useEffect(() => {
    if (isPaused || isModalOpen) return;

    // Random interval between 10-15 seconds (10000-15000ms)
    const getRandomInterval = () => Math.floor(Math.random() * 5000) + 10000;

    const shufflePhoto = () => {
      setPrevIndex(currentIndex);

      setPlaylistIndex((prevPlaylistIdx) => {
        const nextPlaylistIdx = prevPlaylistIdx + 1;

        if (nextPlaylistIdx >= playlist.length) {
          // Playlist finished: Go back to the latest photo (index 0) and generate a new shuffle
          setCurrentIndex(0);
          setPlaylist(generateShuffledPlaylist(TEAM_PHOTOS.length));
          return -1;
        } else {
          // Show the next shuffled photo
          setCurrentIndex(playlist[nextPlaylistIdx]);
          return nextPlaylistIdx;
        }
      });

      // Clear the background image after transition completes to clean up the DOM
      setTimeout(() => {
        setPrevIndex(null);
      }, 600); // matches the 0.6s fade-in duration
    };

    const intervalId = setTimeout(shufflePhoto, getRandomInterval());

    return () => clearTimeout(intervalId);
  }, [currentIndex, isPaused, isModalOpen, playlist]);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPrevIndex(currentIndex);
    
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
    
    const nextIndex = (currentIndex - 1 + TEAM_PHOTOS.length) % TEAM_PHOTOS.length;
    setCurrentIndex(nextIndex);
    resetPlaylistForIndex(nextIndex);
    
    setTimeout(() => {
      setPrevIndex(null);
    }, 600);
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, currentIndex]);

  const currentPhoto = TEAM_PHOTOS[currentIndex];

  return (
    <div 
      className="space-y-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sleek rounded frame wrapper with thin border & slight shadow drop */}
      <div 
        className="overflow-hidden rounded-xl border border-gray-200/50 shadow-sm aspect-video bg-gray-50 flex items-center justify-center select-none cursor-pointer group hover:border-gray-300 transition-colors relative"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Background Layer (Outgoing/Static) */}
        {prevIndex !== null && (
          <div className="absolute inset-0 pointer-events-none z-0">
            <Image
              src={TEAM_PHOTOS[prevIndex].url}
              alt="Previous team photo"
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
          className="absolute inset-0 z-10 animate-fade-in"
        >
          <Image
            src={currentPhoto.url}
            alt={`${currentPhoto.date} - ${currentPhoto.location}`}
            fill
            sizes="(max-width: 1024px) 100vw, 320px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-sm border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-sm hover:scale-105 flex items-center justify-center"
          aria-label="Previous photo"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-sm border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-sm hover:scale-105 flex items-center justify-center"
          aria-label="Next photo"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Caption Metadata & Counter */}
      <div className="relative h-10 select-none">
        {/* Outgoing Caption */}
        {prevIndex !== null && (
          <div className="absolute inset-x-0 top-0 flex justify-between items-start pointer-events-none z-0">
            <div>
              <p className="text-[11px] font-bold text-gray-400 leading-tight">
                📍 {TEAM_PHOTOS[prevIndex].location}
              </p>
              <p className="text-[10px] font-semibold text-gray-300 mt-0.5">
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
            <p className="text-[11px] font-bold text-gray-500 leading-tight">
              📍 {currentPhoto.location}
            </p>
            <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Left Arrow Button in Modal */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev(e);
            }}
            className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50 hover:scale-105 flex items-center justify-center"
            aria-label="Previous photo"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow Button in Modal */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext(e);
            }}
            className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50 hover:scale-105 flex items-center justify-center"
            aria-label="Next photo"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Modal Content container */}
          <div 
            className="relative max-w-[90vw] max-h-[85vh] aspect-video w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 flex items-center justify-center p-1"
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
                <p className="text-sm font-bold">📍 {currentPhoto.location}</p>
                <p className="text-xs text-gray-300 mt-0.5">{currentPhoto.date}</p>
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
