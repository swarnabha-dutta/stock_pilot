// d:\StockPilot\app\api\db-test\route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";

/**
 * Report database connection and health status for the GET route.
 *
 * @returns {Response} JSON response. On success (200): { ok: true, state, readyState, pingOk, host, name } where
 *  - state: human-readable connection state ("disconnected", "connected", "connecting", "disconnecting", or "unknown")
 *  - readyState: numeric MongoDB connection readyState
 *  - pingOk: `true` if the database admin ping returned `ok === 1`, `false` otherwise
 *  - host: database host
 *  - name: database name
 *
 * On failure (500): { ok: false, error } where `error` is the error message.
 */
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