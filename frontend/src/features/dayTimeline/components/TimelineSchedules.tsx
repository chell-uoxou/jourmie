import { DayTimelineSchedule, ScheduleEvent } from "./DayTimelineSchedule";
import { useTimelineSettings } from "~/hooks/useTimelineSettings";
import DraggableDayTimelineSchedule from "./DraggableDayTimelineSchedule";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useDndEditInTimeline } from "../hooks/useDndEditInTimeline";
import { doc, Timestamp } from "firebase/firestore";
import { db } from "~/lib/firebase";
import useAuthUser from "~/hooks/useAuthUser";
import { defaultConverter } from "~/lib/firestore/firestore";
import { useCalendarSession } from "~/hooks/useCalendarSession";
import { getEndDroppingDate } from "~/app/(app)/(calendar)/calendar/edit/page";
import { DBEventPoolItem } from "~/lib/firestore/utils";
import { MutableRefObject, UIEventHandler, useEffect } from "react";

interface TimelineSchedulesProps {
  schedules: ScheduleEvent[];
  currentDate: Date;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  handleScrollStateForDndEditInTimeline: MutableRefObject<UIEventHandler<HTMLDivElement> | null>;
}

const TimelineSchedules = (props: TimelineSchedulesProps) => {
  const { timelineSettings } = useTimelineSettings();
  const {
    dndContextProps,
    activeId,
    activeScheduleEvent,
    quantizedMinutesFromMidnight,
    handleScroll,
  } = useDndEditInTimeline({ scrollAreaRef: props.scrollAreaRef });
  const { calendarSession } = useCalendarSession();
  const authUser = useAuthUser();

  const droppingDate = new Date(calendarSession.currentDate);
  droppingDate.setHours(
    Math.floor(quantizedMinutesFromMidnight / 60),
    quantizedMinutesFromMidnight % 60
  );

  const getTop = (schedule: ScheduleEvent) => {
    const startDate = schedule.start_time.toDate();
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
        {props.schedules
          .filter((schedule) => {
            const startDate = schedule.start_time.toDate();
            const condition =
              startDate.getDate() === props.currentDate.getDate() &&
              startDate.getMonth() === props.currentDate.getMonth() &&
              startDate.getFullYear() === props.currentDate.getFullYear();
            return condition;
          })
          .map((schedule) => {
            return (
              <div
                key={schedule.schedule_uid}
                className="absolute"
                style={{
                  top: getTop(schedule),
                  left: 24 + 36,
                  width: "min(calc(100% - 76px), 400px)",
                }}
              >
                <DraggableDayTimelineSchedule
                  schedule={schedule}
                  id={schedule.schedule_uid}
                />
              </div>
            );
          })}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <DayTimelineSchedule
            isDragging
            schedule={{
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
