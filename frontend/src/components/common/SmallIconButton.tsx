import React from "react";
import { Button, ButtonProps } from "../ui/button";
import { X } from "lucide-react";

interface SmallIconButtonProps extends ButtonProps {
  icon: React.ReactNode;
}

const SmallIconButton = (props: SmallIconButtonProps) => {
  return (
    <Button variant={"ghost"} size={"icon"} className="size-8" {...props}>
      {props.icon}
    </Button>
  );
};

export default SmallIconButton;
