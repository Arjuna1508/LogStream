const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const messages = {
  INFO: [
    "Dashboard session active.",
    "Database connection stable.",
    "Background cache check completed.",
    "System health check passed."
  ],
  WARN: [
    "High memory allocation detected.",
    "Response latency is above normal.",
    "Background task queue is growing.",
    "Cache refresh is taking longer than expected."
  ],
  ERROR: [
    "API request failed with status 500.",
    "Background service returned an error.",
    "Database query failed.",
    "Network request could not be completed."
  ]
};

function createLog() {
  const levels = ["INFO", "WARN", "ERROR"];
  const level = levels[Math.floor(Math.random() * levels.length)];
  const time = new Date().toLocaleTimeString("en-GB", {
    hour12: false
  }) + "." + String(new Date().getMilliseconds()).padStart(3, "0");

  const list = messages[level];
  const message = list[Math.floor(Math.random() * list.length)];

  return {
    level,
    time,
    message
  };
}

app.use(express.static(path.join(__dirname, "public")));

app.get("/stream", (req, res) => {
  const clientId = req.query.clientId || "Unknown";
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");
res.setHeader("X-Accel-Buffering", "no");
res.flushHeaders();

console.log(`Client connected: ${clientId}`);

const sendLog = () => {
  const log = createLog();
  res.write(`data: ${JSON.stringify({ clientId, ...log })}\n\n`);
};

sendLog();
const timer = setInterval(sendLog, 500);

req.on("close", () => {
  clearInterval(timer);
  console.log(`Client disconnected: ${clientId}`);
});
});
app.listen(PORT, () => {
  console.log(`LogStream running at http://localhost:${PORT}`);
});
