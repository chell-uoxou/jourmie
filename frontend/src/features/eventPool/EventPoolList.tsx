import React from "react";
import EventPoolItem from "./EventsPoolListItem";
import { DBEventPoolItem } from "~/lib/firestore/utils";

interface EventPoolProps {
  events: DBEventPoolItem[];
}

export const EventPoolList = ({ events }: EventPoolProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {events.map((event: DBEventPoolItem) => (
        <EventPoolItem id={event.uid} key={event.uid} eventPoolItem={event} />
      ))}
    </div>
  );
};
