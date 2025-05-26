import fs from "fs/promises";
import path from "path";

const DB_PATH = path.resolve("messages-db.json");

// Generate a unique ID using timestamp and random numbers
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

const defaultData = {
  messages: [],
  summary: "",
};

const readDb = async () => {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return defaultData; // If file doesn't exist, return default data
  }
};

const writeDb = async (data) => {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing to DB:", error);
    throw error; // Prevent silent failures
  }
};

export const clearMessages = async () => {
  try {
    const db = await readDb();
    db.messages = [];
    writeDb(db);
  } catch (error) {
    console.error("Error in clearMessages", error);
    throw error; // Prevent silent failures
  }
};

export const addMessages = async (messages) => {
  try {
    const db = await readDb();

    db.messages.push(...messages.map(addMetadata));

    if (db.messages.length >= 10) {
      // Avoid blocking by moving to background processing
      // setTimeout(async () => {
      //   try {
      //     const oldestMessages = db.messages.slice(0, 5).map(removeMetadata);
      //     db.summary = await summarizeMessages(oldestMessages);
      //     await writeDb(db);
      //   } catch (err) {
      //     console.error("Error summarizing messages:", err);
      //   }
      // }, 0);
    }

    await writeDb(db);
  } catch (error) {
    console.error("Error in addMessages:", error);
    throw error;
  }
};

export const getMessages = async () => {
  const db = await readDb();
  const messages = db.messages.map(removeMetadata);
  const lastFive = messages.slice(-5);

  if (lastFive[0]?.role === "tool") {
    const sixthMessage = messages[messages.length - 6];
    return sixthMessage ? [sixthMessage, ...lastFive] : lastFive;
  }

  return lastFive;
};

export const getSummary = async () => {
  const db = await readDb();
  return db.summary;
};

export const saveToolResponse = async (toolCallId, toolResponse) => {
  return addMessages([
    {
      role: "tool",
      content: toolResponse,
      tool_call_id: toolCallId,
    },
  ]);
};
