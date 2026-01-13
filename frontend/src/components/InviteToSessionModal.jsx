import { CheckIcon, CopyIcon, MailIcon, XIcon, ShareIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function InviteToSessionModal({ isOpen, onClose, sessionId }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const inviteLink = `${window.location.origin}/session/${sessionId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleWhatsAppShare = () => {
    const message = `Hey! Join my coding session on CodeVanta: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailShare = () => {
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

      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <ShareIcon className="size-5 text-orange-600" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">Invite to Session</h3>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500 hover:text-slate-700"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-500">
            Share this link to invite someone to join your session
          </p>
          
          {/* Session Link */}
          <div className="bg-slate-50 border border-slate-200 px-3 py-3 rounded-xl text-sm break-all font-mono text-slate-700">
            {inviteLink}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="w-full px-5 py-3 text-sm font-medium rounded-xl btn-primary flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <CheckIcon className="size-5" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="size-5" />
                Copy Link
              </>
            )}
          </button>

          {/* Share Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 px-4 py-3 text-sm font-medium rounded-xl bg-[#25D366] text-white hover:bg-[#20BA5A] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </button>

            <button
              onClick={handleEmailShare}
              className="flex-1 px-4 py-3 text-sm font-medium rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <MailIcon className="size-5" />
              Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InviteToSessionModal;
