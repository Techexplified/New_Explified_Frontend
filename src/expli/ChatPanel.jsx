import React from "react";
import { useExpli } from "../context/ExpliContext";
import ChatContainer from "./ChatContainer";
import ExpliInput from "./ExpliInput";
import { FaPlus } from "react-icons/fa6";
import { AiOutlineOpenAI } from "react-icons/ai";
import { RiGeminiLine } from "react-icons/ri";
import GeminiLogo from "../assets/logos/gemini.png";
import ChatGPT from "../assets/logos/openai.png";
import { ExpliLogo } from "../assets";

export default function ChatPanel() {
  const {
    currentMessages,
    currentMessagesOpenAI,
    currentMessagesGemini,
    isTyping,
    enabledProviders,
    setEnabledProviders,
    onlyExpliOpen,
    prompt,
    handleInputChange,
    handleSubmit,
    handlePaste,
    handleMicClick,
    isRecording,
    isSidebarOpen,
    sidebarPinned,
    chatNotPresent,
    closedChats,
    setClosedChats,
    providerKeys,
    sessionId,
  } = useExpli();

  return (
    <div className="w-full flex-1 bg-black/95 backdrop-blur-xl flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[120px] -right-[120px] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(35,181,181,0.10)_0%,transparent_70%)]" />
        <div className="absolute -bottom-[180px] -left-[120px] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="flex divide-x divide-gray-800/40 flex-1 overflow-x-auto overflow-y-hidden flex-nowrap [&>*]:min-w-[350px] relative z-10">
        <ChatContainer
          messages={currentMessages}
          isTyping={isTyping.expli}
          toolName="Expli"
          icon={<FaPlus />}
          logo={ExpliLogo}
          enabled={enabledProviders.expli}
          setEnabled={(val) =>
            setEnabledProviders((prev) => ({ ...prev, expli: val }))
          }
          onlyExpliOpen={onlyExpliOpen}
          sessionId={sessionId}
        />

        {providerKeys?.openai && !closedChats.openai && (
          <ChatContainer
            messages={currentMessagesOpenAI}
            isTyping={isTyping.openai}
            toolName="OpenAI"
            pid="openai"
            icon={<AiOutlineOpenAI />}
            logo={ChatGPT}
            enabled={enabledProviders.openai}
            setEnabled={(val) =>
              setEnabledProviders((prev) => ({ ...prev, openai: val }))
            }
            handleCloseChat={(pid) =>
              setClosedChats((prev) => ({ ...prev, [pid]: true }))
            }
            sessionId={sessionId}
          />
        )}

        {providerKeys?.gemini && !closedChats.gemini && (
          <ChatContainer
            messages={currentMessagesGemini}
            isTyping={isTyping.gemini}
            toolName="Gemini"
            pid="gemini"
            icon={<RiGeminiLine />}
            logo={GeminiLogo}
            enabled={enabledProviders.gemini}
            setEnabled={(val) =>
              setEnabledProviders((prev) => ({ ...prev, gemini: val }))
            }
            handleCloseChat={(pid) =>
              setClosedChats((prev) => ({ ...prev, [pid]: true }))
            }
            sessionId={sessionId}
          />
        )}
      </div>

      <ExpliInput
        prompt={prompt}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handlePaste={handlePaste}
        isTyping={isTyping.expli}
        handleMicClick={handleMicClick}
        isRecording={isRecording}
        isSidebarOpen={isSidebarOpen}
        sidebarPinned={sidebarPinned}
        onlyExpliOpen={onlyExpliOpen}
        chatNotPresent={chatNotPresent}
      />
    </div>
  );
}
