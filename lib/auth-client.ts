// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth"; // adjust if your server auth.ts lives elsewhere

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});

export const { signIn, signOut, useSession, signUp  } = authClient;