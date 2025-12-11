export default defineCachedEventHandler(async (event) => {
    const { githubToken, githubOwner, githubRepo } = useRuntimeConfig()
    const query = getQuery(event)
    const filename = query.file as string

    if (!filename) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Filename is required',
        })
    }

    const response = await fetch(
        `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filename}`,
        {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        }
    )

    if (!response.ok) {
        throw createError({
            statusCode: response.status,
            statusMessage: `Failed to fetch article: ${filename}`,
        })
    }

    const data = await response.json()

    // Decode base64 content
    const content = Buffer.from(data.content, 'base64').toString('utf-8')

    return {
        filename,
        content,
    }
}, {
    maxAge: 60 * 10, // Cache for 10 minutes
    getKey: (event) => `article-${getQuery(event).file}`
})
