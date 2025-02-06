import { Button } from "~/components/ui/button";
import EventForm from "./components/EventForm";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

interface EventInputDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const EventInputDialog = (props: EventInputDialogProps) => {
  return (
    <Sheet open={props.isOpen} onOpenChange={props.onOpenChange} modal={false}>
      <SheetContent
        side={"left"}
        className="flex flex-col mt-14 h-auto min-w-[400px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()} // TODO: 編集中なら確認ダイアログを出す
      >
        <SheetHeader>
          <SheetTitle>イベント候補 新規作成</SheetTitle>
          <SheetDescription>
            行ってみたいイベントを追加してみましょう‼︎
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 -mx-4">
          <EventForm />
        </ScrollArea>
        <SheetFooter>
          <Button>Submit</Button>
          <SheetClose>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
