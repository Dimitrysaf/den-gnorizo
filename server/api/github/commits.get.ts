
export default defineEventHandler(async (event) => {
    const { githubToken, githubOwner, githubRepo } = useRuntimeConfig();
    const query = getQuery(event);
    const sha = query.sha || 'main'; // Default to main if not provided

    const response = await fetch(
        `https://api.github.com/repos/${githubOwner}/${githubRepo}/commits?sha=${sha}&per_page=1`,
        {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.json();
});
