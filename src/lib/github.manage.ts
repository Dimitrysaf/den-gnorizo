interface CommitOptions {
  token: string;
  owner: string;      // Upstream Owner
  repo: string;       // Upstream Repo
  filePath: string;
  content: string;
  message: string;
  userLogin: string;
  branchName?: string;
}

const baseUrl = "https://api.github.com";

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

// Logic to Fork -> Branch -> Commit
export async function saveToFork(opts: CommitOptions) {
  const { token, owner, repo, filePath, content, message, userLogin } = opts;
  // Use existing branch name if provided, else create new timestamped branch
  const branchName = opts.branchName || `patch-${Date.now()}`;

  // 1. Check if User has a Fork
  try {
    await req(`${baseUrl}/repos/${userLogin}/${repo}`, 'GET', token);
  } catch (e) {
    // 404 means no fork. Create it.
    await req(`${baseUrl}/repos/${owner}/${repo}/forks`, 'POST', token);
    // Wait for GitHub to copy the repo
    await new Promise(r => setTimeout(r, 4000));
  }

  // 2. Get latest SHA from Upstream Main
  const upstreamRef = await req(`${baseUrl}/repos/${owner}/${repo}/git/ref/heads/main`, 'GET', token);
  const baseSha = upstreamRef.object.sha;

  // 3. Create/Check Branch on User's Fork
  try {
    // Try to create branch from upstream base
    await req(`${baseUrl}/repos/${userLogin}/${repo}/git/refs`, 'POST', token, {
      ref: `refs/heads/${branchName}`,
      sha: baseSha
    });
  } catch (e) {
    // Branch might exist if we are updating an existing draft. Ignore error.
  }

  // 4. Get file SHA (if file exists in fork) to allow update
  let fileSha = undefined;
  try {
    const fileData = await req(`${baseUrl}/repos/${userLogin}/${repo}/contents/${filePath}?ref=${branchName}`, 'GET', token);
    fileSha = fileData.sha;
  } catch (e) {
    // File doesn't exist yet, that's fine
  }

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