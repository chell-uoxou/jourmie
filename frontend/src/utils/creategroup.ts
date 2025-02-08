// creategroup.ts
import {
  doc,
  setDoc,
  collection,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "~/lib/firebase"; // Firebase 初期化ファイル
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function CreateGroup(
  groupId: string,
  groupData: { name: string; description?: string; icon_url?: string },
  groupIcon?: File
) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("ユーザーがログインしていません");
  }

  // アイコンが添付されていなければデフォルトのURLを設定
  let iconUrl = "/images/defaulticon.png";

  // 添付ファイルが存在し、かつファイルサイズがある場合のみ Storage アップロード
  if (groupIcon && groupIcon.size > 0) {
    const storage = getStorage();
    const storageRef = ref(storage, `group_icons/${groupId}`);
    await uploadBytes(storageRef, groupIcon);
    iconUrl = await getDownloadURL(storageRef);
  }

  try {
    const groupRef = doc(db, "groups", groupId);
    // groups コレクションにグループ情報を登録（ここで icon_url を必ずセットする）
    await setDoc(groupRef, {
      ...groupData,
      icon_url: iconUrl,
      createdAt: new Date(),
    });

    // メンバーサブコレクションに作成者を追加
    const membersRef = collection(groupRef, "members");
    const accountRef = doc(db, "accounts", currentUser.uid);
    await setDoc(doc(membersRef, currentUser.uid), {
      account_reference: accountRef,
      display_name: currentUser.displayName || currentUser.email || "No Name",
      email: currentUser.email || "",
      editing_permission_scopes: [
        "common_schedules",
        "open_schedules",
        "event_pool",
        "group_settings",
      ],
      notes: "グループ作成者",
    });

    // ユーザーアカウントの groups 配列にグループへの参照を追加
    await updateDoc(accountRef, {
      groups: arrayUnion(groupRef),
    });

    console.log(
      "グループとメンバーが作成され、ユーザーアカウントにグループ参照が追加されました"
    );
  } catch (error) {
    console.error("グループ作成中にエラーが発生しました: ", error);
    alert("グループ作成に失敗しました。もう一度試してください。");
  }
}
