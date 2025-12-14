// src/lib/github.fetch.ts
// GitHub API utility for fetching repository data

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

interface GitHubApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

class GitHubAPI {
  private config: GitHubConfig;
  private baseUrl = 'https://api.github.com';

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  private async request(endpoint: string, options: GitHubApiOptions = {}) {
    const { method = 'GET', body, headers = {} } = options;

    const defaultHeaders = {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${this.config.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...headers,
    };

    const fetchOptions: RequestInit = {
      method,
      headers: defaultHeaders,
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
      defaultHeaders['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, fetchOptions);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`GitHub API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // ========== REPOSITORY ==========

  /**
   * Get repository information
   */
  async getRepository() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}`);
  }

  /**
   * List all repositories for the owner/organization
   */
  async listRepositories() {
    return this.request(`/users/${this.config.owner}/repos`);
  }

  // ========== BRANCHES ==========

  /**
   * List all branches in the repository
   */
  async listBranches() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/branches`);
  }

  /**
   * Get a specific branch
   */
  async getBranch(branch: string) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/branches/${branch}`);
  }

  // ========== COMMITS ==========

  /**
   * List commits on a repository
   * @param options - Optional parameters (sha, path, author, since, until, per_page, page)
   */
  async listCommits(options: {
    sha?: string;
    path?: string;
    author?: string;
    since?: string;
    until?: string;
    per_page?: number;
    page?: number;
  } = {}) {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/commits${queryString}`);
  }

  /**
   * Get a specific commit
   */
  async getCommit(sha: string) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/commits/${sha}`);
  }

  // ========== CONTENTS ==========

  /**
   * Get contents of a file or directory
   * @param path - Path to the file/directory (empty string for root)
   * @param ref - The name of the commit/branch/tag (default: repository's default branch)
   */
  async getContents(path: string = '', ref?: string) {
    const params = ref ? `?ref=${ref}` : '';
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/contents/${path}${params}`);
  }

  /**
   * Get raw file content (decoded from base64)
   */
  async getFileContent(path: string, ref?: string) {
    const data = await this.getContents(path, ref);

    if (Array.isArray(data)) {
      throw new Error('Path is a directory, not a file');
    }

    if (data.type !== 'file') {
      throw new Error(`Path is a ${data.type}, not a file`);
    }

    // Decode base64 content
    if (data.encoding === 'base64' && data.content) {
      return atob(data.content.replace(/\n/g, ''));
    }

    return data.content;
  }

  /**
   * Get directory tree
   */
  async listDirectory(path: string = '', ref?: string) {
    const data = await this.getContents(path, ref);

    if (!Array.isArray(data)) {
      throw new Error('Path is not a directory');
    }

    return data;
  }

  // ========== TREES ==========

  /**
   * Get a tree (recursive directory structure)
   * @param treeSha - The SHA1 value of the tree
   * @param recursive - Set to 1 to get the tree recursively
   */
  async getTree(treeSha: string, recursive: boolean = false) {
    const params = recursive ? '?recursive=1' : '';
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/git/trees/${treeSha}${params}`);
  }

  // ========== DISCUSSIONS ==========

  /**
   * List discussions in the repository
   */
  async listDiscussions() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/discussions`);
  }

  /**
   * Get a specific discussion
   */
  async getDiscussion(discussionNumber: number) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/discussions/${discussionNumber}`);
  }

  /**
   * List comments on a discussion
   */
  async listDiscussionComments(discussionNumber: number) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/discussions/${discussionNumber}/comments`);
  }

  // ========== ISSUES ==========

  /**
   * List issues in the repository
   * @param options - Optional filters (state, labels, sort, direction, since, per_page, page)
   */
  async listIssues(options: {
    state?: 'open' | 'closed' | 'all';
    labels?: string;
    sort?: 'created' | 'updated' | 'comments';
    direction?: 'asc' | 'desc';
    since?: string;
    per_page?: number;
    page?: number;
  } = {}) {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/issues${queryString}`);
  }

  /**
   * Get a specific issue
   */
  async getIssue(issueNumber: number) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/issues/${issueNumber}`);
  }

  /**
   * List comments on an issue
   */
  async listIssueComments(issueNumber: number) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/issues/${issueNumber}/comments`);
  }

  // ========== PULL REQUESTS ==========

  /**
   * List pull requests
   */
  async listPullRequests(options: {
    state?: 'open' | 'closed' | 'all';
    head?: string;
    base?: string;
    sort?: 'created' | 'updated' | 'popularity' | 'long-running';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}) {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/pulls${queryString}`);
  }

  /**
   * Get a specific pull request
   */
  async getPullRequest(prNumber: number) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/pulls/${prNumber}`);
  }

  /**
   * List files in a pull request
   */
  async listPullRequestFiles(prNumber: number) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/pulls/${prNumber}/files`);
  }

  // ========== RELEASES ==========

  /**
   * List releases
   */
  async listReleases() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/releases`);
  }

  /**
   * Get the latest release
   */
  async getLatestRelease() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/releases/latest`);
  }

  /**
   * Get a specific release by tag
   */
  async getReleaseByTag(tag: string) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/releases/tags/${tag}`);
  }

  // ========== TAGS ==========

  /**
   * List tags
   */
  async listTags() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/tags`);
  }

  // ========== SEARCH ==========

  /**
   * Search code in the repository
   */
  async searchCode(query: string) {
    const q = `${query}+repo:${this.config.owner}/${this.config.repo}`;
    return this.request(`/search/code?q=${encodeURIComponent(q)}`);
  }
}

// Export a factory function to create the API instance
export function createGitHubAPI(config?: Partial<GitHubConfig>) {
  const githubConfig: GitHubConfig = {
    token: config?.token || import.meta.env.GITHUB_TOKEN || '',
    owner: config?.owner || import.meta.env.GITHUB_OWNER || '',
    repo: config?.repo || import.meta.env.GITHUB_CONTENT_REPO || '',
  };

  if (!githubConfig.token) {
    throw new Error('GitHub token is required. Set GITHUB_TOKEN in .env');
  }

  if (!githubConfig.owner) {
    throw new Error('GitHub owner is required. Set GITHUB_OWNER in .env');
  }

  if (!githubConfig.repo) {
    throw new Error('GitHub repository is required. Set GITHUB_CONTENT_REPO in .env');
  }

  return new GitHubAPI(githubConfig);
}

// Export the class for advanced usage
export { GitHubAPI };
export type { GitHubConfig, GitHubApiOptions };