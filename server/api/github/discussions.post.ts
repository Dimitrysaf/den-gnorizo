export default defineEventHandler(async (event) => {
  const { githubToken, githubRepoId } = useRuntimeConfig();
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
      Authorization: `Bearer ${githubToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: mutation }),
  });

  return response.json();
});
