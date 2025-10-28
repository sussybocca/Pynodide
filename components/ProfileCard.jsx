export default function ProjectCard({ project }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>
      <h3>{project.name}</h3>
      <a href={project.github_pages_url} target="_blank">
        Visit Site
      </a>
      <br />
      <a href={project.github_repo} target="_blank">
        GitHub Repo
      </a>
    </div>
  );
}
