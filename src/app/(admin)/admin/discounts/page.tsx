"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  gql,
  DISCOUNTS_QUERY,
  CREATE_DISCOUNT_MUTATION,
  UPDATE_DISCOUNT_MUTATION,
  DELETE_DISCOUNT_MUTATION,
  TOGGLE_DISCOUNT_MUTATION,
} from "@/lib/graphql/queries";

interface Discount {
  id: string;
  code: string;
  percentage: number;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  enabled: boolean;
  showTimer: boolean;
  timerMinutes: number;
  delaySeconds: number;
  expiresAt?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

const EMPTY: Omit<Discount, "id" | "usageCount" | "createdAt" | "updatedAt"> = {
  code: "",
  percentage: 20,
  title: "🎉 Limited Time Offer!",
  description: "Get exclusive discount on all premium plans",
  ctaText: "Claim Discount",
  ctaLink: "/pricing",
  enabled: true,
  showTimer: true,
  timerMinutes: 15,
  delaySeconds: 3,
};

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [, startTransition] = useTransition();

  const fetchDiscounts = useCallback(() => {
    setLoading(true);
    gql<{ discounts: Discount[] }>(DISCOUNTS_QUERY)
      .then((data) => setDiscounts(data.discounts))
      .catch(() => toast.error("Failed to load discounts"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    startTransition(() => fetchDiscounts());
  }, [fetchDiscounts]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setDialogOpen(true);
  };
  const openEdit = (d: Discount) => {
    setEditing(d);
    setForm({ ...d });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.code) {
      toast.error("Code is required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          id: _id,
          usageCount: _u,
          createdAt: _c,
          updatedAt: _up,
          ...input
        } = form as Discount;
        await gql(UPDATE_DISCOUNT_MUTATION, { id: editing.id, input });
        toast.success("Discount updated");
      } else {
        await gql(CREATE_DISCOUNT_MUTATION, { input: form });
        toast.success("Discount created");
      }
      setDialogOpen(false);
      fetchDiscounts();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await gql(DELETE_DISCOUNT_MUTATION, { id });
      toast.success("Discount deleted");
      setDeleteId(null);
      fetchDiscounts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleToggle = async (d: Discount) => {
    // Optimistic update — flip immediately in UI
    setDiscounts((prev) =>
      prev.map((item) =>
        item.id === d.id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
    try {
      await gql(TOGGLE_DISCOUNT_MUTATION, { id: d.id, enabled: !d.enabled });
      toast.success(!d.enabled ? "Discount enabled" : "Discount disabled");
    } catch {
      // Revert on failure
      setDiscounts((prev) =>
        prev.map((item) =>
          item.id === d.id ? { ...item, enabled: d.enabled } : item,
        ),
      );
      toast.error("Toggle failed");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-full"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Discounts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Button size="sm" onClick={openCreate} className="gap-1.5">
            <Plus className="size-3.5" /> Add Discount
          </Button>
        </div>
      </header>

      <main className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Discount Codes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage popup discount cards via GraphQL
          </p>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Delay</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Loader2 className="size-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : discounts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No discounts yet
                  </TableCell>
                </TableRow>
              ) : (
                discounts.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <code className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {d.code}
                        </code>
                        <button
                          onClick={() => copyCode(d.code)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy className="size-3" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-lg font-black text-primary">
                        {d.percentage}%
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <p className="text-sm font-medium text-foreground truncate">
                        {d.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {d.description}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {d.expiresAt
                        ? new Date(d.expiresAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "No expiry"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {d.delaySeconds}s
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs",
                          d.enabled
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {d.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => handleToggle(d)}
                          title={d.enabled ? "Disable" : "Enable"}
                        >
                          {d.enabled ? (
                            <ToggleRight className="size-4 text-primary" />
                          ) : (
                            <ToggleLeft className="size-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => openEdit(d)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(d.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </main>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Discount" : "Create Discount"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="d-code">Code *</Label>
              <Input
                id="d-code"
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                }
                placeholder="SAVE20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="d-pct">Discount %</Label>
              <Input
                id="d-pct"
                type="number"
                min={1}
                max={100}
                value={form.percentage}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    percentage: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="d-title">Title</Label>
              <Input
                id="d-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="🎉 Limited Time Offer!"
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="d-desc">Description</Label>
              <Input
                id="d-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="d-cta">CTA Button Text</Label>
              <Input
                id="d-cta"
                value={form.ctaText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ctaText: e.target.value }))
                }
                placeholder="Claim Discount"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="d-link">CTA Link</Label>
              <Input
                id="d-link"
                value={form.ctaLink}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ctaLink: e.target.value }))
                }
                placeholder="/pricing"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="d-delay">Delay (seconds)</Label>
              <Input
                id="d-delay"
                type="number"
                min={0}
                value={form.delaySeconds}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    delaySeconds: parseInt(e.target.value) || 3,
                  }))
                }
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="d-expires">
                Expires At
                <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                  — sets the countdown timer automatically
                </span>
              </Label>
              <Input
                id="d-expires"
                type="datetime-local"
                value={form.expiresAt ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    expiresAt: e.target.value || undefined,
                    // Auto-enable timer when expiry date is set
                    showTimer: !!e.target.value,
                  }))
                }
              />
              {form.expiresAt && (
                <p className="text-xs text-primary">
                  ✓ Countdown timer will show automatically
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="d-enabled"
                  checked={form.enabled}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, enabled: e.target.checked }))
                  }
                  className="size-4 rounded"
                />
                <Label htmlFor="d-enabled">Enabled (show popup)</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
              {editing ? "Save Changes" : "Create Discount"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Discount</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete the discount code.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
