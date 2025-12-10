export default defineEventHandler(async (event) => {
  const { githubToken, githubOwner, githubRepo } = useRuntimeConfig();
  const body = await readBody(event);

  const response = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  return response.json();
});
