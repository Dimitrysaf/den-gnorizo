// src/pages/api/github/[...endpoint].ts
// API endpoint for proxying GitHub API requests

import type { APIRoute } from 'astro';
import { createGitHubAPI } from '../../../lib/github.fetch';

// Make this a server-rendered endpoint
export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const github = createGitHubAPI();
    const endpoint = params.endpoint || '';
    const url = new URL(request.url);
    
    let data;

    // Route to different GitHub API methods based on the endpoint
    switch (endpoint) {
      // Repository
      case 'repository':
        data = await github.getRepository();
        break;

      case 'repositories':
        data = await github.listRepositories();
        break;

      // Branches
      case 'branches':
        data = await github.listBranches();
        break;

      case 'branch':
        const branchName = url.searchParams.get('name');
        if (!branchName) {
          return new Response(
            JSON.stringify({ error: 'Branch name is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        data = await github.getBranch(branchName);
        break;

      // Commits
      case 'commits':
        const commitOptions = {
          sha: url.searchParams.get('sha') || undefined,
          path: url.searchParams.get('path') || undefined,
          author: url.searchParams.get('author') || undefined,
          since: url.searchParams.get('since') || undefined,
          until: url.searchParams.get('until') || undefined,
          per_page: url.searchParams.get('per_page') ? parseInt(url.searchParams.get('per_page')!) : undefined,
          page: url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined,
        };
        data = await github.listCommits(commitOptions);
        break;

      case 'commit':
        const sha = url.searchParams.get('sha');
        if (!sha) {
          return new Response(
            JSON.stringify({ error: 'Commit SHA is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        data = await github.getCommit(sha);
        break;

      // Contents
      case 'contents':
        const path = url.searchParams.get('path') || '';
        const ref = url.searchParams.get('ref') || undefined;
        data = await github.getContents(path, ref);
        break;

      case 'file':
        const filePath = url.searchParams.get('path');
        const fileRef = url.searchParams.get('ref') || undefined;
        if (!filePath) {
          return new Response(
            JSON.stringify({ error: 'File path is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        data = await github.getFileContent(filePath, fileRef);
        // Return as plain text for file content
        return new Response(data, {
          status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

      case 'directory':
        const dirPath = url.searchParams.get('path') || '';
        const dirRef = url.searchParams.get('ref') || undefined;
        data = await github.listDirectory(dirPath, dirRef);
        break;

      // Trees
      case 'tree':
        const treeSha = url.searchParams.get('sha');
        const recursive = url.searchParams.get('recursive') === 'true';
        if (!treeSha) {
          return new Response(
            JSON.stringify({ error: 'Tree SHA is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        data = await github.getTree(treeSha, recursive);
        break;

      // Discussions
      case 'discussions':
        data = await github.listDiscussions();
        break;

      case 'discussion':
        const discussionNumber = url.searchParams.get('number');
        if (!discussionNumber) {
          return new Response(
            JSON.stringify({ error: 'Discussion number is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        data = await github.getDiscussion(parseInt(discussionNumber));
        break;

      case 'discussion-comments':
        const discNum = url.searchParams.get('number');
        if (!discNum) {
          return new Response(
            JSON.stringify({ error: 'Discussion number is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        data = await github.listDiscussionComments(parseInt(discNum));
        break;

      // Issues
      case 'issues':
        const issueOptions = {
          state: url.searchParams.get('state') as 'open' | 'closed' | 'all' | undefined,
          labels: url.searchParams.get('labels') || undefined,
          sort: url.searchParams.get('sort') as 'created' | 'updated' | 'comments' | undefined,
          direction: url.searchParams.get('direction') as 'asc' | 'desc' | undefined,
          since: url.searchParams.get('since') || undefined,
          per_page: url.searchParams.get('per_page') ? parseInt(url.searchParams.get('per_page')!) : undefined,
          page: url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined,
        };
        data = await github.listIssues(issueOptions);
        break;

      case 'issue':
        const issueNumber = url.searchParams.get('number');
        if (!issueNumber) {
          return new Response(
            JSON.stringify({ error: 'Issue number is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        data = await github.getIssue(parseInt(issueNumber));
        break;

      case 'issue-comments':
        const issueNum = url.searchParams.get('number');
        if (!issueNum) {
          return new Response(
            JSON.stringify({ error: 'Issue number is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        data = await github.listIssueComments(parseInt(issueNum));
        break;

      // Pull Requests
      case 'pulls':
        const prOptions = {
          state: url.searchParams.get('state') as 'open' | 'closed' | 'all' | undefined,
          head: url.searchParams.get('head') || undefined,
          base: url.searchParams.get('base') || undefined,
          sort: url.searchParams.get('sort') as 'created' | 'updated' | 'popularity' | 'long-running' | undefined,
          direction: url.searchParams.get('direction') as 'asc' | 'desc' | undefined,
          per_page: url.searchParams.get('per_page') ? parseInt(url.searchParams.get('per_page')!) : undefined,
          page: url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined,
        };
        data = await github.listPullRequests(prOptions);
        break;

      case 'pull':
        const prNumber = url.searchParams.get('number');
        if (!prNumber) {
          return new Response(
            JSON.stringify({ error: 'Pull request number is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        data = await github.getPullRequest(parseInt(prNumber));
        break;

      case 'pull-files':
        const prNum = url.searchParams.get('number');
        if (!prNum) {
          return new Response(
            JSON.stringify({ error: 'Pull request number is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        data = await github.listPullRequestFiles(parseInt(prNum));
        break;

      // Releases
      case 'releases':
        data = await github.listReleases();
        break;

      case 'latest-release':
        data = await github.getLatestRelease();
        break;

      case 'release':
        const tag = url.searchParams.get('tag');
        if (!tag) {
          return new Response(
            JSON.stringify({ error: 'Release tag is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        data = await github.getReleaseByTag(tag);
        break;

      // Tags
      case 'tags':
        data = await github.listTags();
        break;

      // Search
      case 'search':
        const query = url.searchParams.get('q');
        if (!query) {
          return new Response(
            JSON.stringify({ error: 'Search query is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        data = await github.searchCode(query);
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown endpoint' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('GitHub API error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};