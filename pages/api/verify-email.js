import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  const { token } = req.query;
  const { data, error } = await supabase
    .from("pending_users")
    .select("*")
    .eq("token", token)
    .single();

  if (!data || error) return res.status(400).send("Invalid token");

  await supabase.from("auth.users").insert({
    email: data.email,
    name: data.name,
    github_username: data.github_username
  });

  await supabase.from("pending_users").delete().eq("token", token);
  res.redirect("/?verified=true");
}
