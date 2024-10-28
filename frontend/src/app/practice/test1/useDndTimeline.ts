import { DragOverEvent, DragStartEvent, Modifier } from "@dnd-kit/core";
import { UIEventHandler, useCallback, useMemo, useRef, useState } from "react";
import { useTimelineSettings } from "~/hooks/useTimelineSettings";

export const useDndTimeline = () => {
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [isOverDraggable, setIsOverDraggable] = useState(false);
  const modifierRef = useRef<Parameters<Modifier>[0] | null>(null);
  const { timelineSettings } = useTimelineSettings();
  const topInDayTimeline = useRef<number | null>(null);
  const scrollTopInDayTimeline = useRef<number | null>(null);
  const minutesFromMidnight = useRef<number | null>(null);
  const quantizedMinutesFromMidnight = useRef<number | null>(null);

  const handleStartDrag = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id);
    },
    [setActiveId]
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    console.log("drag over");
    console.log(event);
    if (event.over === null) {
      setIsOverDraggable(false);
    } else {
      setIsOverDraggable(true);
    }
  }, []);

  const handleDragCancel = () => {
    console.log("drag cancel");
    setIsOverDraggable(false);
  };

  const handleDragEnd = () => {
    console.log("drag end");
    setIsOverDraggable(false);
  };

  const eventItemModifier: Modifier = useCallback(
    (args) => {
      let modifiedTransform = args.transform;

      modifierRef.current = args;
      if (args.over && args.over.id === "dnd-practice-droppable") {
        topInDayTimeline.current =
          (args.overlayNodeRect?.top ?? 0) +
          args.transform.y +
          (scrollTopInDayTimeline.current ?? 0);

        minutesFromMidnight.current = Math.floor(
          (topInDayTimeline.current / timelineSettings.gridHeight) *
            timelineSettings.gridInterval *
            60
        );

        minutesFromMidnight.current =
          minutesFromMidnight.current <= 0
            ? 0
            : minutesFromMidnight.current >= 1440
            ? 1440
            : minutesFromMidnight.current;

        quantizedMinutesFromMidnight.current =
          Math.floor(minutesFromMidnight.current / 15) * 15;

        modifiedTransform = {
          ...modifiedTransform,
          x: 450,
          y:
            (quantizedMinutesFromMidnight.current / 60) *
              timelineSettings.gridHeight -
            (scrollTopInDayTimeline.current ?? 0) -
            (args.overlayNodeRect?.top ?? 0),
        };
      }
      return modifiedTransform;
    },
    [timelineSettings.gridHeight, timelineSettings.gridInterval]
  );

  const dndContextProps = useMemo(() => {
    return {
      modifiers: [eventItemModifier],
      onDragStart: handleStartDrag,
      onDragOver: handleDragOver,
      onDragCancel: handleDragCancel,
      onDragEnd: handleDragEnd,
    };
  }, [eventItemModifier, handleStartDrag, handleDragOver]);

  const onScrollDroppableArea: UIEventHandler = useCallback((e) => {
    scrollTopInDayTimeline.current = e.currentTarget.scrollTop;
  }, []);

  return {
    dndContextProps,
    activeId,
    isOverDraggable,
    modifierRef,
    onScrollDroppableArea,
    minutesFromMidnight,
    topInDayTimeline,
    quantizedMinutesFromMidnight,
  };
};
