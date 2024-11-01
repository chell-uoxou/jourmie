"use client";
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { useState } from "react";
import { useDndTimeline } from "~/app/practice/test1/useDndTimeline";
import { CardBodyWithLeftSidebar } from "~/features/appLayout/CardBodyWithLeftSidebar";
import { DayTimelineEvent } from "~/features/dayTimeline/DayTimelineEvent";
import PrivateScheduleDayTimeline from "~/features/dayTimeline/PrivateScheduleDayTimeline";
import CalendarEditSidebar from "~/features/leftSidebar/CalendarEditSidebar";
import { DBEventPoolItem } from "~/lib/firestore/utils";

export default function Page() {
  const [events, setEvents] = useState<DBEventPoolItem[]>([]);
  // const [modifierState, setModifierState] = useState<
  //   Parameters<Modifier>[0] | null
  // >(null);

  // const formatMinutes = (minutes: number) => {
  //   const hours = Math.floor(minutes / 60);
  //   const minutesInHour = minutes % 60;
  //   return `${hours.toString().padStart(2, "0")}:${minutesInHour
  //     .toString()
  //     .padStart(2, "0")}`;
  // };

  const { dndContextProps, onScrollDroppableArea, activeId, setScrollAreaRef } =
    useDndTimeline();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setModifierState(modifierRef.current);
  //   }, 100);
  //   return () => clearInterval(interval);
  // }, [modifierRef]);

  return (
    <DndContext {...dndContextProps}>
      <CardBodyWithLeftSidebar
        leftSidebar={
          <CalendarEditSidebar events={events} setEvents={setEvents} />
        }
      >
        <PrivateScheduleDayTimeline
          onScroll={onScrollDroppableArea}
          setScrollAreaRef={setScrollAreaRef}
        />
      </CardBodyWithLeftSidebar>
      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({}),
          duration: 0,
        }}
      >
        {/* <Debug
          modifierState={modifierState}
          minutesFromMidnight={minutesFromMidnight}
          topInDayTimeline={topInDayTimeline}
          quantizedMinutesFromMidnight={quantizedMinutesFromMidnight}
          formatMinutes={formatMinutes}
        /> */}
        {activeId ? (
          <DayTimelineEvent
            isDragging
            event={
              events.find((event) => event.uid === activeId) as DBEventPoolItem
            }
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
