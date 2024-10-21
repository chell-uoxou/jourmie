import { PropsWithChildren } from "react";
import SideMenu from "~/features/SideMenu/SideMenu";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex p-6">
      <SideMenu />
      <div className="flex-1">{children}</div>
    </div>
  );
}
