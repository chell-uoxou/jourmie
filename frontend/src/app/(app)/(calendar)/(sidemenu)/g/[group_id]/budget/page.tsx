"use client";
import React from "react";
import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";

function Page() {
  return (
    <div className="p-6 flex flex-col gap-3">
      <div className="flex justify-between">
        <SmallTitleWithIcon title="グループの予算" />
      </div>
    </div>
  );
}
export default Page;
