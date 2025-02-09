import React from "react";
import { Button, ButtonProps } from "../ui/button";

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
