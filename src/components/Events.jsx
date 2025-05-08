import EventCard from "./ui/EventCard";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";

const mockEvents = [
  {
    id: 1,
    name: "Tech Talk 2025",
    description: "Join top speakers discussing the future of AI.",
    organizer: { username: "techguru" },
    date: "2025-08-15",
    location: "New York City",
  },
  {
    id: 2,
    name: "DesignCon",
    description: "A deep dive into modern UI/UX trends.",
    organizer: { username: "ui_master" },
    date: "2025-06-01",
    location: "San Francisco",
  },
  {
    id: 3,
    name: "Startup Summit",
    description: "Pitch your startup to global investors.",
    organizer: { username: "founderhub" },
    date: "2025-07-10",
    location: "Austin",
  },
  {
    id: 4,
    name: "Hack the Planet",
    description: "A 48-hour coding marathon.",
    organizer: { username: "codewizard" },
    date: "2025-09-20",
    location: "Remote",
  },
  {
    id: 5,
    name: "Past Event Sample",
    description: "Example of a past event.",
    organizer: { username: "archiveadmin" },
    date: "2024-12-15",
    location: "Online",
  },
];

const Events = () => {
  const navigate = useNavigate();
  const { defaultTexts } = useData();

  // Sort and limit all events
  const sortedAllEvents = mockEvents
    ? [
        ...mockEvents
          .filter((event) => new Date(event.date) > new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date)),
        ...mockEvents
          .filter((event) => new Date(event.date) <= new Date())
          .sort((a, b) => new Date(b.date) - new Date(a.date)),
      ].slice(0, 11)
    : [];

  // Upcoming events (top 4)
  const upcomingEvents = mockEvents
    ? [...mockEvents]
        .filter((event) => new Date(event.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 4)
    : [];

  return (
    <section className="w-full min-h-screen md:pt-10">
      {/* Header */}
      <div className="w-full flex gap-6 flex-col items-center p-5 border-[#fff] border bg-white/70 shadow-2xl z-20">
        <h1 className="text-3xl text-[#3D004D] md:text-5xl qwigley-regular">
          {defaultTexts.events.events}
        </h1>
        <h1 className="text-4xl md:text-5xl font-semibold">
          {defaultTexts.events.grabyour}{" "}
          <span className="text-[#7BA5FF]">{defaultTexts.events.seats}</span>
        </h1>
      </div>

      {/* Main Content */}
      <div className="w-full flex-col flex min-h-screen py-20 md:px-12 px-8">
        {/* Upcoming Events Section */}
        <div className="w-full flex items-center justify-between min-h-[42vh] md:pl-12 flex-col mb-16">
          <div className="flex flex-col w-[80%]">
            <div className="w-full">
              <h1 className="md:text-4xl text-3xl text-[#3D004D] font-semibold mb-3">
                {defaultTexts.events.upcoming} <br />{" "}
                {defaultTexts.events.events}
              </h1>
              <hr className="border-[2.5px] border-[#3D004D] w-16" />
            </div>
          </div>
          <div className="w-[75vw] h-full gap-5 flex items-center flex-wrap justify-center md:justify-start mt-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>

        {/* All Events Section */}
        <div className="w-full flex items-center justify-between min-h-[42vh] md:pl-12 flex-col">
          <div className="flex flex-col w-[80%]">
            <div className="w-full">
              <h1 className="md:text-4xl text-3xl text-[#3D004D] font-semibold mb-3">
                {defaultTexts.events.all} <br /> {defaultTexts.events.events}
              </h1>
              <hr className="border-[2.5px] border-[#3D004D] w-16" />
            </div>
          </div>

          <div className="w-[75vw] h-full flex items-center gap-5 flex-wrap justify-center md:justify-start mt-3">
            {sortedAllEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}

            {/* See More Button */}
            <div
              onClick={() => navigate("/app/events")}
              className="rounded-full h-24 w-24 border border-black mt-9 ml-9 flex flex-col  justify-center items-center opacity-60 gap-1 hover:scale-110 duration-500 transition-all ease-in-out"
              style={{ cursor: "pointer" }}
            >
              <FaArrowRightLong size={10} />
              <p className="text-sm">{defaultTexts.events.seemore}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
