import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const client_id = import.meta.env.GITHUB_CLIENT_ID;
  const client_secret = import.meta.env.GITHUB_CLIENT_SECRET;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Validate state (CSRF protection)
  const savedState = cookies.get("oauth_state");
  if (!code || !state || !savedState || state !== savedState.value) {
    cookies.delete("oauth_state", { path: "/" });
    return redirect("/403");
  }

  // Clear the state cookie after validation
  cookies.delete("oauth_state", { path: "/" });

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

    // 3. Create Session Object (WITHOUT storing the token in cookie)
    const sessionData = {
      login: userData.login,
      avatar_url: userData.avatar_url,
      id: userData.id,
      name: userData.name,
      html_url: userData.html_url,
      // DO NOT store accessToken here - it's a security risk
    };

    // 4. Set Cookie with proper security settings
    cookies.set("gh_session", JSON.stringify(sessionData), {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax", // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Store the access token separately in a more secure cookie
    // This is still not ideal but better than mixing with user data
    cookies.set("gh_token", accessToken, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return redirect("/settings");

  } catch (error) {
    console.error(error);
    return redirect("/500");
  }
};