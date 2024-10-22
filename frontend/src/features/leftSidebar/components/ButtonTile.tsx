"use client";

import { Button, ButtonProps } from "~/components/ui/button";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

type ButtonTileProps = Omit<ButtonProps, "className"> & {
  icon: ReactNode;
  href: string;
};

export function ButtonTile(props: ButtonTileProps) {
  const router = useRouter();
  const { children, ...rest } = props;
  return (
    <Button
      {...rest}
      className="flex flex-row w-full h-10 gap-1 text-sm items-center justify-center"
      onClick={() => router.push(props.href)}
    >
      {props.icon}
      {children}
    </Button>
  );
}
