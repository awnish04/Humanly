"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Search,
  Download,
  MoreHorizontal,
  Zap,
  FileText,
  Calendar,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  billing: string | null;
  wordsUsed: number;
  wordsLimit: number;
  requests: number;
  createdAt: string;
  lastSignIn: string | null;
}

const PLAN_COLORS: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  basic: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  pro: "bg-primary/10 text-primary border-primary/20",
  max: "bg-violet-400/10 text-violet-400 border-violet-400/20",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function UserDrawer({ user }: { user: User }) {
  const isMobile = useIsMobile();
  const usagePct = Math.min(
    100,
    Math.round((user.wordsUsed / user.wordsLimit) * 100),
  );

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <button className="font-semibold text-foreground hover:text-primary transition-colors text-left">
          {user.name}
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {user.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <DrawerTitle>{user.name}</DrawerTitle>
              <DrawerDescription>{user.email}</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex flex-col gap-5 overflow-y-auto px-4 text-sm">
          {/* Plan badge */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Plan</span>
            <Badge
              variant="outline"
              className={cn("capitalize", PLAN_COLORS[user.plan])}
            >
              {user.plan}
              {user.billing && ` · ${user.billing}`}
            </Badge>
          </div>

          {/* Usage */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Word Usage</span>
              <span className="font-medium">
                {user.wordsUsed.toLocaleString()} /{" "}
                {user.wordsLimit.toLocaleString()}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  usagePct >= 90 ? "bg-destructive" : "bg-primary",
                )}
                style={{ width: `${usagePct}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {usagePct}% used
            </span>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Requests",
                value: user.requests.toLocaleString(),
                icon: Zap,
              },
              {
                label: "Words Used",
                value: user.wordsUsed.toLocaleString(),
                icon: FileText,
              },
              {
                label: "Joined",
                value: formatDate(user.createdAt),
                icon: Calendar,
              },
              {
                label: "Last Sign In",
                value: user.lastSignIn ? formatDate(user.lastSignIn) : "Never",
                icon: Calendar,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border p-3 flex flex-col gap-1"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <stat.icon className="size-3" />
                  {stat.label}
                </div>
                <p className="text-sm font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [planFilter, setPlanFilter] = React.useState<string>("all");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    void fetchUsers();
  }, []);

  const filteredUsers = React.useMemo(() => {
    if (planFilter === "all") return users;
    return users.filter((u) => u.plan === planFilter);
  }, [users, planFilter]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {row.original.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <UserDrawer user={row.original} />
            <p className="text-xs text-muted-foreground truncate">
              {row.original.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn("capitalize text-xs", PLAN_COLORS[row.original.plan])}
        >
          {row.original.plan}
          {row.original.billing && (
            <span className="ml-1 opacity-70">· {row.original.billing}</span>
          )}
        </Badge>
      ),
    },
    {
      accessorKey: "wordsUsed",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 text-xs font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Words Used
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )}
        </button>
      ),
      cell: ({ row }) => {
        const pct = Math.min(
          100,
          Math.round((row.original.wordsUsed / row.original.wordsLimit) * 100),
        );
        return (
          <div className="flex flex-col gap-1 min-w-[100px]">
            <span className="text-xs font-medium">
              {row.original.wordsUsed.toLocaleString()} /{" "}
              {row.original.wordsLimit.toLocaleString()}
            </span>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden w-24">
              <div
                className={cn(
                  "h-full rounded-full",
                  pct >= 90 ? "bg-destructive" : "bg-primary",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "requests",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 text-xs font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Requests
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )}
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.requests.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: "lastSignIn",
      header: "Last Active",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.lastSignIn
            ? formatDate(row.original.lastSignIn)
            : "Never"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" className="size-8" />}
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <UserDrawer user={row.original} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredUsers,
    columns,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const exportCSV = () => {
    const rows = [
      [
        "Name",
        "Email",
        "Plan",
        "Words Used",
        "Words Limit",
        "Requests",
        "Joined",
        "Last Active",
      ],
      ...users.map((u) => [
        u.name,
        u.email,
        u.plan,
        u.wordsUsed,
        u.wordsLimit,
        u.requests,
        formatDate(u.createdAt),
        u.lastSignIn ? formatDate(u.lastSignIn) : "Never",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "humanly-users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const planCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      all: users.length,
      free: 0,
      basic: 0,
      pro: 0,
      max: 0,
    };
    users.forEach((u) => {
      if (u.plan in counts) counts[u.plan]++;
    });
    return counts;
  }, [users]);

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-medium border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
          >
            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
            Refresh
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {users.length} total users across all plans
          </p>
        </div>

        {/* Plan filter tabs */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {(["all", "free", "basic", "pro", "max"] as const).map((plan) => (
            <button
              key={plan}
              onClick={() => setPlanFilter(plan)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                planFilter === plan
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span className="capitalize">{plan}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  planFilter === plan ? "bg-white/20" : "bg-muted",
                )}
              >
                {planCounts[plan] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Export */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="gap-1.5"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <RefreshCw className="size-4 animate-spin" />
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            –
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}{" "}
            of {table.getFilteredRowModel().rows.length} users
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground px-2">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
