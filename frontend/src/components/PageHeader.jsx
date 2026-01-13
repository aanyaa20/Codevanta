import { ArrowLeftIcon, ShareIcon, LogOutIcon, PhoneOffIcon } from "lucide-react";

function PageHeader({ 
  title, 
  subtitle, 
  onBack, 
  difficulty,
  status,
  isHost,
  onInvite,
  onEndSession,
  isLoading
}) {
  return (
    <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
        >
          <ArrowLeftIcon className="size-5" />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-tight truncate max-w-md text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{subtitle}</span>
              {status && (
                <>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className={status.isOnline ? "text-green-600 font-medium" : "text-amber-500 font-medium"}>
                    {status.text}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        {difficulty && (
          <span className={`px-2 py-0.5 rounded text-xs font-medium border uppercase tracking-wider ${
            difficulty === "easy" ? "bg-green-100 text-green-700 border-green-200" :
            difficulty === "medium" ? "bg-amber-100 text-amber-700 border-amber-200" :
            "bg-red-100 text-red-700 border-red-200"
          }`}>
            {difficulty}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isHost && onInvite && (
          <button
            onClick={onInvite}
            className="btn-secondary py-2 px-3 text-sm h-9 border-slate-200 hover:bg-slate-100"
          >
            <ShareIcon className="size-4" />
            <span className="hidden sm:inline">Invite</span>
          </button>
        )}
        
        {isHost && onEndSession && (
          <button
            onClick={onEndSession}
            disabled={isLoading}
            className="btn-secondary py-2 px-3 text-sm h-9 border-slate-200 hover:bg-red-50 hover:border-red-200 text-red-600 disabled:opacity-50"
          >
            <PhoneOffIcon className="size-4" />
            <span className="hidden sm:inline">End Session</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
