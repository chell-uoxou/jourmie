import {
  DayTimelineScheduledEvent,
  DraggableEventData,
} from "./DayTimelineScheduledEvent";
import { useTimelineSettings } from "~/hooks/useTimelineSettings";
import DraggableDayTimelineSchedule from "./DraggableDayTimelineSchedule";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useDndEditInTimeline } from "../hooks/useDndEditInTimeline";
import { doc, Timestamp } from "firebase/firestore";
import { db } from "~/lib/firebase";
import useAuthUser from "~/hooks/useAuthUser";
import { defaultConverter } from "~/lib/firestore/firestore";
import { useCalendarSession } from "~/hooks/useCalendarSession";
import { DBEventPoolItem } from "~/lib/firestore/utils";
import { MutableRefObject, UIEventHandler, useEffect } from "react";
import { useOptimisticScheduledEvents } from "~/hooks/useOptimisticScheduledEvents";
import { getEndDroppingDate } from "../utils/getEndDroppingDate";

interface TimelineSchedulesProps {
  eventDataArray: DraggableEventData[];
  currentDate: Date;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  handleScrollStateForDndEditInTimeline: MutableRefObject<UIEventHandler<HTMLDivElement> | null>;
}

const TimelineSchedules = (props: TimelineSchedulesProps) => {
  const { timelineSettings } = useTimelineSettings();
  const { calendarSession } = useCalendarSession();
  const { updateOptimisticScheduledEvent } = useOptimisticScheduledEvents();
  const {
    dndContextProps,
    activeId,
    activeScheduleEvent,
    quantizedMinutesFromMidnight,
    handleScroll,
  } = useDndEditInTimeline({
    scrollAreaRef: props.scrollAreaRef,
    onChangeStartTime: (startMinute, scheduleEvent) => {
      const newStartTime = new Date(scheduleEvent.start_time.toDate());
      const newEndTime = new Date(scheduleEvent.end_time.toDate());
      const duration =
        newEndTime.getHours() * 60 +
        newEndTime.getMinutes() -
        newStartTime.getHours() * 60 -
        newStartTime.getMinutes();
      const endMinute = startMinute + duration;
      newStartTime.setHours(Math.floor(startMinute / 60), startMinute % 60);
      newEndTime.setHours(Math.floor(endMinute / 60), endMinute % 60);
      updateOptimisticScheduledEvent(scheduleEvent.schedule_uid, {
        ...scheduleEvent,
        start_time: Timestamp.fromDate(newStartTime),
        end_time: Timestamp.fromDate(newEndTime),
      });

      console.log("Change start time!", startMinute, endMinute, duration);
    },
  });
  const authUser = useAuthUser();

  const droppingDate = new Date(calendarSession.currentDate);
  droppingDate.setHours(
    Math.floor(quantizedMinutesFromMidnight / 60),
    quantizedMinutesFromMidnight % 60
  );

  const getTop = (eventData: DraggableEventData) => {
    const startDate = eventData.start_time.toDate();
    const minutesFromMidnight =
      startDate.getHours() * 60 + startDate.getMinutes();
    const top =
      timelineSettings.gridHeight *
      (minutesFromMidnight / (timelineSettings.gridInterval * 60));
    return top;
  };

  useEffect(() => {
    props.handleScrollStateForDndEditInTimeline.current = handleScroll;
  }, [handleScroll, props.handleScrollStateForDndEditInTimeline]);

  return (
    <DndContext {...dndContextProps}>
      <div className="relative w-full h-ful">
        {props.eventDataArray
          .filter((eventData) => {
            const startDate = eventData.start_time.toDate();
            const condition =
              startDate.getDate() === props.currentDate.getDate() &&
              startDate.getMonth() === props.currentDate.getMonth() &&
              startDate.getFullYear() === props.currentDate.getFullYear();
            return condition;
          })
          .map((eventData) => {
            return (
              <div
                key={eventData.schedule_uid}
                className="absolute"
                style={{
                  top: getTop(eventData),
                  left: 24 + 36,
                  width: "min(calc(100% - 76px), 400px)",
                }}
              >
                <DraggableDayTimelineSchedule
                  eventData={eventData}
                  id={eventData.schedule_uid}
                />
              </div>
            );
          })}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <DayTimelineScheduledEvent
            isDragging
            eventData={{
              ...activeScheduleEvent!,
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
                  activeScheduleEvent!.default_duration
                )
              ),
              actual_budget:
                activeScheduleEvent === null
                  ? { mode: "total", value: 0 }
                  : activeScheduleEvent.default_budget,
              did_prepare: false,
              schedule_uid: activeScheduleEvent?.schedule_uid ?? "",
            }}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TimelineSchedules;
