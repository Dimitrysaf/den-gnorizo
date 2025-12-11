export default defineCachedEventHandler(async (event) => {
    const { githubToken, githubOwner, githubRepo } = useRuntimeConfig()

    const response = await fetch(
        `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/metadata.json`,
        {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        }
    )

    if (response.status === 404) {
        throw createError({
            statusCode: 404,
            statusMessage: 'metadata.json not found in repository. Please create it first.',
        })
    }

    if (!response.ok) {
        throw createError({
            statusCode: response.status,
            statusMessage: 'Failed to fetch constitution metadata',
        })
    }

    const data = await response.json()

    // Decode base64 content
    const content = Buffer.from(data.content, 'base64').toString('utf-8')

    // Check if content is empty
    if (!content || content.trim() === '') {
        throw createError({
            statusCode: 500,
            statusMessage: 'metadata.json is empty',
        })
    }

    return JSON.parse(content)
}, {
    maxAge: 60 * 5, // Cache for 5 minutes
    getKey: () => 'constitution-metadata'
})
