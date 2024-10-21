import React, { ReactNode } from "react";
import { LoadingSpinner } from "../ui/spinner";

interface SmallTitleWithIconProps {
  icon?: ReactNode;
  title: string;
  isLoading?: boolean;
}

const SmallTitleWithIcon = (props: SmallTitleWithIconProps) => {
  return (
    <div className="flex gap-2 items-center">
      {props.icon ? <div className="size-6">{props.icon}</div> : null}
      <h2 className="text-xl font-bold">{props.title}</h2>
      {props.isLoading && <LoadingSpinner className="size-6" />}
    </div>
  );
};

export default SmallTitleWithIcon;
