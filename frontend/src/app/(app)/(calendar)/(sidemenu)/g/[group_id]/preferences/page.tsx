import React from "react";
import Image from "next/image";
import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";

function Page() {
  return (
    <div className="flex w-full justify-center items-center p-6">
      <div className="flex flex-col gap-5 max-w-lg">
        <SmallTitleWithIcon title="概要" />
        <div className="flex justify-center">
          <Image
            src={"/images/defaultIcon.png"}
            alt="Selected Icon"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <div className="font-bold text-2xl flex justify-center">グループ名</div>
        <div className="flex justify-center text-justify">
          これはグループの説明を表示します。これはグループの説明を表示します。これはグループの説明を表示します。これはグループの説明を表示します。これはグループの説明を表示します。これはグループの説明を表示します。
        </div>
      </div>
    </div>
  );
}

export default Page;
