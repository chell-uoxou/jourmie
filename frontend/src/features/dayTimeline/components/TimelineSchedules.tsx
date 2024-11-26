import { DayTimelineSchedule, ScheduleEvent } from "./DayTimelineEvent";
import { useTimelineSettings } from "~/hooks/useTimelineSettings";

interface TimelineSchedulesProps {
  schedules: ScheduleEvent[];
}

const TimelineSchedules = (props: TimelineSchedulesProps) => {
  const { timelineSettings } = useTimelineSettings();
  const getTop = (schedule: ScheduleEvent) => {
    const startDate = schedule.start_time.toDate();
    console.log(startDate);

    const minutesFromMidnight =
      startDate.getHours() * 60 + startDate.getMinutes();
    const top =
      timelineSettings.gridHeight *
      (minutesFromMidnight / (timelineSettings.gridInterval * 60));
    console.log(top);

    return top;
  };

  return (
    <div className="relative w-full h-ful">
      {props.schedules.map((schedule) => {
        return (
          <div
            key={schedule.schedule_uid}
            className="absolute"
            style={{
              top: getTop(schedule),
              left: 24 + 36,
              width: "min(calc(100% - 76px), 400px)",
            }}
          >
            <DayTimelineSchedule schedule={schedule} />
          </div>
        );
      })}
    </div>
  );
};

export default TimelineSchedules;