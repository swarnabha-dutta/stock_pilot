// d:\StockPilot\app\api\db-test\route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    const readyState = conn.connection.readyState;
    const stateText = ["disconnected", "connected", "connecting", "disconnecting"][readyState] || "unknown";

    let pingOk = false;
    try {
      const pingRes = await conn.connection.db.admin().ping();
      pingOk = pingRes?.ok === 1;
    } catch {}

    return NextResponse.json({
      ok: true,
      state: stateText,
      readyState,
      pingOk,
      host: conn.connection.host,
      name: conn.connection.name,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}