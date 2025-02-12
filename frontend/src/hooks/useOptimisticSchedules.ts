import { useAtom } from "jotai";
import { DraggableEventData } from "~/features/dayTimeline/components/DayTimelineSchedule";
import { optimisticSchedulesAtom } from "~/stores/optimisticSchedules";

export const useOptimisticSchedules = () => {
  const [optimisticSchedules, setOptimisticSchedules] = useAtom(
    optimisticSchedulesAtom
  );

  const setSchedulesFromDB = (
    schedules: DraggableEventData[],
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

  const addOptimisticSchedule = (
    schedule: DraggableEventData,
    groupId: string
  ) => {
    const optimisticSchedule = {
      ...schedule,
      groupId: groupId,
      isSyncedWithDB: false,
    };
    setOptimisticSchedules([...optimisticSchedules, optimisticSchedule]);
    return schedule;
  };

  const updateOptimisticSchedule = (
    schedule_uid: string,
    data: DraggableEventData
  ) => {
    if (
      optimisticSchedules.some(
        (prevSchedule) => prevSchedule.schedule_uid === schedule_uid
      )
    ) {
      setOptimisticSchedules((prev) =>
        prev.map((prevSchedule) =>
          prevSchedule.schedule_uid === schedule_uid
            ? {
                ...data,
                isSyncedWithDB: false,
                groupId: prevSchedule.groupId,
              }
            : prevSchedule
        )
      );
    } else {
      console.log("Schedule not found: ", schedule_uid);
    }
  };

  return {
    optimisticSchedules,
    setSchedulesFromDB,
    addOptimisticSchedule,
    updateOptimisticSchedule,
  };
};
