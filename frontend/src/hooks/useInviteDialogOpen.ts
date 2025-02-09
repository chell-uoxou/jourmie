import { useAtom } from "jotai";
import { inviteDialogAtom } from "~/stores/inviteDialogOpen";

export default function useInviteDialogOpen() {
  const [isOpen, setIsOpen] = useAtom(inviteDialogAtom);
  return { isOpen, setIsOpen };
}
