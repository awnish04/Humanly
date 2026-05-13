import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_iInK76bCsGTt@ep-holy-glade-aozmwp5u.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
});
