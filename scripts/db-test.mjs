
import { connectToDatabase } from "../database/mongoose.js";

const main = async () => {
  try {
    const conn = await connectToDatabase();
    const readyState = conn.connection.readyState;
    console.log(JSON.stringify({ ok: true, readyState }, null, 2));
    const pingRes = await conn.connection.db.admin().ping();
    console.log(JSON.stringify({ pingOk: pingRes?.ok === 1 }, null, 2));
    await conn.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(JSON.stringify({ ok: false, error: err?.message || String(err) }, null, 2));
    process.exit(1);
  }
};

main();