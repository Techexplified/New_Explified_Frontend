import React, { useState } from "react";
import {
  INTEGRATION_PROVIDERS,
  PROVIDER_HELP_STEPS,
  PROVIDER_DOC_URL,
} from "../utils/data/TroneData";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import { Lock } from "lucide-react";

function IntegrationModal({
  providerKeys,
  setProviderKeys,
  setShowIntegrationsModal,
}) {
  const [integrationTab, setIntegrationTab] = useState("my"); // "my" | "add"
  const [integrationSearch, setIntegrationSearch] = useState("");

  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [selectedProviderKey, setSelectedProviderKey] = useState("");
  const [showProviderHelp, setShowProviderHelp] = useState(false);
  const handleOpenProvider = (providerId) => {
    setSelectedProviderId(providerId);
    const existing = providerKeys?.[providerId] || "";
    setSelectedProviderKey(existing);
    setShowProviderHelp(false);
  };

  const handleSaveProviderKey = (providerId, useAfterSave = false) => {
    const next = { ...(providerKeys || {}), [providerId]: selectedProviderKey };
    try {
      localStorage.setItem("provider_keys", JSON.stringify(next));
    } catch (err) {
      console.log(err);
    }
    setProviderKeys(next);
    if (useAfterSave) {
      // optionally you can set active provider here if used elsewhere
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
    <div className="fixed inset-0 z-[9999]  flex items-center justify-center backdrop-blur-sm">
      <div
        className="absolute inset-0 bg-gray-900/80"
        onClick={() => setShowIntegrationsModal(false)}
      />
      <div
        className={`relative w-full ${
          showProviderHelp ? "max-w-3xl" : "max-w-2xl"
        } mx-4 bg-gray-900/95 border border-teal-500/40 rounded-2xl shadow-2xl shadow-teal-500/10 p-6`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-teal-400/5 rounded-2xl pointer-events-none"></div>
        <button
          aria-label="Close"
          onClick={() => setShowIntegrationsModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-teal-300 transition-colors duration-200 z-10"
        >
          <FiX size={24} />
        </button>
        <h3 className="text-white text-2xl font-bold text-center mb-6 bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
          Integrations
        </h3>

        {!selectedProviderId && (
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setIntegrationTab("my")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                integrationTab === "my"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/60 shadow-lg shadow-teal-500/20"
                  : "bg-gray-800/50 text-gray-400 border border-gray-600/70 hover:bg-gray-800/80 hover:text-gray-300 hover:border-gray-500/80"
              }`}
            >
              My Keys
            </button>
            <button
              onClick={() => setIntegrationTab("add")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                integrationTab === "add"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/60 shadow-lg shadow-teal-500/20"
                  : "bg-gray-800/50 text-gray-400 border border-gray-600/70 hover:bg-gray-800/80 hover:text-gray-300 hover:border-gray-500/80"
              }`}
            >
              Add Keys
            </button>
          </div>
        )}

        {!selectedProviderId && (
          <div className="relative mb-6">
            <input
              type="text"
              value={integrationSearch}
              onChange={(e) => setIntegrationSearch(e.target.value)}
              placeholder="Search integrations..."
              className="w-full bg-gray-800/30 border border-gray-600/70 rounded-xl pl-4 pr-12 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500/70 transition-all duration-200"
            />
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        )}

        {!selectedProviderId && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {INTEGRATION_PROVIDERS.filter((p) => {
              const matchesTab =
                integrationTab === "my" ? Boolean(providerKeys[p.id]) : true;
              const q = integrationSearch.trim().toLowerCase();
              const matchesQuery = p.name.toLowerCase().includes(q);
              return matchesTab && matchesQuery;
            }).map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className="bg-gray-800/40 backdrop-blur-sm border border-gray-600/70 rounded-2xl p-4 hover:bg-gray-800/60 hover:border-teal-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/20 relative group cursor-pointer"
                  onClick={() => handleOpenProvider(p.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400/20 to-teal-600/20 border border-teal-500/50 rounded-xl flex items-center justify-center text-teal-300 text-xl shadow-lg group-hover:scale-105 group-hover:border-teal-400/70 transition-all duration-200">
                      {Icon}
                    </div>
                    <div className="flex gap-2">
                      {!(p.id === "openai" || p.id === "gemini") && (
                        <button
                          type="button"
                          className="w-8 h-8 bg-amber-500/20 border border-amber-500/60 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 hover:bg-amber-500/30"
                        >
                          <Lock className="text-amber-400" size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProvider(p.id);
                        }}
                        className="w-8 h-8 bg-teal-500/20 border border-teal-500/60 rounded-xl flex items-center justify-center text-teal-300 transition-all duration-200 transform hover:scale-105 hover:bg-teal-500/30 hover:border-teal-400/80"
                      >
                        +
                      </button>

                      {/* X button visible only when integrationTab === "my" */}
                      {integrationTab === "my" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProvider(p.id);
                          }}
                          className="w-8 h-8 bg-red-500/20 border border-red-500/60 rounded-xl flex items-center justify-center text-red-400 transition-all duration-200 transform hover:scale-105 hover:bg-red-500/30 hover:border-red-400/80"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-teal-300 transition-colors flex items-center gap-2">
                    {p.name}
                    {p.byok && (
                      <span className="bg-gray-700/50 text-teal-300 text-[10px] px-2 py-1 rounded-lg border border-teal-500/50 font-medium">
                        BYOK
                      </span>
                    )}
                  </h3>

                  <p className="text-gray-400 text-xs leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
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
                    className="text-sm text-gray-400 hover:text-teal-300 mb-6 flex items-center gap-2 transition-colors duration-200"
                    onClick={() => setSelectedProviderId(null)}
                  >
                    ← Back to Integrations
                  </button>

                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-600/70">
                    {Icon && (
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400/20 to-teal-600/20 border border-teal-500/50 rounded-xl flex items-center justify-center text-teal-300 text-xl">
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
                    className="w-full bg-gray-800/30 border border-gray-600/70 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500/70 transition-all duration-200"
                  />

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-300 transition-colors duration-200"
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
                    <div className="border border-gray-600/70 rounded-xl p-4 bg-gray-800/30 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                        {Icon && (
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-400/20 to-teal-600/20 border border-teal-500/50 rounded-lg flex items-center justify-center text-teal-300">
                            {Icon}
                          </div>
                        )}
                        <h5 className="text-white text-base font-semibold">
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
                      <div className="pt-3 border-t border-gray-600/70">
                        <a
                          href={PROVIDER_DOC_URL[selectedProviderId]}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-teal-400 hover:text-teal-300 transition-colors duration-200 flex items-center gap-1"
                        >
                          Open official documentation →
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      className="px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-600/70 text-gray-300 hover:bg-gray-800/80 hover:text-white hover:border-gray-500/80 transition-all duration-200"
                      onClick={() =>
                        handleSaveProviderKey(selectedProviderId, false)
                      }
                    >
                      Save
                    </button>
                    <button
                      className="px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-500/60 text-teal-300 hover:bg-teal-500/30 hover:border-teal-400/80 hover:text-teal-200 transition-all duration-200 shadow-lg shadow-teal-500/20"
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
