import React, { forwardRef } from "react";
import { Input, InputProps } from "../ui/input";
import { WithLabel } from "./WithLabel";

interface InputWithLabelProps extends InputProps {
  label: string;
  errorText?: string;
}

export const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  function InputWithLabel(props, ref) {
    const { label, ...rest } = props;
    const isError = !!props.errorText;

    return (
      <WithLabel label={label} className={(isError && "text-red-500") || ""}>
        <Input
          {...rest}
          ref={ref}
          className={isError ? "border-red-500 border-2" : ""}
        />
        {props.errorText ? (
          <div className="text-red-500 text-sm">{props.errorText}</div>
        ) : null}
      </WithLabel>
    );
  }
);
