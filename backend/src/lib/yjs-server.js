import { WebSocketServer } from 'ws';
import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as syncProtocol from 'y-protocols/sync';
import { encoding, decoding } from 'lib0';

const wsReadyStateOpen = 1;
const docs = new Map();
const docConnections = new Map(); // Track connections per document
const messageSync = 0;
const messageAwareness = 1;

const getYDoc = (docname) => {
  let doc = docs.get(docname);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(docname, doc);
  }
  return doc;
};

const getDocConnections = (docname) => {
  let connections = docConnections.get(docname);
  if (!connections) {
    connections = new Set();
    docConnections.set(docname, connections);
  }
  return connections;
};

const setupWSConnection = (conn, req, docName) => {
  conn.binaryType = 'arraybuffer';
  const doc = getYDoc(docName);
  const connections = getDocConnections(docName);
  const awareness = new awarenessProtocol.Awareness(doc);

  // Add this connection to the document's connection set
  connections.add(conn);

  // Listen to document updates and broadcast to all connections
  const updateHandler = (update, origin) => {
    if (origin !== conn) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageSync);
      syncProtocol.writeUpdate(encoder, update);
      const message = encoding.toUint8Array(encoder);
      
      if (conn.readyState === wsReadyStateOpen) {
        conn.send(message);
      }
    }
  };
  
  doc.on('update', updateHandler);

  conn.on('message', (message) => {
    try {
      const encoder = encoding.createEncoder();
      const decoder = decoding.createDecoder(new Uint8Array(message));
      const messageType = decoding.readVarUint(decoder);

      switch (messageType) {
        case messageSync:
          encoding.writeVarUint(encoder, messageSync);
          syncProtocol.readSyncMessage(decoder, encoder, doc, conn);
          if (encoding.length(encoder) > 1) {
            conn.send(encoding.toUint8Array(encoder));
          }
          break;
          
        case messageAwareness:
          awarenessProtocol.applyAwarenessUpdate(
            awareness,
            decoding.readVarUint8Array(decoder),
            conn
          );
          break;
      }
    } catch (err) {
      console.error('Error processing Y.js message:', err);
    }
  });

  conn.on('close', () => {
    connections.delete(conn);
    doc.off('update', updateHandler);
    awarenessProtocol.removeAwarenessStates(awareness, [conn], null);
  });

  // Send initial sync
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeSyncStep1(encoder, doc);
  conn.send(encoding.toUint8Array(encoder));

  const awarenessStates = awareness.getStates();
  if (awarenessStates.size > 0) {
    const encoder2 = encoding.createEncoder();
    encoding.writeVarUint(encoder2, messageAwareness);
    encoding.writeVarUint8Array(
      encoder2,
      awarenessProtocol.encodeAwarenessUpdate(awareness, Array.from(awarenessStates.keys()))
    );
    conn.send(encoding.toUint8Array(encoder2));
  }

  awareness.on('update', ({ added, updated, removed }) => {
    const changedClients = added.concat(updated, removed);
    if (changedClients.length > 0) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients)
      );
      const buff = encoding.toUint8Array(encoder);
      // Broadcast to all connections
      Array.from(awareness.states.keys()).forEach((client) => {
        if (client !== conn && client.readyState === wsReadyStateOpen) {
          client.send(buff);
        }
      });
    }
  });
};

// Attach WebSocket server to existing HTTP server
export const startYjsServer = (httpServer) => {
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket upgrade requests
  httpServer.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    
    // Only handle Y.js WebSocket connections (paths starting with /yjs/)
    if (url.pathname.startsWith('/yjs/')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        const docName = url.pathname.slice(5) || 'default'; // Remove '/yjs/' prefix
        setupWSConnection(ws, request, docName);
      });
    } else {
      // Not a Y.js connection, let other handlers deal with it
      socket.destroy();
    }
  });

  console.log('Y.js WebSocket server integrated with Express on /yjs/ path');
  return wss;
};
