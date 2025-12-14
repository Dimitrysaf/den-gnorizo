// src/lib/github.fetch.ts

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

const CACHE = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

class GitHubAPI {
  private config: GitHubConfig;
  private baseUrl = 'https://api.github.com';

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  private async request(endpoint: string, options: GitHubApiOptions = {}) {
    const { method = 'GET', body, headers = {} } = options;

    const cacheKey = `${method}:${endpoint}:${JSON.stringify(body || '')}`;
    const now = Date.now();

    if (method === 'GET' && CACHE.has(cacheKey)) {
      const cached = CACHE.get(cacheKey)!;
      if (now - cached.timestamp < CACHE_TTL) {
        return cached.data;
      } else {
        CACHE.delete(cacheKey);
      }
    }

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

      const data = await response.json();

      if (method === 'GET') {
        CACHE.set(cacheKey, { data, timestamp: now });
      }

      return data;
    } catch (error) {
      console.error(`GitHub API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // ========== REPOSITORY ==========
  async getRepository() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}`);
  }

  async listRepositories() {
    return this.request(`/users/${this.config.owner}/repos`);
  }

  // ========== BRANCHES ==========
  async listBranches() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/branches`);
  }

  async getBranch(branch: string) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/branches/${branch}`);
  }

  // ========== COMMITS ==========
  async listCommits(options: { sha?: string; path?: string; author?: string; since?: string; until?: string; per_page?: number; page?: number; } = {}) {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/commits${queryString}`);
  }

  async getCommit(sha: string) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/commits/${sha}`);
  }

  // ========== CONTENTS ==========
  async getContents(path: string = '', ref?: string) {
    const params = ref ? `?ref=${ref}` : '';
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/contents/${path}${params}`);
  }

  async getFileContent(path: string, ref?: string) {
    const data = await this.getContents(path, ref);

    if (Array.isArray(data)) {
      throw new Error('Path is a directory, not a file');
    }

    if (data.type !== 'file') {
      throw new Error(`Path is a ${data.type}, not a file`);
    }

    if (data.encoding === 'base64' && data.content) {
      const binaryString = atob(data.content.replace(/\n/g, ''));
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder('utf-8').decode(bytes);
    }

    return data.content;
  }

  async listDirectory(path: string = '', ref?: string) {
    const data = await this.getContents(path, ref);
    if (!Array.isArray(data)) throw new Error('Path is not a directory');
    return data;
  }

  // ========== TREES ==========
  async getTree(treeSha: string, recursive: boolean = false) {
    const params = recursive ? '?recursive=1' : '';
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/git/trees/${treeSha}${params}`);
  }

  // ========== DISCUSSIONS ==========
  async listDiscussions() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/discussions`);
  }

  async getDiscussion(discussionNumber: number) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/discussions/${discussionNumber}`);
  }

  async listDiscussionComments(discussionNumber: number) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/discussions/${discussionNumber}/comments`);
  }

  // ========== ISSUES ==========
  async listIssues(options: { state?: 'open' | 'closed' | 'all'; labels?: string; sort?: 'created' | 'updated' | 'comments'; direction?: 'asc' | 'desc'; since?: string; per_page?: number; page?: number; } = {}) {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/issues${queryString}`);
  }

  async getIssue(issueNumber: number) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/issues/${issueNumber}`);
  }

  async listIssueComments(issueNumber: number) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/issues/${issueNumber}/comments`);
  }

  // ========== PULL REQUESTS ==========
  async listPullRequests(options: { state?: 'open' | 'closed' | 'all'; head?: string; base?: string; sort?: 'created' | 'updated' | 'popularity' | 'long-running'; direction?: 'asc' | 'desc'; per_page?: number; page?: number; } = {}) {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/pulls${queryString}`);
  }

  async getPullRequest(prNumber: number) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/pulls/${prNumber}`);
  }

  async listPullRequestFiles(prNumber: number) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/pulls/${prNumber}/files`);
  }

  // ========== RELEASES ==========
  async listReleases() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/releases`);
  }

  async getLatestRelease() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/releases/latest`);
  }

  async getReleaseByTag(tag: string) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/releases/tags/${tag}`);
  }

  // ========== TAGS ==========
  async listTags() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/tags`);
  }

  // ========== SEARCH ==========
  async searchCode(query: string) {
    const q = `${query}+repo:${this.config.owner}/${this.config.repo}`;
    return this.request(`/search/code?q=${encodeURIComponent(q)}`);
  }
}

export function createGitHubAPI(config?: Partial<GitHubConfig>) {
  const githubConfig: GitHubConfig = {
    token: config?.token || import.meta.env.GITHUB_TOKEN || '',
    owner: config?.owner || import.meta.env.GITHUB_OWNER || '',
    repo: config?.repo || import.meta.env.GITHUB_CONTENT_REPO || '',
  };

  if (!githubConfig.token) throw new Error('GitHub token is required. Set GITHUB_TOKEN in .env');
  if (!githubConfig.owner) throw new Error('GitHub owner is required. Set GITHUB_OWNER in .env');
  if (!githubConfig.repo) throw new Error('GitHub repository is required. Set GITHUB_CONTENT_REPO in .env');

  return new GitHubAPI(githubConfig);
}

export function resetCache() {
  CACHE.clear();
}

export { GitHubAPI };
export type { GitHubConfig, GitHubApiOptions };