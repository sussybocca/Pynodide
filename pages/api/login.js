import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  const { email } = req.body;
  const { data, error } = await supabase
    .from("auth.users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return res.status(404).json({ error: "User not found" });
  res.status(200).json({ user: data });
}
