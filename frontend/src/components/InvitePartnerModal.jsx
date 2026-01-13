import { Check, Copy, Mail, X, Link, MessageCircle, MessageSquare } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function InvitePartnerModal({ isOpen, onClose, activeSessions }) {
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (sessionId) => {
    const inviteLink = `${window.location.origin}/session/${sessionId}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedId(sessionId);
    toast.success("Link copied to clipboard!");
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleWhatsAppShare = (sessionId) => {
    const inviteLink = `${window.location.origin}/session/${sessionId}`;
    const message = `Hey! Join my coding session on CodeVanta: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailShare = (sessionId) => {
    const inviteLink = `${window.location.origin}/session/${sessionId}`;
    const subject = "Join my CodeVanta Coding Session";
    const body = `Hi!\n\nI'd like to invite you to join my coding session on CodeVanta.\n\nClick here to join: ${inviteLink}\n\nSee you there!`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Invite a Partner</h3>
            <p className="text-sm text-slate-500 mt-1">Share the link to start pair programming</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-slate-50/50">
          {activeSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="size-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4">
                <MessageSquare className="size-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold mb-1 text-slate-900">No Active Sessions</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                Create a session first to invite partners to join you!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div
                    key={session._id}
                    className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm"
                  >
                    {/* Session Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900">{session.problem}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-medium">
                            {session.difficulty}
                          </span>
                          <span>•</span>
                          <span>{session.participant ? "2/2" : "1/2"} participants</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-bold rounded bg-green-50 text-green-600 border border-green-200 uppercase tracking-wider">
                        Active
                      </span>
                    </div>

                    {/* Link Display */}
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 mb-4">
                      <div className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-400 shadow-sm">
                        <Link className="size-4" />
                      </div>
                      <div className="flex-1 text-sm text-slate-600 truncate font-mono">
                        {`${window.location.origin}/session/${session._id}`}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleCopy(session._id)}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm ${
                          copiedId === session._id
                            ? "bg-green-600 text-white border border-green-600"
                            : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {copiedId === session._id ? (
                          <>
                            <Check className="size-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="size-4" />
                            Copy Link
                          </>
                        )}
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleWhatsAppShare(session._id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all group shadow-sm"
                          title="Share via WhatsApp"
                        >
                          <MessageCircle className="size-4 text-[#25D366] group-hover:text-white transition-colors" />
                        </button>

                        <button
                          onClick={() => handleEmailShare(session._id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all group shadow-sm"
                          title="Share via Email"
                        >
                          <Mail className="size-4 text-blue-500 group-hover:text-white transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvitePartnerModal;
