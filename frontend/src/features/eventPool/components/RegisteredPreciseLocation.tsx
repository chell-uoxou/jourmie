import { MapPinCheckInside, X } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";

interface RegisteredPreciseLocationProps {
  label: string;
  onClickDelete?: () => void;
}

const RegisteredPreciseLocation = (props: RegisteredPreciseLocationProps) => {
  return (
    <div className="text-slate-600 flex gap-1.5 text-sm items-center rounded-md bg-muted py-1.5 px-2 w-fit">
      <MapPinCheckInside size={18} />
      <span className="flex-1">{props.label}</span>
      <Button
        onClick={props.onClickDelete}
        type="button"
        variant={"ghost"}
        className="text-muted-foreground p-0 size-4"
      >
        <X size={18} />
      </Button>
    </div>
  );
};

export default RegisteredPreciseLocation;
