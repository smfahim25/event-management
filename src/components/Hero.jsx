import { FaArrowRightLong } from "react-icons/fa6";

import Carousel from "./ui/Carousel";

import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";

const Hero = ({ sliders }) => {
  const navigate = useNavigate();
  const { defaultTexts } = useData();

  return (
    <>
      <section className="w-full h-[70vh] lg:h-screen bg-black/60 relative">
        <div className="absolute w-full h-full overflow-hidden">
          <Carousel sliders={sliders} />
        </div>
        <div className="absolute bottom-8 lg:bottom-20 left-12 flex flex-col text-white">
          <div className="mb-12">
            <h1 className="md:text-8xl text-5xl font-semibold">
              {defaultTexts.hero.title[0]}
              {/**Live the moment, */}
            </h1>
            <h1 className="md:text-8xl text-5xl font-semibold">
              {defaultTexts.hero.title[1]}{" "}
              <span className="text-[#E167FF]">
                {defaultTexts.hero.title[2]}
              </span>
              {/**Love the experience. */}
            </h1>
          </div>
          <div
            onClick={() => {
              navigate("/app/events");
            }}
            style={{
              cursor: "pointer",
            }}
            className="border-white text-white border-2 font-semibold rounded-lg px-10 py-6 w-fit flex items-center gap-2  hover:gap-5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_-8px_16px_rgba(0,0,0,0.2)]  hover:bg-black/20  hover:shadow-white/40  transition-all ease-in-out duration-500"
          >
            <h1 className="text-xl">{defaultTexts.hero.ctaButton}</h1>
            {/**All events */}
            <FaArrowRightLong color="white" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
