"use server"
import { headers } from "next/headers";
import { auth } from "../auth";

// Auth Check
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return session?.user ?? null;
}