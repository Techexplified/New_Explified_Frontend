import React, { useState } from "react";
import {
  INTEGRATION_PROVIDERS,
  PROVIDER_HELP_STEPS,
  PROVIDER_DOC_URL,
} from "../utils/data/TroneData";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import { Lock, Plus, X } from "lucide-react";

function IntegrationModal({
  providerKeys,
  setProviderKeys,
  setShowIntegrationsModal,
  setClosedChats,
  closedChats,
}) {
  const [integrationTab, setIntegrationTab] = useState("my");
  const [integrationSearch, setIntegrationSearch] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [selectedProviderKey, setSelectedProviderKey] = useState("");
  const [showProviderHelp, setShowProviderHelp] = useState(false);

  async function verifyProviderKey(providerId, apiKey) {
    try {
      switch (providerId) {
        case "openai": {
          const res = await fetch("https://api.openai.com/v1/models", {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          return res.ok;
        }

        case "gemini": {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
          );
          return res.ok;
        }

        case "anthropic": {
          const res = await fetch("https://api.anthropic.com/v1/models", {
            headers: {
              "x-api-key": apiKey,
            },
          });
          return res.ok;
        }

        case "mistral": {
          const res = await fetch("https://api.mistral.ai/v1/models", {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          return res.ok;
        }

        case "cohere": {
          const res = await fetch("https://api.cohere.ai/v1/models", {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          return res.ok;
        }

        case "grok": {
          const res = await fetch("https://api.x.ai/v1/models", {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          return res.ok;
        }

        default:
          return false;
      }
    } catch (err) {
      console.error("Verification error:", err);
      return false;
    }
  }

  const handleOpenProvider = (providerId) => {
    setSelectedProviderId(providerId);
    const existing = providerKeys?.[providerId] || "";
    setSelectedProviderKey(existing);
    setShowProviderHelp(false);
  };

  const handleSaveProviderKey = async (providerId, useAfterSave = false) => {
    const isValid = await verifyProviderKey(providerId, selectedProviderKey);

    if (!isValid) {
      alert("❌ Invalid API key. Please check and try again.");
      return;
    }
    const next = { ...(providerKeys || {}), [providerId]: selectedProviderKey };
    try {
      localStorage.setItem("provider_keys", JSON.stringify(next));
    } catch (err) {
      console.log(err);
    }
    setProviderKeys(next);
    if (useAfterSave) {
      try {
        localStorage.setItem("active_provider", providerId);
      } catch (err) {
        console.log(err);
      }
    }
    setShowIntegrationsModal(false);
    setSelectedProviderId(null);
  };

  const handleRemoveProvider = (providerId) => {
    const next = { ...(providerKeys || {}), [providerId]: "" };
    try {
      localStorage.setItem("provider_keys", JSON.stringify(next));
    } catch (err) {
      console.log(err);
    }
    setProviderKeys(next);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80"
        onClick={() => setShowIntegrationsModal(false)}
      />
      <div
        className={`relative w-full
    ${showProviderHelp ? "max-w-4xl" : "max-w-2xl"}
    bg-gray-900 border border-gray-700 rounded-xl shadow-2xl
    p-4 sm:p-6
    max-h-[90vh] overflow-y-auto
  `}
      >
        <button
          aria-label="Close"
          onClick={() => setShowIntegrationsModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200 z-10 p-1"
        >
          <FiX size={24} />
        </button>

        <h2 className="font-bold text-2xl mb-1 text-white">Integrations</h2>
        <p className="text-gray-400 text-sm mb-4">
          Manage API keys, model versions, and active AI models.
        </p>

        {!selectedProviderId && (
          <>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              <button
                onClick={() => setIntegrationTab("my")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  integrationTab === "my"
                    ? "bg-gray-700 text-white border border-gray-600"
                    : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-gray-100"
                }`}
              >
                My Keys
              </button>

              <button
                onClick={() => setIntegrationTab("add")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  integrationTab === "add"
                    ? "bg-gray-700 text-white border border-gray-600"
                    : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-gray-100"
                }`}
              >
                Add Keys
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                value={integrationSearch}
                onChange={(e) => setIntegrationSearch(e.target.value)}
                placeholder="Search integrations..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-12 py-2.5 sm:py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all duration-200"
              />
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>

            <div className="space-y-2">
              {INTEGRATION_PROVIDERS.filter((p) => {
                const matchesTab =
                  integrationTab === "my" ? Boolean(providerKeys[p.id]) : true;
                const q = integrationSearch.trim().toLowerCase();
                const matchesQuery = p.name.toLowerCase().includes(q);
                return matchesTab && matchesQuery;
              }).map((p) => {
                const Icon = p.icon;
                const hasKey = Boolean(providerKeys[p.id]);
                console.log(p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => handleOpenProvider(p.id)}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-800 rounded-xl border border-gray-700 px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-700 border border-gray-600 flex items-center justify-center text-xl">
                        {Icon}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm group-hover:text-gray-100">
                          {p.name}
                        </h4>
                        <p className="text-gray-400 text-xs">{p.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={p.defaultModel ?? ""}
                          className="px-2 py-1 rounded-xl border border-gray-700 text-white bg-gray-800 shadow-sm appearance-none pr-6"
                        >
                          {p.dropdown?.map((model) => (
                            <option key={model} value={model}>
                              {model}
                            </option>
                          ))}
                        </select>

                        {/* Chevron */}
                        <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-sm" />
                      </div>

                      {!hasKey && (
                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg flex items-center justify-center transition-all duration-200"
                          title="Premium"
                        >
                          <Lock className="text-gray-400" size={16} />
                        </button>
                      )}

                      {integrationTab === "my" && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setClosedChats((prev) => ({
                                ...prev,
                                [p.id]: false,
                              }));
                            }}
                            className={`ml-2 w-10 h-5 flex items-center rounded-full transition-colors shadow ${
                              closedChats[p.id] === false
                                ? "bg-indigo-600"
                                : "bg-gray-600"
                            }`}
                            title="Toggle"
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                closedChats[p.id] === false
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                          {/* <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setClosedChats((prev) => ({
                                  ...prev,
                                  [p.id]: false,
                                }));
                              }}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 border ${
                                closedChats[p.id] === true
                                  ? "bg-green-100 border-green-300 text-green-600 hover:bg-green-200"
                                  : "bg-gray-200 hover:bg-gray-300 border-gray-300 text-gray-600"
                              }`}
                              title="Toggle"
                            >
                              <Plus size={15} />
                            </button> */}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveProvider(p.id);
                            }}
                            className="text-gray-400 hover:text-red-500 w-7 h-7 flex items-center justify-center  transition-all duration-200"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-5 py-2 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition shadow">
              Update preferences
            </button>
            <div className="w-full mt-3 flex flex-col items-center bg-gray-800 rounded-xl pt-3 border border-gray-700">
              <div className="font-semibold mb-1 text-white">
                Upgrade and Unlock Premium AI Models
              </div>
              <div className="text-xs text-gray-400 text-center">
                Access all six top AI models for just{" "}
                <span className="font-semibold">$12/month</span>.
              </div>
            </div>
          </>
        )}

        {selectedProviderId && (
          <div className="mt-6">
            {(() => {
              const provider = INTEGRATION_PROVIDERS.find(
                (p) => p.id === selectedProviderId
              );
              const Icon = provider?.icon;
              return (
                <div>
                  <button
                    className="text-sm text-gray-400 hover:text-gray-200 mb-6 flex items-center gap-2 transition-colors duration-200"
                    onClick={() => setSelectedProviderId(null)}
                  >
                    ← Back to Integrations
                  </button>

                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    {Icon && (
                      <div className="w-12 h-12 bg-gray-700 border border-gray-600 rounded-lg flex items-center justify-center text-2xl">
                        {Icon}
                      </div>
                    )}
                    <div>
                      <h4 className="text-white text-lg font-semibold">
                        {provider?.name}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Configure your API key
                      </p>
                    </div>
                  </div>

                  <label className="block text-sm text-gray-300 mb-2 font-medium">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={selectedProviderKey}
                    onChange={(e) => setSelectedProviderKey(e.target.value)}
                    placeholder={`Enter ${provider?.name} API key`}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all duration-200"
                  />

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors duration-200"
                      onClick={() => setShowProviderHelp((v) => !v)}
                      aria-expanded={showProviderHelp}
                    >
                      <span>Don't have a key?</span>
                      <FiChevronDown
                        className={`transition-transform duration-200 ${
                          showProviderHelp ? "rotate-180" : "rotate-0"
                        }`}
                        size={16}
                      />
                    </button>
                  </div>

                  <div
                    className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
                      showProviderHelp
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                    aria-hidden={!showProviderHelp}
                  >
                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                      <div className="flex items-center gap-3 mb-4">
                        {Icon && (
                          <div className="w-8 h-8 bg-gray-700 border border-gray-600 rounded-lg flex items-center justify-center text-lg">
                            {Icon}
                          </div>
                        )}
                        <h5 className="text-gray-100 text-base font-semibold">
                          How to get a key for {provider?.name}
                        </h5>
                      </div>

                      <ol className="list-decimal list-inside text-sm text-gray-300 space-y-3 mb-4">
                        {(PROVIDER_HELP_STEPS[selectedProviderId] || []).map(
                          (step, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {step}
                            </li>
                          )
                        )}
                      </ol>
                      <div className="pt-3 border-t border-gray-700">
                        <a
                          href={PROVIDER_DOC_URL[selectedProviderId]}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-gray-400 hover:text-gray-200 transition-colors duration-200 flex items-center gap-1"
                        >
                          Open official documentation →
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-all duration-200"
                      onClick={() =>
                        handleSaveProviderKey(selectedProviderId, false)
                      }
                    >
                      Save
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-black hover:bg-gray-100 transition-all duration-200"
                      onClick={() => {
                        handleSaveProviderKey(selectedProviderId, true);
                      }}
                    >
                      Save & Use
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default IntegrationModal;
