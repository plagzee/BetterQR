import QRCode from "qrcode";
import { encryptMessage } from "./crypto.js";

/**
 * Generates a QR that encodes a public URL pointing to decryptor.
 * @param {string} message - The message to encrypt
 * @param {string} passcode - The passcode for encryption
 * @returns {Promise<string>} - QR code data URL (PNG)
 */
export async function generateEncryptedQR(message, passcode) {
  // Encrypt the message first
  const encrypted = encryptMessage(message, passcode);

  // Build a URL with the encrypted payload as a query parameter
  const baseUrl = process.env.NEXT_PUBLIC_URL; // e.g., https://yourdomain.com
  const decryptUrl = `${baseUrl}/decrypt?payload=${encodeURIComponent(encrypted)}`;

  // Generate the QR from the URL
  const qr = await QRCode.toDataURL(decryptUrl, {
    errorCorrectionLevel: "M",
    type: "image/png",
    margin: 2,
    scale: 6,
  });

  return qr;
}
