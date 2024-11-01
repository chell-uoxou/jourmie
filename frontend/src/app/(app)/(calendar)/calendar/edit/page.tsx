"use client";
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { doc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDndTimeline } from "~/app/practice/test1/useDndTimeline";
import { CardBodyWithLeftSidebar } from "~/features/appLayout/CardBodyWithLeftSidebar";
import { DayTimelineEvent } from "~/features/dayTimeline/DayTimelineEvent";
import PrivateScheduleDayTimeline from "~/features/dayTimeline/PrivateScheduleDayTimeline";
import CalendarEditSidebar from "~/features/leftSidebar/CalendarEditSidebar";
import useAuthUser from "~/hooks/useAuthUser";
import { useCalendarSession } from "~/hooks/useCalendarSession";
import { useOptimisticSchedules } from "~/hooks/useOptimisticSchedules";
import { db } from "~/lib/firebase";
import { defaultConverter } from "~/lib/firestore/firestore";
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

  const authUser = useAuthUser();

  const { optimisticSchedules, addOptimisticSchedule } =
    useOptimisticSchedules();

  const { calendarSession } = useCalendarSession();

  const { dndContextProps, onScrollDroppableArea, activeId, setScrollAreaRef } =
    useDndTimeline({
      onDropNewSchedule: (startMinute, eventPoolItem) => {
        console.log("Drop new schedule!", startMinute, eventPoolItem);

        if (authUser === "loading" || authUser === null) return;

        const eventReference = doc(
          db,
          "accounts",
          authUser?.uid,
          "event_pool",
          eventPoolItem.uid
        ).withConverter(defaultConverter<DBEventPoolItem>());
        const startTime = new Date(
          calendarSession.currentDate.setMinutes(startMinute)
        );
        const endTime = new Date(
          calendarSession.currentDate.setMinutes(
            startMinute + eventPoolItem.default_duration
          )
        );

        addOptimisticSchedule(
          {
            event_reference: eventReference,
            actual_budget: eventPoolItem.default_budget,
            did_prepare: false,
            start_time: Timestamp.fromDate(startTime),
            end_time: Timestamp.fromDate(endTime),
          },
          "personal"
        );
      },
    });

  useEffect(() => {
    console.log(optimisticSchedules);
  }, [optimisticSchedules]);

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
