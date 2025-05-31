import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Marquee = () => {
  useEffect(() => {
    gsap.set(".mslides", { scale: 1.3 });
    gsap.registerPlugin(ScrollTrigger);
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".marqueeCont",
        start: "top bottom",
        end: "bottom top",

        scrub: 0.5,
      },
    });

    tl.to(
      ".lft",
      {
        xPercent: -10,
        ease: "power2",
        stagger: 0.03,
      },
      "b"
    ).to(
      ".rgt",
      {
        xPercent: 10,
        ease: "power2",
        stagger: 0.03,
      },
      "b"
    );
  }, []);
  return (
    <section className="w-screen md:h-[50vh] h-[50vh] flex items-center justify-center ">
      <div className="marqueeCont scale-[1.3] text-2xl md:text-3xl  w-[100vw] h-full overflow-hidden">
        <div className="qwigley-regular  mSlides relative scale-[1] w-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="lft row -translate-x-1/2 w-full md:py-5 py-3 flex items-center gap-8">
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
          </div>
          <div className="rgt row -translate-x-1/3 w-full md:py-5 py-3 flex items-center gap-8">
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
          </div>

          <div className="lft row -translate-x-2/3 w-full md:py-5 py-3 flex items-center gap-8">
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>

            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Events</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Outings</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Gathering</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Sports</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
            <div className="elem flex items-center gap-8">
              <h1 className="font-semibold   opacity-60 ">Conference</h1>
              <div className="imgdiv md:w-[2.5rem] md:h-[2.5rem] w-[1.5rem] h-[1.5rem] rounded-full border-[1px] border-[#E167FF]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marquee;
