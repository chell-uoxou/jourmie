import { CardBodyWithLeftSidebar } from "~/features/appLayout/CardBodyWithLeftSidebar";
import PrivateScheduleDayTimeline from "~/features/dayTimeline/PrivateScheduleDayTimeline";
import { ViewerLeftSideBar } from "~/features/leftSideBar/ViewerLeftSidebar";

export default function Page() {
  return (
    <CardBodyWithLeftSidebar
      leftSidebar={<ViewerLeftSideBar title="カレンダー" subTitle="あなたの" />}
    >
      <PrivateScheduleDayTimeline />
    </CardBodyWithLeftSidebar>
  );
}
