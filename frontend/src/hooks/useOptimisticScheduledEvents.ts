import { useAtom } from "jotai";
import { DraggableEventData } from "~/features/dayTimeline/components/DayTimelineScheduledEvent";
import { optimisticScheduledEventsAtom } from "~/stores/optimisticScheduledEvents";

export const useOptimisticScheduledEvents = () => {
  const [optimisticScheduledEvents, setOptimisticScheduledEvents] = useAtom(
    optimisticScheduledEventsAtom
  );

  const setSchedulesFromDB = (
    eventDataArray: DraggableEventData[],
    groupId: string
  ) => {
    setOptimisticScheduledEvents(
      eventDataArray.map((eventData) => ({
        ...eventData,
        groupId: groupId,
        isSyncedWithDB: true,
      }))
    );
  };

  const addOptimisticSchedule = (
    eventData: DraggableEventData,
    groupId: string
  ) => {
    const optimisticSchedule = {
      ...eventData,
      groupId: groupId,
      isSyncedWithDB: false,
    };
    setOptimisticScheduledEvents([
      ...optimisticScheduledEvents,
      optimisticSchedule,
    ]);
    return eventData;
  };

  const updateOptimisticSchedule = (
    schedule_uid: string,
    data: DraggableEventData
  ) => {
    if (
      optimisticScheduledEvents.some(
        (prevSchedule) => prevSchedule.schedule_uid === schedule_uid
      )
    ) {
      setOptimisticScheduledEvents((prev) =>
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
    optimisticScheduledEvents,
    setSchedulesFromDB,
    addOptimisticSchedule,
    updateOptimisticSchedule,
  };
};
