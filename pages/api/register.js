import { supabase } from "../../lib/supabaseClient";
import { sendVerificationEmail } from "../../lib/nodemailer";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, name, github_username } = req.body;
  const token = crypto.randomBytes(24).toString("hex");

  const { data, error } = await supabase.from("pending_users").insert([
    { email, name, github_username, token }
  ]);

  if (error) return res.status(400).json({ error });

  await sendVerificationEmail(email, token);
  res.status(200).json({ message: "Verification email sent" });
}
