import React from "react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

interface MenuItemWithIconProps {
  icon: React.ReactNode;
  title: string;
  url?: string;
}

const MenuItemWithIcon: React.FC<MenuItemWithIconProps> = (props) => {
  const handleClick = () => {
    if (props.url) {
      window.location.href = props.url;
    }
  };

  return (
    <DropdownMenuItem className="font-bold" onClick={handleClick}>
      <div>{props.icon}</div>
      {props.title}
    </DropdownMenuItem>
  );
};

export default MenuItemWithIcon;
