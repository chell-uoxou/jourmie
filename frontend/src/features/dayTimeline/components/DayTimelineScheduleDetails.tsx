import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import { PopoverContent } from "~/components/ui/popover";
import { ScheduleEvent } from "./DayTimelineSchedule";

interface DayTimelineScheduleDetailsProps {
  scheduleEvent: ScheduleEvent;
}

const DayTimelineScheduleDetails = (props: DayTimelineScheduleDetailsProps) => {
  return (
    <PopoverContent className="w-80" side={"right"} sideOffset={10}>
      {/* TODO: 編集とかできるようにする */}
      <div className="flex flex-col gap-2">
        <SmallTitleWithIcon title={props.scheduleEvent.title} />
        <div>{props.scheduleEvent.description}</div>
        <div>{props.scheduleEvent.location_text}</div>
        <div>{props.scheduleEvent.preparation_task}</div>
        <div>{props.scheduleEvent.notes}</div>
      </div>
    </PopoverContent>
  );
};

export default DayTimelineScheduleDetails;
