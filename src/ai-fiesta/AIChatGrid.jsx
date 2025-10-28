import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatGrid from "./chat/ChatGrid";
import ModelPreferencesModal from "./ModelPreferencesModal";
import SettingsModal from "./SettingsModal";
import { aiModelDetails } from "./aiModelDetails";

export default function AIChatApp() {
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // Create a new chat — now each model has enabled: true by default
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      models: aiModelDetails.slice(0, 4).map((m) => ({
        id: m.id,
        name: m.name,
        icon: m.icon,
        enabled: true, // <-- default enabled
        messages: [
          { role: "bot", text: `👋 Hi, I’m ${m.name}. How can I assist you?` },
        ],
      })),
    };
    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

  // Select a chat
  const handleSelectChat = (id) => setActiveChatId(id);

  // Delete a chat
  const handleDeleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  // Toggle model enabled/disabled inside a chat
  const handleToggleModelEnabled = (chatId, modelId) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        return {
          ...chat,
          models: chat.models.map((m) =>
            m.id === modelId ? { ...m, enabled: !m.enabled } : m
          ),
        };
      })
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
            // Always append user's message to each model's message stream
            const updatedMessages = [...model.messages, { role: "user", text }];

            // If model is enabled -> append bot reply, otherwise don't
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

  // Mock AI replies
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

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar
        setModalOpen={setModalOpen}
        setSettingsOpen={setSettingsOpen}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        chats={chats}
      />

      <ChatGrid
        chat={activeChat}
        onSendMessage={handleSendMessage}
        onToggleModelEnabled={(modelId) =>
          handleToggleModelEnabled(activeChatId, modelId)
        }
      />

      <ModelPreferencesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdateModels={(enabledModels) => {
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
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
