import { CalendarPlus, Pencil, Trash2, X } from "lucide-react";
import SmallIconButton from "~/components/common/SmallIconButton";
import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import { PopoverContent } from "~/components/ui/popover";
import { DBEventPoolItem } from "~/lib/firestore/utils";

interface EventPoolItemDetailsProps {
  eventPoolItem: DBEventPoolItem;
  onClickEdit: () => void;
  onClickDelete: () => void;
  onClickAddToCalendar: () => void;
  onClickClose: () => void;
}

const EventPoolItemDetails = (props: EventPoolItemDetailsProps) => {
  return (
    <PopoverContent className="w-80" side={"right"} sideOffset={10}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-end w-full ">
          <div className="flex gap-0">
            <SmallIconButton icon={<Pencil />} onClick={props.onClickEdit} />
            <SmallIconButton
              icon={<CalendarPlus />}
              onClick={props.onClickAddToCalendar}
            />
            <SmallIconButton icon={<Trash2 />} onClick={props.onClickDelete} />
          </div>
          <SmallIconButton icon={<X />} onClick={props.onClickClose} />
        </div>
        <SmallTitleWithIcon title={props.eventPoolItem.title} />
        <div>{props.eventPoolItem.description}</div>
        <div>{props.eventPoolItem.location_text}</div>
        <div>{props.eventPoolItem.preparation_task}</div>
        <div>{props.eventPoolItem.notes}</div>
      </div>
    </PopoverContent>
  );
};

export default EventPoolItemDetails;
