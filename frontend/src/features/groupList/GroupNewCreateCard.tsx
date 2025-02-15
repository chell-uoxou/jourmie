import { CirclePlus } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import CreateGroupDialog from "~/features/groupCreation/CreateGroupDialog";
import useGroupRouter from "~/hooks/useGroupRouter";

const GroupNewCreateCard = () => {
  // 使用しない変数は _ で表記するか、空白で対応する。削除すると呼び出し可能じゃないって怒られる
  const [, setOpenGroupSwitcher] = useState(false);
  const [isCGOpen, setIsCGOpen] = useState(false);
  const { pushToChangeGroup } = useGroupRouter();
  const onChange = (groupId: string) => {
    setOpenGroupSwitcher(false);
    pushToChangeGroup(groupId);
  }
  return (
    <>
      <Button
        variant="ghost"
        className="flex-1 min-w-[250px] min-h-[156px] shadow [&_svg]:w-12 [&_svg]:h-12"
        onClick={() => setIsCGOpen(true)}
        asChild
      >
        <Card className="w-hull h-full p-6 text-xl font-semibold flex flex-col">
          <CirclePlus/>
          <div>
            グループを新規作成
          </div>
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