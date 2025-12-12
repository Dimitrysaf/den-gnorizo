export default defineCachedEventHandler(async (event) => {
  const { githubToken, githubOwner, githubRepo } = useRuntimeConfig();
  const params = (event as any).context?.params || {};
  const numberParam = params.number;

  if (!numberParam) {
    throw createError({ statusCode: 400, statusMessage: 'Discussion number is required' });
  }

  const number = parseInt(numberParam as string, 10);
  if (isNaN(number)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid discussion number' });
  }

  const queryParams = getQuery(event);
  const commentsLimit = parseInt((queryParams.commentsLimit as string) || '100', 10);

  const query = `
    query {
      repository(owner: "${githubOwner}", name: "${githubRepo}") {
        discussion(number: ${number}) {
          id
          number
          title
          url
          body
          bodyHTML
          createdAt
          author { login avatarUrl }
          comments(first: ${commentsLimit}) {
            totalCount
            nodes {
              id
              body
              bodyHTML
              createdAt
              author { login avatarUrl }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: `GitHub API error` });
  }

  return response.json();
}, {
  maxAge: 60 * 5, // cache 5 minutes
  getKey: (event) => `discussion-${(event as any).context?.params?.number}`
});
