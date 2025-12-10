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

*   A simple Vue component in `app.vue` to demonstrate how to use the API endpoints.
*   Buttons to fetch and display Issues, Pull Requests, Discussions, Branches, and the Repository ID.

## Current Plan

The application was failing to fetch data from the GitHub API due to a misconfiguration in the environment variables. I have corrected the `nuxt.config.ts` to use the `GITHUB_CONTENT_REPO` variable from the `.env` file.

Additionally, the `GITHUB_REPO_ID` was missing, which is required for the Discussions API. I have added a new API endpoint and a button in the frontend to fetch this ID. The user needs to:

1.  Click the "Fetch Repo ID" button.
2.  Copy the displayed repository ID.
3.  Paste the ID into the `.env` file for the `GITHUB_REPO_ID` variable.

After completing these steps, the application should be fully functional.
