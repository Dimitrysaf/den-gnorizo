import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const client_id = import.meta.env.GITHUB_CLIENT_ID;
  const client_secret = import.meta.env.GITHUB_CLIENT_SECRET;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return redirect("/403");
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("GitHub Auth Error:", tokenData.error_description);
      return redirect("/403");
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch User Data from GitHub using the new token
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Astro-App",
      },
    });

    if (!userResponse.ok) {
      return redirect("/500");
    }

    const userData = await userResponse.json();

    // 3. Create Session Object
    // We only store essential public info in the cookie to keep it small
    const sessionData = {
      login: userData.login,
      avatar_url: userData.avatar_url,
      id: userData.id,
      name: userData.name,
      html_url: userData.html_url,
      accessToken: accessToken, // Storing token to make API calls on their behalf if needed
    };

    // 4. Set Cookie
    // httpOnly: true (JS cannot read it, prevents XSS)
    // secure: true (HTTPS only)
    // maxAge: 7 days
    cookies.set("gh_session", JSON.stringify(sessionData), {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD, 
      maxAge: 60 * 60 * 24 * 7, 
    });

    return redirect("/settings");

  } catch (error) {
    console.error(error);
    return redirect("/500");
  }
};