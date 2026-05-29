"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { TEAM_PHOTOS } from "@/data/teamPhotos";

export default function TeamPhotos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

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

  const currentPhoto = TEAM_PHOTOS[currentIndex];

  return (
    <div className="space-y-3">
      {/* Sleek rounded frame wrapper with thin border & slight shadow drop */}
      <div className="overflow-hidden rounded-xl border border-gray-200/50 shadow-sm aspect-video bg-gray-50 flex items-center justify-center select-none">
        <div
          className={`w-full h-full relative transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={currentPhoto.url}
            alt={`${currentPhoto.date} - ${currentPhoto.location}`}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover transition-transform duration-300 hover:scale-105"
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
    </div>
  );
}
