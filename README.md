# LogStream

A simple live developer observability dashboard built with Node.js, Express and Server-Sent Events (SSE).

## Features

- Name / Client ID
- Start and Stop stream controls
- Backend-generated logs every 500 ms
- INFO, WARN and ERROR levels
- Precise timestamps
- Native browser `EventSource`
- Separate stream for each connected client
- Server-side cleanup when a client disconnects
- Frontend rolling window of the latest 100 logs
- Terminal-style UI

## Run locally

```bash
npm install
npm start
```

Open:

http://localhost:3000

## Project structure

```text
logstream/
├── package.json
├── server.js
├── README.md
└── public/
    ├── index.html
    ├── style.css
    └── app.js
```

## Architecture

```text
Browser
   |
   | GET /stream?clientId=...
   | persistent SSE connection
   v
Express server
   |
   | creates one timer for this connection
   | every 500 ms
   v
new log -> res.write()
   |
   v
Browser EventSource -> terminal
```

When the browser closes the connection or the user presses Stop, the server receives the request `close` event and clears that client's timer.

## Resources used

- MDN: Server-sent events
- MDN: EventSource API
- Node.js: Event loop and HTTP stream closing
- Express.js: routing and middleware
- Recruitment task: GDGxIris-Recruitments-2026 LogStream

The implementation uses the native browser `EventSource` API and a simple Express route so the core streaming mechanism remains easy to understand.
