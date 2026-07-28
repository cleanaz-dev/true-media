import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, tenant } from "./permissions";
import { UserRole } from "@/lib/generated/prisma/client";
import { headers } from "next/headers";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // 1. Allow incoming requests from your root domains and subdomains
  baseURL: {
    allowedHosts: [
      "localhost:3000",
      "lvh.me:3000",
      "*.lvh.me:3000",
      "true-media.vercel.app",
      "*.true-media.vercel.app",
    ],
    fallback: "http://localhost:3000",
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://lvh.me:3000",
    "http://admin.lvh.me:3000",
    "https://admin.true-media.vercel.app", // Add your admin subdomain
    "https://*.true-media.vercel.app",
  ],

  // 2. Enable sharing session cookies between main domain and subdomains
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },

  emailAndPassword: {
    enabled: true,
  },
  user: {
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

// Auth Check
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return session?.user ?? null;
}