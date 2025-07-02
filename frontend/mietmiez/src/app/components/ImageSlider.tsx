'use client';
import React, { useState } from 'react';

interface ImageSliderProps{
    images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({images}) =>{
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    //Testen wie das aussieht
    if (images.length === 0) {
        return <div>Keine Bilder verfügbar</div>;
    }
    return(<div className="w-full max-w-xl aspect-video overflow-hidden mx-auto rounded-xl shadow-md relative select-none">
      <img
        src={images[currentIndex]}
        alt={`Bild ${currentIndex + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Pfeil nach links */}
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition"
        aria-label="Vorheriges Bild"
      >
        ‹
      </button>

      {/* Pfeil nach rechts */}
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition"
        aria-label="Nächstes Bild"
      >
        ›
      </button>

      {/* Anzeige der Bildnummer */}
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
    );
};

export default ImageSlider;