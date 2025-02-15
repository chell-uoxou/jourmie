"use client";
import React, { useEffect, useState } from 'react'
import { LoadingSpinner } from '~/components/ui/spinner';
import useCurrentAccount from '~/hooks/useCurrentAccount';
import { DBGroup } from "~/lib/firestore/schemas";
import { GroupListCard } from "./GroupListCard";
import { GroupNewCreateCard } from './GroupNewCreateCard';

const GroupList = () => {
  const { currentDBAccount, getGroupsByAccount } = useCurrentAccount(true);
  const [groups, setGroups] = useState<DBGroup[] | null | "loading">("loading");

  useEffect(() => {
    if (currentDBAccount === "loading" || currentDBAccount === null) return;

    getGroupsByAccount(currentDBAccount).then((groups) => {
      setGroups(groups);
    });
  }, [currentDBAccount, getGroupsByAccount]);

  return (
    <div className="flex flex-wrap gap-4">
      {groups === "loading" ? (
        <LoadingSpinner />
      ) : groups === null ? (
        <GroupNewCreateCard />
      ) :
        (
          <>
            <GroupNewCreateCard />
            {groups.map((group) => (
              <GroupListCard key={group.uid} {...group} />
            ))
            }
            {/* flexの限界 */}
            <div className='flex-1 min-w-[250px] px-6'>
            </div>
            <div className='flex-1 min-w-[250px] px-6'>
            </div>
            <div className='flex-1 min-w-[250px] px-6'>
            </div>
          </>
        )
      }
    </div >
  )
}

export default GroupList