import { Card, CardContent } from "~/components/ui/card";
import { PropsWithIcon } from "./PropsWithIcon";
import { Clock, Map } from "lucide-react";
import clsx from "clsx";
import { Schedule } from "~/models/types/schedule";
import { EventPoolItem } from "~/models/types/event_pool_item";

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

export const DayTimelineSchedule = ({
  schedule,
  isDragging,
}: DayTimelineEventProps) => {
  return (
    <div>
      <Card className={clsx(isDragging && "shadow-lg")}>
        <CardContent className="py-4 px-5">
          <div className="flex flex-col gap-2">
            <h1 className="text-sm font-bold">{schedule.title}</h1>
            {(schedule.location_text !== "" || !isDragging) && (
              <div className="flex flex-col gap-1.5 ">
                {schedule.location_text !== "" && (
                  <>
                    <PropsWithIcon
                      icon={<Map size={14} />}
                      value={schedule.location_text}
                    />
                    <PropsWithIcon
                      icon={<Clock size={14} />}
                      value={formatTime(schedule.start_time.toDate())}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
