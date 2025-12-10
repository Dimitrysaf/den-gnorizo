import { Octokit } from '@octokit/rest';

export default defineEventHandler(async (event) => {
  const { githubToken, githubOwner, githubRepo } = useRuntimeConfig();

  const octokit = new Octokit({ auth: githubToken });

  try {
    const response = await octokit.graphql(
      `query GetRepoId($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id
        }
      }`,
      {
        owner: githubOwner,
        name: githubRepo,
      }
    );

    return {
      // @ts-ignore
      repoId: response.repository.id,
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
