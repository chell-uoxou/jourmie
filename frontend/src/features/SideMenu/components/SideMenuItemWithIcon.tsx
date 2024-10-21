import clsx from "clsx";
import React, { ReactNode } from "react";
import { Button } from "~/components/ui/button";

interface SideMenuItemWithIconProps {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const SideMenuItemWithIcon = (props: SideMenuItemWithIconProps) => {
  return (
    <Button
      variant={props.isSelected ? "secondary" : "ghost"}
      className={clsx(
        "transition-colors flex p-2 gap-2 justify-start w-full h-8",
        props.isSelected ? "font-bold" : ""
      )}
      onClick={props.onClick}
    >
      <div
        className={clsx(
          "transition-opacity duration-200 absolute w-1 h-6 bg-gray-900 rounded-full -ml-4",
          props.isSelected ? "opacity-100" : "opacity-0"
        )}
      />

      <div>{props.icon}</div>
      <h2 className="text-sm">{props.title}</h2>
    </Button>
  );
};

export default SideMenuItemWithIcon;
