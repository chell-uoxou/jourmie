"use client";

import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

// TODO: ログイン中のユーザーがメンバーとして所属しているのか確認してから取得する
// なんならFirestoreのセキュリティルールでチェックする
export default function useGroupRouter() {
  const nextRouter = useRouter();
  const pathname = usePathname();
  const groupRegex = useMemo(() => /^\/g\/([^/]+)(\/|$)/, []);
  const pathInGroupRegex = useMemo(() => /^\/g\/[^/]+(\/.*)/, []);

  /**
   * 現在グループ内にいるかどうか
   * @type {boolean}
   *
   * @example
   * `/g/xxxxx` => true
   * `/g/xxxxx/` => true
   * `/g/xxxxx/abc` => true
   * `/calendar` => false
   */
  const isInGroup: boolean = groupRegex.test(pathname);

  const extractId = useCallback(
    (path: string) => {
      const match = path.match(groupRegex);
      return match ? match[1] : null;
    },
    [groupRegex]
  );

  const extractPathInGroup = useCallback(
    (pathname: string) => {
      const match = pathname.match(pathInGroupRegex);
      return match ? match[1] : pathname;
    },
    [pathInGroupRegex]
  );

  /**
   * 現在アクセス中のグループID
   * @type {string | null}
   */
  const groupId: string | null = extractId(pathname);

  /**
   * グループ内のパスを取得する
   * @param {string} href /から始まるパス
   * @param {string} [groupIdOverride] グループIDをオーバーライドする
   * @returns {string} グループ内のパス
   *
   * @example
   * getGroupPath("/calendar", "yyyyy") => "/g/yyyyy/calendar"
   * getGroupPath("/calendar", "personal") => "/calendar"
   * getGroupPath("/preferences") => "g/xxxxx/somewhere" -> "/g/xxxxx/preferences"
   * getGroupPath("/preferences", "yyyyy") => "/g/yyyyy/preferences"
   */
  const getGroupPath = useCallback(
    (href: string, groupIdOverride?: string) => {
      const gid = groupIdOverride || groupId;
      return gid ? `/g/${gid}${href}` : href;
    },
    [groupId]
  );

  /**
   * グループ内に遷移する
   *
   * @param {string} href /から始まるパス
   * @param {NavigateOptions} [options] オプション
   * @param {string} [groupId] グループIDをオーバーライドする
   *
   * @example
   * pushInGroup("/calendar") => "/g/xxxxx/calendar"
   * pushInGroup("/calendar", { replace: true }) => "/g/xxxxx/calendar"
   * pushInGroup("/calendar", undefined, "yyyyy") => "/g/yyyyy/calendar"
   * pushInGroup("/calendar", { replace: true }, "yyyyy") => "/g/yyyyy/calendar"
   */
  const pushInGroup = useCallback(
    (href: string, options?: NavigateOptions, groupId?: string) => {
      if (!isInGroup && !groupId) {
        nextRouter.push(href, options);
        return;
      }

      nextRouter.push(getGroupPath(href, groupId), options);
    },
    [getGroupPath, isInGroup, nextRouter]
  );

  const replaceInGroup = useCallback(
    (href: string, options?: NavigateOptions, groupId?: string) => {
      if (!isInGroup && !groupId) {
        console.error("You are not in a group. Please specify groupId.");
        return;
      }
      nextRouter.replace(getGroupPath(href, groupId), options);
    },
    [getGroupPath, isInGroup, nextRouter]
  );

  /**
   * グループを変更して遷移する
   *
   * @param {string | "personal"} groupId グループID
   * @param {NavigateOptions} [options] オプション
   *
   * @example
   * pushToChangeGroup("xxxxx")    // "/calendar" => "/xxxxx/calendar"
   * pushToChangeGroup("personal") // "/g/xxxxx/calendar" => "/calendar"
   */
  const pushToChangeGroup = useCallback(
    (groupId: string | "personal", options?: NavigateOptions) => {
      const realPath =
        groupId === "personal"
          ? extractPathInGroup(pathname)
          : "/g/" + groupId + "/" + extractPathInGroup(pathname);
      console.log("pushToChangeGroup!!!!!!!!!!!!!!!! ", realPath);

      nextRouter.push(realPath, options);
    },
    [extractPathInGroup, nextRouter, pathname]
  );

  return {
    isInGroup,
    groupId,
    getGroupPath,
    pushInGroup,
    replaceInGroup,
    pushToChangeGroup,
  };
}
