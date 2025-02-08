import {
  CollectionReference,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
  WithFieldValue,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { defaultConverter } from "~/lib/firestore/firestore";
import useFirestoreRefMemo from "./useFirestoreRefMemo";

/**
 * FirestoreのCollectionReferenceを受け取り、そのコレクションに対するリアルタイムのデータを配列で返すフックを返す
 * nullが来たら、空の配列を返す
 */
export const useFirestoreRealtimeCollection = <
  T extends WithFieldValue<DocumentData>
>(
  collection: CollectionReference | null
) => {
  const [data, setData] = useState<T[]>([]);
  const memoizedCollection = useFirestoreRefMemo(collection);

  useEffect(() => {
    if (memoizedCollection === null) {
      setData([]);
      return;
    }

    const unsubscribe = onSnapshot(
      memoizedCollection.withConverter(defaultConverter<T>()),
      (snapshot: QuerySnapshot<T>) => {
        const docs = snapshot.docs.map((doc) => doc.data());
        setData(docs);
      },
      (error) => {
        console.error("Error fetching realtime collection data: ", error);
        setData([]);
      }
    );

    return () => unsubscribe();
  }, [memoizedCollection]);

  return data;
};
