import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

function Inspiration() {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Placeholder data for Instagram inspiration carousel
  const inspirationSlides = [
    { id: 1, color: "bg-gray-300" },
    { id: 2, color: "bg-gray-300" },
    { id: 3, color: "bg-gray-300" },
    { id: 4, color: "bg-gray-300" },
    { id: 5, color: "bg-gray-300" },
    { id: 6, color: "bg-gray-300" },
    { id: 7, color: "bg-gray-300" },
  ];

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % Math.max(1, inspirationSlides.length - 4)
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.max(1, inspirationSlides.length - 4)) %
        Math.max(1, inspirationSlides.length - 4)
    );
  };
  return (
    <div className="mb-8 mt-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        Take Inspiration from Instagram!
      </h2>

      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out gap-4"
            style={{
              transform: `translateX(-${currentSlide * (100 / 5)}%)`,
            }}
          >
            {inspirationSlides.map((slide) => (
              <div key={slide.id} className="flex-none w-1/5 aspect-square">
                <div
                  className={`w-full h-full ${slide.color} rounded-lg`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-800 hover:bg-gray-700 rounded-full p-3 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-800 hover:bg-gray-700 rounded-full p-3 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* See More Link */}
      <div className="text-center mt-6">
        <button className="text-teal-400 hover:text-teal-300 transition-colors">
          See more...
        </button>
      </div>
    </div>
  );
}

export default Inspiration;
