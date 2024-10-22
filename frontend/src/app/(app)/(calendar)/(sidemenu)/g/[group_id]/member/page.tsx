"use client";
import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import { DataTableDemo } from "~/features/memberList/GroupMemberDataTable";

function Page() {
  return (
    <div className="p-6 flex flex-col gap-3">
      <SmallTitleWithIcon title="メンバー一覧" />
      <DataTableDemo />
    </div>
  );
}

export default Page;
