export default defineOAuthGitHubEventHandler({
    async onSuccess(event, { user, tokens }) {
        const userData = {
            id: user.id,
            login: user.login,
            name: user.name,
            avatar: user.avatar_url,
            accessToken: tokens.access_token,
            loggedInAt: Date.now(),
        }

        await replaceUserSession(event, userData)

        return sendRedirect(event, '/settings')
    },
    async onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, '/settings?error=auth_failed')
    },
})
