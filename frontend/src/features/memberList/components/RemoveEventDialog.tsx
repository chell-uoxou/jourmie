import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import { DBEventPoolItem } from "~/lib/firestore/utils";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";

interface RemoveEventDialogProps {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  event: DBEventPoolItem | null;
  onDelete: () => void;
}

const RemoveEventDialog = (props: RemoveEventDialogProps) => {
  const { event, onDelete, ...dialogProps } = props;

  const [leavePreparation, setLeavePreparation] = useState<boolean>(
    event?.needs_preparation ?? false
  );

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            あなたのカレンダーから {event?.title} を削除しますか?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex items-center gap-2 mt-4">
              <Checkbox
                id="leave_preparation"
                checked={leavePreparation}
                onCheckedChange={(value) =>
                  setLeavePreparation(value as boolean)
                }
              />
              <label
                htmlFor="leave_preparation"
                className="text-sm font-bold leading-none"
              >
                この候補から作った予定も削除する
              </label>
            </div>
            <div className="mt-2 text-sm">
              {leavePreparation
                ? "この候補からタイムラインにドラッグして作成した予定が全て削除されます。この操作は取り消しできません。"
                : "この候補からタイムラインにドラッグして作成した予定は全て予定メモに変換されます。この操作は取り消しできません。"}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={onDelete}
              className={buttonVariants({ variant: "destructive" })}
            >
              イベント候補を削除
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveEventDialog;
