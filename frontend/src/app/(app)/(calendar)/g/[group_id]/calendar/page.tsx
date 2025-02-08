"use client";
import useCurrentAccount from "~/hooks/useCurrentAccount";
import useCurrentGroup from "~/hooks/useCurrentGroup";

export default function Page() {
  const dbGroup = useCurrentGroup(true);
  const { currentDBAccount: dbAccount } = useCurrentAccount();
  console.log(dbGroup, dbAccount);

  const message =
    dbGroup === "loading"
      ? "Loading..."
      : dbGroup === null
      ? "Group not found"
      : "Welcome to " + dbGroup.name;

  return <div>{message}</div>;
}
