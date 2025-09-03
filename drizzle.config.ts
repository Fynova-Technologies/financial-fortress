import { defineConfig } from "drizzle-kit";

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL, ensure the database is provisioned");
// }

export default defineConfig({
  out: "./migrations",
  schema: "./server/src/models/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // url: `postgresql://postgres:bibash@localhost:5432/financial-fortress`,
    url: `postgresql://fynova_db_user:mj2r0eglsJDd6N3OOk89REIc2fWXTIgU@dpg-d2rtainfte5s739atuvg-a/fynova_db`,
  },
});
