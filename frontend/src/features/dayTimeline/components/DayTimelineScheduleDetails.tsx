import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import { PopoverContent } from "~/components/ui/popover";
import { ScheduleEvent } from "./DayTimelineSchedule";
import SmallIconButton from "~/components/common/SmallIconButton";
import {
  CalendarPlus,
  Pencil,
  Trash2,
  X,
  Map,
  CalendarRange,
  Hourglass,
  Check,
  Text,
  PiggyBank,
} from "lucide-react";
import formatTimes from "~/utils/timesformater";
import formatDuration from "~/utils/formater";

interface DayTimelineScheduleDetailsProps {
  scheduleEvent: ScheduleEvent;
  onClickEdit: () => void;
  onClickDelete: () => void;
  onClickAddToCalendar: () => void;
  onClickClose: () => void;
}

const DayTimelineScheduleDetails = (props: DayTimelineScheduleDetailsProps) => {
  return (
    <PopoverContent className="w-80" side={"right"} sideOffset={10}>
      {/* TODO: 編集とかできるようにする */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-end w-full ">
            <div className="flex gap-0">
              <SmallIconButton icon={<Pencil />} onClick={props.onClickEdit} />
              <SmallIconButton
                icon={<CalendarPlus />}
                onClick={props.onClickAddToCalendar}
              />
              <SmallIconButton
                icon={<Trash2 />}
                onClick={props.onClickDelete}
              />
            </div>
            <SmallIconButton icon={<X />} onClick={props.onClickClose} />
          </div>
          <SmallTitleWithIcon title={props.scheduleEvent.title} />
          <div>{props.scheduleEvent.description}</div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center text-sm">
            <Map className="size-4" />
            {props.scheduleEvent.location_text}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <CalendarRange className="size-4" />
            {formatTimes(props.scheduleEvent.available_times)}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <Hourglass className="size-4" />
            {formatDuration(props.scheduleEvent.default_duration)}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <PiggyBank className="size-4" />
            {props.scheduleEvent.default_budget.mode === "per_person"
              ? `${props.scheduleEvent.default_budget.value}円/人`
              : `合計 ${props.scheduleEvent.default_budget.value}円`}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <Check className="size-4" />
            {props.scheduleEvent.preparation_task}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <Text className="size-4" />
            {props.scheduleEvent.notes}
          </div>
        </div>
      </div>
    </PopoverContent>
  );
};

export default DayTimelineScheduleDetails;
