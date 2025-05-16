import { neon } from "@neondatabase/serverless";

const db = neon(
  "postgresql://neondb_owner:npg_7DZdS5VIwvBP@ep-yellow-water-a26l1lwt-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
);

export default db;
