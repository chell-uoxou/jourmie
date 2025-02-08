import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUp, MoreHorizontal, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useMemo, useState } from "react";
import useGroupRouter from "~/hooks/useGroupRouter";
import { collection, doc } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { DBGroupMember } from "~/lib/firestore/schemas";
import clsx from "clsx";
import useCurrentGroup from "~/hooks/useCurrentGroup";
import { InviteMemberDialog } from "./components/InviteMemberDialog";
import { PermissionIcons } from "./components/PermissionIcons";
import EditMemberDialog from "./components/EditMemberDialog";
import RemoveMemberDialog from "./components/RemoveMemberDialog";
import { useFirestoreRealtimeCollection } from "~/hooks/useFirestoreRealtimeCollection";

export function GroupMemberDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { groupId } = useGroupRouter();
  const group = useCurrentGroup(true);
  const data = useFirestoreRealtimeCollection<DBGroupMember>(
    groupId ? collection(doc(db, "groups", groupId), "members") : null
  );

  // EditMemberDialog
  const [isEMBOpen, setIsEMBOpen] = useState(false);
  const [EMBSelectedMember, setEMBSelectedMember] =
    useState<DBGroupMember | null>(null);

  const [isRMBOpen, setIsRMBOpen] = useState(false);
  const [RMBSelectedMember, setRMBSelectedMember] =
    useState<DBGroupMember | null>(null);

  const columns: ColumnDef<DBGroupMember>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "display_name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              名前
              <ArrowUp
                className={clsx(
                  "transition-transform",
                  column.getIsSorted()
                    ? column.getIsSorted() === "asc"
                      ? "rotate-180"
                      : ""
                    : "opacity-0"
                )}
              />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("display_name")}</div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              メールアドレス
              <ArrowUp
                className={clsx(
                  "transition-transform",
                  column.getIsSorted()
                    ? column.getIsSorted() === "asc"
                      ? "rotate-180"
                      : ""
                    : "opacity-0"
                )}
              />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="font-mono">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "editing_permission_scopes",
        header: "権限",

        cell: ({ row }) => (
          <PermissionIcons
            permissionScopes={row.getValue("editing_permission_scopes")}
          />
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          // const rowMember = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {row.getValue("display_name")}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setEMBSelectedMember(row.original);
                    setIsEMBOpen(true);
                  }}
                >
                  メンバーを編集
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setRMBSelectedMember(row.original);
                    setIsRMBOpen(true);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  グループから削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const searchParams = useSearchParams();
  const invite = searchParams.get("invite") ? true : false;
  const [openDialog, setOpenDialog] = useState(invite);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center">
        <Input
          placeholder="メールアドレスを検索"
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("email")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
        <Button
          onClick={() => setOpenDialog(true)}
          className="ml-auto"
          size={"sm"}
        >
          招待 <Plus className=" h-4 w-4" />
        </Button>
        <InviteMemberDialog
          group={group}
          isOpen={openDialog}
          onOpenChange={setOpenDialog}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-3">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <EditMemberDialog
        member={EMBSelectedMember}
        open={isEMBOpen}
        onOpenChange={setIsEMBOpen}
      />
      <RemoveMemberDialog
        member={RMBSelectedMember}
        open={isRMBOpen}
        onOpenChange={setIsRMBOpen}
      />
    </div>
  );
}
