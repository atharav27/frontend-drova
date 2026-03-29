"use client";

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@repo/ui/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

interface ImageCarouselProps {
  images: (string | StaticImageData)[];
  title: string;
  className?: string;
}

export function ImageCarousel({ images, title, className = "" }: ImageCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const updateCarouselState = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
      setTotalItems(carouselApi.scrollSnapList().length);
    };

    updateCarouselState();
    carouselApi.on("select", updateCarouselState);

    return () => {
      carouselApi.off("select", updateCarouselState);
    };
  }, [carouselApi]);

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      <Carousel
        setApi={setCarouselApi}
        opts={{ loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="flex items-center justify-center">
              <div className="relative w-full aspect-video">
                <Image
                  src={typeof src === 'string' ? src : src.src}
                  fill
                  className="rounded-xl object-cover"
                  alt={`${title} ${idx + 1}`}
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 z-20 flex items-center justify-between px-3 pointer-events-none">
        <Button
          // onClick={() => scrollToIndex(currentIndex - 1)}
          onClick={() => carouselApi?.scrollPrev()}
          className="pointer-events-auto rounded-full w-8 h-8 p-0 bg-gray-800/50 text-white"
          variant="ghost"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-6" />
        </Button>
        <Button
          // onClick={() => scrollToIndex(currentIndex + 1)}
          onClick={() => carouselApi?.scrollNext()}
          className="pointer-events-auto rounded-full w-8 h-8 p-0 bg-gray-800/50  text-white"
          variant="ghost"
          aria-label="Next slide"
        >
          <ChevronRight className="size-6" />
        </Button>
      </div>

      {/* Navigation Dots */}
      {totalItems > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-20">
          {Array.from({ length: totalItems }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${currentIndex === index ? "bg-white" : "bg-gray-300"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
