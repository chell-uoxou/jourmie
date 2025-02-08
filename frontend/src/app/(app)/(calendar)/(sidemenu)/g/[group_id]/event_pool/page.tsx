"use client";
import React from "react";
import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import useCurrentGroup from "~/hooks/useCurrentGroup";
import { isReady } from "~/lib/firestore/utils";

function Page() {
  const group = useCurrentGroup();
  if (isReady(group)) {
  }
  return (
    <div className="p-6 flex flex-col gap-3">
      <div className="flex justify-between">
        <SmallTitleWithIcon title="イベント候補" />
      </div>
    </div>
  );
}
export default Page;
