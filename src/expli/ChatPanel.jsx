// src/components/expli/ChatPanel.jsx
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
    // setCurrentMessages,
    // setCurrentMessagesOpenAI,
    // setCurrentMessagesGemini,
    closedChats,
    setClosedChats,
    providerKeys,
  } = useExpli();

  return (
    <div className="w-full flex-1 border border-cyan-500/20 shadow-[...] bg-black flex flex-col gap-4 relative backdrop-blur-xl">
      <div className="flex divide-x-1  divide-gray-700 flex-1 overflow-x-auto overflow-y-hidden flex-nowrap [&>*]:min-w-[350px]">
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
