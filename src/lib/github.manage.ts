// src/lib/github.manage.ts

interface CommitOptions {
  token: string;      // User's OAuth Token
  owner: string;      // Content Owner (Upstream)
  repo: string;       // Content Repo (Upstream)
  filePath: string;   // File to edit (e.g. "metadata.json" or "article.md")
  content: string;    // New content
  message: string;    // Commit message
  userLogin: string;  // The logged-in user's username
}

export async function proposeChange(opts: CommitOptions) {
  const { token, owner, repo, filePath, content, message, userLogin } = opts;
  const baseUrl = "https://api.github.com";
  
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/vnd.github+json",
    "Content-Type": "application/json"
  };

  // Helper for requests
  const req = async (url: string, method: string, body?: any) => {
    const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "GitHub API Error");
    return json;
  };

  try {
    // 1. Check if User has a Fork
    // We check if a repo named {repo} exists under {userLogin}
    let fork = null;
    try {
        fork = await req(`${baseUrl}/repos/${userLogin}/${repo}`, 'GET');
    } catch (e) {
        // 404 means no fork exists. Create it.
        console.log("Forking repository...");
        fork = await req(`${baseUrl}/repos/${owner}/${repo}/forks`, 'POST');
        // Wait a bit for the fork to be ready
        await new Promise(r => setTimeout(r, 3000)); 
    }

    // 2. Get latest SHA from Upstream Main
    // We base our branch off the UPSTREAM main to be up to date
    const upstreamRef = await req(`${baseUrl}/repos/${owner}/${repo}/git/ref/heads/main`, 'GET');
    const baseSha = upstreamRef.object.sha;

    // 3. Create a Branch on User's Fork
    const branchName = `patch-${Date.now()}`;
    await req(`${baseUrl}/repos/${userLogin}/${repo}/git/refs`, 'POST', {
        ref: `refs/heads/${branchName}`,
        sha: baseSha
    });

    // 4. Get the file's current SHA (blob) from the Fork (required for update)
    // If it's a new file, this might fail, handled by not sending sha
    let fileSha = undefined;
    try {
        const fileData = await req(`${baseUrl}/repos/${userLogin}/${repo}/contents/${filePath}?ref=${branchName}`, 'GET');
        fileSha = fileData.sha;
    } catch (e) { /* File might be new */ }

    // 5. Update/Create the File (Commit)
    // Content must be Base64 encoded
    const contentBase64 = Buffer.from(content).toString('base64');
    
    await req(`${baseUrl}/repos/${userLogin}/${repo}/contents/${filePath}`, 'PUT', {
        message: message,
        content: contentBase64,
        branch: branchName,
        sha: fileSha // Only needed if updating
    });

    // 6. Create Pull Request
    // Head format: "username:branch"
    const pr = await req(`${baseUrl}/repos/${owner}/${repo}/pulls`, 'POST', {
        title: message,
        body: `Πρόταση αλλαγής από τον χρήστη @${userLogin}.`,
        head: `${userLogin}:${branchName}`,
        base: "main"
    });

    return pr;

  } catch (error) {
    console.error("Propose Change Error:", error);
    throw error;
  }
}