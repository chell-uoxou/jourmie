import {
  addDoc,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  setDoc,
  WithFieldValue,
} from "firebase/firestore";
import { useCallback } from "react";
import { createConverter, defaultConverter } from "~/lib/firestore/firestore";
import useFirestoreRefMemo from "./useFirestoreRefMemo";

/**
 * FirestoreのCollectionReferenceを受け取り、そのコレクションに対する操作を行うフックを返す
 * nullが来たら、それぞれの操作関数にnullを代入したものを返す
 * （フックの引数のコレクションが未readyな時にnullを渡せば、返り値に伝播ができる）
 */
export const useFirestoreCollection = <T extends WithFieldValue<DocumentData>>(
  collection: CollectionReference | null
) => {
  const memoizedCollection = useFirestoreRefMemo(collection);

  const add = useCallback(
    async function (data: Omit<T, "uid">) {
      if (memoizedCollection === null) return null;

      console.log("adding document in useFirestoreCollection...");
      return await addDoc(
        memoizedCollection.withConverter(createConverter<Omit<T, "uid">>()),
        data
      );
    },
    [memoizedCollection]
  );

  const set = useCallback(
    async function (docId: string, data: Omit<T, "uid">) {
      if (memoizedCollection === null) return null;

      const newDoc = doc(memoizedCollection, docId).withConverter(
        defaultConverter<Omit<T, "uid">>()
      );
      console.log("setting document in useFirestoreCollection...", docId);
      return await setDoc(newDoc, data);
    },
    [memoizedCollection]
  );

  const update = useCallback(
    async function (docId: string, data: Partial<T>) {
      if (memoizedCollection === null) return null;

      const newDoc = doc(memoizedCollection, docId).withConverter(
        defaultConverter<T>()
      );
      console.log("updating document in useFirestoreCollection...", docId);
      return await setDoc(newDoc, data, { merge: true });
    },
    [memoizedCollection]
  );

  const get = useCallback(
    async function (docId: string) {
      if (memoizedCollection === null) return null;

      const docRef = doc(
        memoizedCollection.withConverter(defaultConverter<T>()),
        docId
      );
      console.log("getting document in useFirestoreCollection...");
      const snapshot = await getDoc(docRef);
      return snapshot.data();
    },
    [memoizedCollection]
  );

  const list = useCallback(
    async function () {
      if (memoizedCollection === null) return null;
      console.log("getting document in useFirestoreCollection...");
      const snapshot = await getDocs(
        memoizedCollection.withConverter(defaultConverter<T>())
      );
      return snapshot.docs.map((doc) => doc.data());
    },
    [memoizedCollection]
  );

  const del = useCallback(
    async function (docId: string) {
      if (memoizedCollection === null) return null;

      const docRef = doc(memoizedCollection, docId);
      console.log("deleting document in useFirestoreCollection...", docId);
      return await deleteDoc(docRef);
    },
    [memoizedCollection]
  );

  const exists = useCallback(
    async function (docId: string) {
      if (memoizedCollection === null) return null;

      const docRef = doc(memoizedCollection, docId);
      console.log(
        "checking if document exists in useFirestoreCollection...",
        docId
      );
      const snapshot = await getDoc(docRef);
      return snapshot.exists();
    },
    [memoizedCollection]
  );

  return { add, set, update, get, list, del, exists };
};
