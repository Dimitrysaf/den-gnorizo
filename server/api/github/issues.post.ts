export default defineEventHandler(async (event) => {
  // Require user authentication - this will throw 401 if not logged in
  const userToken = await requireUserAuth(event);

  const { githubOwner, githubRepo } = useRuntimeConfig();
  const body = await readBody(event);

  const response = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`, // Use authenticated user's token
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  return response.json();
});
