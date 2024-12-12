import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Popover, PopoverContent } from "~/components/ui/popover";
import { DBEventPoolItem } from "~/lib/firestore/utils";

interface EventPoolItemDetailsProps {
  eventPoolItem: DBEventPoolItem;
}

const EventPoolItemDetails = (props: EventPoolItemDetailsProps) => {
  return (
    <PopoverContent className="w-80" side={"right"} sideOffset={10}>
      {/* TODO: 編集とかできるようにする */}
      <div className="flex flex-col gap-2">
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
