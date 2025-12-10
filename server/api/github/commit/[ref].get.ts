export default defineEventHandler(async (event) => {
    const { githubToken, githubOwner, githubRepo } = useRuntimeConfig();
    const ref = event.context.params?.ref;

    if (!ref) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Commit Ref (SHA) is required',
        });
    }

    try {
        const response = await fetch(
            `https://api.github.com/repos/${githubOwner}/${githubRepo}/commits/${ref}`,
            {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GitHub API Error for commit:', ref, response.status, errorText);
            throw createError({
                statusCode: response.status,
                statusMessage: `GitHub API Error: ${response.statusText}`,
                data: errorText
            });
        }

        return response.json();
    } catch (error: any) {
        console.error('Fetch Error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            data: error.message
        });
    }
});
