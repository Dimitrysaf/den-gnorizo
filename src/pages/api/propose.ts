import type { APIRoute } from "astro";
import { saveToFork } from "../../lib/github.manage"; // Fixed import

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

    const branchName = await saveToFork({
      token: user.accessToken,
      owner: import.meta.env.GITHUB_OWNER,
      repo: import.meta.env.GITHUB_CONTENT_REPO,
      filePath,
      content,
      message,
      userLogin: user.login
    });

    // Return the branch name so UI can tell user
    return new Response(JSON.stringify({ success: true, branchName }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};