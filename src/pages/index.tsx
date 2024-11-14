import React, { useEffect, useState } from "react";
import { saveChat, getChats, getChat, deleteChat } from "@/lib/db";
import { ChatWindow, Sidebar } from "@/components";

interface Chat {
  id: string;
  title: string;
  messages: { role: string; content: string }[];
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      const storedChats = await getChats();
      setChats(storedChats);
    };

    fetchChats();
  }, []);

  const handleNewChat = async () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    await saveChat(newChat);
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleSelectChat = async (id: string) => {
    const chat = await getChat(id);
    if (chat) setActiveChatId(chat.id);
  };

  const handleSendMessage = async (message: string) => {
    if (!activeChatId) return;

    const activeChat = chats.find(chat => chat.id === activeChatId);

    if (!activeChat) {
      console.error("Active chat not found.");
      return;
    }

    // If it's the first message in the chat, update the title
    const isFirstMessage = activeChat.messages.length === 0;

    const updatedChat: Chat = {
      ...activeChat,
      title: isFirstMessage ? message.slice(0, 20) + "..." : activeChat.title,
      messages: [...activeChat.messages, { role: "user", content: message }],
    };

    // Update state and save to IndexedDB
    setChats(prev =>
      prev.map(chat => (chat.id === activeChatId ? updatedChat : chat))
    );

    await saveChat(updatedChat);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedChat.messages,
        }),
      });

      const data = await response.json();

      const finalChat: Chat = {
        ...updatedChat,
        messages: [
          ...updatedChat.messages,
          { role: "assistant", content: data.message },
        ],
      };

      // Save the updated chat to IndexedDB
      await saveChat(finalChat);

      // Update the state with the assistant's response
      setChats(prev =>
        prev.map(chat => (chat.id === activeChatId ? finalChat : chat))
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteChat = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this chat?"
    );
    if (!confirm) return;

    // Remove from IndexedDB
    await deleteChat(id);

    // Update state to remove chat
    setChats(prev => prev.filter(chat => chat.id !== id));

    // Clear active chat if it was deleted
    if (id === activeChatId) {
      setActiveChatId(null);
    }
  };

  const activeChat = chats.find(chat => chat.id === activeChatId);

  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chats.map(chat => ({ id: chat.id, title: chat.title }))}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex flex-1">
        {activeChat ? (
          <ChatWindow
            messages={activeChat.messages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p>Select or create a chat to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
