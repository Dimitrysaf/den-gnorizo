export default defineOAuthGitHubEventHandler({
    async onSuccess(event, { user, tokens }) {
        await setUserSession(event, {
            id: user.id,
            login: user.login,
            name: user.name,
            avatar: user.avatar_url,
            loggedInAt: Date.now(),
        })

        return sendRedirect(event, '/settings')
    },
    async onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, '/settings?error=auth_failed')
    },
})
