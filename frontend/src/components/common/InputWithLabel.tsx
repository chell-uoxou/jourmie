import React, { forwardRef } from "react";
import { Input, InputProps } from "../ui/input";
import { WithLabel } from "./WithLabel";
import clsx from "clsx";

interface InputWithLabelProps extends InputProps {
  label: string;
  errorText?: string;
  rightElement?: React.ReactNode;
}

export const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  function InputWithLabel(props, ref) {
    const { label, ...rest } = props;
    const isError = !!props.errorText;

    return (
      <WithLabel label={label} className={(isError && "text-red-500") || ""}>
        <div className="flex gap-2">
          <Input
            {...rest}
            ref={ref}
            className={clsx("flex-1", isError ? "border-red-500 border-2" : "")}
          />
          {props.rightElement}
        </div>
        {props.errorText ? (
          <div className="text-red-500 text-sm">{props.errorText}</div>
        ) : null}
      </WithLabel>
    );
  }
);
