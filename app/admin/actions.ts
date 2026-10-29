"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "@/auth";
import { eraseSubscriber, normalizeEmail } from "@/lib/newsletter";

export async function signInWithGitHub() {
  await signIn("github", { redirectTo: "/admin/newsletter" });
}

export async function signOutAdmin() {
  await signOut({ redirectTo: "/admin/newsletter" });
}

export async function eraseSubscriberAction(formData: FormData) {
  const session = await auth();
  if (!session?.isAdmin) {
    throw new Error("Not authorized.");
  }

  const email = normalizeEmail(formData.get("email"));
  if (!email) {
    throw new Error("Invalid email address.");
  }

  await eraseSubscriber(email);
  revalidatePath("/admin/newsletter");
}
