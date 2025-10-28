import { supabase } from "../../lib/supabaseClient";
import Navbar from "../../components/Navbar";
import ProjectCard from "../../components/ProjectCard";

export default function Profile({ user, projects }) {
  return (
    <div>
      <Navbar />
      <h2>{user.name}'s Projects</h2>
      <div className="grid">
        {projects.map(p => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { username } = params;
  const { data: user } = await supabase
    .from("auth.users")
    .select("*")
    .eq("github_username", username)
    .single();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id);

  return { props: { user, projects } };
}
