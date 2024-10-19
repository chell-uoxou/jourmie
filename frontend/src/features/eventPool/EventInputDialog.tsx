import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { DialogHeader } from "~/components/ui/dialog";
import EventForm from "./components/EventFormProt";
import { ScrollArea } from "~/components/ui/scroll-area";

interface EventInputDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const EventInputDialog = (props: EventInputDialogProps) => {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent className="w-[440px]">
        <DialogHeader>
          <DialogTitle>イベント候補 新規作成</DialogTitle>
          <DialogDescription>イベント候補を新規作成します。</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 ">
          <EventForm />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
