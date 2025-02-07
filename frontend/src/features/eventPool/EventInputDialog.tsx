import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { useState } from "react";
import { DBEventPoolItem } from "~/lib/firestore/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import EventFormComponents from "./components/EventFormComponents";
import EventFormComponentsConfirmation from "./components/EventFormComponentsConfirmation";
import { collection, Timestamp } from "firebase/firestore";
import { BudgetMode } from "~/models/types/common";
import useCurrentAccount, { isReady } from "~/hooks/useCurrentAccount";
import { db } from "~/lib/firebase";
import { useFirestoreCollection } from "~/hooks/useFirestoreCollection";
import { AccountEventPoolItem } from "~/models/types/account_event_pool_item";
import { set } from "date-fns";

interface EventInputDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

// EventPoolItemForm は EventForm からコピーし、全部をInput用にStringに変換
export type EventPoolItemForm = Omit<
  DBEventPoolItem,
  | "location_coordinates"
  | "available_times"
  | "default_duration"
  | "default_budget"
  | "max_participants"
> & {
  available_start_time: Date;
  available_end_time: Date;
  default_duration: number;
  default_budget_type: BudgetMode;
  default_budget: number;
  preparation_task: string;
  max_participants: number;
};

export const EventInputDialog = (props: EventInputDialogProps) => {
  const [isConfirmation, setIsConfirmation] = useState(false);

  const { currentDBAccount } = useCurrentAccount();
  const eventsCollection = isReady(currentDBAccount)
    ? collection(db, "accounts", currentDBAccount.uid, "event_pool")
    : null;
  const { add } = useFirestoreCollection<DBEventPoolItem>(eventsCollection);

  const eventForm = useForm<EventPoolItemForm>({
    defaultValues: {
      title: "",
      description: "",
      location_text: "",
      available_start_time: set(new Date(), {
        hours: 9,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }), // 今日の9時
      available_end_time: set(new Date(), {
        hours: 17,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }), // 今日の17時
      default_duration: 0,
      default_budget_type: "per_person",
      default_budget: 0,
      needs_preparation: false,
      preparation_task: "",
      max_participants: NaN, // 未入力
      notes: "",
    },
  });

  const handleFinalSubmit: SubmitHandler<EventPoolItemForm> = async (data) => {
    if (!isReady(currentDBAccount)) {
      console.error("currentDBAccount is null");
      return;
    }

    const sendData: AccountEventPoolItem = {
      title: data.title,
      description: data.description,
      location_text: data.location_text,
      location_coordinates: null, // TODO: ジオコーディング
      attached_image: "", // TODO: 画像アップロード
      available_times: [
        {
          start_time: Timestamp.fromDate(data.available_start_time),
          end_time: Timestamp.fromDate(data.available_end_time),
        },
      ],
      default_duration: Number(data.default_duration),
      default_budget: {
        mode: data.default_budget_type,
        value: data.default_budget,
      },
      needs_preparation: data.needs_preparation,
      preparation_task: data.needs_preparation ? data.preparation_task : "",
      max_participants: data.max_participants,
      notes: data.notes,
      schedule_instances: [],
    };

    try {
      await add(sendData);
      alert("イベントが正常に追加されました！");
      eventForm.reset();
      setIsConfirmation(false);
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  return (
    <Sheet open={props.isOpen} onOpenChange={props.onOpenChange} modal={false}>
      <SheetContent
        side={"left"}
        className="flex flex-col mt-14 h-[calc(100svh-56px)] min-w-[400px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()} // TODO: 編集中なら確認ダイアログを出す
      >
        <SheetHeader>
          <SheetTitle>イベント候補 新規作成</SheetTitle>
          <SheetDescription>
            行ってみたいイベントを追加してみましょう‼︎
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={eventForm.handleSubmit(() => setIsConfirmation(true))}
          className="flex flex-col h-[calc(100%-72px)] gap-4"
        >
          <ScrollArea className="flex-1 -mx-4">
            {!isConfirmation ? (
              <div className="flex flex-col w-full gap-6 px-4">
                <EventFormComponents eventForm={eventForm} />
              </div>
            ) : (
              <div className="flex flex-col gap-4 px-4">
                <EventFormComponentsConfirmation eventForm={eventForm} />
              </div>
            )}
          </ScrollArea>

          <div className="flex flex-col w-full gap-2">
            {!isConfirmation ? (
              <Button variant="default" type="submit">
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
                  onClick={eventForm.handleSubmit(handleFinalSubmit)}
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
        </form>
      </SheetContent>
    </Sheet>
  );
};
