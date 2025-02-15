import React from 'react'
import { Card } from '~/components/ui/card'
import Image from "next/image";
import { Button } from '~/components/ui/button';
import { DBGroup } from "~/lib/firestore/schemas";
import { useRouter } from 'next/navigation';

const GroupListCard = (prop: DBGroup) => {
  const router = useRouter();
  const DEFAULT_ICON_URL =
    "https://firebasestorage.googleapis.com/v0/b/jourmie-181d8.appspot.com/o/group_icons%2FdefaultIcon.png?alt=media&token=ced5dd5a-f87f-4652-9643-76a8579f1249";

  return (
    <Button
      variant='ghost'
      className="flex-1 min-w-[250px] min-h-[156px] shadow whitespace-normal break-words"
      onClick={() => {
        router.push(`/g/${prop.uid}`);
      }}
      asChild
    >
      <Card key={prop.uid} className="w-hull h-full p-6 flex flex-wrap content-around">
        <div className='flex mb-2 w-full'>
          <Image
            src={prop.icon_url || DEFAULT_ICON_URL}
            alt={prop.name || "prop icon"}
            width={32}
            height={32}
            className="mr-2 rounded-full w-8 h-8 object-cover"
          />
          <h1 className='text-xl font-semibold'>
            {prop.name}
          </h1>
        </div>
        <div className="text-xs w-full line-clamp-3 overflow-hidden min-h-[3.4rem] leading-normal">
          {prop.description}
        </div>
      </Card>
    </Button>
  )
}

export { GroupListCard };