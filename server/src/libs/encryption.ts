import crypto from "crypto";

const algorithm = "aes-256-gcm"; // Updated to use AES-GCM

export const generateEncryptionKey = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const encrypt = (text: string, secretKey: string) => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(secretKey, "hex"),
      iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return {
      iv: iv.toString("hex"),
      authTag,
      data: encrypted,
    };
  } catch (err: any) {
    console.error("Encryption error:", err.message);
    throw err;
  }
};

export const decrypt = (
  encryptedObject: { iv: string; authTag: string; data: string },
  secretKey: string
) => {
  try {
    const { iv, authTag, data } = encryptedObject;
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(secretKey, "hex"),
      Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(data, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err: any) {
    console.error("Decryption error:", err.message);
    throw err;
  }
};
