import type { APIRoute } from "astro";

export const ALL: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("gh_session", { path: "/" });
  cookies.delete("gh_token", { path: "/" }); // Also clear token
  cookies.delete("oauth_state", { path: "/" }); // Clean up any leftover state
  return redirect("/settings");
};