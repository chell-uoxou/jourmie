"use client";
import React, { useEffect, useState } from 'react'
import { Card } from '~/components/ui/card';
import { LoadingSpinner } from '~/components/ui/spinner';
import useCurrentAccount from '~/hooks/useCurrentAccount';
import { DBGroup } from "~/lib/firestore/schemas";

const GroupList = () => {
  const { currentDBAccount, getGroupsByAccount } = useCurrentAccount(true);
  const [groups, setGroups] = useState<DBGroup[] | null | "loading">("loading");

  useEffect(() => {
    if (currentDBAccount === "loading" || currentDBAccount === null) return;

    getGroupsByAccount(currentDBAccount).then((groups) => {
      setGroups(groups);
    });
  }, [currentDBAccount, getGroupsByAccount]);
  console.log(groups)

  return (
    <div className="flex flex-wrap gap-4">
      {groups === "loading" ? (
        <LoadingSpinner />
      ) : groups === null ? (
        <Card>
          グループが見つかりませんでした。
        </Card>
      ) : (
        groups.map((group) => (
          <Card key={group.uid} className="w-[250px] h-[200px]">
            {group.name}
          </Card>
        ))
      )}
    </div>
  )
}

export default GroupList