import React from "react";
import { ViewTitle } from "~/components/common/ViewTitle";
import GroupList from "~/features/groupList/GroupList";
import { GroupSearch } from "~/features/groupList/GroupSearch";

function Page() {

  return (
    <div className="p-6 h-[calc(100vh-56px)] flex flex-col">
      <div className="flex justify-between pb-6">
        <div>
          <ViewTitle title="グループ一覧" />
          <div>表示するグループを選択してください。</div>
        </div>
        <GroupSearch />
      </div>
      <div className="bg-brand-border-color p-6 rounded-lg flex-grow min-h-0 overflow-auto">
        <GroupList />
      </div>
    </div>
  );
}

export default Page;
