# Project Blueprint

## Overview

This project is a Nuxt application that provides an API to interact with the GitHub API. It allows reading and writing issues, pull requests, and discussions, as well as reading branches.

## Implemented Features

### GitHub API Integration

*   **Configuration:** The application uses `runtimeConfig` in `nuxt.config.ts` to manage GitHub API credentials (`GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_CONTENT_REPO`, `GITHUB_REPO_ID`).
*   **API Endpoints:** The application provides the following API endpoints under `server/api/github/`:
    *   `issues.get.ts`: Fetches a list of issues.
    *   `issues.post.ts`: Creates a new issue.
    *   `prs.get.ts`: Fetches a list of pull requests.
    *   `prs.post.ts`: Creates a new pull request.
    *   `discussions.get.ts`: Fetches a list of discussions.
    *   `discussions.post.ts`: Creates a new discussion.
    *   `branches.get.ts`: Fetches a list of branches.
    *   `repo-id.get.ts`: Fetches the repository ID for the configured repository.

### Frontend

*   A responsive Vue application with multiple pages:
    *   **Home** (`index.vue`): Main landing page
    *   **Συζήτηση** (`discuss.vue`): Discussions page
    *   **Προβλήματα** (`issues.vue`): Issues page
    *   **Προτάσεις** (`ideas.vue`): Ideas/Pull Requests page
    *   **Σχετικά** (`about.vue`): About page
    *   **Ρυθμίσεις** (`settings.vue`): Settings page with GitHub authentication
*   **Navigation**: Responsive tab navigation using `ResponsiveTabs.vue` component
*   **Authentication**: GitHub OAuth integration using `nuxt-auth-utils`
    *   Users can authenticate with their GitHub account (simple login, no API setup required)
    *   Session management with encrypted cookies
    *   User profile display (avatar, username)
    *   Logout functionality
    *   **Dual-Token System**:
        *   **Read operations** (GET): Use server token - anyone can browse
        *   **Write operations** (POST): Use authenticated user's OAuth token - users contribute as themselves

### Configuration

*   **Environment Variables**:
    *   `GITHUB_TOKEN`: Personal access token for server-side GitHub API calls (read operations)
    *   `GITHUB_OWNER`: Repository owner
    *   `GITHUB_CONTENT_REPO`: Repository name
    *   `GITHUB_REPO_ID`: Repository ID for Discussions API
    *   `GITHUB_CLIENT_ID`: OAuth App Client ID
    *   `GITHUB_CLIENT_SECRET`: OAuth App Client Secret
    *   `NUXT_SESSION_PASSWORD`: Session encryption password (32+ characters)

## Current Plan

The application now includes a dual-token authentication system:

**For Anonymous Users:**
- Can browse all content (discussions, issues, PRs) using server token
- No authentication required for viewing

**For Authenticated Users:**
- Sign in with GitHub (one-click, no API setup needed)
- Create discussions, issues, and PRs as themselves
- Contributions appear under their GitHub account
- Uses their own API quota (not the server's)

This approach provides the best of both worlds: open browsing for everyone, and proper attribution for contributors.
