import { openDB, DBSchema } from "idb";

export interface ChatMessage {
  role: string;
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
}

interface ChatDB extends DBSchema {
  chats: {
    key: string; // Chat ID
    value: Chat;
  };
}

export const getDB = () => {
  return openDB<ChatDB>("ChatDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("chats")) {
        db.createObjectStore("chats", { keyPath: "id" });
      }
    },
  });
};

// IndexedDB operations
export const saveChat = async (chat: Chat) => {
  const db = await getDB();
  await db.put("chats", chat);
};

export const getChats = async () => {
  const db = await getDB();
  return db.getAll("chats");
};

export const getChat = async (id: string) => {
  const db = await getDB();
  return db.get("chats", id);
};

export const deleteChat = async (id: string) => {
  const db = await getDB();
  await db.delete("chats", id);
};
