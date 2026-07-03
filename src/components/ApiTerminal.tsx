import React, { useState } from 'react';
import { Terminal, RefreshCw, Play, ShieldAlert, Wifi, Activity } from 'lucide-react';

interface ApiLog {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  status: number;
  payload: any;
  response: any;
  timestamp: string;
  latency: number;
}

interface ApiTerminalProps {
  logs: ApiLog[];
  onClearLogs: () => void;
  onSimulateCron: () => void;
  cronLogs: string[];
}

export const ApiTerminal: React.FC<ApiTerminalProps> = ({ logs, onClearLogs, onSimulateCron, cronLogs }) => {
  const [activeSubTab, setActiveSubTab] = useState<'rest_api' | 'cron_alarms'>('rest_api');

  return (
    <div className="bg-slate-950 text-slate-200 rounded-3xl p-5 border border-slate-800 shadow-sm font-mono text-xs space-y-4">
      
      {/* Header controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
          <span className="font-extrabold uppercase text-slate-300 tracking-wider text-[11px]">Backend Server REST API Console</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('rest_api')}
            className={`px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase transition ${activeSubTab === 'rest_api' ? 'bg-slate-850 text-emerald-400 border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
          >
            REST API Stream
          </button>
          <button
            onClick={() => setActiveSubTab('cron_alarms')}
            className={`px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase transition ${activeSubTab === 'cron_alarms' ? 'bg-slate-850 text-emerald-400 border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Cron Reminder Engine
          </button>
          <span className="text-slate-800">|</span>
          <button
            onClick={onClearLogs}
            className="text-slate-500 hover:text-slate-300 text-[9px] font-extrabold uppercase"
          >
            Clear
          </button>
        </div>
      </div>

      {/* VIEW A: REST API ENDPOINTS AUDITS */}
      {activeSubTab === 'rest_api' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
            <span>HTTP ENDPOINT STREAM</span>
            <span className="flex items-center text-emerald-500"><Wifi className="w-3 h-3 mr-0.5" />ONLINE</span>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {logs.length > 0 ? (
              logs.map(log => (
                <div key={log.id} className="bg-slate-900 border border-slate-850 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center space-x-2">
                      <span className={`px-1.5 py-0.5 rounded-md font-extrabold uppercase ${
                        log.method === 'GET' ? 'bg-blue-950/80 text-blue-400 border border-blue-900' :
                        log.method === 'POST' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900' :
                        log.method === 'DELETE' ? 'bg-rose-950/80 text-rose-400 border border-rose-900' : 'bg-amber-950/80 text-amber-400'
                      }`}>{log.method}</span>
                      <span className="font-bold text-slate-300 text-[11px]">{log.endpoint}</span>
                    </div>
                    <span className={`font-extrabold ${log.status >= 200 && log.status < 300 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      HTTP {log.status}
                    </span>
                  </div>

                  {log.payload && (
                    <div className="text-[10px] bg-slate-950/50 p-2 rounded-lg border border-slate-850">
                      <span className="text-slate-500 uppercase font-black text-[9px] block mb-1">Request Payloads</span>
                      <pre className="text-slate-400 whitespace-pre-wrap">{JSON.stringify(log.payload)}</pre>
                    </div>
                  )}

                  <div className="text-[10px] bg-slate-950/50 p-2 rounded-lg border border-slate-850">
                    <div className="flex justify-between text-slate-500 uppercase font-black text-[9px] mb-1">
                      <span>Server Response Body</span>
                      <span className="font-mono text-slate-600 font-bold">{log.latency} ms roundtrip</span>
                    </div>
                    <pre className="text-slate-400 whitespace-pre-wrap">{JSON.stringify(log.response, null, 2)}</pre>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-600 space-y-1 select-none">
                <Activity className="w-8 h-8 mx-auto text-slate-800 animate-spin" />
                <p className="text-[10px] font-bold">Waiting for REST API calls... Try clicking Web Portal tabs or simulator login forms!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW B: CRON ALARMS CHECKER */}
      {activeSubTab === 'cron_alarms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">LECTURE REMINDER ENGINE</span>
            <button
              onClick={onSimulateCron}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[9px] px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <Play className="w-3 h-3 text-emerald-200" />
              <span>Force cron execute</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-[10px] border-b border-slate-800 pb-2 text-slate-400 font-bold">
              <span>CRON TAB SCHEDULER ACTIVITY LOGS</span>
              <span className="text-emerald-400 text-[9px]">*/10 * * * * ENHANCED</span>
            </div>
            
            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1 text-[10px] font-mono leading-relaxed">
              {cronLogs.length > 0 ? (
                cronLogs.map((logLine, i) => (
                  <div key={i} className={`py-0.5 border-b border-slate-850/50 flex space-x-1.5 ${
                    logLine.includes('ALERT TRIGGERED') ? 'text-amber-400 font-bold' :
                    logLine.includes('RESTORED') ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    <span className="text-slate-600 font-bold">[{i + 1}]</span>
                    <span>{logLine}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-slate-600">
                  <ShieldAlert className="w-8 h-8 mx-auto text-slate-800 mb-1" />
                  <p className="text-[10px] font-bold">No alarms checked yet. Click "Force cron execute" to run checking sweeps!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
