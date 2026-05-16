// feriados.dev webhook receiver — Node.js, no dependencies
//
// Run:
//   FERIADOS_WEBHOOK_SECRET=whsec_... node javascript/webhook-receiver.js
//
// Then use http://localhost:3000/webhook as a temporary webhook URL.

import crypto from "node:crypto";
import http from "node:http";

const PORT = Number(process.env.PORT || 3000);
const SIGNING_SECRET = process.env.FERIADOS_WEBHOOK_SECRET;

function timingSafeEqualHex(a, b) {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function verifySignature({ timestamp, signatureHeader, rawBody }) {
  if (!SIGNING_SECRET) {
    throw new Error("Set FERIADOS_WEBHOOK_SECRET before starting the receiver");
  }
  if (!timestamp || !signatureHeader?.startsWith("sha256=")) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", SIGNING_SECRET)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  return timingSafeEqualHex(signatureHeader.slice("sha256=".length), expected);
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/webhook") {
    res.writeHead(404);
    res.end("not found");
    return;
  }

  const chunks = [];
  req.on("data", chunk => chunks.push(chunk));
  req.on("end", () => {
    const rawBody = Buffer.concat(chunks).toString("utf8");
    const timestamp = req.headers["x-feriados-timestamp"];
    const signatureHeader = req.headers["x-feriados-signature"];

    if (!verifySignature({ timestamp, signatureHeader, rawBody })) {
      res.writeHead(401);
      res.end("invalid signature");
      return;
    }

    const event = JSON.parse(rawBody);
    console.log("Webhook received:", event);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ received: true }));
  });
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}/webhook`);
});
