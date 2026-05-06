export const PLANS_QUERY = `
  query GetPlans {
    plans {
      id name desc monthlyPrice yearlyPrice
      highlight accentColor bgColor features
      stripePriceMonthly stripePriceYearly
      createdAt updatedAt
    }
  }
`;

export const DISCOUNTS_QUERY = `
  query GetDiscounts {
    discounts {
      id code percentage title description
      ctaText ctaLink enabled showTimer
      timerMinutes delaySeconds expiresAt
      usageCount createdAt updatedAt
    }
  }
`;

export const CREATE_PLAN_MUTATION = `
  mutation CreatePlan($input: CreatePlanInput!) {
    createPlan(input: $input) {
      id name desc monthlyPrice yearlyPrice
      highlight accentColor bgColor features
      stripePriceMonthly stripePriceYearly
      createdAt updatedAt
    }
  }
`;

export const UPDATE_PLAN_MUTATION = `
  mutation UpdatePlan($id: ID!, $input: UpdatePlanInput!) {
    updatePlan(id: $id, input: $input) {
      id name desc monthlyPrice yearlyPrice
      highlight accentColor bgColor features
      stripePriceMonthly stripePriceYearly updatedAt
    }
  }
`;

export const DELETE_PLAN_MUTATION = `
  mutation DeletePlan($id: ID!) {
    deletePlan(id: $id)
  }
`;

export const CREATE_DISCOUNT_MUTATION = `
  mutation CreateDiscount($input: CreateDiscountInput!) {
    createDiscount(input: $input) {
      id code percentage title description
      ctaText ctaLink enabled showTimer
      timerMinutes delaySeconds expiresAt
      usageCount createdAt updatedAt
    }
  }
`;

export const UPDATE_DISCOUNT_MUTATION = `
  mutation UpdateDiscount($id: ID!, $input: UpdateDiscountInput!) {
    updateDiscount(id: $id, input: $input) {
      id code percentage title description
      ctaText ctaLink enabled showTimer
      timerMinutes delaySeconds expiresAt
      usageCount updatedAt
    }
  }
`;

export const DELETE_DISCOUNT_MUTATION = `
  mutation DeleteDiscount($id: ID!) {
    deleteDiscount(id: $id)
  }
`;

export const TOGGLE_DISCOUNT_MUTATION = `
  mutation ToggleDiscount($id: ID!, $enabled: Boolean!) {
    toggleDiscount(id: $id, enabled: $enabled) {
      id enabled updatedAt
    }
  }
`;

// Simple fetch-based GraphQL client (no Apollo needed on server)
export async function gql<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}
