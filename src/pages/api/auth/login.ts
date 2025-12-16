import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect, cookies }) => {
    const client_id = import.meta.env.GITHUB_CLIENT_ID;

    if (!client_id) {
        return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
    }

    // Generate a secure random state for CSRF protection
    const state = crypto.randomUUID();

    // Store state in a secure cookie to validate later
    cookies.set("oauth_state", state, {
        path: "/",
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: 60 * 10, // 10 minutes - short lived
    });

    const scope = "read:user";

    const params = new URLSearchParams({
        client_id,
        scope,
        state,
    });

    return redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};