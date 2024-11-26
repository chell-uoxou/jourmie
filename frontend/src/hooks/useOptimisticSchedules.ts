import { useAtom } from "jotai";
import { ScheduleEvent } from "~/features/dayTimeline/components/DayTimelineEvent";
import { optimisticSchedulesAtom } from "~/stores/optimisticSchedules";

export const useOptimisticSchedules = () => {
  const [optimisticSchedules, setOptimisticSchedules] = useAtom(
    optimisticSchedulesAtom
  );

  const updateSchedulesFromDB = (
    schedules: ScheduleEvent[],
    groupId: string
  ) => {
    setOptimisticSchedules(
      schedules.map((schedule) => ({
        ...schedule,
        groupId: groupId,
        isSyncedWithDB: true,
      }))
    );
  };

  const addOptimisticSchedule = (schedule: ScheduleEvent, groupId: string) => {
    const optimisticSchedule = {
      ...schedule,
      groupId: groupId,
      isSyncedWithDB: false,
    };
    setOptimisticSchedules([...optimisticSchedules, optimisticSchedule]);
    return schedule;
  };

  return {
    optimisticSchedules,
    updateSchedulesFromDB,
    addOptimisticSchedule,
  };
};
