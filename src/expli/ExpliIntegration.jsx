import { useState } from "react";
import { Zap } from "lucide-react";
import IntegrationModal from "./IntegrationModal";
import { FaCodeBranch } from "react-icons/fa6";
import { useExpli } from "../context/ExpliContext";
import { FaPuzzlePiece } from "react-icons/fa";
import IntegrationModalPortal from "./IntegrationModalPortal";

function ExpliIntegration() {
  const {
    providerKeys,
    setProviderKeys,
    sidebarPinned,
    isSidebarOpen,
    setClosedChats,
    closedChats,
  } = useExpli();

  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);

  return (
    <>
      <div className="">
        <div
          className={`relative group ${
            sidebarPinned || isSidebarOpen ? "" : ""
          } `}
        >
          {/* Main button */}
          <button
            type="button"
            className="flex flex-col justify-center items-center text-gray-500 hover:text-[#23b5b5] py-3"
            title="Integrations"
            onClick={() => setShowIntegrationsModal(true)}
          >
            {/* <Zap className="w-6 h-6 drop-shadow-sm" /> */}
            <FaPuzzlePiece className="drop-shadow-sm" size={20} />
            <span className="text-[11px] mt-1">Integrate</span>
          </button>
        </div>
      </div>
      {/* {showIntegrationsModal && (
        <IntegrationModal
          providerKeys={providerKeys}
          setProviderKeys={setProviderKeys}
          setShowIntegrationsModal={setShowIntegrationsModal}
          setClosedChats={setClosedChats}
          closedChats={closedChats}
        />
      )} */}
      {showIntegrationsModal && (
        <IntegrationModalPortal
          providerKeys={providerKeys}
          setProviderKeys={setProviderKeys}
          setShowIntegrationsModal={setShowIntegrationsModal}
          setClosedChats={setClosedChats}
          closedChats={closedChats}
        />
      )}
    </>
  );
}

export default ExpliIntegration;
