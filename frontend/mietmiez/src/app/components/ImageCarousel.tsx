"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const images: string[] = ["/dogs.jpg", "/cat.jpg", "/dolphin.jpg"];

/**
 * a component to display images
 * @constructor
 */
const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-xl aspect-video overflow-hidden mx-auto rounded-xl shadow-md">
      <Image
        src={images[currentIndex]}
        alt={`Bild ${currentIndex + 1}`}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export default ImageCarousel;
