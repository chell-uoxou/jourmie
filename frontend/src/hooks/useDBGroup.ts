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
  const memoizedGroupRef = useFirestoreRefMemo(groupRef);

  const existAccount = useCallback(
    async (accountRef: DocumentReference<DBAccount>) => {
      if (!memoizedGroupRef) return false;
      const snapshot = await getDocs(
        query(
          collection(memoizedGroupRef, "members"),
          where("account_reference", "==", accountRef)
        )
      );
      console.log(snapshot);
      return snapshot.size > 0;
    },
    [memoizedGroupRef]
  );

  const addMemberToGroup = useCallback(
    async (
      accountRef: DocumentReference<DBAccount>,
      memberInfo: Omit<DBGroupMember, "account_reference" | "uid">
    ) => {
      try {
        await runTransaction(db, async (transaction) => {
          console.log("transaction start: addMemberToGroup");
          const newMemberRef = doc(
            collection(memoizedGroupRef!, "members")
          ).withConverter(createConverter<DBGroupMember>());
          const newMemberData = {
            account_reference: accountRef,
            ...memberInfo,
          };
          transaction.set(newMemberRef, newMemberData);
          transaction.update(accountRef, {
            groups: arrayUnion(memoizedGroupRef),
          });
          console.log("transaction end: addMemberToGroup");
        });
      } catch (e) {
        console.error(e);
      }
    },
    [memoizedGroupRef]
  );

  return { existAccount, addMemberToGroup };
}
