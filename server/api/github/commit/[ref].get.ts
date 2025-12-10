
export default defineEventHandler(async (event) => {
    const { githubToken, githubOwner, githubRepo } = useRuntimeConfig();
    const ref = event.context.params?.ref;

    if (!ref) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Commit Ref (SHA) is required',
        });
    }

    const response = await fetch(
        `https://api.github.com/repos/${githubOwner}/${githubRepo}/commits/${ref}`,
        {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.json();
});
