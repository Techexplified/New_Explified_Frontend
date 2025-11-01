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
    <div className="fixed inset-0 z-[9999] overflow-scroll flex items-center justify-center backdrop-blur-sm">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={() => setShowIntegrationsModal(false)}
      />
      <div
        className={`relative w-full ${
          showProviderHelp ? "max-w-4xl" : "max-w-2xl"
        } mx-4 bg-white border border-gray-200 rounded-xl shadow-2xl p-6`}
      >
        <button
          aria-label="Close"
          onClick={() => setShowIntegrationsModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 z-10 p-1"
        >
          <FiX size={24} />
        </button>

        <h2 className="font-bold text-2xl mb-1 text-gray-900">Integrations</h2>
        <p className="text-gray-500 text-sm mb-4">
          Manage API keys, model versions, and active AI models.
        </p>

        {!selectedProviderId && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setIntegrationTab("my")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  integrationTab === "my"
                    ? "bg-gray-200 text-gray-900 border border-gray-300"
                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:text-gray-800"
                }`}
              >
                My Keys
              </button>

              <button
                onClick={() => setIntegrationTab("add")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  integrationTab === "add"
                    ? "bg-gray-200 text-gray-900 border border-gray-300"
                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:text-gray-800"
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
                className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-4 pr-12 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all duration-200"
              />
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
                    className="flex items-center justify-between  bg-gray-100 rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-xl">
                        {Icon}
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold text-sm group-hover:text-gray-800">
                          {p.name}
                        </h4>
                        <p className="text-gray-500 text-xs">{p.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!hasKey && (
                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded-lg flex items-center justify-center transition-all duration-200"
                          title="Premium"
                        >
                          <Lock className="text-gray-600" size={16} />
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
                                ? "bg-indigo-500"
                                : "bg-gray-300"
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
                            className="text-gray-600 hover:text-red-600 w-7 h-7 flex items-center justify-center  transition-all duration-200"
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
                    className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-2 transition-colors duration-200"
                    onClick={() => setSelectedProviderId(null)}
                  >
                    ← Back to Integrations
                  </button>

                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {Icon && (
                      <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-2xl">
                        {Icon}
                      </div>
                    )}
                    <div>
                      <h4 className="text-gray-900 text-lg font-semibold">
                        {provider?.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Configure your API key
                      </p>
                    </div>
                  </div>

                  <label className="block text-sm text-gray-700 mb-2 font-medium">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={selectedProviderKey}
                    onChange={(e) => setSelectedProviderKey(e.target.value)}
                    placeholder={`Enter ${provider?.name} API key`}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all duration-200"
                  />

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-4">
                        {Icon && (
                          <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-lg">
                            {Icon}
                          </div>
                        )}
                        <h5 className="text-gray-800 text-base font-semibold">
                          How to get a key for {provider?.name}
                        </h5>
                      </div>

                      <ol className="list-decimal list-inside text-sm text-gray-700 space-y-3 mb-4">
                        {(PROVIDER_HELP_STEPS[selectedProviderId] || []).map(
                          (step, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {step}
                            </li>
                          )
                        )}
                      </ol>
                      <div className="pt-3 border-t border-gray-200">
                        <a
                          href={PROVIDER_DOC_URL[selectedProviderId]}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center gap-1"
                        >
                          Open official documentation →
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200"
                      onClick={() =>
                        handleSaveProviderKey(selectedProviderId, false)
                      }
                    >
                      Save
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 text-gray-900 hover:bg-gray-300 transition-all duration-200"
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
