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

interface RemoveEventDialogProps {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  event: DBEventPoolItem | null;
}
const RemoveEventDialog = (props: RemoveEventDialogProps) => {
  const { event, ...dialogProps } = props;
  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            あなたのカレンダーから {event?.title} を削除しますか?
          </AlertDialogTitle>
          <AlertDialogDescription>
            チェックしたときと、してないときで注意事項を表示する。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button className={buttonVariants({ variant: "destructive" })}>
              イベント候補を削除
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveEventDialog;
