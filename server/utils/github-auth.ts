/**
 * Get the authenticated user's GitHub access token from session
 */
export async function getUserToken(event: any): Promise<string | null> {
    const session = await getUserSession(event)
    return (session as any)?.accessToken || null
}

/**
 * Get the server's GitHub token from runtime config
 */
export function getServerToken(): string {
    const config = useRuntimeConfig()
    return config.githubToken
}

/**
 * Require user authentication and return their token
 * Throws 401 error if user is not authenticated
 */
export async function requireUserAuth(event: any): Promise<string> {
    const token = await getUserToken(event)
    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication required. Please sign in with GitHub.',
        })
    }
    return token
}
