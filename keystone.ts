import { createSchema, config } from "@keystone-next/keystone/schema";
import type { KeystoneConfig, ListSchemaConfig } from "@keystone-next/types";
import { User } from "./schemas/User";
import "dotenv/config";

const databaseURL = process.env.DATABASE_URL;

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // how long the user stays signed in
    secret: process.env.COOKIE_SECRET,
};

const keystoneConfig: KeystoneConfig = {
    lists: createSchema({
        User,
    }),
    server: {
        cors: {
            origin: [process.env.FRONTEND_URL],
            credentials: true,
        },
    },
    db: {
        provider: "postgresql",
        url: process.env.DATABASE_URL,
    },
    ui: {
        isAccessAllowed: () => true,
    },
};

export default config(keystoneConfig);
