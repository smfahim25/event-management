import { useEffect, useState } from "react";

const Carousel = ({ sliders }) => {
  const [curr, setCurr] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    if (sliders && sliders.length > 0) {
      const sortedSliders = [...sliders].sort(
        (a, b) => a.position - b.position
      );
      const slideImages = sortedSliders.map((slider) => slider.image);
      setSlides(slideImages);

      setCurr(0);
    } else {
      setSlides([]);
    }
  }, [sliders]);

  const next = () => {
    setCurr((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const slideInterval = setInterval(next, 6000);
    return () => {
      clearInterval(slideInterval);
    };
  }, [slides.length]);

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex transition-transform ease-out duration-1000"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((slideImage, index) => (
          <img
            key={index}
            src={slideImage}
            alt={
              sliders && sliders[index]
                ? sliders[index].title
                : `Slide ${index + 1}`
            }
            className="w-screen h-screen object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Optional: Navigation dots */}
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`transition-all w-3 h-3 bg-white rounded-full cursor-pointer ${
                curr === i ? "p-2" : "bg-opacity-50"
              }`}
              onClick={() => setCurr(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
