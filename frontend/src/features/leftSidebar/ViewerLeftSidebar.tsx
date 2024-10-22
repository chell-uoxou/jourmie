import { ViewTitle } from "~/components/common/ViewTitle";
import { CalendarTile } from "./components/CalendarTile";
import { ButtonTile } from "./components/ButtonTile";
import { Blocks, Plus } from "lucide-react";

interface ViewerSideBarProps {
  title: string;
  subTitle?: string;
}

export const ViewerLeftSideBar = (props: ViewerSideBarProps) => {
  return (
    <div className="flex flex-col p-6 justify-between h-full gap-3">
      <div className="flex flex-col gap-3">
        <ViewTitle title={props.title} subTitle={props.subTitle} />
        <CalendarTile />
      </div>
      <div className="flex flex-col gap-3">
        <ButtonTile
          variant="outline"
          href="/practice/test4"
          icon={<Blocks className="size-5" />}
        >
          イベント候補一覧
        </ButtonTile>
        <ButtonTile
          variant="default"
          href="/calendar/edit"
          icon={<Plus className="size-5" />}
        >
          予定を追加する
        </ButtonTile>
      </div>
    </div>
  );
};
