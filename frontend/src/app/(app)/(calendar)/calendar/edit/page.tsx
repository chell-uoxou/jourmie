"use client";
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { doc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDndTimeline } from "~/hooks/useDndTimeline";
import { CardBodyWithLeftSidebar } from "~/features/appLayout/CardBodyWithLeftSidebar";
import { DayTimelineSchedule } from "~/features/dayTimeline/components/DayTimelineEvent";
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
  const authUser = useAuthUser();
  const { optimisticSchedules, addOptimisticSchedule } =
    useOptimisticSchedules();
  const { calendarSession } = useCalendarSession();
  const {
    dndContextProps,
    onScrollDroppableArea,
    activeId,
    setScrollAreaRef,
    activeEventPoolItem,
    quantizedMinutesFromMidnight,
  } = useDndTimeline({
    onDropNewSchedule: (startMinute, eventPoolItem) => {
      console.log("Drop new schedule!", startMinute, eventPoolItem);
      const currentDate = new Date(calendarSession.currentDate);

      if (authUser === "loading" || authUser === null) return;

      const eventReference = doc(
        db,
        "accounts",
        authUser?.uid,
        "event_pool",
        eventPoolItem.uid
      ).withConverter(defaultConverter<DBEventPoolItem>());
      const startTime = currentDate;
      startTime.setHours(Math.floor(startMinute / 60), startMinute % 60);
      const endTime = currentDate;
      const endMinutes = startMinute + eventPoolItem.default_duration;
      endTime.setHours(Math.floor(endMinutes / 60), endMinutes % 60);

      addOptimisticSchedule(
        {
          ...eventPoolItem,
          event_reference: eventReference,
          actual_budget: eventPoolItem.default_budget,
          did_prepare: false,
          start_time: Timestamp.fromDate(startTime),
          end_time: Timestamp.fromDate(endTime),
          schedule_uid: eventReference.id,
        },
        "personal"
      );
    },
  });

  const droppingDate = calendarSession.currentDate;
  droppingDate.setHours(
    Math.floor(quantizedMinutesFromMidnight / 60),
    quantizedMinutesFromMidnight % 60
  );

  useEffect(() => {
    console.log(optimisticSchedules);
  }, [optimisticSchedules]);

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
        {activeId ? (
          <DayTimelineSchedule
            isDragging
            schedule={{
              ...activeEventPoolItem!,
              event_reference: doc(
                db,
                "accounts",
                authUser !== "loading" ? authUser?.uid ?? "" : "",
                "event_pool",
                activeId
              ).withConverter(defaultConverter<DBEventPoolItem>()),
              start_time: Timestamp.fromDate(droppingDate),
              end_time: Timestamp.now(),
              actual_budget:
                activeEventPoolItem === null
                  ? { mode: "total", value: 0 }
                  : activeEventPoolItem.default_budget,
              did_prepare: false,
              schedule_uid: activeEventPoolItem?.uid ?? "",
            }}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
