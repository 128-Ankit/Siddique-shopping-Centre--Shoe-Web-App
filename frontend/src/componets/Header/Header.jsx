import { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import "./Header.css";  

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [
    assets.header_img1,
    assets.header_img2,
    assets.header_img3,
    assets.header_img4,
    assets.header_img5,
    assets.header_img6,
    assets.header_img7,
  ];
  const interval = 4000;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(intervalId);
  }, [images, interval]);

  return (
    <div className="slider-container">
      {images.map((image, index) => (
        <div
          key={index}
          className={index === activeIndex ? "slide active" : "slide"}
        >
          <img src={image} alt={`Slide ${index + 1}`} className="slide-image" />
        </div>
      ))}
    </div>
  );
};

export default Slider;
