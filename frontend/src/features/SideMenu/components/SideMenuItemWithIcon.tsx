import React, { ReactNode } from "react";
import { Button } from "~/components/ui/button";

interface SideMenuItemWithIconProps {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
}

const SideMenuItemWithIcon = (props: SideMenuItemWithIconProps) => {
  return (
    <Button
      variant="ghost"
      className="flex p-2 gap-2 justify-start w-full"
      onClick={props.onClick}
    >
      <div>{props.icon}</div>
      <h2 className="text-sm">{props.title}</h2>
    </Button>
  );
};

export default SideMenuItemWithIcon;
