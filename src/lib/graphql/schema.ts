export const typeDefs = `#graphql

  # ── Pricing Plan ──────────────────────────────────────────────────────────────
  type Plan {
    id: ID!
    name: String!
    desc: String!
    monthlyPrice: Float!
    yearlyPrice: Float!
    highlight: Boolean!
    accentColor: String!
    bgColor: String!
    features: [String!]!
    stripePriceMonthly: String
    stripePriceYearly: String
    createdAt: String!
    updatedAt: String!
  }

  input CreatePlanInput {
    id: String!
    name: String!
    desc: String!
    monthlyPrice: Float!
    yearlyPrice: Float!
    highlight: Boolean!
    accentColor: String!
    bgColor: String!
    features: [String!]!
    stripePriceMonthly: String
    stripePriceYearly: String
  }

  input UpdatePlanInput {
    name: String
    desc: String
    monthlyPrice: Float
    yearlyPrice: Float
    highlight: Boolean
    accentColor: String
    bgColor: String
    features: [String!]
    stripePriceMonthly: String
    stripePriceYearly: String
  }

  # ── Discount / Coupon ─────────────────────────────────────────────────────────
  type Discount {
    id: ID!
    code: String!
    percentage: Int!
    title: String!
    description: String!
    ctaText: String!
    ctaLink: String!
    enabled: Boolean!
    showTimer: Boolean!
    timerMinutes: Int!
    delaySeconds: Int!
    expiresAt: String
    usageCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  input CreateDiscountInput {
    code: String!
    percentage: Int!
    title: String!
    description: String!
    ctaText: String!
    ctaLink: String!
    enabled: Boolean!
    showTimer: Boolean!
    timerMinutes: Int!
    delaySeconds: Int!
    expiresAt: String
  }

  input UpdateDiscountInput {
    code: String
    percentage: Int
    title: String
    description: String
    ctaText: String
    ctaLink: String
    enabled: Boolean
    showTimer: Boolean
    timerMinutes: Int
    delaySeconds: Int
    expiresAt: String
  }

  # ── Queries & Mutations ───────────────────────────────────────────────────────
  type Query {
    plans: [Plan!]!
    plan(id: ID!): Plan
    discounts: [Discount!]!
    discount(id: ID!): Discount
    activeDiscount: Discount
  }

  type Mutation {
    createPlan(input: CreatePlanInput!): Plan!
    updatePlan(id: ID!, input: UpdatePlanInput!): Plan!
    deletePlan(id: ID!): Boolean!

    createDiscount(input: CreateDiscountInput!): Discount!
    updateDiscount(id: ID!, input: UpdateDiscountInput!): Discount!
    deleteDiscount(id: ID!): Boolean!
    toggleDiscount(id: ID!, enabled: Boolean!): Discount!
  }
`;
