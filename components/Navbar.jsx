import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b bg-zinc-900 text-white flex items-center justify-between p-4">
      <h1 className="text-lg font-bold">MyHost</h1>
      <nav className="space-x-4">
        <Link href="/">Editor</Link>
        <Link href="/explore">Explore</Link>
        <Link href="/profile/me">Profile</Link>
      </nav>
    </header>
  );
}
