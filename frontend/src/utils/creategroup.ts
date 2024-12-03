import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "~/lib/firebase"; // Firebase 初期化ファイル

// グループ作成関数
export async function CreateGroup(
  groupId: string,
  groupData: { name: string; description?: string; icon_url?: string }
) {
  try {
    // groups/{groupId} にドキュメントを作成
    const groupRef = doc(db, "groups", groupId);
    await setDoc(groupRef, {
      ...groupData,
      createdAt: new Date(), // 作成日時を追加
    });

    // サブコレクションの初期化
    const commonSchedulesRef = doc(collection(groupRef, "common_schedules"));
    const eventPoolRef = doc(collection(groupRef, "event_pool"));
    const membersRef = doc(collection(groupRef, "members"));
    const openSchedulesRef = doc(collection(groupRef, "open_schedules"));
    const scheduleMemosRef = doc(collection(groupRef, "schedule_memos"));

    // 初期データをセット (空データでも可)
    await Promise.all([
      setDoc(commonSchedulesRef, { initialized: true }),
      setDoc(eventPoolRef, { initialized: true }),
      setDoc(membersRef, { initialized: true }),
      setDoc(openSchedulesRef, { initialized: true }),
      setDoc(scheduleMemosRef, { initialized: true }),
    ]);

    console.log("グループとサブコレクションが作成されました");
  } catch (error) {
    console.error("グループ作成中にエラーが発生しました: ", error);
    alert("グループ作成に失敗しました。もう一度試してください。");
  }
}
