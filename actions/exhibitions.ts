"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { isAllowedEmail } from "@/lib/allowlist";
import {
  createExhibition,
  updateExhibition,
  deleteExhibition,
} from "@/lib/exhibitions";
import type { ExhibitionInput } from "@/lib/types";

async function assertAllowed(): Promise<void> {
  const session = await auth();
  if (!isAllowedEmail(session?.user?.email ?? null, process.env.ALLOWED_EMAILS)) {
    throw new Error("Not authorized.");
  }
}

function readInput(formData: FormData): ExhibitionInput {
  return {
    societyName: String(formData.get("societyName") ?? ""),
    title: String(formData.get("title") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
  };
}

export async function createExhibitionAction(formData: FormData): Promise<void> {
  await assertAllowed();
  await createExhibition(readInput(formData));
  revalidatePath("/settings");
}

export async function updateExhibitionAction(formData: FormData): Promise<void> {
  await assertAllowed();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing exhibition id.");
  await updateExhibition(id, readInput(formData));
  revalidatePath("/settings");
}

export async function deleteExhibitionAction(formData: FormData): Promise<void> {
  await assertAllowed();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing exhibition id.");
  await deleteExhibition(id);
  revalidatePath("/settings");
}
