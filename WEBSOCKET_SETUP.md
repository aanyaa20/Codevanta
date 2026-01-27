# WebSocket Configuration for Live Cursor Tracking

## Overview
The live cursor/collaborative editing feature uses Y.js with WebSocket for real-time synchronization. As of this update, the WebSocket server is integrated with the Express server running on the same port.

## Setup Instructions

### Local Development
No additional configuration needed! The WebSocket automatically connects to `ws://localhost:3000/yjs`

### Production Deployment (Render + Vercel)

#### On Render (Backend):
Add these environment variables:
```
PORT=3000
NODE_ENV=production
CLIENT_URL=https://your-frontend.vercel.app
DB_URL=your_mongodb_connection_string
# ... other existing variables
```

#### On Vercel (Frontend):
Add this new environment variable:
```
VITE_YJS_WS_URL=wss://your-backend.onrender.com
```

**Important:** The WebSocket URL should use `wss://` (secure WebSocket) and point to your Render backend URL WITHOUT any port number.

## What Changed?

### Before:
- WebSocket ran on separate port 1234
- Hardcoded URLs
- Didn't work on Render deployment

### After:
- WebSocket integrated with Express on port 3000
- WebSocket path: `/yjs/session-{sessionId}`
- Configurable via environment variable
- Works on all deployment platforms

## Testing

### Local Testing:
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open a session and verify cursor tracking works

### Production Testing:
1. Deploy backend to Render
2. Add `VITE_YJS_WS_URL` on Vercel
3. Open a session and verify cursor tracking works

## Troubleshooting

If cursors don't show up in production:
1. Check browser console for WebSocket connection errors
2. Verify `VITE_YJS_WS_URL` is set correctly on Vercel
3. Check that Render backend is running and accessible
4. Ensure WebSocket connections are allowed (no firewall blocking)

## Technical Details

- **Backend:** `backend/src/lib/yjs-server.js` - WebSocket server
- **Frontend:** `frontend/src/components/CollaborativeEditor.jsx` - WebSocket client
- **Protocol:** Y.js CRDT with awareness protocol
- **Path:** `/yjs/{documentName}` on the same server as Express
