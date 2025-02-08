import { PropsWithChildren, ReactNode } from "react";

interface CardBodyWithLeftSidebarProps extends PropsWithChildren {
  leftSidebar: ReactNode;
}

export const CardBodyWithLeftSidebar = (
  props: CardBodyWithLeftSidebarProps
) => {
  return (
    <div className="flex gap-0 size-full">
      <div className="h-full">{props.leftSidebar}</div>
      <div className="bg-gray-100 size-full p-6">
        <div className="flex-1 shadow-xl rounded-lg bg-white size-full">
          {props.children}
        </div>
      </div>
    </div>
  );
};
