import { useFirestoreCollection } from "./useFirestoreCollection";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "~/lib/firebase";
import useAuthUser from "./useAuthUser";
import { useCallback, useEffect, useState } from "react";
import useDBGroup, { getGroupDocRef } from "./useDBGroup";
import { DBAccount, DBGroup } from "~/lib/firestore/schemas";
import { defaultConverter } from "~/lib/firestore/firestore";

const undefinedDefaultName = "名無しさん";
const temporaryGroupIdForDemo = "YqPvZW6JKURIcTjCR9FA"; // デモ用に新規登録したアカウントを放り込むグループのID

export default function useCurrentAccount(realTime: boolean = false) {
  const [currentDBAccount, setCurrentDBAccount] = useState<
    DBAccount | null | "loading"
  >("loading");
  const {
    exists: accountExists,
    set: setAccount,
    get: getAccount,
  } = useFirestoreCollection<DBAccount>(collection(db, "accounts"));
  const currentAuthUser = useAuthUser();
  const { existAccount, addMemberToGroup } = useDBGroup(
    getGroupDocRef(temporaryGroupIdForDemo)
  );

  useEffect(() => {
    if (currentAuthUser === "loading") return;
    if (currentAuthUser === null || accountExists === null) {
      setCurrentDBAccount(null);
    } else {
      const fetchAccount = async () => {
        const exists = await accountExists(currentAuthUser.uid);
        if (!exists) {
          await setAccount(currentAuthUser.uid, {
            email: currentAuthUser.email ?? "",
            default_display_name:
              currentAuthUser.displayName ?? undefinedDefaultName,
            avatar_url: currentAuthUser.photoURL ?? "",
            password_hash: "",
            last_name: "",
            first_name: "",
            phone_number: "",
            address: "",
            groups: [],
          });
        }

        const account = await getAccount(currentAuthUser.uid);
        if (account === undefined) {
          throw new Error("Account not found （なんで？）");
        }

        setCurrentDBAccount(account);

        // ついでに初回登録時、一旦勝手にDEMO用グループに放り込む
        if (!exists) {
          const accountRef = doc(
            db,
            "accounts",
            currentAuthUser.uid
          ).withConverter(defaultConverter<DBAccount>());
          const accountExistsInGroup = await existAccount(accountRef);
          if (!accountExistsInGroup) {
            console.log(
              `adding ${currentAuthUser.displayName} to demo group {${temporaryGroupIdForDemo}}`
            );
            await addMemberToGroup(accountRef, {
              display_name: currentAuthUser.displayName ?? "",
              notes: "自動追加されました",
              email: currentAuthUser.email ?? "",
              avatar_url: currentAuthUser.photoURL ?? "",
              editing_permission_scopes: [
                "common_schedules",
                "event_pool",
                "group_settings",
                "open_schedules",
              ],
            });
          } else {
            console.log(
              `already added to demo group {${temporaryGroupIdForDemo}}`
            );
          }
        }
      };

      if (realTime) {
        const unsubscribe = onSnapshot(
          doc(db, "accounts", currentAuthUser.uid).withConverter(
            defaultConverter<DBAccount>()
          ),
          (doc) => {
            if (doc.exists()) {
              setCurrentDBAccount(doc.data());
            } else {
              setCurrentDBAccount(null);
            }
          }
        );
        return () => unsubscribe();
      } else {
        fetchAccount();
      }
    }
  }, [
    currentAuthUser,
    accountExists,
    getAccount,
    setAccount,
    existAccount,
    addMemberToGroup,
    realTime,
  ]);

  const getGroupsByAccount = useCallback(async (account: DBAccount) => {
    return await Promise.all(
      account.groups.map(async (groupRef) => {
        const snapshot = await getDoc(
          doc(db, groupRef.path).withConverter(defaultConverter<DBGroup>())
        );
        return snapshot.data() as DBGroup;
      })
    );
  }, []);

  return { currentDBAccount, getGroupsByAccount };
}