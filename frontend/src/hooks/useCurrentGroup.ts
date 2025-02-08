"use client";

import { collection, doc, onSnapshot } from "firebase/firestore";
import { useFirestoreCollection } from "./useFirestoreCollection";
import useGroupRouter from "./useGroupRouter";
import { useEffect, useState } from "react";
import { db } from "~/lib/firebase";
import { DBGroup } from "~/lib/firestore/schemas";
import { defaultConverter } from "~/lib/firestore/firestore";

export default function useCurrentGroup(realTime: boolean = false) {
  const { groupId } = useGroupRouter();
  const { get } = useFirestoreCollection<DBGroup>(collection(db, "groups"));
  const [group, setGroup] = useState<DBGroup | null | "loading">("loading");

  useEffect(() => {
    if (realTime) {
      const unsubscribe = onSnapshot(
        doc(db, "groups", groupId!).withConverter(defaultConverter<DBGroup>()),
        (doc) => {
          if (doc.exists()) {
            setGroup(doc.data());
          } else {
            console.error(`Group (id: ${groupId}) not found`);
            setGroup(null);
          }
        }
      );
      return () => unsubscribe();
    } else {
      get(groupId!).then((group) => {
        if (!group) {
          console.error(`Group (id: ${groupId}) not found`);
          setGroup(null);
        } else {
          console.log("Group found", group);
          setGroup(group);
        }
      });
    }
  }, [get, groupId, realTime]);

  return group;
}
