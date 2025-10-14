import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import IntegrationModal from "./IntegrationModal";
import { FaCodeBranch } from "react-icons/fa6";

function ExpliIntegration({
  providerKeys,
  setProviderKeys,
  sidebarPinned,
  isSidebarOpen,
  setClosedChats,
}) {
  const [showIntegrationHint, setShowIntegrationHint] = useState(true);
  const [isHoveringIntegration, setIsHoveringIntegration] = useState(false);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => setShowIntegrationHint(false), 5000);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <div
          className={`relative group ${
            sidebarPinned || isSidebarOpen ? "" : ""
          } `}
          onMouseEnter={() => setIsHoveringIntegration(true)}
          onMouseLeave={() => setIsHoveringIntegration(false)}
        >
          {/* Animated tooltip */}
          {(showIntegrationHint || isHoveringIntegration) && (
            <div className="absolute -top-16 right-0 transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-2 fade-in-0">
              <div className="bg-black/95 backdrop-blur-sm border border-[#23b5b5]/30 text-white text-xs px-4 py-2 rounded-xl shadow-2xl whitespace-nowrap">
                <span className="text-[#23b5b5] font-medium">Integrate</span>{" "}
                your own API key
                {/* Animated tooltip arrow */}
                <div className="absolute -bottom-1 right-5 w-3 h-3 bg-black/95 rotate-45 border-r border-b border-[#23b5b5]/30 transform transition-transform duration-200" />
              </div>
            </div>
          )}

          {/* Main button */}
          <button
            type="button"
            className="p-2"
            title="Integrations"
            onClick={() => setShowIntegrationsModal(true)}
          >
            {/* <Zap className="w-6 h-6 drop-shadow-sm" /> */}
            <FaCodeBranch className="w-6 h-6 drop-shadow-sm" />
          </button>
        </div>
      </div>
      {showIntegrationsModal && (
        <IntegrationModal
          providerKeys={providerKeys}
          setProviderKeys={setProviderKeys}
          setShowIntegrationsModal={setShowIntegrationsModal}
          setClosedChats={setClosedChats}
        />
      )}
    </>
  );
}

export default ExpliIntegration;
