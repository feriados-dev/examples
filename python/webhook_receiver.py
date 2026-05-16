# feriados.dev webhook receiver — Python standard library only
#
# Run:
#   FERIADOS_WEBHOOK_SECRET=whsec_... python python/webhook_receiver.py

import hashlib
import hmac
import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = int(os.environ.get("PORT", "3000"))
SIGNING_SECRET = os.environ.get("FERIADOS_WEBHOOK_SECRET", "")


class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/webhook":
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(length)
        timestamp = self.headers.get("X-Feriados-Timestamp", "")
        signature = self.headers.get("X-Feriados-Signature", "")

        expected = hmac.new(
            SIGNING_SECRET.encode("utf-8"),
            timestamp.encode("utf-8") + b"." + raw_body,
            hashlib.sha256,
        ).hexdigest()

        if not signature.startswith("sha256=") or not hmac.compare_digest(signature[7:], expected):
            self.send_response(401)
            self.end_headers()
            self.wfile.write(b"invalid signature")
            return

        event = json.loads(raw_body)
        print("Webhook received:", event)

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"received": true}')


if __name__ == "__main__":
    if not SIGNING_SECRET:
        raise RuntimeError("Set FERIADOS_WEBHOOK_SECRET before starting the receiver")
    server = HTTPServer(("0.0.0.0", PORT), WebhookHandler)
    print(f"Listening on http://localhost:{PORT}/webhook")
    server.serve_forever()
