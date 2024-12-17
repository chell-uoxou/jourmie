import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";

interface EventInputDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const EventInputDialog = (props: EventInputDialogProps) => {
  return (
    // <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
    //   <DialogContent className="w-[440px]">
    //     <DialogHeader>
    //       <DialogTitle>イベント候補 新規作成</DialogTitle>
    //       <DialogDescription>
    //         行ってみたいイベントを追加してみましょう‼︎
    //       </DialogDescription>
    //     </DialogHeader>
    //     <ScrollArea className="h-96 ">
    //       <EventForm />
    //     </ScrollArea>
    //   </DialogContent>
    // </Dialog>
    <Drawer
      open={props.isOpen}
      onOpenChange={props.onOpenChange}
      modal={false}
      direction="left"
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
