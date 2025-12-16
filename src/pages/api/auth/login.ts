import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect }) => {
    const client_id = import.meta.env.GITHUB_CLIENT_ID;

    if (!client_id) {
        return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
    }

    // Request access to read user data
    const scope = "read:user";
    const state = Math.random().toString(36).substring(7); // Simple CSRF protection

    const params = new URLSearchParams({
        client_id,
        scope,
        state,
    });

    return redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};