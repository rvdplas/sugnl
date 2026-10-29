"use server";

import { revalidatePath, updateTag } from "next/cache";
import { auth, signIn, signOut } from "@/auth";
import { eraseSubscriber, normalizeEmail } from "@/lib/newsletter";
import { parseBannerInput } from "@/lib/bannerInput";
import { createBanner, removeBanner, SITE_BANNER_TAG, updateBanner } from "@/lib/siteBanner";

export async function signInWithGitHub() {
  await signIn("github", { redirectTo: "/admin" });
}

export async function signOutAdmin() {
  await signOut({ redirectTo: "/admin" });
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

/** Creates a banner, or updates one when the form has an id. Returns an error message for the Admin, or null once saved. */
export async function saveBannerAction(formData: FormData): Promise<string | null> {
  const session = await auth();
  if (!session?.isAdmin) {
    throw new Error("Not authorized.");
  }

  const banner = parseBannerInput({
    message: formData.get("message"),
    startsOn: formData.get("startsOn"),
    endsOn: formData.get("endsOn"),
    dismissible: formData.get("dismissible"),
  });
  if (!banner) {
    return "Check the banner: a message of at most 250 characters, links written as [text](/page) or [text](https://…), and an end date on or after the start date.";
  }

  const id = formData.get("id");
  if (id === null) {
    await createBanner(banner);
  } else if (Number.isInteger(Number(id))) {
    await updateBanner(Number(id), banner);
  } else {
    throw new Error("Invalid banner.");
  }

  updateTag(SITE_BANNER_TAG);
  return null;
}

export async function removeBannerAction(formData: FormData) {
  const session = await auth();
  if (!session?.isAdmin) {
    throw new Error("Not authorized.");
  }

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) {
    throw new Error("Invalid banner.");
  }

  await removeBanner(id);
  updateTag(SITE_BANNER_TAG);
}
