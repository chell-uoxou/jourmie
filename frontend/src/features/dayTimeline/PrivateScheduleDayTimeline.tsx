"use client";

import DateSwitcher from "../timeline/DateSwitcher";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Timeline } from "../timeline/Timeline";
import { useCalendarSession } from "~/hooks/useCalendarSession";
import { RefCallback, UIEventHandler } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useTimelineSettings } from "~/hooks/useTimelineSettings";

interface PrivateScheduleDayTimelineProps {
  onScroll?: UIEventHandler<HTMLDivElement>;
  setScrollAreaRef?: RefCallback<HTMLDivElement>;
}

const PrivateScheduleDayTimeline = (props: PrivateScheduleDayTimelineProps) => {
  const { calendarSession, updateCalendarSession } = useCalendarSession();
  const { setNodeRef } = useDroppable({ id: "droppable-timeline" });
  const { timelineSettings } = useTimelineSettings();

  return (
    <div className="relative flex flex-col size-full px-6">
      <ScrollArea
        className="size-full"
        onScroll={props.onScroll}
        ref={props.setScrollAreaRef}
      >
        <div className="my-6 mr-3" ref={setNodeRef}>
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

export default PrivateScheduleDayTimeline;
