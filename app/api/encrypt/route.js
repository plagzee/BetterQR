import { NextResponse } from "next/server";
import { generateEncryptedQR } from "../../utils/qrcode.js";

export async function POST(req) {
  try {
    const { message, passcode } = await req.json();
    if (!message || !passcode) {
      return NextResponse.json({ error: "Missing message or passcode" }, { status: 400 });
    }

    const qrDataUrl = await generateEncryptedQR(message, passcode);
    return NextResponse.json({ qrDataUrl });
  } catch (err) {
    console.error("QR generation failed:", err);
    return NextResponse.json({ error: "QR generation failed" }, { status: 500 });
  }
}
