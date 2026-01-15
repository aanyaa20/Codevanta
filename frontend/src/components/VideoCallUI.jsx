import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon, MicIcon, VideoIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

// Add custom CSS to fix text visibility
const customStyles = `
  /* Call controls background and text */
  .str-video__call-controls {
    background: white !important;
  }
  .str-video__call-controls button {
    color: #1e293b !important;
  }
  .str-video__call-controls button svg {
    color: #1e293b !important;
  }
  
  /* Participant labels and mute indicators */
  .str-video__participant-view__label,
  .str-video__participant-details,
  .str-video__participant-view__audio-mute-badge {
    color: white !important;
    background: rgba(0, 0, 0, 0.7) !important;
    padding: 6px 10px !important;
    border-radius: 6px !important;
    font-weight: 600 !important;
    font-size: 14px !important;
  }
  .str-video__mute-indicator {
    color: white !important;
    background: rgba(0, 0, 0, 0.7) !important;
    padding: 6px 10px !important;
    border-radius: 6px !important;
    font-weight: 600 !important;
    font-size: 13px !important;
  }
  
  /* Notification messages (You are muted, etc) */
  .str-video__notification_message,
  .str-video__notification_message span {
    color: white !important;
    background: rgba(0, 0, 0, 0.8) !important;
    padding: 8px 12px !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
  }
  
  /* All notification messages */
  .str-video__notification,
  .str-video__notification_message {
    color: white !important;
    background: rgba(0, 0, 0, 0.8) !important;
    padding: 8px 12px !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    font-size: 14px !important;
  }
  
  /* Notification messages - "You are muted" etc */
  .str-video__notification_message,
  .str-video__notification,
  .str-video__notification-message {
    color: white !important;
    background: rgba(0, 0, 0, 0.8) !important;
    padding: 8px 12px !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
  }
  .str-video__notification_message {
    color: white !important;
    background: rgba(0, 0, 0, 0.8) !important;
    padding: 8px 12px !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    font-size: 14px !important;
  }
  
  /* Three dots menu (participant actions menu) */
  .str-video__menu-container,
  .str-video__participant-actions-menu {
    background: white !important;
    color: #1e293b !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  }
  .str-video__menu-container button,
  .str-video__participant-actions-menu button {
    color: #1e293b !important;
    background: white !important;
  }
  .str-video__menu-container button:hover,
  .str-video__participant-actions-menu button:hover {
    background: #f1f5f9 !important;
  }
  .str-video__menu-container svg,
  .str-video__participant-actions-menu svg {
    color: #1e293b !important;
  }
  
  /* Generic menu items */
  .str-video__generic-menu__item {
    color: #1e293b !important;
    background: white !important;
  }
  .str-video__generic-menu__item:hover {
    background: #f1f5f9 !important;
  }
  .str-video__generic-menu__item svg {
    color: #1e293b !important;
  }
  
  /* Dropdown menus */
  [role="menu"],
  [role="menuitem"] {
    background: white !important;
    color: #1e293b !important;
  }
  [role="menuitem"]:hover {
    background: #f1f5f9 !important;
  }

  /* Hide Stream's default recording button to avoid duplicates */
  .str-video__call-controls button[aria-label*="recording"],
  .str-video__call-controls button[aria-label*="Record"],
  .str-video__composite-button.str-video__record-call-button {
    display: none !important;
  }
`;

function VideoCallUI({ chatClient, channel, isHost, onStartRecording, onStopRecording, isRecording: recordingState }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount, useIsCallRecordingInProgress } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const isRecording = useIsCallRecordingInProgress() || recordingState;
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2Icon className="size-10 mx-auto animate-spin text-orange-500 mb-4" />
          <p className="text-slate-500">Joining secure channel...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className="h-full flex gap-3 relative str-video p-3 overflow-hidden bg-slate-50">
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Participants Header */}
          <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                <UsersIcon className="size-4 text-slate-500" />
                <span className="font-semibold text-sm text-slate-700">
                  {participantCount} Online
                </span>
              </div>
              
              {/* Recording Indicator */}
              {isRecording && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200">
                  <div className="size-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-red-600">RECORDING</span>
                </div>
              )}
            </div>
            {chatClient && channel && (
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm ${
                    isChatOpen 
                    ? "bg-orange-500 hover:bg-orange-600 text-white" 
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <MessageSquareIcon className="size-4" />
                <span>Open Chat</span>
              </button>
            )}
          </div>

        {/* Video Grid */}
        <div className="flex-1 bg-slate-200 rounded-xl overflow-hidden relative border border-slate-300 shadow-inner">
          <SpeakerLayout />
        </div>

        {/* Controls */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 flex justify-center gap-2 shadow-sm">
          {isHost && onStartRecording && onStopRecording && (
            <button
              onClick={isRecording ? onStopRecording : onStartRecording}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-slate-700 hover:bg-slate-800 text-white"
              }`}
            >
              <div className={`size-2 rounded-full ${
                isRecording ? "bg-white animate-pulse" : "bg-red-400"
              }`}></div>
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          )}
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* CHAT OVERLAY / SIDEBAR */}
      {chatClient && channel && (
        <div
          className={`absolute inset-y-3 right-3 z-10 flex flex-col rounded-xl overflow-hidden bg-white transition-all duration-300 ease-in-out shadow-2xl border border-slate-200 ${
            isChatOpen ? "w-80 translate-x-0" : "w-0 translate-x-[120%] opacity-0 pointer-events-none"
          }`}
          style={{ background: '#ffffff' }} // Hardcoded to match theme for now
        >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <MessageSquareIcon className="size-4 text-orange-500" />
                    Live Chat
                </h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-200"
                >
                  <XIcon className="size-4" />
                </button>
            </div>
            
            <div className="flex-1 overflow-hidden stream-chat-theme-light">
                <Chat client={chatClient} theme="str-chat__theme-light">
                    <Channel channel={channel}>
                    <Window>
                        <MessageList />
                        <MessageInput placeholder="Ready to grind together? Send your friend a message..." />
                    </Window>
                    </Channel>
                </Chat>
            </div>
        </div>
      )}
    </div>
    </>
  );
}
export default VideoCallUI;
