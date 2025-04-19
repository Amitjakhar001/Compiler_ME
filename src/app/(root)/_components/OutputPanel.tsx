"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { AlertTriangle, CheckCircle, Clock, Copy, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { useState, } from "react";
import RunningCodeSkeleton from "./RunningCodeSkeleton";

function OutputPanel() {
  const { output, error, isRunning, setStdin, executionResult, stdin } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const hasContent = error || output;

  const executedInput = executionResult?.stdin || "";

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(error || output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#181825] rounded-xl p-4 ring-1 ring-gray-800/50 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-gray-300">Output</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInput(!showInput)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-300 bg-[#1e1e2e] 
                      rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all"
          >
            {showInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showInput ? "Hide Input" : "Show Input"}
          </button>

          {hasContent && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-300 bg-[#1e1e2e] 
                        rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all"
            >
              {isCopied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {isCopied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      </div>

      {/* Container for Input + Output */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        {/* Input Section */}
        {showInput && (
          <div className="flex flex-col h-[30%] min-h-[100px]">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">Program Input (STDIN)</span>
            </div>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              className="w-full flex-1 bg-[#1e1e2e] rounded-lg p-3 font-mono text-sm text-gray-300 
                        ring-1 ring-white/[0.05] focus:ring-2 focus:ring-blue-500/50 transition-all 
                        outline-none resize-none scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
              placeholder="Enter input for your program..."
              spellCheck={false}
            />
          </div>
        )}

        {/* Output Section */}
        <div className={`flex-1 min-h-0 ${showInput ? 'h-[70%]' : 'h-full'}`}>
          <div className="relative h-full bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
                        rounded-xl p-4 overflow-auto font-mono text-sm scrollbar-thin 
                        scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {isRunning ? (
              <RunningCodeSkeleton />
            ) : error ? (
              <div className="space-y-4">
                {/* Show input if it exists */}
                {executedInput && (
                  <div className="mb-4 p-3 bg-[#1e1e2e] rounded-lg">
                    <div className="text-xs text-gray-400 mb-2">Input Used:</div>
                    <pre className="whitespace-pre-wrap text-gray-300">
                      {executedInput || "<no input provided>"}
                    </pre>
                  </div>
                )}

                <div className="flex items-start gap-3 text-red-400">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <div className="space-y-1">
                    <div className="font-medium">Execution Error</div>
                    <pre className="whitespace-pre-wrap text-red-400/80">{error}</pre>
                  </div>
                </div>
              </div>
            ) : output ? (
              <div className="space-y-4">
                {/* Show input if it exists */}
                {executedInput && (
                  <div className="mb-4 p-3 bg-[#1e1e2e] rounded-lg">
                    <div className="text-xs text-gray-400 mb-2">Input Used:</div>
                    <pre className="whitespace-pre-wrap text-gray-300">{executedInput}</pre>
                  </div>
                )}

                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Execution Successful</span>
                </div>
                <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-center">Run your code to see the output here...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutputPanel;