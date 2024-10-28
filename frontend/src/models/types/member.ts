import { GroupMemberPermissionScope } from "./permission";
import { DocumentReference } from "firebase/firestore";
import { DBAccount } from "~/lib/firestore/schemas";

/**
 * ## Member
 *
 * グループ内でのメンバーの情報を持つ型。
 *
 * #### これを継承するモデル
 *   なし
 *
 * #### これを継承するスキーマ
 * - [DBGroupMember](../../lib/firestore/schemas/group/members.ts)
 *
 */
export interface Member {
  account_reference: DocumentReference<DBAccount>;
  display_name: string;
  editing_permission_scopes: GroupMemberPermissionScope[];
  notes: string;
  email: string;
  avatar_url: string;
}
