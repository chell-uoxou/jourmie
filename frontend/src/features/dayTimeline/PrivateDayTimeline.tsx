"use client";

import DateSwitcher from "../timeline/DateSwitcher";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Timeline } from "../timeline/Timeline";
import { useCalendarSession } from "~/hooks/useCalendarSession";
import { UIEvent, UIEventHandler, useCallback, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useTimelineSettings } from "~/hooks/useTimelineSettings";
import DayTimelineScheduleEvents from "./components/DayTimelineScheduleEvents";
import { useOptimisticScheduledEvents } from "~/hooks/useOptimisticScheduledEvents";

interface PrivateDayTimelineProps {
  onScroll?: UIEventHandler<HTMLDivElement>;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}

const PrivateDayTimeline = (props: PrivateDayTimelineProps) => {
  const { calendarSession, updateCalendarSession } = useCalendarSession();
  const { setNodeRef } = useDroppable({ id: "droppable-timeline" });
  const { timelineSettings } = useTimelineSettings();
  const { optimisticScheduledEvents } = useOptimisticScheduledEvents();
  const onScrollForDndEditInTimeline =
    useRef<UIEventHandler<HTMLDivElement> | null>(null);

  const handleScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      if (onScrollForDndEditInTimeline.current) {
        onScrollForDndEditInTimeline.current(e);
      }
      if (props.onScroll) {
        props.onScroll(e);
      }
    },
    [onScrollForDndEditInTimeline, props]
  );

  return (
    <div className="relative flex flex-col size-full px-6">
      <ScrollArea
        className="size-full"
        onScroll={handleScroll}
        ref={props.scrollAreaRef}
      >
        <div className="my-6 mr-3 relative" ref={setNodeRef}>
          <DayTimelineScheduleEvents
            eventDataArray={optimisticScheduledEvents}
            currentDate={calendarSession.currentDate}
            scrollAreaRef={props.scrollAreaRef}
            handleScrollStateForDndEditInTimeline={onScrollForDndEditInTimeline}
          />
          <Timeline
            itemHeight={timelineSettings.gridHeight}
            interval={timelineSettings.gridInterval}
          />
        </div>
      </ScrollArea>
      <div className="absolute top-[14px] left-[17px]">
        <DateSwitcher
          value={calendarSession.currentDate}
          onChange={(date) => updateCalendarSession("currentDate", date)}
        />
      </div>
    </div>
  );
};

export default PrivateDayTimeline;
