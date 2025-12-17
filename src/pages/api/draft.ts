import type { APIRoute } from "astro";
import { saveToFork } from "../../lib/github.manage";

export const POST: APIRoute = async ({ request, cookies }) => {
    const session = cookies.get("gh_session");
    if (!session || !session.value) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const user = JSON.parse(session.value);

    try {
        const body = await request.json();
        const branchName = await saveToFork({
            token: user.accessToken,
            owner: import.meta.env.GITHUB_OWNER,
            repo: import.meta.env.GITHUB_CONTENT_REPO,
            filePath: body.filePath,
            content: body.content,
            message: body.message,
            userLogin: user.login,
            branchName: body.branchName
        });

        return new Response(JSON.stringify({ success: true, branchName }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};