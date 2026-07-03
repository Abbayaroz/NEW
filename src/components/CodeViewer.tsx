import React, { useState } from 'react';
import { ANDROID_SOURCE_CODE, AndroidFile } from '../androidSourceCode';
import { Copy, Check, FileText, ChevronRight, Folder, Terminal, Download, Sparkles, BookOpen } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ANDROID_SOURCE_CODE[2]); // Default to Lecture.kt
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'files' | 'guide'>('files');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group files by category
  const categories = Array.from(new Set(ANDROID_SOURCE_CODE.map((f) => f.category)));

  return (
    <div id="code_viewer_container" className="flex flex-col h-full min-h-[640px] bg-slate-900 text-slate-100 rounded-3xl overflow-hidden border border-slate-800 shadow-xl select-none">
      
      {/* Top Header Controls */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-emerald-400 flex items-center space-x-1.5">
            <Terminal className="w-4 h-4" />
            <span>FUDMA Lecture Reminder Native Android Source Project</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Ready-to-build source files and Android Studio project compiler guides</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'files' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Project Files
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'guide' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            APK Compilation Guide
          </button>
        </div>
      </div>

      {activeTab === 'files' ? (
        /* PROJECT FILES EXPLORER PANEL */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[540px]">
          
          {/* Left File Tree Sidebar */}
          <div className="w-full md:w-64 bg-slate-950/40 border-r border-slate-800 flex flex-col overflow-y-auto scrollbar-none">
            <div className="p-3 border-b border-slate-800 bg-slate-950/20">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-500">Android Studio Directory Tree</span>
            </div>

            <div className="p-2 space-y-3">
              {categories.map((cat) => (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center space-x-1.5 px-2 py-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <Folder className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{cat}</span>
                  </div>

                  <div className="space-y-0.5 pl-2.5">
                    {ANDROID_SOURCE_CODE.filter((f) => f.category === cat).map((file) => {
                      const isSelected = selectedFile.path === file.path;
                      return (
                        <button
                          key={file.path}
                          onClick={() => {
                            setSelectedFile(file);
                            setCopied(false);
                          }}
                          className={`w-full text-left px-2 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-950 text-emerald-300 font-semibold border-l-2 border-emerald-500'
                              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 truncate pr-1">
                            <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <ChevronRight className={`w-3 h-3 flex-shrink-0 opacity-50 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Code Display View */}
          <div className="flex-1 flex flex-col bg-slate-900/60 overflow-hidden relative">
            
            {/* File Path and Actions Top-bar */}
            <div className="bg-slate-950/60 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-mono font-bold text-emerald-500">Path:</span>
                <span className="text-[11px] font-mono text-slate-300 ml-1.5 select-all truncate block">
                  {selectedFile.path}
                </span>
              </div>
              
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-emerald-800/40 transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Text Panel */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300 scrollbar-none select-text selection:bg-emerald-700/50">
              <pre className="whitespace-pre">{selectedFile.code}</pre>
            </div>
          </div>

        </div>
      ) : (
        /* APK COMPILATION STEP-BY-STEP INSTRUCTIONS */
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[540px] scrollbar-none select-text">
          
          <div className="flex items-start space-x-3 bg-emerald-950/40 border border-emerald-900/30 p-4 rounded-2xl">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">Fast APK Generation Flow</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                You can quickly compile this project into a real, native Android installation package (APK) to test on your own physical smartphone or emulator in less than 5 minutes.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <BookOpen className="w-4.5 h-4.5 text-emerald-500" />
              <span>Compile Setup in 4 Steps:</span>
            </h3>

            {/* Step 1 */}
            <div className="flex items-start space-x-3.5">
              <div className="bg-emerald-900/60 text-emerald-300 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-200">Initialize New Android Studio Project</h4>
                <p className="text-slate-400 leading-relaxed">
                  Open <strong>Android Studio</strong>, select <strong>File &gt; New &gt; New Project</strong>, and select the <strong>Empty Activity</strong> template. Set the project details as follows:
                </p>
                <ul className="list-disc list-inside text-[11px] text-slate-400 pl-2 space-y-1 mt-1.5 font-medium">
                  <li>Name: <strong className="text-white">FUDMA Lecture Reminder</strong></li>
                  <li>Package name: <strong className="text-emerald-400 font-mono">com.fudma.lecturereminder</strong></li>
                  <li>Language: <strong className="text-white">Kotlin</strong></li>
                  <li>Build configuration language: <strong className="text-white">Kotlin DSL (build.gradle.kts)</strong></li>
                  <li>Minimum SDK: <strong className="text-white">API 26: Android 8.0 (Oreo)</strong></li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-3.5">
              <div className="bg-emerald-900/60 text-emerald-300 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-200">Paste Configuration Files</h4>
                <p className="text-slate-400 leading-relaxed">
                  Go to the <strong>Project Files</strong> tab above and copy the contents of the following configurations:
                </p>
                <ul className="list-disc list-inside text-[11px] text-slate-400 pl-2 space-y-1 mt-1 font-medium">
                  <li>Paste <strong className="text-white">build.gradle.kts</strong> into your app-level build file.</li>
                  <li>Paste <strong className="text-white">AndroidManifest.xml</strong> into your main manifest file to declare notification permissions and receptors.</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-3.5">
              <div className="bg-emerald-900/60 text-emerald-300 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-200">Replicate the Code Directories</h4>
                <p className="text-slate-400 leading-relaxed">
                  Create the necessary packages in your <code className="text-emerald-400 bg-slate-950 px-1 py-0.5 rounded font-mono text-[11px]">app/src/main/java/com/fudma/lecturereminder</code> folder:
                </p>
                <ul className="list-disc list-inside text-[11px] text-slate-400 pl-2 space-y-1 mt-1 font-medium">
                  <li>Create folder <strong className="text-white">data/entity</strong>, <strong className="text-white">data/dao</strong>, and <strong className="text-white">data/database</strong> and copy-paste the Room entities, DAOs, and Database codes.</li>
                  <li>Create folder <strong className="text-white">receiver</strong> and paste the Boot and Alarm BroadcastReceivers.</li>
                  <li>Create folder <strong className="text-white">ui/theme</strong> and <strong className="text-white">ui/screens</strong> and paste the Compose theme colors and Screens.</li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-3.5">
              <div className="bg-emerald-900/60 text-emerald-300 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-200">Sync, Build & Generate APK</h4>
                <p className="text-slate-400 leading-relaxed">
                  In Android Studio, click <strong>Sync Project with Gradle Files</strong>. Once compilation completes without error:
                </p>
                <p className="text-slate-400 leading-relaxed mt-1">
                  Go to <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>. Android Studio will bundle the compiled Dalvik bytecode, SQLite Room schemas, and Jetpack Compose assets into a signed debug <strong className="text-white">.apk</strong> file. You can install it on any Android phone to test offline lecture reminders instantly!
                </p>
              </div>
            </div>

          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Need help with custom FUDMA API integrations?</span>
            <span className="text-emerald-400 underline">FUDMA Computer Science Dept</span>
          </div>

        </div>
      )}

    </div>
  );
};
