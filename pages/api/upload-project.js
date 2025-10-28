import { supabase } from "../../lib/supabaseClient";
import { createRepo, pushFilesToRepo, pagesUrl } from "../../lib/github";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { userId, projectName, files } = req.body;

  const { data: user } = await supabase
    .from("auth.users")
    .select("email, github_username")
    .eq("id", userId)
    .single();

  const repo = await createRepo(projectName);
  await pushFilesToRepo(user.github_username, repo.name, files);

  const url = pagesUrl(user.github_username, repo.name);

  await supabase.from("projects").insert({
    user_id: userId,
    name: projectName,
    github_repo: repo.html_url,
    github_pages_url: url
  });

  res.status(200).json({ url });
}
