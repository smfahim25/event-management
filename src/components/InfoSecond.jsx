import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import img3 from "../assets/image3.jpg";
import { useData } from "../context/DataContext";

gsap.registerPlugin(ScrollTrigger);

const InfoSecond = ({ settings }) => {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);

  const { defaultTexts } = useData();

  useEffect(() => {
    gsap.fromTo(
      [box1Ref.current],
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
          trigger: ".info2",
          start: "top center",
          end: "60% center",
          scrub: 3,
        },
      }
    );

    gsap.fromTo(
      [box2Ref.current],
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
          trigger: ".info2",
          start: "center center",
          end: "60% center",
          scrub: 3,
        },
      }
    );
  }, []);
  return (
    <section className=" info2 w-full min-h-screen md:px-12 px-8 md:pt-10 pt-10 flex flex-col items-center">
      <h1 className=" text-[7.3vw] font-black bg-gradient-to-b from-[#FF8317]  to-white inline-block text-transparent bg-clip-text h-fit opacity-80">
        {defaultTexts.infoSecond.title}
      </h1>

      <div className="  flex w-full justify-center  flex-wrap md:gap-32 items-center mt-8 md:mt-14">
        <div className="flex flex-col w-[80vw] md:w-[30vw]">
          <div className=" mb-8 md:mb-14 ">
            <h1 className="text-4xl md:text-5xl font-semibold">
              {defaultTexts.infoSecond.subtitle[0]}{" "}
              <span className=" text-[#FF8317]">
                {defaultTexts.infoSecond.subtitle[1]}{" "}
              </span>
            </h1>
            <h1 className="text-4xl md:text-5xl font-semibold">
              {defaultTexts.infoSecond.subtitle[2]}
            </h1>
          </div>

          <div>
            <p className=" text-sm md:text-lg">
              {defaultTexts.infoSecond.description}
            </p>
          </div>
        </div>

        <div className=" md:w-[33vw] md:h-[12vw] w-[75vw] h-[48vw]  relative mt-12">
          <div
            ref={box1Ref}
            className=" absolute z-10 top-0 left-0  border border-black rounded-[50px] md:w-[30vw] md:h-[15vw] w-[70vw] h-[40vw]"
          ></div>
          <div className=" absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-[50px] md:w-[30vw] md:h-[15vw] w-[70vw] h-[40vw] overflow-hidden">
            <img
              src={settings?.marqueeImage || img3}
              alt=""
              className=" object-cover h-full w-full"
            />
          </div>
          <div
            ref={box2Ref}
            className=" absolute z-10 bottom-0 right-0 border border-black rounded-[50px] md:w-[30vw] md:h-[15vw] w-[70vw] h-[40vw]"
          ></div>
        </div>
      </div>
    </section>
  );
};

export default InfoSecond;
