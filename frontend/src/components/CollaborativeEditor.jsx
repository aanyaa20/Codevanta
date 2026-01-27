import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import "./collaborative-cursor.css";

const CollaborativeEditor = ({
  language = "javascript",
  value = "",
  onChange,
  sessionId,
  userId,
  userName,
  allowRemoteEditing = true,
  ...editorProps
}) => {
  const editorRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);
  const ydocRef = useRef(null);
  const yTextRef = useRef(null);
  
  // Track mode state
  const isSoloModeRef = useRef(!allowRemoteEditing);
  
  // For Solo mode: local document that syncs TO shared but not FROM shared
  const localDocRef = useRef(null);
  const localTextRef = useRef(null);
  const localBindingRef = useRef(null);
  const syncObserverRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // If no sessionId, use regular editor without collaboration
    if (!sessionId) {
      return;
    }

    try {
      const model = editorRef.current.getModel();
      
      // ============================================
      // SHARED DOCUMENT (connected to WebSocket)
      // ============================================
      const ydoc = new Y.Doc();
      ydocRef.current = ydoc;
      const yText = ydoc.getText("monaco");
      yTextRef.current = yText;

      // Set initial value if provided
      if (value && yText.length === 0) {
        yText.insert(0, value);
      }

      // Connect to WebSocket server
      // Use environment variable for production, fallback to localhost for development
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const isDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      
      let wsUrl;
      if (import.meta.env.VITE_YJS_WS_URL) {
        // Use explicit WebSocket URL from environment variable
        wsUrl = `${import.meta.env.VITE_YJS_WS_URL}/yjs`;
      } else if (isDevelopment) {
        // Development: connect to localhost
        wsUrl = `${wsProtocol}//localhost:3000/yjs`;
      } else {
        // Production fallback: use current hostname
        wsUrl = `${wsProtocol}//${window.location.hostname}/yjs`;
      }
      
      const provider = new WebsocketProvider(wsUrl, `session-${sessionId}`, ydoc);
      providerRef.current = provider;

      // Set user awareness information
      provider.awareness.setLocalStateField("user", {
        name: userName || "Anonymous",
        color: generateUserColor(userId),
        userId: userId,
        allowRemoteEditing: allowRemoteEditing,
      });

      // ============================================
      // LOCAL DOCUMENT (for Solo mode editing)
      // ============================================
      const localDoc = new Y.Doc();
      localDocRef.current = localDoc;
      const localText = localDoc.getText("monaco");
      localTextRef.current = localText;

      // Initialize with current shared content
      localText.insert(0, yText.toString() || value || "");

      // ============================================
      // SETUP BINDINGS BASED ON MODE
      // ============================================
      
      if (allowRemoteEditing) {
        // LIVE MODE: Bind editor to shared document
        const binding = new MonacoBinding(
          yText,
          model,
          new Set([editor]),
          provider.awareness
        );
        bindingRef.current = binding;
        console.log("🟢 Starting in Live mode");
      } else {
        // SOLO MODE: Bind editor to local document
        const localBinding = new MonacoBinding(
          localText,
          model,
          new Set([editor]),
          null // No awareness = no remote cursors
        );
        localBindingRef.current = localBinding;
        
        // Setup one-way sync: local -> shared
        setupLocalToSharedSync();
        console.log("🔴 Starting in Solo mode");
      }

      // Sync changes to parent component
      yText.observe(() => {
        if (onChange && !isSoloModeRef.current) {
          onChange(yText.toString());
        }
      });

      localText.observe(() => {
        if (onChange && isSoloModeRef.current) {
          onChange(localText.toString());
        }
      });

      provider.on("status", (event) => {
        console.log("Y.js WebSocket status:", event.status);
      });

      // Function to setup one-way sync from local to shared
      function setupLocalToSharedSync() {
        // Watch local document for changes and push to shared
        const observer = (event, transaction) => {
          // Only sync if we're in solo mode and this is a local change
          if (isSoloModeRef.current && transaction.local) {
            // Get the current local content
            const localContent = localText.toString();
            const sharedContent = yText.toString();
            
            // Only update if content is different
            if (localContent !== sharedContent) {
              // Push local changes to shared document
              ydoc.transact(() => {
                yText.delete(0, yText.length);
                yText.insert(0, localContent);
              }, 'solo-sync');
            }
          }
        };
        
        localText.observe(observer);
        syncObserverRef.current = observer;
      }

    } catch (error) {
      console.error("Error setting up collaborative editing:", error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      if (localBindingRef.current) {
        localBindingRef.current.destroy();
      }
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (ydocRef.current) {
        ydocRef.current.destroy();
      }
      if (localDocRef.current) {
        localDocRef.current.destroy();
      }
    };
  }, []);

  // Handle Live/Solo mode toggle
  useEffect(() => {
    const provider = providerRef.current;
    const editor = editorRef.current;
    const yText = yTextRef.current;
    const localText = localTextRef.current;
    const ydoc = ydocRef.current;
    const localDoc = localDocRef.current;
    
    if (!provider || !sessionId || !editor || !yText || !localText) {
      return;
    }

    const wasInSoloMode = isSoloModeRef.current;
    const isNowInSoloMode = !allowRemoteEditing;
    
    // Update awareness
    provider.awareness.setLocalStateField("user", {
      name: userName || "Anonymous",
      color: generateUserColor(userId),
      userId: userId,
      allowRemoteEditing: allowRemoteEditing,
    });
    
    // Skip if mode hasn't changed
    if (wasInSoloMode === isNowInSoloMode) {
      return;
    }
    
    isSoloModeRef.current = isNowInSoloMode;
    const model = editor.getModel();

    if (isNowInSoloMode) {
      // ============================================
      // SWITCHING TO SOLO MODE
      // ============================================
      console.log("🔴 Switching to Solo mode");
      
      // Destroy shared binding
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
      
      // Copy current shared content to local doc
      const currentContent = yText.toString();
      localDoc.transact(() => {
        localText.delete(0, localText.length);
        localText.insert(0, currentContent);
      });
      
      // Create local binding
      const localBinding = new MonacoBinding(
        localText,
        model,
        new Set([editor]),
        null
      );
      localBindingRef.current = localBinding;
      
      // Setup one-way sync: local -> shared
      if (!syncObserverRef.current) {
        const observer = (event, transaction) => {
          if (isSoloModeRef.current && transaction.local) {
            const localContent = localText.toString();
            const sharedContent = yText.toString();
            
            if (localContent !== sharedContent) {
              ydoc.transact(() => {
                yText.delete(0, yText.length);
                yText.insert(0, localContent);
              }, 'solo-sync');
            }
          }
        };
        localText.observe(observer);
        syncObserverRef.current = observer;
      }
      
    } else {
      // ============================================
      // SWITCHING TO LIVE MODE
      // ============================================
      console.log("🟢 Switching to Live mode");
      
      // Get local content before switching
      const localContent = localText.toString();
      
      // Destroy local binding
      if (localBindingRef.current) {
        localBindingRef.current.destroy();
        localBindingRef.current = null;
      }
      
      // Push final local content to shared document
      ydoc.transact(() => {
        yText.delete(0, yText.length);
        yText.insert(0, localContent);
      }, 'mode-switch');
      
      // Create shared binding
      const binding = new MonacoBinding(
        yText,
        model,
        new Set([editor]),
        provider.awareness
      );
      bindingRef.current = binding;
    }

  }, [allowRemoteEditing, sessionId, userId, userName]);

  return (
    <div className={!allowRemoteEditing ? "hide-remote-cursors" : ""} style={{ height: '100%' }}>
      <Editor
        language={language}
        value={value}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          ...editorProps.options,
        }}
        {...editorProps}
      />
    </div>
  );
};

// Generate a consistent color for each user based on their ID
const generateUserColor = (userId) => {
  if (!userId) return "#" + Math.floor(Math.random() * 16777215).toString(16);
  
  const colors = [
    "#FF6B6B", // red
    "#4ECDC4", // teal
    "#45B7D1", // blue
    "#FFA07A", // salmon
    "#98D8C8", // mint
    "#F7DC6F", // yellow
    "#BB8FCE", // purple
    "#85C1E2", // light blue
    "#F8B739", // orange
    "#52C41A", // green
  ];
  
  // Use userId to consistently pick a color
  const hash = userId.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

export default CollaborativeEditor;
