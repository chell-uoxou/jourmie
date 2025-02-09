"use client";

import { collection, doc, onSnapshot } from "firebase/firestore";
import { useFirestoreCollection } from "./useFirestoreCollection";
import useGroupRouter from "./useGroupRouter";
import { useEffect, useState } from "react";
import { db } from "~/lib/firebase";
import { DBGroup } from "~/lib/firestore/schemas";
import { defaultConverter } from "~/lib/firestore/firestore";

/**
 * 現在表示中のグループを取得するカスタムフック。
 *
 * @param realTime リアルタイムでデータを取得するかどうかを指定します。
 * @returns 表示中のグループのDB上のデータ。ロード中は "loading"、グループが存在しない場合または個人の場合はnullを返します。
 */
export default function useCurrentGroup(realTime: boolean = false) {
  const { groupId } = useGroupRouter();
  const { get } = useFirestoreCollection<DBGroup>(collection(db, "groups"));
  const [group, setGroup] = useState<DBGroup | null | "loading">("loading");

  useEffect(() => {
    if (!groupId) {
      setGroup(null);
      return;
    }
    if (realTime) {
      const unsubscribe = onSnapshot(
        doc(db, "groups", groupId).withConverter(defaultConverter<DBGroup>()),
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
      get(groupId).then((group) => {
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
