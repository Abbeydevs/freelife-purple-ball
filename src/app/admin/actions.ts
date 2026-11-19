"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(passcode: string) {
  const validPasscode = process.env.ADMIN_PASSCODE || "PURPLE2026";

  if (passcode === validPasscode) {
    const cookieStore = await cookies();
    cookieStore.set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true };
  }

  return { success: false, error: "Incorrect executive passcode" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_authenticated");
  redirect("/admin/login");
}
