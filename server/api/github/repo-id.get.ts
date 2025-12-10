export default defineEventHandler(async (event) => {
  const { githubToken, githubOwner, githubRepo } = useRuntimeConfig();

  if (!githubOwner || !githubRepo || !githubToken) {
    console.error('Missing GitHub configuration in .env');
    return {
      error: 'Configuration Error',
      details: 'Missing GITHUB_OWNER, GITHUB_CONTENT_REPO, or GITHUB_TOKEN in .env',
    };
  }

  const query = `
    query GetRepoId($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
      }
    }
  `;

  const variables = {
    owner: githubOwner,
    name: githubRepo,
  };

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return {
      repoId: data.data.repository.id,
    };
  } catch (error) {
    console.error('Error fetching repo ID:', error);
    return {
      error: 'Could not fetch repository ID',
      // @ts-ignore
      details: error.message,
    };
  }
});
