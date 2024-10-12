interface TitleProps {
  title: string;
  subTitle?: string;
}

export const ViewTitle = (props: TitleProps) => {
  return (
    <div className="flex-1 flex flex-col gap-1.5">
      {/* subtitleがある場合のみ表示 */}
      {props.subTitle && (
        <span className="text-base">{props.subTitle + "の"}</span>
      )}{" "}
      <span className="text-4xl font-black">{props.title}</span>
    </div>
  );
};