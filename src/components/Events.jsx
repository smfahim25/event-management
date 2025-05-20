import { useEffect } from "react";
import EventCard from "./ui/EventCard";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useEventStore } from "../store/EventStore";

const Events = () => {
  const navigate = useNavigate();
  const { defaultTexts } = useData();
  const {
    events,
    fetchAllEvents,
    loading: eventsLoading,
    error: eventsError,
  } = useEventStore();

  useEffect(() => {
    fetchAllEvents({
      searchTerm: "",
      // eventCategory: "",
      page: 1,
      limit: 12,
      sort: "eventDate",
    });
  }, []);

  const sortedAllEvents = events
    ? [
        ...events
          .filter((event) => new Date(event.eventDate) > new Date())
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)),
        ...events
          .filter((event) => new Date(event.eventDate) <= new Date())
          .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)),
      ].slice(0, 11)
    : [];

  const upcomingEvents = events
    ? [...events]
        .filter((event) => new Date(event.eventDate) > new Date())
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
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

      <div className="w-full flex-col flex min-h-screen py-20 md:px-12 px-8">
        {eventsLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        )}

        {eventsError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error loading events: {eventsError}</p>
          </div>
        )}

        {!eventsLoading && !eventsError && (
          <div className="w-full flex justify-between min-h-[42vh] md:pl-12 flex-col mb-16">
            <div className="flex flex-col w-full xl:w-[80%]">
              <div className="w-full">
                <h1 className="md:text-4xl text-3xl text-[#3D004D] font-semibold mb-3">
                  {defaultTexts.events.upcoming} <br />{" "}
                  {defaultTexts.events.events}
                </h1>
                <hr className="border-[2.5px] border-[#3D004D] w-16" />
              </div>
            </div>
            <div className=" h-full gap-5 flex items-center flex-wrap justify-center md:justify-start mt-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <EventCard key={event._id} {...event} />
                ))
              ) : (
                <p className="text-gray-500">No upcoming events found</p>
              )}
            </div>
          </div>
        )}

        {!eventsLoading && !eventsError && (
          <div className="w-full flex justify-between min-h-[42vh] md:pl-12 flex-col">
            <div className="flex flex-col w-full xl:w-[80%]">
              <div className="w-full">
                <h1 className="md:text-4xl text-3xl text-[#3D004D] font-semibold mb-3">
                  {defaultTexts.events.all} <br /> {defaultTexts.events.events}
                </h1>
                <hr className="border-[2.5px] border-[#3D004D] w-16" />
              </div>
            </div>

            <div className=" h-full flex items-center gap-5 flex-wrap justify-center md:justify-start mt-3">
              {sortedAllEvents.length > 0 ? (
                <>
                  {sortedAllEvents.map((event) => (
                    <EventCard key={event._id} {...event} />
                  ))}

                  <div
                    onClick={() => navigate("/app/events")}
                    className="rounded-full h-24 w-24 border border-black mt-9 ml-9 flex flex-col justify-center items-center opacity-60 gap-1 hover:scale-110 duration-500 transition-all ease-in-out cursor-pointer"
                  >
                    <FaArrowRightLong size={10} />
                    <p className="text-sm">{defaultTexts.events.seemore}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No events found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
