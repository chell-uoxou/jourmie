import { CirclePlus } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import CreateGroupDialog from "~/features/groupCreation/CreateGroupDialog";
import useGroupRouter from "~/hooks/useGroupRouter";

const GroupNewCreateCard = () => {
  const [openGroupSwitcher, setOpenGroupSwitcher] = useState(false);
  const [isCGOpen, setIsCGOpen] = useState(false);
  const { groupId, pushToChangeGroup } = useGroupRouter();
  const onChange = (groupId: string) => {
    setOpenGroupSwitcher(false);
    pushToChangeGroup(groupId);
  }
  return (
    <>
      <Button
        variant="ghost"
        className="flex-1 min-w-[250px] min-h-[156px] shadow"
        onClick={() => setIsCGOpen(true)}
        asChild
      >
        <Card className="w-hull h-full p-6 ">
          新しいグループを作成
        </Card>
      </Button>
      <CreateGroupDialog
        isDialogOpen={isCGOpen}
        setIsDialogOpen={setIsCGOpen}
        switchGroupHandler={onChange}
      />
    </>
  )
}

export { GroupNewCreateCard };