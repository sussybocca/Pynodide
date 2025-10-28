export default function ProfileHeader({ name, github }) {
  return (
    <header style={{ marginBottom: 20 }}>
      <h1>{name}</h1>
      <p>GitHub: <a href={`https://github.com/${github}`}>{github}</a></p>
    </header>
  );
}
