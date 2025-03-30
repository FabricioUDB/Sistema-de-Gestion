"use server";

import { createAdminClient } from "@/lib/appwrite";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";

// Función auxiliar reutilizable para manejar el OAuth
async function handleOAuthSignUp(provider: OAuthProvider) {
  try {
    const { account } = await createAdminClient();
    const origin = headers().get("origin");

    if (!origin) {
      throw new Error("Origin header is missing");
    }

    const redirectUrl = await account.createOAuth2Token(
      provider,
      `${origin}/oauth`,
      `${origin}/sign-up`
    );

    return redirect(redirectUrl);
  } catch (error) {
    console.error(`Error in ${provider} OAuth:`, error);
    throw error;
  }
}

export async function signUpWithGithub() {
  return handleOAuthSignUp(OAuthProvider.Github);
}

export async function signUpWithGoogle() {
  return handleOAuthSignUp(OAuthProvider.Google);
}