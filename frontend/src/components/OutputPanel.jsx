import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function OutputPanel({ output, testResults, isRunning }) {
  // Use testResults if available, otherwise fall back to output
  const data = testResults || output;
  
  // Handle new online judge result format
  const status = data?.status;
  const passedCount = data?.passed || data?.passedCount || 0;
  const totalCount = data?.total || data?.totalCount || 0;
  const results = data?.results || [];
  const errorMessage = data?.errorMessage || data?.error;
  const runtime = data?.runtime;
  const simpleOutput = data?.output;

  // Find first failed test
  const failedTest = results.find(r => !r.passed);
  const failedTestIndex = failedTest ? results.indexOf(failedTest) : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-700">Output</h3>
        {isRunning && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="size-4 animate-spin" />
            Running...
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {status ? (
          <div className="space-y-4">
            {/* Status Badge */}
            <div className={`p-4 rounded-lg border-2 ${
              status === "Accepted" ? "bg-green-50 border-green-500" :
              status === "Wrong Answer" ? "bg-red-50 border-red-500" :
              status === "Runtime Error" ? "bg-orange-50 border-orange-500" :
              status === "Compilation Error" ? "bg-yellow-50 border-yellow-500" :
              "bg-purple-50 border-purple-500"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {status === "Accepted" ? (
                  <CheckCircle2 className="size-6 text-green-600" />
                ) : (
                  <XCircle className="size-6 text-red-600" />
                )}
                <span className="text-lg font-bold">{status}</span>
              </div>
              <div className="text-sm font-medium">
                Test Cases Passed: {passedCount} / {totalCount}
              </div>
              {runtime && (
                <div className="text-xs text-slate-600 mt-1">
                  Runtime: {runtime}ms
                </div>
              )}
            </div>

            {/* Error or Failed Test Details */}
            {status !== "Accepted" && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                {errorMessage ? (
                  <div>
                    <h4 className="text-sm font-semibold text-red-600 mb-2">Error Message:</h4>
                    <pre className="text-xs bg-red-50 p-3 rounded text-red-800 overflow-x-auto">{errorMessage}</pre>
                  </div>
                ) : failedTest ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700">Failed at Test Case {failedTestIndex + 1}</h4>
                    <div>
                      <span className="text-xs font-medium text-slate-600">Input:</span>
                      <pre className="mt-1 p-2 bg-white rounded text-xs text-slate-800">{JSON.stringify(failedTest.input)}</pre>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-600">Expected:</span>
                      <pre className="mt-1 p-2 bg-white rounded text-xs text-slate-800">{JSON.stringify(failedTest.expected)}</pre>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-600">Your Output:</span>
                      <pre className="mt-1 p-2 bg-red-100 rounded text-xs text-red-800">{JSON.stringify(failedTest.actual)}</pre>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ) : errorMessage ? (
          <div className="space-y-3">
            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-500">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="size-6 text-red-600" />
                <span className="text-lg font-bold text-red-800">Error</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="text-sm font-semibold text-red-600 mb-2">Error Message:</h4>
              <pre className="text-xs bg-red-50 p-3 rounded text-red-800 overflow-x-auto whitespace-pre-wrap">{errorMessage}</pre>
            </div>
            {simpleOutput && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Output:</h4>
                <pre className="text-xs bg-white p-3 rounded text-slate-800 overflow-x-auto whitespace-pre-wrap">{simpleOutput}</pre>
              </div>
            )}
          </div>
        ) : simpleOutput ? (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-6 text-green-600" />
                <span className="text-lg font-bold text-green-800">Success</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Output:</h4>
              <pre className="text-sm text-slate-700 font-mono bg-white p-3 rounded overflow-x-auto whitespace-pre-wrap">{simpleOutput}</pre>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p className="text-sm">Run your code to see output here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
