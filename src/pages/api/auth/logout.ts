import type { APIRoute } from "astro";

export const ALL: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("gh_session", { path: "/" });
  return redirect("/settings");
};