"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
// import useSignInWithGoogle from "../hooks/useSignInWithGoogle";
import { signInWithPopup } from "firebase/auth";
import { provider } from "./utils/googleSignInProvider";
import { auth } from "~/lib/firebase";

export const Register = () => {
  const navigate = useRouter();
  // const signInWithGoogle = useSignInWithGoogle();

  const handleLoginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        navigate.push("/calendar");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <Card className="w-[350px]">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>アカウント登録</CardTitle>
        <CardDescription>
          すでにアカウントをお持ちの場合は
          <Link href="/account/login" className="underline">
            ログイン
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="displayName">ニックネーム</Label>
              <Input id="displayName" />
            </div>
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="mailAddress">メールアドレス</Label>
              <Input id="mailAddress" type="email" />
            </div>
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="password">パスワード</Label>
              <Input id="password" type="password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          onClick={handleLoginWithGoogle}
          className="w-full"
          variant={"secondary"}
        >
          Googleで登録
        </Button>
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            onClick={() => navigate.push("/account/register")}
          >
            Cancel
          </Button>
          <Button>
            <Link href="/">登録</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
