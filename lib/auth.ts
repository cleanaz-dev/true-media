import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, tenant } from "./permissions";
import { UserRole } from "@/lib/generated/prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: {
    allowedHosts: [
      "localhost:3000",
      "lvh.me:3000",
      "*.lvh.me:3000",
      "true-media.vercel.app",
      "*.true-media.vercel.app",
      "truemediasports.com",
      "*.truemediasports.com",
    ],
    fallback: "http://localhost:3000",
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://lvh.me:3000",
    "http://admin.lvh.me:3000",
    "https://admin.true-media.vercel.app",
    "https://*.true-media.vercel.app",
    "https://truemediasports.com",
    "https://*.truemediasports.com",
  ],

   advanced: {
    crossSubDomainCookies: {
      enabled: true,
      // 👇 DO NOT HARDCODE .true-media.vercel.app
      // If on truemediasports.com, the browser will drop cookies set for vercel.app
      domain:
        process.env.NODE_ENV === "production"
          ? ".truemediasports.com" 
          : ".lvh.me",
    },
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  emailAndPassword: {
    enabled: true,
  },

  // ADD THIS BLOCK
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    fields: {
      image: "avatarUrl", // map Better Auth's "image" to your "avatarUrl" column
    },
    additionalFields: {
      role: {
        type: "string",
        defaultValue: UserRole.TENANT,
        input: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [
    dash(),
    adminPlugin({
      defaultRole: UserRole.TENANT,
      ac,
      roles: {
        ADMIN: admin,
        TENANT: tenant,
      },
    }),
  ],
});
