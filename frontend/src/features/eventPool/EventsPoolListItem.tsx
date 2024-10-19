"use client";
import { forwardRef, HTMLAttributes } from "react";
import { Hourglass, Map } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import { EventPoolItem } from "~/models/types/event_pool_item";
import { TimeRange } from "~/models/types/common";
import { Timestamp } from "firebase/firestore";

type Props = {
  id: string;
  eventPool: EventPoolItem;
} & HTMLAttributes<HTMLDivElement>;

const Component = forwardRef<HTMLDivElement, Props>(function EventPoolItem(
  { eventPool, ...rest }: Props,
  ref
) {
  // TODO　現状は開始時間と終了時間から時間帯を表示しているが、今後は平日は何時やいつは何時と表形式にしたい。
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
    <div className="relative w-[350px]" ref={ref} {...rest}>
      <Card className="w-[350px]">
        <CardContent>
          <h1 className="text-xl font-bold mt-6 mb-4">{eventPool.title}</h1>
          <div className="col-auto flex flex-col gap-x-0 gap-y-3">
            <div className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-start justify-start gap-x-1 text-sm">
              <Hourglass className="w-3.5 h-3.5 mt-1" />
              {formatTimes(eventPool.available_times)}
            </div>
            <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-start gap-x-1">
              <Map className="w-3.5 h-3.5" />
              {eventPool.location}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default function Draggable(props: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.id,
  });

  return (
    <div className={clsx(isDragging && "opacity-50")}>
      <Component ref={setNodeRef} {...attributes} {...listeners} {...props} />
    </div>
  );
}