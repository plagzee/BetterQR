// /lib/utils/crypto.js
import crypto from "crypto";

export function encryptMessage(message, passcode) {
  const iv = crypto.randomBytes(16); // initialization vector
  const key = crypto.createHash("sha256").update(passcode).digest(); // derive key
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(message, "utf8", "base64");
  encrypted += cipher.final("base64");

  // iv + encrypted message combined
  return `${iv.toString("base64")}:${encrypted}`;
}

export function decryptMessage(encrypted, passcode) {
  const [ivBase64, data] = encrypted.split(":");
  const iv = Buffer.from(ivBase64, "base64");
  const key = crypto.createHash("sha256").update(passcode).digest();
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decrypted = decipher.update(data, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
    