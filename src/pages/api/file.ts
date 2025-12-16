import type { APIRoute } from "astro";
import { createGitHubAPI } from "../../lib/github.fetch";

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const path = url.searchParams.get("path");

    if (!path) return new Response("Missing path", { status: 400 });

    try {
        const api = createGitHubAPI();
        const content = await api.getFileContent(path);
        return new Response(JSON.stringify({ content }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};