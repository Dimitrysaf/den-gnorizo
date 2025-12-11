
export default defineCachedEventHandler(async (event) => {
    const { githubToken, githubOwner, githubRepo } = useRuntimeConfig();
    const query = getQuery(event);
    const sha = query.sha || 'main'; // Default to main if not provided
    const limit = query.limit || 30; // Default to 30 commits
    const path = query.path || ''; // Optional file path filter

    // Build URL with optional path parameter
    let url = `https://api.github.com/repos/${githubOwner}/${githubRepo}/commits?sha=${sha}&per_page=${limit}`;
    if (path) {
        url += `&path=${path}`;
    }

    const response = await fetch(
        url,
        {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.json();
}, {
    maxAge: 60 * 2, // Cache for 2 minutes
    getKey: (event) => {
        const query = getQuery(event);
        return `commits-${query.sha || 'main'}-${query.path || 'all'}`;
    }
});
