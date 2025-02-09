"use client";
import { collection } from "firebase/firestore";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { EventInputDialog } from "~/features/eventPool/EventInputDialog";
import { EventPoolList } from "~/features/eventPool/EventPoolList";
import useCurrentAccount from "~/hooks/useCurrentAccount";
import { db } from "~/lib/firebase";
import { ViewTitle } from "~/components/common/ViewTitle";
import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import { Blocks } from "lucide-react";
import BackButton from "~/components/common/BackButton";
import { ScrollArea } from "~/components/ui/scroll-area";
import EventPoolListSkeleton from "../eventPool/EventPoolListSkeleton";
import { DBEventPoolItem, isReady } from "~/lib/firestore/utils";
import useGroupRouter from "~/hooks/useGroupRouter";
import { useEventPoolFormSheet } from "~/hooks/useEventPoolFormSheet";
import { useFirestoreRealtimeCollection } from "~/hooks/useFirestoreRealtimeCollection";

export default function CalendarEditSidebar() {
  const { currentDBAccount } = useCurrentAccount();

  const eventPoolItems = useFirestoreRealtimeCollection<DBEventPoolItem>(
    isReady(currentDBAccount)
      ? collection(db, "accounts", currentDBAccount.uid, "event_pool")
      : null
  );

  const { setOpenEventPoolFormSheet, setCurrentEventPoolItem } =
    useEventPoolFormSheet();
  const router = useGroupRouter();

  return (
    <div className="p-6 flex flex-col gap-4 h-full border-r border-brand-border-color w-[400px]">
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
          onClick={() => {
            setCurrentEventPoolItem(null);
            setOpenEventPoolFormSheet(true);
          }}
          className="flex items-center gap-1 pr-4 h-8"
          size={"sm"}
        >
          <Plus strokeWidth={"1.5px"} size={20} />
          作成
        </Button>
      </div>

      {currentDBAccount !== "loading" && eventPoolItems !== null ? (
        <ScrollArea className="flex-1">
          <EventPoolList events={eventPoolItems} />
        </ScrollArea>
      ) : (
        <EventPoolListSkeleton />
      )}

      <EventInputDialog />
    </div>
  );
}
