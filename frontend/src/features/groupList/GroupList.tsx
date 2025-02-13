"use client";
import React, { useEffect, useState } from 'react'
import { Card } from '~/components/ui/card';
import { LoadingSpinner } from '~/components/ui/spinner';
import useCurrentAccount from '~/hooks/useCurrentAccount';
import { DBGroup } from "~/lib/firestore/schemas";
import Image from "next/image";

const GroupList = () => {
  const { currentDBAccount, getGroupsByAccount } = useCurrentAccount(true);
  const [groups, setGroups] = useState<DBGroup[] | null | "loading">("loading");
  const DEFAULT_ICON_URL =
    "https://firebasestorage.googleapis.com/v0/b/jourmie-181d8.appspot.com/o/group_icons%2FdefaultIcon.png?alt=media&token=ced5dd5a-f87f-4652-9643-76a8579f1249";

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
      ) :
        (
          <>
            {groups.map((group) => (
              <Card key={group.uid} className="flex-1 min-w-[250px] h-[200px] p-6 shadow">
                <div className='flex mb-2'>
                  <Image
                    src={group.icon_url || DEFAULT_ICON_URL}
                    alt={group.name || "group icon"}
                    width={32}
                    height={32}
                    className="flex mr-2 rounded-full"
                  />
                  <h1 className='text-xl font-bold'>
                    {group.name}
                  </h1>
                </div>
                <div className=' line-clamp-3'>
                  {group.description}
                </div>
              </Card>
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