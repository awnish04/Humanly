import {
  getPlans,
  savePlans,
  getDiscounts,
  saveDiscounts,
  type StoredPlan,
  type StoredDiscount,
} from "./db";

function now() {
  return new Date().toISOString();
}

export const resolvers = {
  Query: {
    plans: () => getPlans(),
    plan: (_: unknown, { id }: { id: string }) =>
      getPlans().find((p) => p.id === id) ?? null,
    discounts: () => getDiscounts(),
    discount: (_: unknown, { id }: { id: string }) =>
      getDiscounts().find((d) => d.id === id) ?? null,
    activeDiscount: () => getDiscounts().find((d) => d.enabled) ?? null,
  },

  Mutation: {
    createPlan: (
      _: unknown,
      { input }: { input: Omit<StoredPlan, "createdAt" | "updatedAt"> },
    ) => {
      const plans = getPlans();
      const plan: StoredPlan = { ...input, createdAt: now(), updatedAt: now() };
      plans.push(plan);
      savePlans(plans);
      return plan;
    },

    updatePlan: (
      _: unknown,
      { id, input }: { id: string; input: Partial<StoredPlan> },
    ) => {
      const plans = getPlans();
      const idx = plans.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error(`Plan ${id} not found`);
      plans[idx] = { ...plans[idx], ...input, updatedAt: now() };
      savePlans(plans);
      return plans[idx];
    },

    deletePlan: (_: unknown, { id }: { id: string }) => {
      const plans = getPlans();
      const idx = plans.findIndex((p) => p.id === id);
      if (idx === -1) return false;
      plans.splice(idx, 1);
      savePlans(plans);
      return true;
    },

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
      const discounts = getDiscounts();
      const discount: StoredDiscount = {
        ...input,
        id: crypto.randomUUID(),
        usageCount: 0,
        createdAt: now(),
        updatedAt: now(),
      };
      discounts.push(discount);
      saveDiscounts(discounts);
      return discount;
    },

    updateDiscount: (
      _: unknown,
      { id, input }: { id: string; input: Partial<StoredDiscount> },
    ) => {
      const discounts = getDiscounts();
      const idx = discounts.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error(`Discount ${id} not found`);
      discounts[idx] = { ...discounts[idx], ...input, updatedAt: now() };
      saveDiscounts(discounts);
      return discounts[idx];
    },

    deleteDiscount: (_: unknown, { id }: { id: string }) => {
      const discounts = getDiscounts();
      const idx = discounts.findIndex((d) => d.id === id);
      if (idx === -1) return false;
      discounts.splice(idx, 1);
      saveDiscounts(discounts);
      return true;
    },

    toggleDiscount: (
      _: unknown,
      { id, enabled }: { id: string; enabled: boolean },
    ) => {
      const discounts = getDiscounts();
      const idx = discounts.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error(`Discount ${id} not found`);
      discounts[idx] = { ...discounts[idx], enabled, updatedAt: now() };
      saveDiscounts(discounts);
      return discounts[idx];
    },
  },
};
