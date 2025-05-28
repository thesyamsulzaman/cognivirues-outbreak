import fs from "fs/promises";
import path from "path";

const DB_PATH = path.resolve("messages-db.json");

const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

export const addMetadata = (message) => ({
  ...message,
  id: generateId(),
  createdAt: new Date().toISOString(),
});

export const removeMetadata = (message) => {
  const { id, createdAt, ...rest } = message;
  return rest;
};

const defaultUserData = {
  messages: [],
  summary: "",
};

const readDb = async () => {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return {}; // Return empty object if DB not initialized
  }
};

const writeDb = async (data) => {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing to DB:", error);
    throw error;
  }
};

const ensureUserData = (db, userId) => {
  if (!db[userId]) {
    db[userId] = { ...defaultUserData };
  }
  return db;
};

export const clearMessages = async (userId) => {
  try {
    const db = await readDb();
    if (db[userId]) {
      delete db[userId]; // Completely remove the user's entry
      await writeDb(db);
    }
  } catch (error) {
    console.error("Error in clearMessages:", error);
    throw error;
  }
};

export const addMessages = async (userId, messages) => {
  try {
    const db = await readDb();
    ensureUserData(db, userId);

    db[userId].messages.push(...messages.map(addMetadata));

    // Optional background task if too many messages
    if (db[userId].messages.length >= 10) {
      // Handle background tasks here if needed
    }

    await writeDb(db);
  } catch (error) {
    console.error("Error in addMessages:", error);
    throw error;
  }
};

export const getMessages = async (userId) => {
  const db = await readDb();
  if (!db[userId]) return [];

  const messages = db[userId].messages.map(removeMetadata);
  const lastFive = messages.slice(-5);

  if (lastFive[0]?.role === "tool") {
    const sixthMessage = messages[messages.length - 6];
    return sixthMessage ? [sixthMessage, ...lastFive] : lastFive;
  }

  return lastFive;
};

export const getSummary = async (userId) => {
  const db = await readDb();
  return db[userId]?.summary ?? "";
};

export const saveToolResponse = async (userId, toolCallId, toolResponse) => {
  return addMessages(userId, [
    {
      role: "tool",
      content: toolResponse,
      tool_call_id: toolCallId,
    },
  ]);
};
