import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, SendIcon } from "lucide-react";

const LANGUAGE_CONFIG = {
  javascript: { name: "JavaScript", monacoLang: "javascript" },
  python: { name: "Python", monacoLang: "python" },
  cpp: { name: "C++", monacoLang: "cpp" },
  java: { name: "Java", monacoLang: "java" },
};

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  isSubmitting,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onSubmitCode,
}) {
  return (
    <div className="h-full flex flex-col bg-white relative group">
      {/* Editor Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <select
              className="bg-white px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg focus:outline-none cursor-pointer hover:text-slate-900 transition-colors"
              value={selectedLanguage}
              onChange={onLanguageChange}
            >
              {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                <option key={key} value={key} className="bg-white text-slate-900">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-600 text-white hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isRunning || isSubmitting}
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

          <button
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            disabled={isRunning || isSubmitting}
            onClick={onSubmitCode}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-3 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <SendIcon className="size-3" />
                Submit
              </>
            )}
          </button>
        </div>
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
            },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
