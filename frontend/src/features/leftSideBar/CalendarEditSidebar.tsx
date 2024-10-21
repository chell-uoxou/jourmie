"use client";
import { useEffect, useState } from "react";
import { collection, doc } from "firebase/firestore";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { EventInputDialog } from "~/features/eventPool/EventInputDialog";
import { EventPoolList } from "~/features/eventPool/EventPoolList";
import useCurrentAccount from "~/hooks/useCurrentAccount";
import { useFirestoreCollection } from "~/hooks/useFirestoreCollection";
import { db } from "~/lib/firebase";
import { ViewTitle } from "~/components/common/ViewTitle";
import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import { Blocks } from "lucide-react";
import BackButton from "~/components/common/BackButton";
import { ScrollArea } from "~/components/ui/scroll-area";
import EventPoolListSkeleton from "../eventPool/EventPoolListSkeleton";
import { DBEventPoolItem } from "~/lib/firestore/utils";
import useGroupRouter from "~/hooks/useGroupRouter";

export default function CalendarEditSidebar({
  events,
  setEvents,
}: {
  events: DBEventPoolItem[];
  setEvents: React.Dispatch<React.SetStateAction<DBEventPoolItem[]>>;
}) {
  const { currentDBAccount } = useCurrentAccount();
  const { list: listEventPool } = useFirestoreCollection<DBEventPoolItem>(
    currentDBAccount !== "loading" && currentDBAccount?.uid
      ? collection(doc(db, "accounts", currentDBAccount.uid), "event_pool")
      : null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const router = useGroupRouter();

  useEffect(() => {
    if (listEventPool) {
      listEventPool().then((events) => {
        if (events) {
          console.log(events);
          setEvents(events);
        } else {
          console.log("No events found");
        }
      });
    }
  }, [listEventPool, setEvents]);

  return (
    <div className="p-6 flex flex-col gap-4 h-full border-r border-brand-border-color w-[402px]">
      <div className="flex flex-col gap-1">
        <BackButton onClick={() => router.pushInGroup("/calendar")} />
        <ViewTitle title="予定を編集" subTitle="あなたのカレンダー"></ViewTitle>
      </div>
      <div className="flex justify-between items-center">
        <SmallTitleWithIcon
          icon={<Blocks />}
          title="イベント候補"
          isLoading={currentDBAccount === "loading"}
        ></SmallTitleWithIcon>
        <Button
          onClick={() => setOpenDialog(true)}
          className="flex items-center gap-1 pr-4 h-8"
          size={"sm"}
        >
          <Plus strokeWidth={"1.5px"} size={20} />
          作成
        </Button>
      </div>

      {currentDBAccount !== "loading" && events !== null ? (
        <ScrollArea className="flex-1">
          <EventPoolList events={events} />
        </ScrollArea>
      ) : (
        <EventPoolListSkeleton />
      )}

      <EventInputDialog isOpen={openDialog} onOpenChange={setOpenDialog} />
    </div>
  );
}
