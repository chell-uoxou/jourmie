"use client";
import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import { GroupMemberDataTable } from "~/features/memberList/GroupMemberDataTable";

function Page() {
  return (
    <div className="p-6 flex flex-col gap-3">
      <div className="flex justify-between">
        <SmallTitleWithIcon title="グループメンバー" />
      </div>
      <GroupMemberDataTable />
    </div>
  );
}

export default Page;
