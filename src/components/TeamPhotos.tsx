"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { TEAM_PHOTOS } from "@/data/teamPhotos";

export default function TeamPhotos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Random interval between 10-15 seconds (10000-15000ms)
    const getRandomInterval = () => Math.floor(Math.random() * 5000) + 10000;

    const shufflePhoto = () => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * TEAM_PHOTOS.length);
          } while (newIndex === prevIndex && TEAM_PHOTOS.length > 1);
          return newIndex;
        });
        setIsVisible(true);
      }, 500); // Fade out duration
    };

    const intervalId = setInterval(shufflePhoto, getRandomInterval());

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const currentPhoto = TEAM_PHOTOS[currentIndex];

  return (
    <div className="space-y-3">
      {/* Sleek rounded frame wrapper with thin border & slight shadow drop */}
      <div 
        className="overflow-hidden rounded-xl border border-gray-200/50 shadow-sm aspect-video bg-gray-50 flex items-center justify-center select-none cursor-pointer group hover:border-gray-300 transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <div
          className={`w-full h-full relative transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
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
      </div>
      
      {/* Caption Metadata */}
      <div
        className={`transition-opacity duration-500 select-none ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-[11px] font-bold text-gray-500 leading-tight">
          📍 {currentPhoto.location}
        </p>
        <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
          {currentPhoto.date}
        </p>
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
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-white">
              <p className="text-sm font-bold">📍 {currentPhoto.location}</p>
              <p className="text-xs text-gray-300 mt-0.5">{currentPhoto.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
