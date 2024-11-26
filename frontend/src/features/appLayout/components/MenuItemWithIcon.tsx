import { useRouter } from "next/navigation";
import React from "react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

interface MenuItemWithIconProps {
  icon: React.ReactNode;
  title: string;
  url?: string;
}

const MenuItemWithIcon: React.FC<MenuItemWithIconProps> = (props) => {
  const router = useRouter();
  const handleClick = () => {
    if (props.url) {
      router.push(props.url);
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
