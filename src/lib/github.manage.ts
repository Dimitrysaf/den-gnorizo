// src/lib/github.manage.ts

interface CommitOptions {
  token: string;
  owner: string; // Upstream Owner
  repo: string;  // Upstream Repo
  filePath: string;
  content: string;
  message: string;
  userLogin: string;
  branchName?: string; // Optional: specify a branch name
}

interface PROptions {
  token: string;
  owner: string;
  repo: string;
  userLogin: string;
  branchName: string;
  title: string;
  body: string;
}

const baseUrl = "https://api.github.com";

// Helper request function
async function req(url: string, method: string, token: string, body?: any) {
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/vnd.github+json",
    "Content-Type": "application/json"
  };
  const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "GitHub API Error");
  return json;
}

/**
 * Stage 1: Save changes to the User's Fork (Invisible Forking)
 * Returns the branch name used.
 */
export async function saveToFork(opts: CommitOptions) {
  const { token, owner, repo, filePath, content, message, userLogin } = opts;
  const branchName = opts.branchName || `patch-${Date.now()}`;

  // 1. Check/Create Fork
  try {
    await req(`${baseUrl}/repos/${userLogin}/${repo}`, 'GET', token);
  } catch (e) {
    console.log("Forking repository...");
    await req(`${baseUrl}/repos/${owner}/${repo}/forks`, 'POST', token);
    await new Promise(r => setTimeout(r, 4000)); // Wait for fork
  }

  // 2. Get latest SHA from Upstream Main to base our branch
  const upstreamRef = await req(`${baseUrl}/repos/${owner}/${repo}/git/ref/heads/main`, 'GET', token);
  const baseSha = upstreamRef.object.sha;

  // 3. Create Branch on User's Fork (if it doesn't exist)
  try {
    await req(`${baseUrl}/repos/${userLogin}/${repo}/git/refs`, 'POST', token, {
      ref: `refs/heads/${branchName}`,
      sha: baseSha
    });
  } catch (e) {
    // Branch might exist if updating draft, ignore
  }

  // 4. Get file SHA for update (if exists)
  let fileSha = undefined;
  try {
    const fileData = await req(`${baseUrl}/repos/${userLogin}/${repo}/contents/${filePath}?ref=${branchName}`, 'GET', token);
    fileSha = fileData.sha;
  } catch (e) { }

  // 5. Commit File
  const contentBase64 = Buffer.from(content).toString('base64');
  await req(`${baseUrl}/repos/${userLogin}/${repo}/contents/${filePath}`, 'PUT', token, {
    message: message,
    content: contentBase64,
    branch: branchName,
    sha: fileSha
  });

  return branchName;
}

/**
 * Stage 2: Create Pull Request from User's Fork Branch -> Upstream Main
 */
export async function createPR(opts: PROptions) {
  const { token, owner, repo, userLogin, branchName, title, body } = opts;

  const pr = await req(`${baseUrl}/repos/${owner}/${repo}/pulls`, 'POST', token, {
    title: title,
    body: body,
    head: `${userLogin}:${branchName}`,
    base: "main"
  });

  return pr;
}