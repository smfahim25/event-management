import Hero from "../../components/Hero";
import Info from "../../components/Info";
import InfoSecond from "../../components/InfoSecond";
import Events from "../../components/Events";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Marquee from "../../components/Marquee";

function LandingPage() {
  return (
    <>
      <div>
        <div className=" relative z-[1] ">
          <div className="absolute w-[45vw] h-[45vw] bg-[#FF8317] rounded-full blur-3xl opacity-20 top-[115vh] left-[5vw]"></div>
          <div className="absolute w-[30vw] h-[30vw] bg-[#7BA5FF] rounded-full blur-3xl opacity-20 top-[145vh] right-[15vw]"></div>
          <div className="absolute w-[100vw] h-[200vh] bg-gradient-to-b opacity-90 from-white via-[#7BA5FF] to-white top-[260vh]"></div>

          <div className="absolute w-[60vw] h-[60vw] bg-[#E167FF] rounded-full blur-3xl opacity-10 top-[530vh] -left-[20vw]"></div>
          <div className="absolute w-[50vw] h-[50vw] bg-[#7BA5FF] rounded-full blur-3xl opacity-20 top-[530vh] left-[7vw]"></div>
          <div className="absolute w-[30vw] h-[30vw] bg-[#FF8317] rounded-full blur-3xl opacity-10 top-[480vh] right-[10vw]"></div>
          <div className="absolute w-[45vw] h-[45vw] bg-[#E167FF] rounded-full blur-3xl opacity-10 top-[480vh] -right-[15vw]"></div>
        </div>
        <div className="relative z-30 ">
          <Nav />
          <Hero />
          <Info />
          <Marquee />
          <InfoSecond />
          <Events />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default LandingPage;
