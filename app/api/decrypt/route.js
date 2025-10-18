import { NextResponse } from "next/server";
import { decryptMessage } from "../../utils/crypto.js";

export async function POST(req) {
  try {
    const { encrypted, passcode } = await req.json();
    if (!encrypted || !passcode) {
      return NextResponse.json({ error: "Missing encrypted payload or passcode" }, { status: 400 });
    }

    try {
      const decrypted = decryptMessage(encrypted, passcode);
      return NextResponse.json({ decrypted });
    } catch {
      return NextResponse.json({ error: "Invalid passcode or payload" }, { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Decryption failed" }, { status: 500 });
  }
}
