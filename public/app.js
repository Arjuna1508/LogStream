const clientId = document.getElementById("clientId");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const logs = document.getElementById("logs");
const status = document.getElementById("status");

let stream = null;
let logHistory = [];

function addLog(log) {
  logHistory.push(log);

  if (logHistory.length > 100) {
    logHistory.shift();
  }

  logs.innerHTML = "";

  logHistory.forEach(item => {
    const row = document.createElement("div");
    row.className = `log ${item.level.toLowerCase()}`;
    row.textContent = `[${item.level}] ${item.time} - ${item.message}`;
    logs.appendChild(row);
  });

  logs.scrollTop = logs.scrollHeight;
}

start.addEventListener("click", () => {
  const name = clientId.value.trim();

  if (!name) {
    clientId.focus();
    return;
  }

  if (stream) {
    stream.close();
  }
  logHistory = [];
  logs.innerHTML = "";
  stream = new EventSource(`/stream?clientId=${encodeURIComponent(name)}`);

  stream.onopen = () => {
    status.textContent = "● Live";
    start.disabled = true;
    stop.disabled = false;
  };

  stream.onmessage = event => {
    addLog(JSON.parse(event.data));
  };

  stream.onerror = () => {
    status.textContent = "● Disconnected";
  };
});

stop.addEventListener("click", () => {
  if (stream) {
    stream.close();
    stream = null;
  }

  status.textContent = "● Offline";
  start.disabled = false;
  stop.disabled = true;
});
