export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    // Check if session has actual user data (not just an ID)
    const hasUserData = !!(session && session.login)

    return {
        hasSession: hasUserData,
        sessionData: hasUserData ? {
            id: session.id,
            login: session.login,
            name: session.name,
            avatar: session.avatar,
            hasAccessToken: !!session.accessToken,
            loggedInAt: session.loggedInAt,
        } : null
    }
})
