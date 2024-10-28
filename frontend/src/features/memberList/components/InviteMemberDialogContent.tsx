"use client";

import { FormEventHandler, useState } from "react";
import { InputWithLabel } from "~/components/common/InputWithLabel";
import { WithLabel } from "~/components/common/WithLabel";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import useCurrentGroup from "~/hooks/useCurrentGroup";
import {
  getScopesByPreset,
  GroupMemberPermissionPreset,
} from "~/models/types/permission";
import { PermissionDescriptions } from "./PermissionDescriptions";
import PermissionSelector from "./PermissionSelector";
import { DBAccount } from "~/lib/firestore/schemas";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  doc,
} from "firebase/firestore";
import useGroupRouter from "~/hooks/useGroupRouter";
import useDBGroup, { getGroupDocRef } from "~/hooks/useDBGroup";
import { db } from "~/lib/firebase";
import { createConverter, defaultConverter } from "~/lib/firestore/firestore";

interface InviteMemberDialogContentProps {
  group: ReturnType<typeof useCurrentGroup>;
}

export const InviteMemberDialogContent = ({
  group,
}: InviteMemberDialogContentProps) => {
  const { groupId } = useGroupRouter();
  const { addMemberToGroup, existAccount } = useDBGroup(
    getGroupDocRef(groupId!)
  );
  const firestore = getFirestore();
  const AccountsCollectionRef = collection(firestore, "accounts");

  const [permPreset, setPermPreset] = useState<GroupMemberPermissionPreset>(
    "can-edit-all-schedule"
  );
  const [mailaddress, setMailaddress] = useState("");

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    // メールアドレスに基づいてアカウントを取得する
    const q = query(
      AccountsCollectionRef,
      where("email", "==", mailaddress)
    ).withConverter(defaultConverter<DBAccount>());

    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0) {
      alert("そのメールアドレスのユーザは存在しません");
      return;
    }

    querySnapshot.forEach(async (snapshot) => {
      const matchedAccount = snapshot.data();
      const accountRef = doc(db, "accounts", snapshot.id).withConverter(
        createConverter<DBAccount>()
      );

      if (await existAccount(accountRef)) {
        alert("そのユーザはすでにグループに所属しています");
        return;
      }
      if (group != "loading" && group) {
        addMemberToGroup(accountRef, {
          display_name: matchedAccount.default_display_name ?? "",
          notes: "自動追加されました",
          email: matchedAccount.email ?? "",
          avatar_url: matchedAccount.avatar_url ?? "",
          editing_permission_scopes: getScopesByPreset(permPreset) ?? [],
        });
      }
    });

    // 成功メッセージを表示するなどの処理を追加
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>メンバーを招待</DialogTitle>
        <DialogDescription>
          {(group !== "loading" ? group?.name : "グループ") +
            "に招待したいメンバーのメールアドレスを入力してください。"}
        </DialogDescription>
      </DialogHeader>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <InputWithLabel
          label="メールアドレス"
          type="email"
          required
          value={mailaddress}
          onChange={(e) => setMailaddress(e.target.value)}
        />
        <WithLabel label="権限">
          <PermissionSelector
            permissionPreset={permPreset}
            onChange={setPermPreset}
          />
          <PermissionDescriptions presetName={permPreset} />
        </WithLabel>
        <div className="flex justify-end">
          <Button type="submit">招待</Button>
        </div>
      </form>
    </DialogContent>
  );
};
