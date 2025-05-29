import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import img1 from "../assets/image1.jpg";
import img2 from "../assets/image2.jpg";
import { useData } from "../context/DataContext";

gsap.registerPlugin(ScrollTrigger);

const Info = ({ settings }) => {
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const { defaultTexts } = useData();

  useEffect(() => {
    gsap.fromTo(
      [img1Ref.current],
      {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
      },
      {
        top: 0,
        left: 0,
        xPercent: 0,
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".info",
          start: "top center",
          end: "60% center",
          scrub: 5,
        },
      }
    );

    gsap.fromTo(
      [img2Ref.current],
      {
        bottom: "50%",
        right: "50%",
        xPercent: 50,
        yPercent: 50,
      },
      {
        bottom: 0,
        right: 0,
        xPercent: 0,
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".info",
          start: "top center",
          end: "60% center",
          scrub: 5,
        },
      }
    );
  }, []);

  return (
    <section className="info w-full min-h-screen z-30">
      <div className="w-full h-[12vh] border-[#3D004D] border flex items-center justify-center qwigley-regular text-3xl md:text-5xl text-[#3D004D]">
        <h1>{defaultTexts.info.welcome}</h1>
        {/**Welcome everyone to Diane's outings */}
      </div>

      <div className="flex w-full justify-center h-full flex-1 flex-wrap md:gap-32 items-center">
        <div className="md:w-[30vw] md:h-[30vw] w-[75vw] h-[75vw] relative mt-12">
          <div
            ref={img1Ref}
            className="absolute z-20 top-0 left-0 rounded-[50px] md:w-[20vw] md:h-[20vw] w-[50vw] h-[50vw] overflow-hidden"
          >
            <img
              src={settings?.infoFirstImage || img1}
              alt=""
              className="object-cover h-full w-full"
            />
          </div>
          <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-black rounded-[50px] md:w-[20vw] md:h-[20vw] w-[50vw] h-[50vw]"></div>
          <div
            ref={img2Ref}
            className="absolute z-30 bottom-0 right-0 rounded-[50px] md:w-[20vw] md:h-[20vw] w-[50vw] h-[50vw] overflow-hidden"
          >
            <img
              src={settings?.infoFirstImage || img2}
              alt=""
              className="object-cover h-full w-full"
            />
          </div>
        </div>

        <div className="flex flex-col w-[80vw] md:w-[30vw]">
          {/**We inspire
                        people to go out more */}
          <div className="mb-8 md:mb-14">
            <h1 className="text-4xl md:text-5xl font-semibold ">
              {defaultTexts.info.title[0]}{" "}
              <span className="text-[#FF8317]">
                {defaultTexts.info.title[1]}
              </span>
            </h1>
            <h1 className="text-4xl md:text-5xl font-semibold">
              {defaultTexts.info.title[2]}
            </h1>
          </div>

          <div>
            <p className="text-sm md:text-lg z-[3]">
              {defaultTexts.info.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Info;
