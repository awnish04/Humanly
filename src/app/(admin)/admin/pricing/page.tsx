/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Plus, Pencil, Trash2, Star, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  gql,
  PLANS_QUERY,
  CREATE_PLAN_MUTATION,
  UPDATE_PLAN_MUTATION,
  DELETE_PLAN_MUTATION,
} from "@/lib/graphql/queries";

interface Plan {
  id: string;
  name: string;
  desc: string;
  monthlyPrice: number;
  yearlyPrice: number;
  highlight: boolean;
  accentColor: string;
  bgColor: string;
  features: string[];
  stripePriceMonthly?: string;
  stripePriceYearly?: string;
  createdAt: string;
  updatedAt: string;
}

const EMPTY: Omit<Plan, "createdAt" | "updatedAt"> = {
  id: "",
  name: "",
  desc: "",
  monthlyPrice: 0,
  yearlyPrice: 0,
  highlight: false,
  accentColor: "text-primary",
  bgColor: "bg-primary/10",
  features: [],
  stripePriceMonthly: "",
  stripePriceYearly: "",
};

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [featureInput, setFeatureInput] = useState("");

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await gql<{ plans: Plan[] }>(PLANS_QUERY);
      setPlans(data.plans);
    } catch {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setFeatureInput("");
    setDialogOpen(true);
  };
  const openEdit = (p: Plan) => {
    setEditing(p);
    setForm({ ...p });
    setFeatureInput("");
    setDialogOpen(true);
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm((f) => ({ ...f, features: [...f.features, featureInput.trim()] }));
    setFeatureInput("");
  };
  const removeFeature = (i: number) =>
    setForm((f) => ({
      ...f,
      features: f.features.filter((_, idx) => idx !== i),
    }));

  const handleSave = async () => {
    if (!form.id || !form.name) {
      toast.error("ID and Name are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const { id, createdAt, updatedAt, ...input } = form as Plan;
        await gql(UPDATE_PLAN_MUTATION, { id: editing.id, input });
        toast.success("Plan updated");
      } else {
        const { createdAt, updatedAt, ...input } = form as Plan;
        await gql(CREATE_PLAN_MUTATION, { input });
        toast.success("Plan created");
      }
      setDialogOpen(false);
      fetchPlans();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await gql(DELETE_PLAN_MUTATION, { id });
      toast.success("Plan deleted");
      setDeleteId(null);
      fetchPlans();
    } catch {
      toast.error("Delete failed");
    }
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
              <BreadcrumbPage>Pricing Plans</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Button size="sm" onClick={openCreate} className="gap-1.5">
            <Plus className="size-3.5" /> Add Plan
          </Button>
        </div>
      </header>

      <main className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Pricing Plans
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage subscription plans via GraphQL
            </p>
          </div>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Monthly</TableHead>
                <TableHead>Yearly</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Stripe IDs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Loader2 className="size-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No plans yet
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-1.5">
                            {p.name}
                            {p.highlight && (
                              <Star className="size-3 text-yellow-500 fill-yellow-500" />
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.desc}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-semibold">
                      ${p.monthlyPrice}
                    </TableCell>
                    <TableCell className="font-mono font-semibold">
                      ${p.yearlyPrice}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {p.features.length} features
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p className="truncate max-w-[140px]">
                          {p.stripePriceMonthly || "—"}
                        </p>
                        <p className="truncate max-w-[140px]">
                          {p.stripePriceYearly || "—"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => openEdit(p)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(p.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Plan" : "Create Plan"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-id">Plan ID *</Label>
              <Input
                id="plan-id"
                value={form.id}
                onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                placeholder="basic"
                disabled={!!editing}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-name">Name *</Label>
              <Input
                id="plan-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Basic"
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="plan-desc">Description</Label>
              <Input
                id="plan-desc"
                value={form.desc}
                onChange={(e) =>
                  setForm((f) => ({ ...f, desc: e.target.value }))
                }
                placeholder="7,000 words per month"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-monthly">Monthly Price ($)</Label>
              <Input
                id="plan-monthly"
                type="number"
                step="0.01"
                value={form.monthlyPrice}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    monthlyPrice: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-yearly">Yearly Price ($)</Label>
              <Input
                id="plan-yearly"
                type="number"
                step="0.01"
                value={form.yearlyPrice}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    yearlyPrice: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-stripe-monthly">
                Stripe Price ID (Monthly)
              </Label>
              <Input
                id="plan-stripe-monthly"
                value={form.stripePriceMonthly ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stripePriceMonthly: e.target.value }))
                }
                placeholder="price_1..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-stripe-yearly">
                Stripe Price ID (Yearly)
              </Label>
              <Input
                id="plan-stripe-yearly"
                value={form.stripePriceYearly ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stripePriceYearly: e.target.value }))
                }
                placeholder="price_1..."
              />
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <input
                type="checkbox"
                id="plan-highlight"
                checked={form.highlight}
                onChange={(e) =>
                  setForm((f) => ({ ...f, highlight: e.target.checked }))
                }
                className="size-4 rounded"
              />
              <Label htmlFor="plan-highlight">
                Mark as highlighted / Most Popular
              </Label>
            </div>

            {/* Features */}
            <div className="col-span-2 flex flex-col gap-2">
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                  placeholder="Add a feature and press Enter"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {form.features.map((f, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 pr-1">
                    {f}
                    <button
                      onClick={() => removeFeature(i)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
              {editing ? "Save Changes" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete the plan. This action cannot be undone.
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
