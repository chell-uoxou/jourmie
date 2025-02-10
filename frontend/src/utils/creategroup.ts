// creategroup.ts
import {
  doc,
  setDoc,
  collection,
  updateDoc,
  arrayUnion,
  addDoc,
} from "firebase/firestore";
import { db } from "~/lib/firebase"; // Firebase 初期化ファイル
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { DBAccount, DBGroup, DBGroupMember } from "~/lib/firestore/schemas";
import { createConverter } from "~/lib/firestore/firestore";
import { toast } from "sonner";

const uploadGroupIcon = async (groupId: string, groupIcon?: File) => {
  // アイコンが添付されていなければデフォルトのURLを設定
  let iconUrl =
    "https://firebasestorage.googleapis.com/v0/b/jourmie-181d8.appspot.com/o/group_icons%2FdefaultIcon.png?alt=media&token=ced5dd5a-f87f-4652-9643-76a8579f1249";

  // 添付ファイルが存在し、かつファイルサイズがある場合のみ Storage アップロード
  if (groupIcon && groupIcon.size > 0) {
    const storage = getStorage();
    const storageRef = ref(storage, `group_icons/${groupId}`);
    await uploadBytes(storageRef, groupIcon);
    iconUrl = await getDownloadURL(storageRef);
  }

  return iconUrl;
};

export async function CreateGroup(
  groupData: Omit<
    DBGroup,
    "created_by_account" | "created_by_member" | "icon_url" | "uid"
  >,
  authorAccount: DBAccount,
  groupIcon?: File
) {
  try {
    const groupRef = (await addDoc(collection(db, "groups"), {})).withConverter(
      createConverter<DBGroup>()
    );

    // アイコンアップロード
    const iconUrl = await uploadGroupIcon(groupRef.id, groupIcon);

    // メンバーサブコレクションに作成者を追加
    const membersRef = collection(groupRef, "members").withConverter(
      createConverter<DBGroupMember>()
    );
    const accountRef = doc(db, "accounts", authorAccount.uid);
    const authorMemberRef = await addDoc(membersRef, {
      account_reference: accountRef,
      display_name: authorAccount.default_display_name,
      editing_permission_scopes: [
        "common_schedules",
        "open_schedules",
        "event_pool",
        "group_settings",
      ],
      notes: "グループ作成者",
      email: authorAccount.email,
      avatar_url: authorAccount.avatar_url,
      uid: "", // 無視される 変な設計...
    });

    // groups コレクションにグループ情報を登録（ここで icon_url を必ずセットする）
    await setDoc(groupRef, {
      ...groupData,
      icon_url: iconUrl,
      created_by_account: doc(db, "accounts", authorAccount.uid),
      created_by_member: authorMemberRef,
      uid: "", // 無視される 変な設計...
    });

    // ユーザーアカウントの groups 配列にグループへの参照を追加
    await updateDoc(accountRef, {
      groups: arrayUnion(groupRef),
    });

    console.log(
      "グループとメンバーが作成され、ユーザーアカウントにグループ参照が追加されました"
    );

    return groupRef;
  } catch (error) {
    console.error("グループ作成中にエラーが発生しました: ", error);
    toast("グループ作成に失敗しました。", {
      description: "もう一度入力してください",
      action: {
        label: "戻る",
        onClick: () => console.log("Undo"),
      },
    });
  }
}
