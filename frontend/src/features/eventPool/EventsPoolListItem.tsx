"use client";
import { forwardRef, HTMLAttributes, useState } from "react";
import { Hourglass, Map } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import { TimeRange } from "~/models/types/common";
import { Timestamp } from "firebase/firestore";
import { DBEventPoolItem } from "~/lib/firestore/utils";
import EventPoolItemDetails from "./components/EventPoolItemDetails";
import { Popover, PopoverTrigger } from "~/components/ui/popover";
import { useEventPoolFormSheet } from "~/hooks/useEventPoolFormSheet";
import RemoveEventDialog from "../memberList/components/RemoveEventDialog";

type Props = {
  id: string;
  eventPoolItem: DBEventPoolItem;
} & HTMLAttributes<HTMLDivElement>;

const Component = forwardRef<HTMLDivElement, Props>(function EventPoolItem(
  { eventPoolItem, ...rest }: Props,
  ref
) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { setOpenEventPoolFormSheet, setCurrentEventPoolItem } =
    useEventPoolFormSheet();
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  const handleDeleteButtonClick = () => {
    console.log("削除ボタンが押されました。まだ削除機能は実装されていません。");
    setIsRemoveDialogOpen(false);
  };

  // 時間帯のフォーマット関数
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

    return `${startFormatted} ~ ${endFormatted}`;
  };

  return (
    <div className="relative w-full" ref={ref} {...rest}>
      <Popover onOpenChange={setIsDetailsOpen} open={isDetailsOpen}>
        <PopoverTrigger asChild>
          <Card
            className={clsx(
              "transition-all duration-100",
              isDetailsOpen ? "shadow-lg" : "shadow-sm"
            )}
          >
            <CardContent>
              <h1 className="text-xl font-bold mt-6 mb-4">
                {eventPoolItem.title}
              </h1>
              <div className="flex flex-col gap-y-3">
                <div className="flex items-start gap-x-1 text-sm font-medium">
                  <Hourglass className="w-3.5 h-3.5 mt-1" />
                  {formatTimes(eventPoolItem.available_times)}
                </div>
                <div className="flex items-center gap-x-1 text-sm font-medium">
                  <Map className="w-3.5 h-3.5" />
                  {eventPoolItem.location_text}
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverTrigger>
        <EventPoolItemDetails
          eventPoolItem={eventPoolItem}
          onClickAddToCalendar={() => {}}
          onClickClose={() => setIsDetailsOpen(false)}
          onClickDelete={() => setIsRemoveDialogOpen(true)}
          onClickEdit={() => {
            setCurrentEventPoolItem(eventPoolItem);
            setOpenEventPoolFormSheet(true);
          }}
        />
      </Popover>
      <RemoveEventDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
        event={eventPoolItem}
        onDelete={handleDeleteButtonClick}
      />
    </div>
  );
});

export default function Draggable(props: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.id,
    data: { eventPoolItem: props.eventPoolItem },
  });

  return (
    <div className={clsx(isDragging && "opacity-50")}>
      <Component ref={setNodeRef} {...attributes} {...listeners} {...props} />
    </div>
  );
}
