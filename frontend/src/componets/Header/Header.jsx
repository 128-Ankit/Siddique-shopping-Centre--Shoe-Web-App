import "./Header.css";
import { assets } from "../../assets/assets";
import { Carousel } from "@material-tailwind/react";
import { useState, useEffect } from "react";

const Header = () => {
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(intervalId);
  }, [images]);

  return (
    <>
      <div className="header">
        <div className="img">
          <Carousel
            className="rounded-xl"
            activeIndex={activeIndex}
            onChange={(index) => setActiveIndex(index)}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            ))}
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default Header;
