export default defineEventHandler(async (event) => {
  // Require user authentication - this will throw 401 if not logged in
  const userToken = await requireUserAuth(event);

  const { githubRepoId } = useRuntimeConfig();
  const body = await readBody(event);

  const mutation = `
    mutation {
      createDiscussion(input: {repositoryId: "${githubRepoId}", categoryId: "${body.categoryId}", title: "${body.title}", body: "${body.body}"}) {
        discussion {
          id
          title
          url
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`, // Use authenticated user's token
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: mutation }),
  });

  return response.json();
});
