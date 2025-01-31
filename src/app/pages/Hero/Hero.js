import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';
import img1 from '../../../images/banner-1.png';
import img2 from '../../../images/banner-2.png';
import img3 from '../../../images/banner-2.png';
import img4 from '../../../images/banner-1.png';

const Hero = () => {
  return (
    <div className="w-full bg-gray-50 rounded-lg relative mt-[50px] md:mt-[100px]">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Main Carousel (Full Width on Mobile, 70% on Desktop) */}
        <div className="col-span-1 md:col-span-8">
          <Carousel
            showStatus={false} // Hides the status (e.g., "1/3")
            showThumbs={false} // Hides thumbnail previews
            showIndicators={false} // Hides the dots (indicators)
            infiniteLoop={true} // Enables infinite looping
            autoPlay={true} // Enables autoplay
            interval={3000} // Sets the interval for autoplay
            className="w-full" // Ensure the carousel spans the full width
            renderArrowPrev={(onClickHandler, hasPrev) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 p-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-600 focus:outline-none md:left-4"
                  aria-label="Previous"
                >
                  ❮
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 p-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-600 focus:outline-none md:right-4"
                  aria-label="Next"
                >
                  ❯
                </button>
              )
            }
          >
            {/* Dynamic Height for Images */}
            <div className="relative w-full h-[50vw] sm:h-[40vw] md:h-[30vw] lg:h-[25vw] xl:h-[30vw]">
              <Image src={img1} alt="Slide 1" layout="fill" objectFit="cover" className="w-full h-full" />
            </div>
            <div className="relative w-full h-[50vw] sm:h-[40vw] md:h-[30vw] lg:h-[25vw] xl:h-[30vw]">
              <Image src={img2} alt="Slide 2" layout="fill" objectFit="cover" className="w-full h-full" />
            </div>
          </Carousel>
        </div>
        {/* Small Banners (Stacked on Mobile, Side-by-Side on Desktop) */}
        <div className="col-span-1 md:col-span-4 flex flex-row sm:flex-col gap-2 sm:gap-4">
  {/* First Small Banner */}
  <div className="relative w-1/2 sm:w-full h-[30vw] sm:h-[25vw] md:h-[20vw] lg:h-[15vw] xl:h-[15vw]">
    <Image src={img3} alt="Banner 3" layout="fill" objectFit="cover" className="w-full h-full" />
  </div>
  {/* Second Small Banner */}
  <div className="relative w-1/2 sm:w-full h-[30vw] sm:h-[25vw] md:h-[20vw] lg:h-[15vw] xl:h-[14vw]">
    <Image src={img4} alt="Banner 4" layout="fill" objectFit="cover" className="w-full h-full" />
  </div>
</div>
      </div>
    </div>
  );
};

const PageLayout = () => {
  return (
    <div className="w-full">
      {/* Hero Component Takes Full Width */}
      <Hero />
    </div>
  );
};

export default PageLayout;