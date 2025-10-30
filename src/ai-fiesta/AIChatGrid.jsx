// AIChatApp.jsx
import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import ChatGrid from "./chat/ChatGrid";
import ModelPreferencesModal from "./ModelPreferencesModal";
import SettingsModal from "./SettingsModal";
import Discover from "./Discover";

import { aiModelDetails } from "./aiModelDetails";

export default function AIChatApp() {
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeSection, setActiveSection] = useState("home"); // "home" | "discover" | "integrate"
  // AIChatApp.jsx
  const [globalModelEnabled, setGlobalModelEnabled] = useState(() => {
    return aiModelDetails.reduce((acc, m) => {
      acc[m.id] = !m.locked; // default enabled (except premium)
      return acc;
    }, {});
  });

  // Create a new blank chat (all models default enabled true)
  const handleNewChat = useCallback(
    (presetModelId = null) => {
      const newChat = {
        id: Date.now(),
        title: `Chat ${chats.length + 1}`,
        models: aiModelDetails.slice(0, 4).map((m) => ({
          id: m.id,
          name: m.name,
          icon: m.icon,
          enabled: globalModelEnabled[m.id],
          messages: [
            {
              role: "bot",
              text: `👋 Hi, I’m ${m.name}. How can I assist you?`,
            },
          ],
        })),
      };
      setChats((prev) => [...prev, newChat]);
      setActiveChatId(newChat.id);
      setActiveSection("home");
    },
    [chats.length]
  );

  // Select chat
  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setActiveSection("home");
  };

  // Delete chat
  const handleDeleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  // Toggle model enabled/disabled in a specific chat
  const handleToggleModelEnabled = (chatId, modelId) => {
    // update global
    setGlobalModelEnabled((prev) => ({
      ...prev,
      [modelId]: !prev[modelId],
    }));

    // update all chats to remain consistent
    setChats((prev) =>
      prev.map((chat) => ({
        ...chat,
        models: chat.models.map((m) =>
          m.id === modelId ? { ...m, enabled: !m.enabled } : m
        ),
      }))
    );
  };

  // Send message -> only enabled models will respond
  const handleSendMessage = (text) => {
    if (!activeChatId || !text?.trim()) return;
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id !== activeChatId) return chat;
        return {
          ...chat,
          models: chat.models.map((model) => {
            const updatedMessages = [...model.messages, { role: "user", text }];
            if (model.enabled) {
              updatedMessages.push({
                role: "bot",
                text: getRandomResponse(model.name),
              });
            }
            return { ...model, messages: updatedMessages };
          }),
        };
      })
    );
  };

  // Small mocked responses for UI
  const getRandomResponse = (modelName) => {
    const replies = [
      `Here’s something interesting from ${modelName}.`,
      `${modelName} says: "That's a great question!"`,
      `${modelName} suggests checking recent data for clarity.`,
      `${modelName}: Let me summarize that for you.`,
      `${modelName} processed it and found 3 main insights.`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  // Keyboard shortcut: Ctrl+T to start a new chat
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "t") {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleNewChat]);

  return (
    <div className="flex h-screen bg-[#0E0E0E] text-white">
      <Sidebar
        setModalOpen={setModalOpen}
        setSettingsOpen={setSettingsOpen}
        onNewChat={() => handleNewChat()}
        onSelectChat={(id) => handleSelectChat(id)}
        onDeleteChat={(id) => handleDeleteChat(id)}
        chats={chats}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="flex-1 overflow-hidden">
        {/* Section switching */}
        {activeSection === "home" && (
          <ChatGrid
            chat={activeChat}
            onSendMessage={handleSendMessage}
            onToggleModelEnabled={(modelId) =>
              handleToggleModelEnabled(activeChatId, modelId)
            }
            onNewChat={() => handleNewChat()}
            chats={chats}
            onSelectChat={handleSelectChat}
          />
        )}

        {activeSection === "discover" && (
          <Discover
            models={aiModelDetails.slice(0, 6)} // pass models to show
            onTryModel={(modelId) => handleNewChat(modelId)}
          />
        )}

        {activeSection === "integrate" && <IntegrateGrid />}
      </main>

      <ModelPreferencesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        // keep your prior onUpdateModels behaviour if needed
        onUpdateModels={(enabledModels) => {
          // replace models inside every chat with enabledModels set
          setChats((prev) =>
            prev.map((chat) => ({
              ...chat,
              models: enabledModels.map((m) => ({
                id: m.id,
                name: m.name,
                icon: m.icon,
                enabled: true,
                messages: [
                  {
                    role: "bot",
                    text: `👋 Hi, I’m ${m.name}. How can I assist you?`,
                  },
                ],
              })),
            }))
          );
        }}
        globalModelEnabled={globalModelEnabled}
        setGlobalModelEnabled={setGlobalModelEnabled}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
