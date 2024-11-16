"use client";
import { Login } from "~/features/accountForms/Login";

export default function CardWithForm() {
  return (
    <div className="flex flex-auto justify-center items-center h-screen w-screen">
      <Login />
    </div>
  );
}
