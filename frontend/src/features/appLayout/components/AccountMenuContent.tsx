"use client";

import MyAvatar from "./MyAvatar";
import { LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "~/components/ui/button";

export const AccountMenuContent = () => {

  const router = useRouter();
  const auth = getAuth();
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        router.push("/account/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MyAvatar />
          </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Settings />
              設定
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogOut}>
              <LogOut />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  );
};
