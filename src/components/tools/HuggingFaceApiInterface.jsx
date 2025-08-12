import React, { useEffect, useMemo, useState } from "react";

const LOCAL_STORAGE_KEY = "huggingface_api_token";

function HuggingFaceApiInterface({ onSave, setShowApiInterface }) {
  const [token, setToken] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  useEffect(() => {
    const existing = window.localStorage.getItem(LOCAL_STORAGE_KEY) || "";
    if (existing) setToken(existing);
  }, []);

  const isTokenPresent = useMemo(() => token.trim().length > 0, [token]);

  function handleSave() {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, token.trim());
    setIsSaved(true);
    if (typeof onSave === "function") onSave(token.trim());
    setTimeout(() => setIsSaved(false), 1500);
    setShowApiInterface(false);
  }

  function handleClear() {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    setToken("");
  }

  return (
    <div className="max-w-sm w-full mx-auto my-3 p-4 border border-neutral-800 rounded-lg bg-neutral-900 shadow-sm text-white">
      <div className="mb-2 font-semibold text-sm text-white">
        Hugging Face API Token
      </div>

      <div className="flex items-center gap-2 mb-2">
        <input
          className="flex-1 px-3 py-2 border border-neutral-700 rounded-md text-sm bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          type={showToken ? "text" : "password"}
          placeholder="hf_********************************"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          autoComplete="off"
        />
        <button
          className="px-3 py-2 border border-neutral-700 rounded-md text-sm bg-neutral-800 text-white hover:bg-neutral-700"
          onClick={() => setShowToken((v) => !v)}
        >
          {showToken ? "Hide" : "Show"}
        </button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <button
            className={`px-3 py-2 rounded-md border text-sm transition disabled:opacity-60 disabled:cursor-not-allowed ${
              isTokenPresent
                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                : "bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700"
            }`}
            onClick={handleSave}
            disabled={!isTokenPresent}
            title={!isTokenPresent ? "Enter a token to save" : "Save token"}
          >
            Save
          </button>
          <button
            className="px-3 py-2 rounded-md border text-sm bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleClear}
            disabled={!isTokenPresent}
          >
            Clear
          </button>
        </div>
        {isSaved && <span className="text-emerald-400 text-xs">Saved</span>}
      </div>

      <div>
        <button
          className="w-full px-3 py-2 rounded-md border text-sm bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700"
          onClick={() => setShowHowTo((v) => !v)}
          aria-expanded={showHowTo}
        >
          {showHowTo ? "Hide: How to get your token" : "How to get your token"}
        </button>

        {showHowTo && (
          <div className="mt-2 text-sm leading-6 text-white">
            <ol className="pl-5 m-0 list-decimal">
              <li>
                Open the Hugging Face token settings:{" "}
                <a
                  href="https://huggingface.co/settings/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  huggingface.co/settings/tokens
                </a>
              </li>
              <li>Sign in or create a free account if prompted.</li>
              <li>
                Click "New token", give it a name, and choose permission (Read
                is enough for most use-cases).
              </li>
              <li>
                Create the token and copy it. It starts with <code>hf_</code>.
              </li>
              <li>Paste it above and click Save.</li>
            </ol>
            <div className="mt-2 text-xs text-gray-400">
              Tip: Keep your token private. It will be stored locally on your
              device.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HuggingFaceApiInterface;
