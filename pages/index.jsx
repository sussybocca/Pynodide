import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Home() {
  const [email, setEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [code, setCode] = useState("<h1>Hello world!</h1>");
  const [published, setPublished] = useState(null);

  async function handlePublish() {
    const files = [
      { path: "index.html", content: code }
    ];
    const res = await axios.post("/api/upload-project", {
      userId: "your-user-id",
      projectName,
      files
    });
    setPublished(res.data.url);
  }

  return (
    <div>
      <Navbar />
      <h1>Host your project instantly</h1>
      <input
        placeholder="Project name"
        value={projectName}
        onChange={e => setProjectName(e.target.value)}
      />
      <textarea
        style={{ width: "100%", height: 300 }}
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button onClick={handlePublish}>Publish</button>

      {published && (
        <p>
          ✅ Published at: <a href={published}>{published}</a>
        </p>
      )}
    </div>
  );
}
