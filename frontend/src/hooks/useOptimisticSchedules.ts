import { useAtom } from "jotai";
import { DBSchedule } from "~/lib/firestore/utils";
import { Schedule } from "~/models/types/schedule";
import { optimisticSchedulesAtom } from "~/stores/optimisticSchedules";

export const useOptimisticSchedules = () => {
  const [optimisticSchedules, setOptimisticSchedules] = useAtom(
    optimisticSchedulesAtom
  );

  const updateSchedulesFromDB = (schedules: DBSchedule[], groupId: string) => {
    setOptimisticSchedules(
      schedules.map((schedule) => ({
        ...schedule,
        groupId: groupId,
        isSyncedWithDB: true,
      }))
    );
  };

  const addOptimisticSchedule = (schedule: Schedule, groupId: string) => {
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
