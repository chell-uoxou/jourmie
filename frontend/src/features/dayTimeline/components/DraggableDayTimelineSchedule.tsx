import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import {
  DayTimelineScheduledEvent,
  DraggableEventData,
} from "./DayTimelineScheduledEvent";

interface DraggableDayTimelineScheduledEventProps {
  id: string;
  eventData: DraggableEventData;
}

const DraggableDayTimelineScheduledEvent = (
  props: DraggableDayTimelineScheduledEventProps
) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.id,
    data: { eventData: props.eventData },
  });

  return (
    <div className={clsx(isDragging && "opacity-50")}>
      <DayTimelineScheduledEvent
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        {...props}
      />
    </div>
  );
};

export default DraggableDayTimelineScheduledEvent;
