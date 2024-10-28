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
import { DBGroupMember } from "~/lib/firestore/schemas";

interface RemoveMemberDialogProps {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  member: DBGroupMember | null;
}
const RemoveMemberDialog = (props: RemoveMemberDialogProps) => {
  const { member, ...dialogProps } = props;
  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            グループからメンバー {member?.display_name} を削除しますか?
          </AlertDialogTitle>
          <AlertDialogDescription>
            グループ内のメンバーとしての設定は削除されますが、ユーザーが作成したイベント候補や予定は削除されません。
            この操作は取り消しできません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button className={buttonVariants({ variant: "destructive" })}>
              ユーザーを削除
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveMemberDialog;
