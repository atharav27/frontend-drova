"use client"
import Image, { StaticImageData } from "next/image";
import { useState, useEffect } from "react";
import { ImageCarousel } from "./image-carousel";

interface PostImageGalleryProps {
  images: (string | StaticImageData)[];
  title: string;
}

export function PostImageGallery({ images, title }: PostImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Ensure we have at least 4 images for the layout, use first image as fallback
  const displayImages = images.length >= 4 ? images.slice(0, 4) : [
    ...images,
    ...Array(4 - images.length).fill(images[0] || '')
  ].filter(Boolean);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Console log the active image whenever it changes
  useEffect(() => {
    console.log(`Big view showing image ${activeImageIndex + 1}:`, displayImages[activeImageIndex]);
    console.log(`Image title: ${title}`);
  }, [activeImageIndex, displayImages, title]);

  // For mobile view, use carousel
  if (isMobile) {
    return <ImageCarousel images={images} title={title} />;
  }

  return (
    <div className="space-y-4">
      {/* Main large image */}
      <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden bg-gray-100">
        {displayImages[activeImageIndex] && (
          <Image
            src={displayImages[activeImageIndex]}
            fill
            className="object-cover"
            alt={`${title} main`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            priority
          />
        )}
      </div>

      {/* Thumbnail row */}
      <div className="grid grid-cols-4 gap-3">
        {displayImages.map((src, idx) => (
          <div
            key={idx}
            className={`relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-100 cursor-pointer transition-all duration-200 ${
              activeImageIndex === idx
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
            }`}
            onClick={() => setActiveImageIndex(idx)}
          >
            {src && (
              <Image
                src={src}
                fill
                className="object-cover hover:scale-105 transition-transform"
                alt={`${title} ${idx + 1}`}
                sizes="(max-width: 768px) 25vw, 120px"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
