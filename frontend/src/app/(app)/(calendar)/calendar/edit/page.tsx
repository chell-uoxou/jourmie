"use client";
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { doc, Timestamp } from "firebase/firestore";
import { useEffect } from "react";
import { useDndTimeline } from "~/hooks/useDndTimeline";
import { CardBodyWithLeftSidebar } from "~/features/appLayout/CardBodyWithLeftSidebar";
import { DayTimelineScheduledEvent } from "~/features/dayTimeline/components/DayTimelineScheduledEvent";
import PrivateDayTimeline from "~/features/dayTimeline/PrivateDayTimeline";
import CalendarEditSidebar from "~/features/leftSidebar/CalendarEditSidebar";
import useAuthUser from "~/hooks/useAuthUser";
import { useCalendarSession } from "~/hooks/useCalendarSession";
import { useOptimisticScheduledEvents } from "~/hooks/useOptimisticScheduledEvents";
import { db } from "~/lib/firebase";
import { defaultConverter } from "~/lib/firestore/firestore";
import { DBEventPoolItem } from "~/lib/firestore/utils";
import { getEndDroppingDate } from "~/features/dayTimeline/utils/getEndDroppingDate";

export default function Page() {
  const authUser = useAuthUser();
  const { optimisticScheduledEvents, addOptimisticScheduledEvent } =
    useOptimisticScheduledEvents();
  const { calendarSession } = useCalendarSession();
  const {
    dndContextProps,
    onScrollDroppableArea,
    activeId,
    scrollAreaRef,
    activeEventPoolItem,
    quantizedMinutesFromMidnight,
  } = useDndTimeline({
    onDropNewEvent: (startMinute, eventPoolItem) => {
      const currentDate = new Date(calendarSession.currentDate);

      if (authUser === "loading" || authUser === null) return;

      const eventReference = doc(
        db,
        "accounts",
        authUser?.uid,
        "event_pool",
        eventPoolItem.uid
      ).withConverter(defaultConverter<DBEventPoolItem>());
      const endMinutes = startMinute + eventPoolItem.default_duration;
      const startTime = new Date(currentDate);
      startTime.setHours(Math.floor(startMinute / 60), startMinute % 60);
      const endTime = new Date(currentDate);
      endTime.setHours(Math.floor(endMinutes / 60), endMinutes % 60);

      addOptimisticScheduledEvent(
        {
          ...eventPoolItem,
          event_reference: eventReference,
          actual_budget: eventPoolItem.default_budget,
          did_prepare: false,
          start_time: Timestamp.fromDate(startTime),
          end_time: Timestamp.fromDate(endTime),
          schedule_uid: crypto.randomUUID(), // 一旦ランダムなUUIDを生成、DB保存後に上書き
        },
        "personal"
      );
    },
  });

  const droppingDate = new Date(calendarSession.currentDate);
  droppingDate.setHours(
    Math.floor(quantizedMinutesFromMidnight / 60),
    quantizedMinutesFromMidnight % 60
  );

  useEffect(() => {
    console.log(optimisticScheduledEvents);
  }, [optimisticScheduledEvents]);

  return (
    <DndContext {...dndContextProps}>
      <CardBodyWithLeftSidebar leftSidebar={<CalendarEditSidebar />}>
        <PrivateDayTimeline
          onScroll={onScrollDroppableArea}
          scrollAreaRef={scrollAreaRef}
        />
      </CardBodyWithLeftSidebar>
      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({}),
          duration: 0,
        }}
      >
        {activeId ? (
          <DayTimelineScheduledEvent
            isDragging
            eventData={{
              ...activeEventPoolItem!,
              event_reference: doc(
                db,
                "accounts",
                authUser !== "loading" ? authUser?.uid ?? "" : "",
                "event_pool",
                activeId
              ).withConverter(defaultConverter<DBEventPoolItem>()),
              start_time: Timestamp.fromDate(droppingDate),
              end_time: Timestamp.fromDate(
                getEndDroppingDate(
                  calendarSession.currentDate,
                  quantizedMinutesFromMidnight,
                  activeEventPoolItem!.default_duration
                )
              ),
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
