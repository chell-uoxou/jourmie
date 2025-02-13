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
      <Card className="flex-1 min-w-[250px] h-[200px] p-6 shadow">
        <Button 
          onClick={() => setIsCGOpen(true)}>
          <CirclePlus size={20} />
          <span>新しいグループを作成</span>
        </Button>
      </Card>
      <CreateGroupDialog
        isDialogOpen={isCGOpen}
        setIsDialogOpen={setIsCGOpen}
        switchGroupHandler={onChange}
      />
    </>
  )
}

export { GroupNewCreateCard };