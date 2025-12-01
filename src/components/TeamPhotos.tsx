"use client";

import { useState, useEffect } from "react";

const teamPhotos = [
  {
    url: "/team/2025-07.jpg",
    date: "July 2025",
    location: "Clove at Swissotel",
  },
  {
    url: "/team/2025-05.jpg",
    date: "May 2025",
    location: "Chimichanga Little India",
  },
  {
    url: "/team/2025-02.2.jpg",
    date: "February 2025",
    location: "Saigon Legend",
  },
  {
    url: "/team/2025-02.1.jpg",
    date: "February 2025",
    location: "Stand Up Paddling",
  },
  {
    url: "/team/2024-06.jpg",
    date: "June 2024",
    location: "Pemenco Chijmes",
  },
  {
    url: "/team/2023-11.jpg",
    date: "November 2023",
    location: "Yoasobi",
  },
  {
    url: "/team/2023-09.jpg",
    date: "September 2023",
    location: "Teacher's Day",
  },
  {
    url: "/team/2023-08.jpg",
    date: "August 2023",
    location: "Tumpeng",
  },
  {
    url: "/team/2023-05.jpg",
    date: "May 2023",
    location: "Whole Earth",
  },
  {
    url: "/team/2023-03.jpg",
    date: "March 2023",
    location: "Brewerkz Stadium",
  },
  {
    url: "/team/2022-11.jpg",
    date: "November 2022",
    location: "The Naughty Chef Shenton Way",
  },
  {
    url: "/team/2022-09.jpg",
    date: "September 2022",
    location: "Teacher's Day",
  },
  {
    url: "/team/2022-04.1.jpg",
    date: "April 2022",
    location: "Cycling from Coney Island",
  },
  {
    url: "/team/2022-04.2.jpg",
    date: "April 2022",
    location: "Brewerkz at One Fullerton",
  },
  {
    url: "/team/2020-12.2.jpg",
    date: "December 2020",
    location: "Food Capital at Grand Copthorne Waterfront",
  },
  {
    url: "/team/2020-12.1.jpg",
    date: "December 2020",
    location: "Ellenborough Market Cafe at Swissotel Merchant Court",
  },
  {
    url: "/team/2019-09.jpg",
    date: "September 2019",
    location: "OverEasy at Fullerton",
  },
  {
    url: "/team/2019-07.jpg",
    date: "July 2019",
    location: "Summer Internship Finale",
  },
  {
    url: "/team/2019-04.jpg",
    date: "April 2019",
    location: "King Ohmii at Robertson Quay",
  },
  {
    url: "/team/2019-01.jpg",
    date: "January 2019",
    location: "Climb Central Kallang Wave",
  },
  {
    url: "/team/2018-11.jpg",
    date: "November 2018",
    location: "Loof at Odeon Towers",
  },
  {
    url: "/team/2018-07.jpg",
    date: "July 2018",
    location: "Sitta Tumpeng N Such",
  },
  {
    url: "/team/2018-05.jpg",
    date: "May 2018",
    location: "TungLok XiHe at Orchard Central",
  },
  {
    url: "/team/2017-10.2.jpg",
    date: "October 2017",
    location: "Dim Sum at Wan Dou Sek",
  },
  {
    url: "/team/2017-10.1.jpg",
    date: "October 2017",
    location: "Archery Tag at Kovan",
  },
  {
    url: "/team/2017-07.jpg",
    date: "July 2017",
    location: "Rice Table at International Building",
  },
  {
    url: "/team/2017-05.jpg",
    date: "May 2017",
    location: "B3 - Burger Beer Bistro",
  },
  {
    url: "/team/2016-12.2.jpg",
    date: "December 2016",
    location: "Saizeriya at The Cathay",
  },
  {
    url: "/team/2016-12.1.jpg",
    date: "December 2016",
    location: "MegaZip Adventure Park",
  },
  {
    url: "/team/2016-06.1.jpg",
    date: "June 2016",
    location: "Katapult Trampoline Park",
  },
  {
    url: "/team/2016-06.2.jpg",
    date: "June 2016",
    location: "Mookata at Orto",
  },
  {
    url: "/team/2015-10.jpg",
    date: "October 2015",
    location: "LaserOPS at Dhoby Ghaut",
  },
  {
    url: "/team/2015-04.jpg",
    date: "April 2015",
    location: "Forest Adventure at Bedok",
  },
  {
    url: "/team/2014-10.jpg",
    date: "October 2014",
    location: "Ice Skating at JCube",
  },
  {
    url: "/team/2014-04.jpg",
    date: "April 2014",
    location: "Paintball at Bottle Tree Park",
  },
  {
    url: "/team/2013-12.jpg",
    date: "December 2013",
    location: "Seoul Garden Marina Square",
  },
  {
    url: "/team/2013-03.jpg",
    date: "March 2013",
    location: "Hog's Breath Cafe at Chijmes",
  },
];

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
            newIndex = Math.floor(Math.random() * teamPhotos.length);
          } while (newIndex === prevIndex && teamPhotos.length > 1);
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
            src={teamPhotos[currentIndex].url}
            alt={`${teamPhotos[currentIndex].date} - ${teamPhotos[currentIndex].location}`}
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
          {teamPhotos[currentIndex].date}, {teamPhotos[currentIndex].location}
        </p>
      </div>
    </div>
  );
}
