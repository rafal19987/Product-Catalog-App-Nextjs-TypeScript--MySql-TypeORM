import { defineConfig, env } from "prisma/config";
import {config} from 'dotenv';

if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_RUNTIME) {
    config();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
