import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotePage() {
  const { id } = useParams();
  const [note, setNote] = useState("");

  useEffect(() => {
    const savedNote = localStorage.getItem(`note-${id}`);
    if (savedNote) {
      setNote(savedNote);
    } else {
      setNote("❌ Note not found or has been deleted.");
    }
  }, [id]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Shared Note</h1>
      <p className="whitespace-pre-wrap">{note}</p>
    </div>
  );
}
