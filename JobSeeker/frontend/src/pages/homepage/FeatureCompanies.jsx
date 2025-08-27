import { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logo from "../../assets/images/logotwo.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

const companyData = [
  { name: "Global", jobs: 7 },
  { name: "Global", jobs: 5 },
  { name: "Global", jobs: 6 },
  { name: "Global", jobs: 3 },
  { name: "Global", jobs: 4 },
  { name: "Global", jobs: 8 },
  { name: "Global", jobs: 9 },
];

// Custom arrow components
const NextArrow = ({ onClick, show }) => {
  if (!show) return null;
  return (
    <div
      onClick={onClick}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border shadow-md rounded-full p-2 cursor-pointer hover:bg-gray-100"
    >
      <ChevronRight size={20} />
    </div>
  );
};

const PrevArrow = ({ onClick, show }) => {
  if (!show) return null;
  return (
    <div
      onClick={onClick}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border shadow-md rounded-full p-2 cursor-pointer hover:bg-gray-100"
    >
      <ChevronLeft size={20} />
    </div>
  );
};

export default function FeaturedCompanies() {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(5); // default

  useEffect(() => {
    // detect actual slidesToShow after mount (responsive)
    if (sliderRef.current) {
      const actualSlidesToShow =
        sliderRef.current.innerSlider.props.slidesToShow;
      setSlidesToShow(actualSlidesToShow);
    }
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
      { breakpoint: 420, settings: { slidesToShow: 1 } },
    ],
  };

  const lastSlideIndex = companyData.length - slidesToShow;

  return (
    <div className="relative px-4 py-4">
      {/* Prev Arrow */}
      <PrevArrow
        onClick={() => sliderRef.current.slickPrev()}
        show={currentSlide !== 0}
      />

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {companyData.map((company, i) => (
          <div key={i} className="px-3">
            <div className="border rounded-lg shadow-sm text-center py-4 bg-white">
              <img
                src={logo}
                alt="Company Logo"
                className="h-10 mx-auto mb-4"
              />
              <h3 className="font-semibold py-4 text-2xl">{company.name}</h3>
              <button className="px-4 py-1 rounded-md bg-[#EFEFEF]">
                <a href="" className="text-lg">
                  {company.jobs} jobs
                </a>
              </button>
            </div>
          </div>
        ))}
      </Slider>

      {/* Next Arrow */}
      <NextArrow
        onClick={() => sliderRef.current.slickNext()}
        show={currentSlide < lastSlideIndex}
      />

      
    </div>
  );
}
