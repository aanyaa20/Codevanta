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
// import "./stream-chat-dark.css"; // Removing dark theme import for now as we want light

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
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
    <div className="h-full flex gap-3 relative str-video p-3 overflow-hidden bg-slate-50">
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Participants Header */}
        <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
            <UsersIcon className="size-4 text-slate-500" />
            <span className="font-semibold text-sm text-slate-700">
              {participantCount} Online
            </span>
          </div>
          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`btn btn-sm text-xs h-8 min-h-0 gap-2 border-none transition-all ${
                  isChatOpen 
                  ? "bg-orange-500 hover:bg-orange-600 text-white" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              <MessageSquareIcon className="size-3.5" />
              <span className="hidden sm:inline">Chat</span>
            </button>
          )}
        </div>

        {/* Video Grid */}
        <div className="flex-1 bg-slate-200 rounded-xl overflow-hidden relative border border-slate-300 shadow-inner">
          <SpeakerLayout />
        </div>

        {/* Controls */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 flex justify-center shadow-sm">
           {/* Customizing these requires overriding CSS or using CustomCallControls, 
               but Stream's default dark mode is usually okay if we wrap it correctly. 
               We will use standard controls for now but ensure container is styled. */}
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
                        <MessageInput placeholder="Type a message..." />
                    </Window>
                    </Channel>
                </Chat>
            </div>
        </div>
      )}
    </div>
  );
}
export default VideoCallUI;
