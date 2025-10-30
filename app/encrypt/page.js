"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import jsPDF from "jspdf";
import "react-toastify/dist/ReactToastify.css";

export default function EncryptPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [message, setMessage] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [includePasscode, setIncludePasscode] = useState(true); // new checkbox state

  const MAX_CHARS = 300;

  // --- Unlock Encryptor ---
  const handleUnlock = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPass }),
      });
      const data = await res.json();
      if (data.success) {
        setIsUnlocked(true);
        toast.success("Encryptor Unlocked!");
      } else {
        toast.error("Invalid admin password");
      }
    } catch {
      toast.error("Error verifying admin password");
    }
  };

  // --- Generate QR ---
  const handleGenerateQR = async () => {
    if (!message || !passcode) {
      toast.error("Enter both message and passcode");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, passcode }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.qrDataUrl) {
        setQrUrl(data.qrDataUrl);
        toast.success("QR Generated Successfully!");
      } else {
        toast.error(data.error || "QR generation failed");
      }
    } catch {
      setLoading(false);
      toast.error("Failed to connect to server");
    }
  };

  // --- Export PDF ---
  const handleExportPDF = () => {
    if (!qrUrl) {
      toast.error("Generate QR first");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    const title = "Scan QR Code to Decrypt Message";
    doc.setFontSize(36);
    doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 40);

    // QR Code Image
    const imgWidth = 150;
    const imgHeight = 150;
    const imgX = (pageWidth - imgWidth) / 2;
    doc.addImage(qrUrl, "PNG", imgX, 70, imgWidth, imgHeight);

    // Passcode (conditionally)
    if (includePasscode) {
      const passcodeText = `Passcode: ${passcode}`;
      doc.setFontSize(18);
      doc.text(passcodeText, (pageWidth - doc.getTextWidth(passcodeText)) / 2, 240);
    }

    doc.save("BetterQR_Message.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
      <ToastContainer />
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-800">
        {!isUnlocked ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">🔐 Private Encryptor Access</h1>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Enter Admin Password"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
              />
              <button
                onClick={handleUnlock}
                className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-500 transition-all text-white py-3 rounded-lg font-semibold"
              >
                Unlock Encryptor
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">🧩 Message Encryptor</h1>
            <div className="space-y-2">
              {/* Message Input */}
              <textarea
                placeholder="Enter your secret message..."
                className="w-full h-28 p-3 rounded-lg bg-gray-800 border border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) setMessage(e.target.value);
                }}
              />
              <div className="text-right text-gray-400 text-sm">
                {message.length} / {MAX_CHARS}
              </div>

              {/* Passcode Input */}
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  placeholder="Enter Passcode"
                  className="w-full p-3 pr-10 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                >
                  {showPasscode ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              {/* Include Passcode Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includePasscode"
                  checked={includePasscode}
                  onChange={(e) => setIncludePasscode(e.target.checked)}
                  className="cursor-pointer"
                />
                <label htmlFor="includePasscode" className="text-gray-200 text-sm cursor-pointer">
                  Include Passcode in PDF
                </label>
              </div>

              {/* Generate QR Button */}
              <button
                onClick={handleGenerateQR}
                disabled={loading}
                className="w-full cursor-pointer bg-green-600 hover:bg-green-500 transition-all text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Encrypting..." : "Generate QR"}
              </button>
            </div>

            {/* QR Preview */}
            {qrUrl && (
              <div className="mt-6 text-center border-t border-gray-700 pt-6 space-y-3">
                <img
                  src={qrUrl}
                  alt="Encrypted QR"
                  className="w-48 h-48 mx-auto rounded-lg border border-gray-700"
                />
                <p className="text-xs mt-1 text-gray-500">*Encrypted QR</p>

                <button
                  onClick={handleExportPDF}
                  className="mt-2 w-full cursor-pointer bg-blue-600 hover:bg-blue-500 transition-all text-white py-2 rounded-lg font-semibold"
                >
                  Export as PDF
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
