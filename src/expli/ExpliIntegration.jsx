import { useEffect, useState } from "react";
import {
  INTEGRATION_PROVIDERS,
  PROVIDER_HELP_STEPS,
  PROVIDER_DOC_URL,
} from "../utils/data/TroneData";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import { Lock } from "lucide-react";
function ExpliIntegration({ providerKeys, setCurrentTool, setProviderKeys }) {
  const [showIntegrationHint, setShowIntegrationHint] = useState(true);
  const [isHoveringIntegration, setIsHoveringIntegration] = useState(false);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [integrationTab, setIntegrationTab] = useState("my"); // "my" | "add"
  const [integrationSearch, setIntegrationSearch] = useState("");

  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [selectedProviderKey, setSelectedProviderKey] = useState("");
  const [showProviderHelp, setShowProviderHelp] = useState(false);
  useEffect(() => {
    const timerId = setTimeout(() => setShowIntegrationHint(false), 5000);
    return () => clearTimeout(timerId);
  }, []);

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
  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <div
          className="relative"
          onMouseEnter={() => setIsHoveringIntegration(true)}
          onMouseLeave={() => setIsHoveringIntegration(false)}
        >
          {(showIntegrationHint || isHoveringIntegration) && (
            <div className="absolute -top-14 right-0 bg-[#191a1c] border border-[#2a2a2a] text-gray-200 text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              Integrate your own API key
              <div className="absolute -bottom-1 right-4 w-3 h-3 bg-[#191a1c] rotate-45 border-r border-b border-[#2a2a2a]" />
            </div>
          )}
          <button
            type="button"
            className="w-18 h-16 px-2 rounded-lg bg-[#191a1c] hover:bg-[#1f2023] border border-[#2a2a2a] text-gray-200 text-[10px] font-medium flex items-center justify-center shadow-lg"
            title="Integrations"
            onClick={() => setShowIntegrationsModal(true)}
          >
            Integrations
          </button>
        </div>
      </div>

      {showIntegrationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowIntegrationsModal(false)}
          />
          <div
            className={`relative w-full ${
              showProviderHelp ? "max-w-3xl" : "max-w-2xl"
            } mx-4 bg-[#111213] border border-[#0f8b8d]/50 rounded-xl shadow-2xl p-5`}
          >
            <button
              aria-label="Close"
              onClick={() => setShowIntegrationsModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <FiX />
            </button>
            <h3 className="text-white text-xl font-semibold text-center">
              Integrations
            </h3>

            {!selectedProviderId && (
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setIntegrationTab("my")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    integrationTab === "my"
                      ? "bg-teal-700 text-white"
                      : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                  }`}
                >
                  My key's
                </button>
                <button
                  onClick={() => setIntegrationTab("add")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    integrationTab === "add"
                      ? "bg-teal-700 text-white"
                      : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                  }`}
                >
                  Add Key's
                </button>
              </div>
            )}

            {!selectedProviderId && (
              <div className="mt-4 relative">
                <input
                  type="text"
                  value={integrationSearch}
                  onChange={(e) => setIntegrationSearch(e.target.value)}
                  placeholder="Search ..."
                  className="w-full bg-black/30 border border-[#2a2a2a] rounded-lg pl-3 pr-9 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            )}

            {!selectedProviderId && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
                {INTEGRATION_PROVIDERS.filter((p) => {
                  const matchesTab =
                    integrationTab === "my"
                      ? Boolean(providerKeys[p.id])
                      : true;
                  const q = integrationSearch.trim().toLowerCase();
                  const matchesQuery = p.name.toLowerCase().includes(q);
                  return matchesTab && matchesQuery;
                }).map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.id}
                      className="bg-[#23b5b5] bg-opacity-20 border border-teal-400 rounded-xl p-5 hover:bg-opacity-40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/30 relative group cursor-pointer"
                      onClick={() => handleOpenProvider(p.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                          {Icon && <Icon className="text-white" size={20} />}
                        </div>
                        <div className="flex">
                          {!(p.id === "openai" || p.id === "gemini") && (
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 transform hover:scale-110 shadow-lg"
                            >
                              <Lock className="text-yellow-400" size={20} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenProvider(p.id);
                              setCurrentTool(p.id);
                            }}
                            className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white transition-all duration-200 transform hover:scale-110 shadow-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-teal-300 transition-colors flex items-center gap-2">
                        {p.name}
                        {p.byok && (
                          <span className="bg-black text-white text-[10px] px-2 py-[2px] rounded-md border border-gray-500">
                            BYOK
                          </span>
                        )}
                      </h3>

                      <p className="text-gray-300 text-xs leading-relaxed mb-1">
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
                        className="text-xs text-gray-300 hover:text-white mb-4"
                        onClick={() => setSelectedProviderId(null)}
                      >
                        ← Back
                      </button>

                      <div className="flex items-center gap-2 mb-3">
                        {Icon && (
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center"
                            style={{ background: "#23b5b5" }}
                          >
                            <Icon className="text-black/80" size={18} />
                          </div>
                        )}
                        <h4 className="text-white text-base font-semibold">
                          {provider?.name}
                        </h4>
                      </div>

                      <label className="block text-xs text-gray-400 mb-1">
                        API Key
                      </label>
                      <input
                        type="text"
                        value={selectedProviderKey}
                        onChange={(e) => setSelectedProviderKey(e.target.value)}
                        placeholder={`Enter ${provider?.name} API key`}
                        className="w-full bg-black/30 border border-[#2a2a2a] rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-600"
                      />

                      <div className="mt-2 flex items-center justify-between">
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300"
                          onClick={() => setShowProviderHelp((v) => !v)}
                          aria-expanded={showProviderHelp}
                        >
                          <span>Don't have a key?</span>
                          <FiChevronDown
                            className={`transition-transform ${
                              showProviderHelp ? "rotate-180" : "rotate-0"
                            }`}
                            size={14}
                          />
                        </button>
                      </div>

                      <div
                        className={`mt-3 overflow-hidden transition-all duration-300 ease-in-out ${
                          showProviderHelp
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                        aria-hidden={!showProviderHelp}
                      >
                        <div className="border border-[#2a2a2a] rounded-lg p-3 bg-black/20">
                          <div className="flex items-center gap-2 mb-2">
                            {Icon && (
                              <div
                                className="w-6 h-6 rounded-md flex items-center justify-center"
                                style={{ background: "#23b5b5" }}
                              >
                                <Icon className="text-black/80" size={14} />
                              </div>
                            )}
                            <h5 className="text-white text-sm font-medium">
                              How to get a key for {provider?.name}
                            </h5>
                          </div>
                          <ol className="list-decimal list-inside text-sm text-gray-200 space-y-2">
                            {(
                              PROVIDER_HELP_STEPS[selectedProviderId] || []
                            ).map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                          <div className="mt-2">
                            <a
                              href={PROVIDER_DOC_URL[selectedProviderId]}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-teal-400 hover:text-teal-300"
                            >
                              Open official docs →
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          className="px-3 py-2 rounded-lg bg-[#191a1c] border border-[#2a2a2a] text-gray-200 hover:bg-[#1f2023]"
                          onClick={() =>
                            handleSaveProviderKey(selectedProviderId, false)
                          }
                        >
                          Save
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white"
                          onClick={() => {
                            handleSaveProviderKey(selectedProviderId, true);
                            setCurrentTool(selectedProviderId);
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
      )}
    </>
  );
}

export default ExpliIntegration;
