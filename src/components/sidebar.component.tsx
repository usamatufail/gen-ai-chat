import { FC } from "react";

interface SidebarProps {
  chats: { id: string; title: string }[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <button
        onClick={onNewChat}
        className="bg-blue-600 hover:bg-blue-700 p-3 text-center">
        + New Chat
      </button>
      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`flex justify-between items-center p-3 ${
              activeChatId === chat.id ? "bg-gray-700" : "hover:bg-gray-700"
            }`}>
            <div
              onClick={() => onSelectChat(chat.id)}
              className="cursor-pointer flex-1">
              {chat.title}
            </div>
            <button
              onClick={() => onDeleteChat(chat.id)}
              className="text-red-500 hover:text-red-700 ml-2">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
