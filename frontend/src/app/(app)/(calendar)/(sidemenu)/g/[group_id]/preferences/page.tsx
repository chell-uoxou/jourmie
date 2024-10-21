"use client";

import React from "react";
import Image from "next/image";
import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import useCurrentGroup from "~/hooks/useCurrentGroup";
import { Skeleton } from "~/components/ui/skeleton";

function Page() {
  const currentDbGroup = useCurrentGroup();

  return (
    <div className="flex w-full justify-center items-center p-6">
      <div className="flex flex-col gap-5 max-w-lg w-full items-center">
        <SmallTitleWithIcon title="概要" />
        {currentDbGroup === "loading" || currentDbGroup === null ? (
          <>
            <Skeleton className="rounded-full size-[100px]" />
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <Image
                src={currentDbGroup.icon_url}
                alt="Selected Icon"
                width={100}
                height={100}
                className="rounded-full"
              />{" "}
            </div>

            <div className="font-bold text-2xl flex justify-center">
              {currentDbGroup.name}
            </div>
            <div className="flex justify-center text-justify">
              {currentDbGroup.description}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
