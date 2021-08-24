import { createSchema, config } from "@keystone-next/keystone/schema";
import type { KeystoneConfig } from "@keystone-next/types";
import { statelessSessions } from "@keystone-next/keystone/session";
import { createAuth } from "@keystone-next/auth";
import { User } from "./schemas/User";
import { Product } from "./schemas/Product";
import { ProductImage } from "./schemas/ProductImage";
import "dotenv/config";
import { insertSeedData } from "./seed-data";

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long the user stays signed in
  secret: process.env.COOKIE_SECRET
};

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  sessionData: "id name email",
  initFirstItem: {
    fields: ["name", "email", "password"]
    // TODO: Add in initial roles here
  }
});

const session = statelessSessions(sessionConfig);

const keystoneConfig: KeystoneConfig = {
  lists: createSchema({
    User,
    Product,
    ProductImage
  }),
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true
    }
  },
  db: {
    provider: "postgresql",
    url: process.env.DATABASE_URL,
    async onConnect(keystone) {
      console.log("connected to the database");
      if (process.argv.includes("--seed-data")) {
        await insertSeedData(keystone);
      }
    }
  },
  ui: {
    isAccessAllowed: ({ session }) => {
      return !!session?.data;
    }
  },
  session
};

export default withAuth(config(keystoneConfig));
