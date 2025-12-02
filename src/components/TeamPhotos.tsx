"use client";

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
          // Get a random index different from current
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

  return (
    <div>
      <div className="overflow-hidden rounded-lg">
        <div
          className={`transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={TEAM_PHOTOS[currentIndex].url}
            alt={`${TEAM_PHOTOS[currentIndex].date} - ${TEAM_PHOTOS[currentIndex].location}`}
            className="h-auto w-full object-cover"
          />
        </div>
      </div>
      <div
        className={`mt-3 text-xs text-gray-600 transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="font-semibold">
          {TEAM_PHOTOS[currentIndex].date}, {TEAM_PHOTOS[currentIndex].location}
        </p>
      </div>
    </div>
  );
}
