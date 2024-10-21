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

  const isInGroup = groupRegex.test(pathname);

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

  const groupId = extractId(pathname);

  const getGroupPath = useCallback(
    (href: string, groupIdOverride?: string) => {
      const gid = groupIdOverride || groupId;
      return gid ? `/g/${gid}${href}` : href;
    },
    [groupId]
  );

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
