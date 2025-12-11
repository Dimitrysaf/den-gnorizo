export default defineCachedEventHandler(async (event) => {
    const { githubToken, githubOwner, githubRepo } = useRuntimeConfig()
    const query = getQuery(event)
    const filename = query.file as string
    const since = query.since as string | undefined

    if (!filename) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Filename is required',
        })
    }

    // Build URL with optional since parameter
    let url = `https://api.github.com/repos/${githubOwner}/${githubRepo}/commits?path=${filename}`
    if (since) {
        url += `&since=${since}`
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
        },
    })

    if (!response.ok) {
        throw createError({
            statusCode: response.status,
            statusMessage: `Failed to fetch commits for: ${filename}`,
        })
    }

    const commits = await response.json()

    // Return the most recent commit (first in the array)
    return commits.length > 0 ? commits[0] : null
}, {
    maxAge: 60 * 5, // Cache for 5 minutes
    getKey: (event) => `file-commit-${getQuery(event).file}`
})
