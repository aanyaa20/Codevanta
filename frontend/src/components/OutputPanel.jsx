import { TerminalIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react";

function OutputPanel({ output }) {
  return (
    <div className="h-full flex flex-col bg-white border-t border-slate-200">
       {/* Output Header */}
       <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <TerminalIcon className="size-3.5" />
                Console Output
            </div>
            
            {/* Status Indicator */}
            {output && (
                <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                    output.success 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                }`}>
                    {output.success ? (
                        <>
                            <CheckCircleIcon className="size-3" />
                            Success
                        </>
                    ) : (
                        <>
                            <AlertCircleIcon className="size-3" />
                            Error
                        </>
                    )}
                </div>
            )}
       </div>


      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {output === null ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 opacity-70">
             <TerminalIcon className="size-12" />
             <p>Run your code to see the output here</p>
          </div>
        ) : output.success ? (
          <pre className="text-slate-800 whitespace-pre-wrap leading-relaxed">{output.output}</pre>
        ) : (
          <div className="space-y-2">
            {output.output && (
              <pre className="text-slate-500 whitespace-pre-wrap opacity-80">
                {output.output}
              </pre>
            )}
            <pre className="text-red-600 whitespace-pre-wrap border-l-2 border-red-500/50 pl-3 bg-red-50 py-1 rounded-r">
                {output.error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;
