import { useState } from "react";
import Editor from "@monaco-editor/react";
import JSZip from "jszip";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";

export default function CodeStudio() {
  const [files, setFiles] = useState({
    "index.html": "<h1>Hello from CodeStudio</h1>",
    "style.css": "body{font-family:sans-serif;background:#111;color:#eee}",
    "script.js": "console.log('ready')"
  });
  const [activeFile, setActiveFile] = useState("index.html");
  const [projectName, setProjectName] = useState("my-project");
  const [status, setStatus] = useState("");
  const [publishedUrl, setPublishedUrl] = useState(null);

  function updateFile(value) {
    setFiles({ ...files, [activeFile]: value });
  }

  async function handleDownload() {
    const zip = new JSZip();
    Object.entries(files).forEach(([path, content]) => zip.file(path, content));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName}.zip`;
    a.click();
  }

  /** ───── PUBLISH TO GITHUB PAGES ───── **/
  async function handlePublish() {
    try {
      setStatus("Publishing...");
      // 1️⃣  Get current signed-in user
      const {
        data: { user },
        error: userErr
      } = await supabase.auth.getUser();
      if (userErr || !user) throw new Error("Not logged in");

      // 2️⃣  Insert basic record (optional local save)
      await supabase.from("projects").insert({
        user_id: user.id,
        name: projectName
      });

      // 3️⃣  Push to GitHub via API route
      const res = await axios.post("/api/upload-project", {
        userId: user.id,
        projectName,
        files
      });

      setPublishedUrl(res.data.url);
      setStatus("✅ Published!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Publish failed: " + err.message);
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white p-3 space-y-2">
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
          className="w-full p-1 mb-3 text-black rounded"
        />

        {Object.keys(files).map((name) => (
          <button
            key={name}
            onClick={() => setActiveFile(name)}
            className={`block w-full text-left p-1 rounded ${
              activeFile === name ? "bg-zinc-700" : ""
            }`}
          >
            {name}
          </button>
        ))}

        <button
          onClick={() => {
            const name = prompt("New file name (e.g. utils.js)");
            if (name) setFiles({ ...files, [name]: "" });
          }}
          className="mt-4 text-sm bg-green-600 p-1 rounded w-full"
        >
          + New File
        </button>

        <button
          onClick={handleDownload}
          className="mt-2 text-sm bg-blue-600 p-1 rounded w-full"
        >
          ⬇ Export Zip
        </button>

        <button
          onClick={handlePublish}
          className="mt-4 text-sm bg-purple-600 p-1 rounded w-full"
        >
          🚀 Publish
        </button>

        <p className="mt-3 text-xs text-gray-300">{status}</p>

        {publishedUrl && (
          <a
            href={publishedUrl}
            target="_blank"
            className="block mt-2 text-xs text-blue-400 underline"
          >
            View Published Site
          </a>
        )}
      </aside>

      {/* Editor */}
      <main className="flex-1">
        <Editor
          height="100%"
          theme="vs-dark"
          path={activeFile}
          defaultLanguage="html"
          value={files[activeFile]}
          onChange={updateFile}
        />
      </main>
    </div>
  );
}
