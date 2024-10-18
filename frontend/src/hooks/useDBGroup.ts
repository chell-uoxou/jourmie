import {
  arrayUnion,
  collection,
  doc,
  DocumentReference,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import useFirestoreRefMemo from "./useFirestoreRefMemo";
import { useCallback } from "react";
import { db } from "~/lib/firebase";
import { DBAccount, DBGroupMember } from "~/lib/firestore/schemas";
import { createConverter } from "~/lib/firestore/firestore";

export const getGroupDocRef = (groupId: string) => {
  return doc(db, "groups", groupId);
};

export default function useDBGroup(groupRef: DocumentReference) {
  const memoizedGroup = useFirestoreRefMemo(groupRef);

  const existAccount = useCallback(
    async (accountRef: DocumentReference<DBAccount>) => {
      if (!memoizedGroup) return false;
      const snapshot = await getDocs(
        query(
          collection(memoizedGroup, "members"),
          where("account_reference", "==", accountRef)
        )
      );
      console.log(snapshot);
      return snapshot.size > 0;
    },
    [memoizedGroup]
  );

  const addMemberToGroup = useCallback(
    async (
      accountRef: DocumentReference<DBAccount>,
      memberInfo: Omit<
        DBGroupMember,
        "account_reference" | "editing_permission_scopes" | "uid"
      >
    ) => {
      try {
        await runTransaction(db, async (transaction) => {
          console.log("transaction start: addMemberToGroup");
          const newMemberRef = doc(
            collection(groupRef, "members")
          ).withConverter(createConverter<DBGroupMember>());
          const newMemberData = {
            account_reference: accountRef,
            editing_permission_scopes: [
              "common_schedules",
              "event_pool",
              "group_settings",
              "open_schedules",
            ], // TODO: 権限設定を追加する時にちゃんとする
            ...memberInfo,
          };
          transaction.set(newMemberRef, newMemberData);
          transaction.update(accountRef, { groups: arrayUnion(memoizedGroup) });
          console.log("transaction end: addMemberToGroup");
        });
      } catch (e) {
        console.error(e);
      }
    },
    [groupRef, memoizedGroup]
  );

  return { existAccount, addMemberToGroup };
}
