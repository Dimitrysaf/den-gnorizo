export default defineEventHandler(async (event) => {
  const { githubToken, githubOwner, githubRepo } = useRuntimeConfig();
  const queryParams = getQuery(event);
  const limit = parseInt((queryParams.limit as string) || '50', 10);
  const commentsLimit = parseInt((queryParams.commentsLimit as string) || '20', 10);

  const query = `
    query {
      repository(owner: "${githubOwner}", name: "${githubRepo}") {
        discussions(first: ${limit}) {
          nodes {
            id
            number
            title
            url
            body
            bodyHTML
            createdAt
            author {
              login
              avatarUrl
            }
            comments(first: ${commentsLimit}) {
              totalCount
              nodes {
                id
                body
                bodyHTML
                createdAt
                author {
                  login
                  avatarUrl
                }
              }
            }
          }
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
    body: JSON.stringify({ query }),
  });

  return response.json();
});
