import { Card, CardContent } from "~/components/ui/card";
import { PropsWithIcon } from "~/components/common/PropsWithIcon";
import { Clock, Map } from "lucide-react";
import clsx from "clsx";
import { Schedule } from "~/models/types/schedule";
import { EventPoolItem } from "~/models/types/event_pool_item";
import { useTimelineSettings } from "~/hooks/useTimelineSettings";
import { forwardRef, HTMLAttributes, useState } from "react";
import { Popover } from "@radix-ui/react-popover";
import { PopoverTrigger } from "~/components/ui/popover";
import DayTimelineScheduleDetails from "./DayTimelineScheduleDetails";

export type ScheduleEvent = Schedule &
  EventPoolItem & {
    schedule_uid: string;
  };

interface DayTimelineEventProps {
  schedule: ScheduleEvent;
  isDragging?: boolean;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const DayTimelineSchedule = forwardRef<
  HTMLDivElement,
  DayTimelineEventProps
>(function DayTimelineSchedule(
  {
    schedule,
    isDragging,
    ...rest
  }: DayTimelineEventProps & HTMLAttributes<HTMLDivElement>,
  ref
) {
  const { timelineSettings } = useTimelineSettings();

  const duration =
    (schedule.end_time.toDate().getTime() -
      schedule.start_time.toDate().getTime()) /
    (1000 * 60);
  const height =
    (duration / (timelineSettings.gridInterval * 60)) *
    timelineSettings.gridHeight;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div ref={ref} {...rest}>
      <Popover onOpenChange={setIsDetailsOpen}>
        <PopoverTrigger className="w-full">
          <Card
            className={clsx(
              isDragging && "shadow-lg",
              "transition-all duration-100",
              isDetailsOpen ? "shadow-lg" : "shadow-sm"
            )}
            style={{
              height: `${height}px`,
              minHeight: "16px",
            }}
          >
            <CardContent className="py-4 px-5">
              <div className="flex flex-col gap-2 items-start">
                <h1 className="text-sm font-bold">{schedule.title}</h1>

                <div className="flex flex-col gap-1.5 ">
                  {schedule.location_text !== "" && (
                    <PropsWithIcon
                      icon={<Map size={14} />}
                      value={schedule.location_text}
                    />
                  )}
                  <PropsWithIcon
                    icon={<Clock size={14} />}
                    value={formatTime(schedule.start_time.toDate())}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverTrigger>
        <DayTimelineScheduleDetails scheduleEvent={schedule} />
      </Popover>
    </div>
  );
});
