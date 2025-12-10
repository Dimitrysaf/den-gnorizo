
export default defineEventHandler(async (event) => {
  const { githubToken, githubOwner, githubRepo } = useRuntimeConfig();

  const response = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/issues?state=all`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.json();
});
