import { ReactNode } from "react";

interface PropsWithIconProps {
  icon: ReactNode;
  value: number | string;
}

export const PropsWithIcon = ({ icon, value }: PropsWithIconProps) => {
  return (
    <div className="flex gap-1 h-3.5 items-center">
      <div>{icon}</div>
      <div className="text-xs">{value}</div>
    </div>
  );
};
