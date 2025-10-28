import { Octokit } from "@octokit/rest";
const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

export async function createRepo(projectName) {
  const { data } = await octokit.repos.createForAuthenticatedUser({
    name: projectName,
    private: false
  });
  return data;
}

export async function pushFilesToRepo(owner, repo, files) {
  for (const file of files) {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: file.path,
      message: `add ${file.path}`,
      content: Buffer.from(file.content).toString("base64")
    });
  }
}

export function pagesUrl(owner, repo) {
  return `https://${owner}.github.io/${repo}`;
}
