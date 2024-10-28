interface DebugProps {
  modifierState: ModifierState;
  minutesFromMidnight: MutableRefObject<number>;
  topInDayTimeline: MutableRefObject<number>;
  quantizedMinutesFromMidnight: MutableRefObject<number | null>;
  formatMinutes: (minutes: number) => string;
}

const Debug = (props: DebugProps) => {
  return (
    <div className="absolute flex flex-col translate-y-32">
      {[
        {
          value: props.modifierState?.active?.id,
          key: "active.id",
        },
        {
          value: props.modifierState?.over?.id,
          key: "over.id",
        },
        {
          value: `${props.modifierState?.activeNodeRect?.top}, ${props.modifierState?.activeNodeRect?.left}, ${props.modifierState?.activeNodeRect?.bottom}, ${props.modifierState?.activeNodeRect?.right}`,
          key: "activeNodeRect",
        },
        {
          value: `${props.modifierState?.overlayNodeRect?.top}, ${props.modifierState?.overlayNodeRect?.left}, ${props.modifierState?.overlayNodeRect?.bottom}, ${props.modifierState?.overlayNodeRect?.right}`,
          key: "overlayNodeRect",
        },
        {
          value: `${props.modifierState?.containerNodeRect?.top}, ${props.modifierState?.containerNodeRect?.left}, ${props.modifierState?.containerNodeRect?.bottom}, ${props.modifierState?.containerNodeRect?.right}`,
          key: "containerNodeRect",
        },
        {
          value: `${props.modifierState?.draggingNodeRect?.top}, ${props.modifierState?.draggingNodeRect?.left}, ${props.modifierState?.draggingNodeRect?.bottom}, ${props.modifierState?.draggingNodeRect?.right}`,
          key: "draggingNodeRect",
        },
        {
          value: `${props.modifierState?.windowRect?.top}, ${props.modifierState?.windowRect?.left}`,
          key: "windowRect",
        },
        {
          value: `${props.modifierState?.transform?.x}, ${props.modifierState?.transform?.y}`,
          key: "transform",
        },
        {
          value: `${props.modifierState?.scrollableAncestorRects
            .map(
              (rect: { top: number; left: number }) =>
                `[${rect.top}, ${rect.left}]`
            )
            .join(", ")}`,
          key: "scrollableAncestorRects",
        },
        {
          value: props.minutesFromMidnight.current,
          key: "minutesFromMidnight",
        },
        {
          value: props.topInDayTimeline.current,
          key: "topInDayTimeline",
        },
        {
          value: props.formatMinutes(
            props.quantizedMinutesFromMidnight.current ?? 0
          ),
          key: "quantizedMinutesFromMidnight",
        },
      ].map((item) => (
        <div key={item.key} className="font-mono flex gap-2">
          <span className="font-bold">{item.key}</span>
          {item.value}
        </div>
      ))}
    </div>
  );
};

export default Debug;
