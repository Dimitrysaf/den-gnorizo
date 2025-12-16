import type { APIRoute } from "astro";
import { proposeChange } from "../../lib/github.manage";

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = cookies.get("gh_session");
  if (!session || !session.value) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const user = JSON.parse(session.value);
  
  try {
    const body = await request.json();
    const { filePath, content, message } = body;

    if (!filePath || !content || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // Call the heavy lifting function
    const pr = await proposeChange({
        token: user.accessToken, // We need the user's token for forking
        owner: import.meta.env.GITHUB_OWNER,
        repo: import.meta.env.GITHUB_CONTENT_REPO,
        filePath,
        content,
        message,
        userLogin: user.login
    });

    return new Response(JSON.stringify({ success: true, pr_url: pr.html_url }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};