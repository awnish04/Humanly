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
    plan: async (_: unknown, { id }: { id: string }) => {
      const plans = await getPlans();
      return plans.find((p) => p.id === id) ?? null;
    },
    discounts: () => getDiscounts(),
    discount: async (_: unknown, { id }: { id: string }) => {
      const discounts = await getDiscounts();
      return discounts.find((d) => d.id === id) ?? null;
    },
    activeDiscount: async () => {
      const discounts = await getDiscounts();
      return discounts.find((d) => d.enabled) ?? null;
    },
  },

  Mutation: {
    createPlan: async (
      _: unknown,
      { input }: { input: Omit<StoredPlan, "createdAt" | "updatedAt"> },
    ) => {
      const plans = await getPlans();
      const plan: StoredPlan = { ...input, createdAt: now(), updatedAt: now() };
      plans.push(plan);
      await savePlans(plans);
      return plan;
    },

    updatePlan: async (
      _: unknown,
      { id, input }: { id: string; input: Partial<StoredPlan> },
    ) => {
      const plans = await getPlans();
      const idx = plans.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error(`Plan ${id} not found`);
      plans[idx] = { ...plans[idx], ...input, updatedAt: now() };
      await savePlans(plans);
      return plans[idx];
    },

    deletePlan: async (_: unknown, { id }: { id: string }) => {
      const plans = await getPlans();
      const idx = plans.findIndex((p) => p.id === id);
      if (idx === -1) return false;
      plans.splice(idx, 1);
      await savePlans(plans);
      return true;
    },

    createDiscount: async (
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
      const discounts = await getDiscounts();
      const discount: StoredDiscount = {
        ...input,
        id: crypto.randomUUID(),
        usageCount: 0,
        createdAt: now(),
        updatedAt: now(),
      };
      discounts.push(discount);
      await saveDiscounts(discounts);
      return discount;
    },

    updateDiscount: async (
      _: unknown,
      { id, input }: { id: string; input: Partial<StoredDiscount> },
    ) => {
      const discounts = await getDiscounts();
      const idx = discounts.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error(`Discount ${id} not found`);
      discounts[idx] = { ...discounts[idx], ...input, updatedAt: now() };
      await saveDiscounts(discounts);
      return discounts[idx];
    },

    deleteDiscount: async (_: unknown, { id }: { id: string }) => {
      const discounts = await getDiscounts();
      const idx = discounts.findIndex((d) => d.id === id);
      if (idx === -1) return false;
      discounts.splice(idx, 1);
      await saveDiscounts(discounts);
      return true;
    },

    toggleDiscount: async (
      _: unknown,
      { id, enabled }: { id: string; enabled: boolean },
    ) => {
      const discounts = await getDiscounts();
      const idx = discounts.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error(`Discount ${id} not found`);
      discounts[idx] = { ...discounts[idx], enabled, updatedAt: now() };
      await saveDiscounts(discounts);
      return discounts[idx];
    },
  },
};
