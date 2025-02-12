import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { useState, useEffect } from "react";
import { DBEventPoolItem, isReady } from "~/lib/firestore/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import EventFormComponents from "./components/EventFormComponents";
import EventFormComponentsConfirmation from "./components/EventFormComponentsConfirmation";
import { collection, GeoPoint, Timestamp } from "firebase/firestore";
import { BudgetMode } from "~/models/types/common";
import useCurrentAccount from "~/hooks/useCurrentAccount";
import { db } from "~/lib/firebase";
import { useFirestoreCollection } from "~/hooks/useFirestoreCollection";
import { AccountEventPoolItem } from "~/models/types/account_event_pool_item";
import { set } from "date-fns";
import CloseConfirmationDialog from "./components/CloseConfirmationDialog";
import { toast } from "sonner";
import { useEventPoolFormSheet } from "~/hooks/useEventPoolFormSheet";

// EventPoolItemForm は EventForm からコピーし、全部をInput用にStringに変換
export type EventPoolItemForm = Omit<
  DBEventPoolItem,
  | "location_coordinates"
  | "available_times"
  | "default_duration"
  | "default_budget"
  | "uid"
  | "location_coordinates"
> & {
  available_start_time: Date;
  available_end_time: Date;
  default_duration: number;
  default_budget_type: BudgetMode;
  default_budget: number;
  location_coordinate_lon: number | null;
  location_coordinate_lat: number | null;
};

export const EventInputDialog = () => {
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const { currentDBAccount } = useCurrentAccount();
  const {
    setCurrentEventPoolItem,
    currentEventPoolItem,
    isOpenEventPoolFormSheet: isOpen,
    setOpenEventPoolFormSheet: setIsOpen,
  } = useEventPoolFormSheet();
  const eventsCollection = isReady(currentDBAccount)
    ? collection(db, "accounts", currentDBAccount.uid, "event_pool")
    : null;
  const { add, update } =
    useFirestoreCollection<DBEventPoolItem>(eventsCollection);

  const defaultValues: EventPoolItemForm = {
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
    attached_image: "",
    scheduled_event_instances: [],
    location_coordinate_lon: null,
    location_coordinate_lat: null,
  };

  const eventForm = useForm<EventPoolItemForm>({
    defaultValues,
  });

  useEffect(() => {
    if (currentEventPoolItem) {
      eventForm.reset({
        ...currentEventPoolItem,
        available_start_time:
          currentEventPoolItem.available_times[0].start_time.toDate(),
        available_end_time:
          currentEventPoolItem.available_times[0].end_time.toDate(),
        default_budget_type: currentEventPoolItem.default_budget.mode,
        default_budget: currentEventPoolItem.default_budget.value,
        location_coordinate_lat:
          currentEventPoolItem.location_coordinates?.latitude ?? null,
        location_coordinate_lon:
          currentEventPoolItem.location_coordinates?.longitude ?? null,
      });
    } else {
      eventForm.reset({});
    }
  }, [eventForm, currentEventPoolItem]);

  const handleFinalSubmit: SubmitHandler<EventPoolItemForm> = async (data) => {
    if (!isReady(currentDBAccount)) {
      console.error("currentDBAccount is null");
      return;
    }

    const sendData: AccountEventPoolItem = {
      title: data.title,
      description: data.description,
      location_text: data.location_text,
      location_coordinates:
        data.location_coordinate_lat && data.location_coordinate_lon
          ? new GeoPoint(
              data.location_coordinate_lat,
              data.location_coordinate_lon
            )
          : null,
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
      scheduled_event_instances: [],
    };

    try {
      if (currentEventPoolItem) {
        await update(currentEventPoolItem.uid, sendData);
        toast.success("イベントが正常に更新されました！");
        setIsOpen(false);
        setCurrentEventPoolItem(null);
        eventForm.reset(defaultValues);
      } else {
        await add(sendData);
        toast("イベントが正常に追加されました！", {
          description: "",
          action: {
            label: "戻る",
            onClick: () => console.log("Undo"),
          },
        });
      }
      eventForm.reset(defaultValues);
      setIsConfirmation(false);
    } catch (error) {
      console.error("Error adding/updating event: ", error);
    }
  };

  const handleCloseDialog = () => {
    if (Object.keys(eventForm.formState.dirtyFields).length > 0) {
      setIsCloseDialogOpen(true);
    } else {
      setIsCloseDialogOpen(false);
      setIsConfirmation(false);
      setIsOpen(false);
      setCurrentEventPoolItem(null);
      eventForm.reset(defaultValues);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <SheetContent
        side={"left"}
        className="flex flex-col mt-14 h-[calc(100svh-56px)] min-w-[400px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          handleCloseDialog();
        }}
        showCloseButton={false}
        onClickCustomClose={handleCloseDialog}
      >
        <SheetHeader>
          <SheetTitle>
            イベント候補 {currentEventPoolItem ? "編集" : "新規作成"}
          </SheetTitle>
          <SheetDescription>
            気になるイベントをイベント候補として登録
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
            {currentEventPoolItem ? (
              <Button
                variant="default"
                type="submit"
                onClick={eventForm.handleSubmit(handleFinalSubmit)}
              >
                更新
              </Button>
            ) : !isConfirmation ? (
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
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={handleCloseDialog}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </SheetContent>
      <CloseConfirmationDialog
        isOpen={isCloseDialogOpen}
        onOpenChange={setIsCloseDialogOpen}
        onConfirm={() => {
          setIsCloseDialogOpen(false);
          setIsConfirmation(false);
          setIsOpen(false);
          setCurrentEventPoolItem(null);
          eventForm.reset();
        }}
        onCancel={() => setIsCloseDialogOpen(false)}
      />
    </Sheet>
  );
};
