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
import SmallIconButton from "~/components/common/SmallIconButton";
import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import { PopoverContent } from "~/components/ui/popover";
import { DBEventPoolItem } from "~/lib/firestore/utils";
import { Timestamp } from "firebase/firestore";
import { TimeRange } from "~/models/types/common";
import formatDuration from "~/utils/formater";

interface EventPoolItemDetailsProps {
  eventPoolItem: DBEventPoolItem;
  onClickEdit: () => void;
  onClickDelete: () => void;
  onClickAddToCalendar: () => void;
  onClickClose: () => void;
}

const EventPoolItemDetails = (props: EventPoolItemDetailsProps) => {
  const formatTimes = (times: TimeRange[]) => {
    const { start_time, end_time } = times[0] ?? {
      start_time: Timestamp.now(),
      end_time: Timestamp.now(),
    };

    const startDate = start_time.toDate();
    const endDate = end_time.toDate();

    const sameDay = startDate.toDateString() === endDate.toDateString();

    const startFormatted = startDate.toLocaleString("ja-JP", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const endFormatted = endDate.toLocaleString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      ...(sameDay ? {} : { year: "numeric", month: "numeric", day: "numeric" }),
    });

    return sameDay
      ? `${startFormatted} ~ ${endFormatted}`
      : `${startFormatted} ~ ${endFormatted}`;
  };

  return (
    <PopoverContent className="w-80" side={"right"} sideOffset={10}>
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
          <SmallTitleWithIcon title={props.eventPoolItem.title} />
          <div>{props.eventPoolItem.description}</div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center text-sm">
            <Map className="size-4" />
            {props.eventPoolItem.location_text}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <CalendarRange className="size-4" />
            {formatTimes(props.eventPoolItem.available_times)}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <Hourglass className="size-4" />
            {formatDuration(props.eventPoolItem.default_duration)}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <PiggyBank className="size-4" />
            {props.eventPoolItem.default_budget.mode === "per_person"
              ? `${props.eventPoolItem.default_budget.value}円/人`
              : `合計 ${props.eventPoolItem.default_budget.value}円`}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <Check className="size-4" />
            {props.eventPoolItem.preparation_task}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <Text className="size-4" />
            {props.eventPoolItem.notes}
          </div>
        </div>
      </div>
    </PopoverContent>
  );
};

export default EventPoolItemDetails;
