import React from 'react'
import { Card } from '~/components/ui/card'
import Image from "next/image";
import { DBGroup } from "~/lib/firestore/schemas";

const GroupListCard = (prop: DBGroup) => {
  const DEFAULT_ICON_URL =
    "https://firebasestorage.googleapis.com/v0/b/jourmie-181d8.appspot.com/o/group_icons%2FdefaultIcon.png?alt=media&token=ced5dd5a-f87f-4652-9643-76a8579f1249";

  return (
    <Card key={prop.uid} className="flex-1 min-w-[250px] h-[200px] p-6 shadow">
      <div className='flex mb-2'>
        <Image
          src={prop.icon_url || DEFAULT_ICON_URL}
          alt={prop.name || "prop icon"}
          width={32}
          height={32}
          className="flex mr-2 rounded-full"
        />
        <h1 className='text-xl font-bold'>
          {prop.name}
        </h1>
      </div>
      <div className=' line-clamp-3'>
        {prop.description}
      </div>
    </Card>
  )
}

export { GroupListCard };