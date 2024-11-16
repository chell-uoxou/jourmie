import Link from "next/link";
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

export const Login = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>ログインしてください</CardTitle>
        <CardDescription>
          <Link href="/account/register">
            アカウントをお持ちでない場合はこちら
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="mailAddress">メールアドレス</Label>
              <Input id="mailAddress" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">パスワード</Label>
              <Input id="password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          <Link href="/account/register">Cancel</Link>
        </Button>
        <Button>Log In</Button>
      </CardFooter>
    </Card>
  );
};
