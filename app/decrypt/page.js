"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

export default function DecryptPage() {
  const searchParams = useSearchParams();
  const payload = searchParams.get("payload");

  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleDecrypt = async () => {
    if (!passcode) return toast.error("Enter passcode");

    try {
      setLoading(true);
      const res = await fetch("/api/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encrypted: payload, passcode }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.decrypted) {
        setDecryptedMessage(data.decrypted);
        setShowInput(false);
        toast.success("Message decrypted!");
      } else {
        toast.error(data.error || "Invalid passcode or payload");
      }
    } catch {
      setLoading(false);
      toast.error("Failed to connect to server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
      <ToastContainer />
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-800">
        {showInput ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">🔓 Decrypt Message</h1>
            <div className="space-y-4 relative">
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPasscode ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              <button
                onClick={handleDecrypt}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 transition-all text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Decrypting..." : "Decrypt"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">📝 Decrypted Message</h1>
            <div className="p-4 rounded-lg bg-gray-800 border border-gray-700">
              <p className="whitespace-pre-wrap">{decryptedMessage}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
