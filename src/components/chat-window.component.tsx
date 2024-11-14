import { FC, useState } from "react";

interface Message {
  role: string;
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export const ChatWindow: FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
}) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto p-4">
        {messages
          .filter(msg => msg.role !== "system") // Exclude system messages
          .map((msg, index) => (
            <div
              key={index}
              className={`p-2 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}>
              <span
                className={`inline-block p-2 rounded ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}>
                {msg.content}
              </span>
            </div>
          ))}
      </div>
      <div className="p-4">
        <div className="flex">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 border rounded p-2"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 ml-2 rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
