import React, { useState } from 'react';
import { NotificationSettings, SimulatedNotification } from '../types';
import { Settings, Bell, Volume2, ShieldAlert, Trash2, Smartphone, RotateCcw, Activity, Check, CheckSquare } from 'lucide-react';

interface NotificationsTabProps {
  settings: NotificationSettings;
  notifications: SimulatedNotification[];
  onUpdateSettings: (settings: NotificationSettings) => void;
  onClearNotifications: () => void;
  onSimulateReboot: () => void;
  onSimulateInstantAlarm: () => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  settings,
  notifications,
  onUpdateSettings,
  onClearNotifications,
  onSimulateReboot,
  onSimulateInstantAlarm,
}) => {
  const [rebooting, setRebooting] = useState(false);

  const toggleReminders = () => {
    onUpdateSettings({ ...settings, remindersEnabled: !settings.remindersEnabled });
  };

  const toggleVibration = () => {
    onUpdateSettings({ ...settings, vibrationEnabled: !settings.vibrationEnabled });
  };

  const toggleSound = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const handlePriorityChange = (priority: 'Low' | 'Default' | 'High') => {
    onUpdateSettings({ ...settings, priority });
  };

  const handleRebootClick = () => {
    setRebooting(true);
    onSimulateReboot();
    setTimeout(() => {
      setRebooting(false);
    }, 1800); // 1.8 seconds simulated reboot time
  };

  return (
    <div id="notifications_tab_container" className="flex flex-col h-full max-h-[580px] p-4 space-y-4 select-none overflow-y-auto scrollbar-none pb-8">
      
      {/* Header */}
      <div className="pb-1 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800 flex items-center space-x-1">
          <Settings className="w-4.5 h-4.5 text-emerald-700" />
          <span>Notification & System Settings</span>
        </h2>
        <p className="text-[10px] text-gray-400 font-medium">Configure Android alerts, sound preferences, and simulation triggers</p>
      </div>

      {/* Settings Panel */}
      <div className="bg-white border border-gray-150 rounded-2xl p-4 space-y-3 shadow-xs">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 flex items-center space-x-1">
          <Bell className="w-3.5 h-3.5" />
          <span>Alert Preferences</span>
        </h3>

        {/* Reminders Toggle */}
        <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
          <div>
            <span className="text-xs font-bold text-gray-800 block">Lecture Reminders</span>
            <span className="text-[10px] text-gray-400 font-medium">Receive automatic pre-lecture alerts</span>
          </div>
          <button
            onClick={toggleReminders}
            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
              settings.remindersEnabled ? 'bg-emerald-700 flex justify-end' : 'bg-gray-200 flex justify-start'
            }`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
          <div>
            <span className="text-xs font-bold text-gray-800 block">Sound Settings</span>
            <span className="text-[10px] text-gray-400 font-medium">Play ringtone sound when alarm triggers</span>
          </div>
          <button
            onClick={toggleSound}
            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
              settings.soundEnabled ? 'bg-emerald-700 flex justify-end' : 'bg-gray-200 flex justify-start'
            }`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Vibration Toggle */}
        <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
          <div>
            <span className="text-xs font-bold text-gray-800 block">Vibration Pattern</span>
            <span className="text-[10px] text-gray-400 font-medium">Vibrate device on receiving alerts</span>
          </div>
          <button
            onClick={toggleVibration}
            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
              settings.vibrationEnabled ? 'bg-emerald-700 flex justify-end' : 'bg-gray-200 flex justify-start'
            }`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Notification Priority */}
        <div className="flex items-center justify-between py-1.5">
          <div>
            <span className="text-xs font-bold text-gray-800 block">Heads-Up Priority</span>
            <span className="text-[10px] text-gray-400 font-medium">Manage alert display level on lockscreen</span>
          </div>
          <select
            value={settings.priority}
            onChange={(e) => handlePriorityChange(e.target.value as 'Low' | 'Default' | 'High')}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            <option value="Low">Low (Silent)</option>
            <option value="Default">Default (Slide-in)</option>
            <option value="High">High (Heads-Up Alert)</option>
          </select>
        </div>
      </div>

      {/* Simulated Notification History */}
      <div className="bg-white border border-gray-150 rounded-2xl p-4 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 flex items-center space-x-1">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Simulated Alarm History</span>
          </h3>
          {notifications.length > 0 && (
            <button
              onClick={onClearNotifications}
              className="text-rose-600 hover:text-rose-800 text-[10px] font-bold flex items-center space-x-0.5 transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-none pr-1">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex items-start space-x-2 text-[11px] hover:border-gray-200 transition"
              >
                <div className="bg-emerald-50 text-emerald-700 p-1 rounded-lg flex-shrink-0 mt-0.5">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-gray-800 truncate">{notif.title}</span>
                    <span className="text-[8px] text-gray-400 font-bold">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-500 font-medium leading-relaxed mt-0.5">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-150 rounded-xl p-6 text-center text-xs text-gray-400 font-medium">
            <Bell className="w-6 h-6 text-gray-300 mx-auto mb-1.5" />
            <span>No notifications fired yet. Use simulator tools to test triggers!</span>
          </div>
        )}
      </div>

      {/* HARDWARE ALARM & SYSTEM REBOOT SIMULATOR TOOLS */}
      <div className="bg-emerald-50/70 border border-emerald-100/60 rounded-2xl p-4 space-y-3 shadow-xs">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-900 flex items-center space-x-1">
          <Smartphone className="w-3.5 h-3.5 text-emerald-800" />
          <span>Android Hardware Simulator Tools</span>
        </h3>
        <p className="text-[10px] text-emerald-800/80 font-medium">
          Test background services and boot recovery resilience directly in the web environment:
        </p>

        <div className="grid grid-cols-2 gap-3.5 pt-1.5">
          {/* Simulate Phone Reboot Button */}
          <button
            onClick={handleRebootClick}
            disabled={rebooting}
            className="bg-white border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-emerald-900 rounded-xl p-3 flex flex-col items-center justify-center text-center transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className={`w-5 h-5 text-emerald-700 mb-1.5 ${rebooting ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-bold block">Simulate Reboot</span>
            <span className="text-[8px] text-emerald-700/70 mt-0.5 leading-snug">Test BootReceiver db restoring</span>
          </button>

          {/* Simulate Instant Alarm Button */}
          <button
            onClick={onSimulateInstantAlarm}
            className="bg-white border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-emerald-900 rounded-xl p-3 flex flex-col items-center justify-center text-center transition cursor-pointer active:scale-95"
          >
            <Activity className="w-5 h-5 text-amber-600 mb-1.5 animate-pulse" />
            <span className="text-[10px] font-bold block">Test Instant Alarm</span>
            <span className="text-[8px] text-emerald-700/70 mt-0.5 leading-snug">Fire heads-up alert now</span>
          </button>
        </div>

        {/* Simulated System Log Terminal */}
        {rebooting && (
          <div className="bg-gray-900 text-emerald-400 font-mono text-[9px] p-2.5 rounded-xl space-y-1 mt-2 shadow-inner border border-emerald-900/30">
            <p className="text-gray-400">--- SYSTEM BOOT TRIGGERED ---</p>
            <p className="animate-pulse">▶ Android OS restarting...</p>
            <p>▶ BroadCastReceiver: [ACTION_BOOT_COMPLETED]</p>
            <p>▶ BootReceiver.kt: Querying Room AppDatabase...</p>
            <p>▶ AlarmScheduler: Restored all saved class reminders!</p>
            <p className="text-white font-bold flex items-center space-x-1">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Timetable alarms successfully scheduled!</span>
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
