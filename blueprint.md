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
    *   Users can authenticate with their GitHub account
    *   Session management with encrypted cookies
    *   User profile display (avatar, username)
    *   Logout functionality

### Configuration

*   **Environment Variables**:
    *   `GITHUB_TOKEN`: Personal access token for server-side GitHub API calls
    *   `GITHUB_OWNER`: Repository owner
    *   `GITHUB_CONTENT_REPO`: Repository name
    *   `GITHUB_REPO_ID`: Repository ID for Discussions API
    *   `GITHUB_CLIENT_ID`: OAuth App Client ID
    *   `GITHUB_CLIENT_SECRET`: OAuth App Client Secret
    *   `NUXT_SESSION_PASSWORD`: Session encryption password (32+ characters)

## Current Plan

The application now includes a Settings page with GitHub OAuth authentication. Users can:

1. Navigate to the Settings tab
2. Click "Σύνδεση με GitHub" to authenticate
3. Authorize the application on GitHub
4. View their profile information
5. Disconnect their account when needed

The OAuth flow is handled by `nuxt-auth-utils` module with secure session management.
