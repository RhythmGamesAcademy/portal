"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { optionalEnv } from "@/lib/env";
import { DiscordApiError, updateAcademyMajorRoles } from "@/lib/discord";
import { majorRoleCodes, majorRoleIdsFromCodes } from "@/lib/roles";

export type MajorRoleUpdateState = {
  status: "idle" | "success" | "error";
  error?: "unauthorized" | "invalid" | "configuration" | "forbidden" | "not_found" | "failure";
  selectedMajors: string[];
};

export async function updateMajorRoles(
  _previousState: MajorRoleUpdateState,
  formData: FormData,
): Promise<MajorRoleUpdateState> {
  const values = formData.getAll("majors");
  if (!values.every((value): value is string => typeof value === "string")) {
    return { status: "error", error: "invalid", selectedMajors: [] };
  }
  const selectedMajors = [...new Set(values)];
  const validCodes = new Set(majorRoleCodes());
  if (
    selectedMajors.length > 5
    || selectedMajors.length !== values.length
    || !selectedMajors.every((code) => validCodes.has(code))
  ) {
    return { status: "error", error: "invalid", selectedMajors };
  }

  const session = await auth();
  if (!session?.discordUserId) {
    return { status: "error", error: "unauthorized", selectedMajors: [] };
  }
  if (!optionalEnv("DISCORD_BOT_TOKEN")) {
    return { status: "error", error: "configuration", selectedMajors };
  }

  try {
    await updateAcademyMajorRoles(
      session.discordUserId,
      majorRoleIdsFromCodes(selectedMajors),
    );
  } catch (error) {
    if (error instanceof DiscordApiError && error.kind === "forbidden") {
      return { status: "error", error: "forbidden", selectedMajors };
    }
    if (error instanceof DiscordApiError && error.kind === "not_found") {
      return { status: "error", error: "not_found", selectedMajors };
    }
    console.error("Failed to update Discord major roles.", error);
    return { status: "error", error: "failure", selectedMajors };
  }

  revalidatePath("/[locale]/id", "page");
  return { status: "success", selectedMajors };
}
