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
import { useState } from "react";

interface EventInputDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const EventInputDialog = (props: EventInputDialogProps) => {
  const [isConfirmation, setIsConfirmation] = useState(false);

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
          <EventForm
            isConfirmation={isConfirmation}
            setIsConfirmation={setIsConfirmation}
          />
        </ScrollArea>
        <SheetFooter>
          <div className="flex flex-col w-full gap-2">
            {!isConfirmation ? (
              <Button variant="default" onClick={() => setIsConfirmation(true)}>
                確認
              </Button>
            ) : (
              <div className="flex gap-2 w-full">
                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={() => setIsConfirmation(false)}
                >
                  戻る
                </Button>
                <Button
                  className="flex-1"
                  variant="default"
                  onClick={() => setIsConfirmation(true)}
                >
                  作成
                </Button>
              </div>
            )}
            <SheetClose className="w-full">
              <Button variant="outline" className="w-full">
                キャンセル
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
