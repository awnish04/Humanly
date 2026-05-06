import {
  plansStore,
  discountsStore,
  StoredPlan,
  StoredDiscount,
} from "./store";

function now() {
  return new Date().toISOString();
}

export const resolvers = {
  Query: {
    plans: () => plansStore,
    plan: (_: unknown, { id }: { id: string }) =>
      plansStore.find((p) => p.id === id) ?? null,

    discounts: () => discountsStore,
    discount: (_: unknown, { id }: { id: string }) =>
      discountsStore.find((d) => d.id === id) ?? null,
    activeDiscount: () => discountsStore.find((d) => d.enabled) ?? null,
  },

  Mutation: {
    // ── Plans ──────────────────────────────────────────────────────────────────
    createPlan: (
      _: unknown,
      { input }: { input: Omit<StoredPlan, "createdAt" | "updatedAt"> },
    ) => {
      const plan: StoredPlan = {
        ...input,
        usageCount: 0,
        createdAt: now(),
        updatedAt: now(),
      } as StoredPlan;
      plansStore.push(plan);
      return plan;
    },

    updatePlan: (
      _: unknown,
      { id, input }: { id: string; input: Partial<StoredPlan> },
    ) => {
      const idx = plansStore.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error(`Plan ${id} not found`);
      plansStore[idx] = { ...plansStore[idx], ...input, updatedAt: now() };
      return plansStore[idx];
    },

    deletePlan: (_: unknown, { id }: { id: string }) => {
      const idx = plansStore.findIndex((p) => p.id === id);
      if (idx === -1) return false;
      plansStore.splice(idx, 1);
      return true;
    },

    // ── Discounts ──────────────────────────────────────────────────────────────
    createDiscount: (
      _: unknown,
      {
        input,
      }: {
        input: Omit<
          StoredDiscount,
          "id" | "usageCount" | "createdAt" | "updatedAt"
        >;
      },
    ) => {
      const discount: StoredDiscount = {
        ...input,
        id: crypto.randomUUID(),
        usageCount: 0,
        createdAt: now(),
        updatedAt: now(),
      };
      discountsStore.push(discount);
      return discount;
    },

    updateDiscount: (
      _: unknown,
      { id, input }: { id: string; input: Partial<StoredDiscount> },
    ) => {
      const idx = discountsStore.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error(`Discount ${id} not found`);
      discountsStore[idx] = {
        ...discountsStore[idx],
        ...input,
        updatedAt: now(),
      };
      return discountsStore[idx];
    },

    deleteDiscount: (_: unknown, { id }: { id: string }) => {
      const idx = discountsStore.findIndex((d) => d.id === id);
      if (idx === -1) return false;
      discountsStore.splice(idx, 1);
      return true;
    },

    toggleDiscount: (
      _: unknown,
      { id, enabled }: { id: string; enabled: boolean },
    ) => {
      const idx = discountsStore.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error(`Discount ${id} not found`);
      discountsStore[idx] = {
        ...discountsStore[idx],
        enabled,
        updatedAt: now(),
      };
      return discountsStore[idx];
    },
  },
};
