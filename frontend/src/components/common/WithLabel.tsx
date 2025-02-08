import clsx from "clsx";
import React, { PropsWithChildren } from "react";

interface WithLabel extends PropsWithChildren {
  label: string;
  className?: string;
}

export const WithLabel = (props: WithLabel) => {
  const { label, children } = props;

  return (
    <div className="flex-1 flex flex-col gap-1.5">
      <div
        className={clsx(
          "text-sm text-left text-slate-900 font-bold",
          props.className
        )}
      >
        {label}
      </div>
      {children}
    </div>
  );
};
