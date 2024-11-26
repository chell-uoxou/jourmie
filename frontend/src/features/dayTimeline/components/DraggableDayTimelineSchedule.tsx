import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import { DayTimelineSchedule, ScheduleEvent } from "./DayTimelineSchedule";

interface DraggableTimelineScheduleProps {
  id: string;
  schedule: ScheduleEvent;
}

const DraggableDayTimelineSchedule = (
  props: DraggableTimelineScheduleProps
) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.id,
    data: { schedule: props.schedule },
  });

  return (
    <div className={clsx(isDragging && "opacity-50")}>
      <DayTimelineSchedule
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        {...props}
      />
    </div>
  );
};

export default DraggableDayTimelineSchedule;
