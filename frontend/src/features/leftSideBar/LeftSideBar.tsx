import { ViewTitle } from "~/components/common/ViewTitle";
import { CalendarTile } from "./components/CalendarTile";
import { ButtonTile } from "./components/ButtonTile";
import { Blocks, Plus } from "lucide-react";

interface LeftSideBarProps {
  title: string;
  subTitle?: string;
}

export const LeftSideBar = (props: LeftSideBarProps) => {
  return (
    <div className="flex flex-col p-6 justify-between">
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
          href="/practice/test4"
          icon={<Plus className="size-5" />}
        >
          予定を追加する
        </ButtonTile>
      </div>
    </div>
  );
};