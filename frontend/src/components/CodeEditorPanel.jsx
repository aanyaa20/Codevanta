import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="h-full flex flex-col bg-white relative group">
       {/* Editor Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
            {/* Language Icon */}
            <div className="size-6 rounded bg-white border border-slate-200 p-1 flex items-center justify-center shadow-sm">
                 <img
                    src={LANGUAGE_CONFIG[selectedLanguage].icon}
                    alt={LANGUAGE_CONFIG[selectedLanguage].name}
                    className="size-full object-contain"
                />
            </div>
          
           {/* Language Selector */}
           <div className="relative">
                <select 
                    className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer appearance-none pr-4 hover:text-slate-900 transition-colors" 
                    value={selectedLanguage} 
                    onChange={onLanguageChange}
                >
                    {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                    <option key={key} value={key} className="bg-white text-slate-900">
                        {lang.name}
                    </option>
                    ))}
                </select>
                {/* Tiny chevron */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-slate-500">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>
           </div>
        </div>

        <button 
          className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-200" 
          disabled={isRunning} 
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="size-3 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="size-3 fill-current" />
              Run
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative border-b border-slate-200">
          <Editor
            height={"100%"}
            language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
            value={code}
            onChange={onCodeChange}
            theme="light"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              minimap: { enabled: false },
              padding: { top: 16, bottom: 16 },
              cursorBlinking: "smooth",
              smoothScrolling: true,
              contextmenu: true,
              scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
              }
            }}
          />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
