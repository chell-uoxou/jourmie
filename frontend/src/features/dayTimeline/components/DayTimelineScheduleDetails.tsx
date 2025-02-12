import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import { PopoverContent } from "~/components/ui/popover";
import { DraggableEventData } from "./DayTimelineScheduledEvent";
import SmallIconButton from "~/components/common/SmallIconButton";
import { X, Map, Check, Text, PiggyBank, Clock } from "lucide-react";
import formatTimes from "~/utils/timesformater";

interface DayTimelineScheduleDetailsProps {
  eventData: DraggableEventData;
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
            <SmallIconButton icon={<X />} onClick={props.onClickClose} />
          </div>
          <SmallTitleWithIcon title={props.eventData.title} />
          <div>{props.eventData.description}</div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center text-sm">
            <Map className="size-4" />
            {props.eventData.location_text}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <Clock className="size-4" />
            {formatTimes([props.eventData])}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <PiggyBank className="size-4" />
            {props.eventData.default_budget.mode === "per_person"
              ? `${props.eventData.default_budget.value}円/人`
              : `合計 ${props.eventData.default_budget.value}円`}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <Check className="size-4" />
            {props.eventData.preparation_task}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <Text className="size-4" />
            {props.eventData.notes}
          </div>
        </div>
      </div>
    </PopoverContent>
  );
};

export default DayTimelineScheduleDetails;
