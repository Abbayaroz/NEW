import React, { useState, useEffect } from 'react';
import { Lecture, StudentProfile, NotificationSettings, SimulatedNotification } from '../types';
import { SAMPLE_LECTURES, DEFAULT_PROFILE, DEFAULT_SETTINGS } from '../sampleData';
import { HomeTab } from './HomeTab';
import { TimetableTab } from './TimetableTab';
import { AddLectureTab } from './AddLectureTab';
import { NotificationsTab } from './NotificationsTab';
import { ProfileTab } from './ProfileTab';
import { Wifi, Battery, Home, ChevronLeft, Square, Bell, Play, Volume2, Shield, Calendar, BookOpen, AlertCircle, Sparkles, PlusCircle, User } from 'lucide-react';

export const AndroidFrame: React.FC = () => {
  // --- LOCAL PERSISTENT STATES ---
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('fudma_student_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [lectures, setLectures] = useState<Lecture[]>(() => {
    const saved = localStorage.getItem('fudma_lectures_list');
    return saved ? JSON.parse(saved) : SAMPLE_LECTURES;
  });

  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('fudma_notification_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [notifications, setNotifications] = useState<SimulatedNotification[]>(() => {
    const saved = localStorage.getItem('fudma_notifications_history');
    return saved ? JSON.parse(saved) : [];
  });

  // --- DEVICE SYSTEM STATES ---
  const [activeTab, setActiveTab] = useState<string>('home');
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [systemTime, setSystemTime] = useState<string>('');
  const [headsUpNotif, setHeadsUpNotif] = useState<SimulatedNotification | null>(null);
  const [isVibrating, setIsVibrating] = useState<boolean>(false);

  // Sync ticking clock for Android status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save states to local storage on changes
  useEffect(() => {
    localStorage.setItem('fudma_student_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('fudma_lectures_list', JSON.stringify(lectures));
  }, [lectures]);

  useEffect(() => {
    localStorage.setItem('fudma_notification_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('fudma_notifications_history', JSON.stringify(notifications));
  }, [notifications]);

  // --- ACTIONS & HANDLERS ---
  const handleSaveLecture = (savedLec: Lecture) => {
    let updated: Lecture[];
    if (editingLecture) {
      // Edit mode
      updated = lectures.map((l) => (l.id === savedLec.id ? savedLec : l));
      setEditingLecture(null);
    } else {
      // Add mode
      updated = [...lectures, savedLec];
    }
    setLectures(updated);
    setActiveTab('timetable');
  };

  const handleDeleteLecture = (id: string) => {
    const updated = lectures.filter((l) => l.id !== id);
    setLectures(updated);
  };

  const handleEditLectureRequest = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setActiveTab('add_lecture');
  };

  const handleCancelEdit = () => {
    setEditingLecture(null);
    setActiveTab('timetable');
  };

  // Synthesise audio beep representing notification sound
  const playNotificationSound = () => {
    if (!settings.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Ringtone double beep sequence
      const playBeep = (delay: number, frequency: number, duration: number) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
          
          gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start();
          osc.stop(audioCtx.currentTime + duration);
        }, delay);
      };

      playBeep(0, 587.33, 0.25); // D5
      playBeep(180, 880, 0.35);  // A5
    } catch (e) {
      console.warn("Web Audio not allowed or failed to load:", e);
    }
  };

  // Simulate haptic vibration via shaking the device frame
  const triggerHapticVibration = () => {
    if (!settings.vibrationEnabled) return;
    setIsVibrating(true);
    // Vibrate real phone device browser if supported
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    setTimeout(() => {
      setIsVibrating(false);
    }, 600);
  };

  // Trigger simulated heads up notification
  const handleTriggerNotification = (lecture: Lecture) => {
    if (!settings.remindersEnabled) return;

    const notifMessage = `${lecture.courseCode} – ${lecture.courseTitle} starts in ${lecture.reminderMinutes} minutes at ${lecture.venue}. Lecturer: ${lecture.lecturer}.`;
    
    const newNotif: SimulatedNotification = {
      id: `notif-${Date.now()}`,
      title: 'Upcoming Lecture Reminder',
      message: notifMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setHeadsUpNotif(newNotif);
    playNotificationSound();
    triggerHapticVibration();

    // Auto dismiss heads up banner after 6 seconds
    setTimeout(() => {
      setHeadsUpNotif((curr) => (curr?.id === newNotif.id ? null : curr));
    }, 6500);
  };

  // Simulate phone restart trigger (BootReceiver test)
  const handleSimulateReboot = () => {
    // History notification triggered on reboot
    setTimeout(() => {
      const rebootNotif: SimulatedNotification = {
        id: `reboot-${Date.now()}`,
        title: 'System Restart: Alarms Restored',
        message: `BootReceiver successfully scheduled all ${lectures.length} saved course reminders in local AlarmManager from Room DB.`,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setNotifications((prev) => [rebootNotif, ...prev]);
      playNotificationSound();
    }, 1800);
  };

  // Instant alarm simulation tool
  const handleSimulateInstantAlarm = () => {
    if (lectures.length > 0) {
      // Pick first lecture or any random lecture
      const randomLec = lectures[Math.floor(Math.random() * lectures.length)];
      handleTriggerNotification(randomLec);
    } else {
      alert("Please add at least one lecture in the 'Add Lecture' tab to simulate alarms!");
    }
  };

  return (
    <div id="android_frame_wrapper" className="flex flex-col items-center justify-center p-2 md:p-6 select-none">
      
      {/* Simulation Banner Label */}
      <div className="flex items-center space-x-1.5 mb-3 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xs">
        <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
        <span>FUDMA Android Device Simulator v1.0</span>
      </div>

      {/* Main Simulated Android Phone Body Frame */}
      <div
        id="android_device_body"
        className={`w-[340px] h-[670px] bg-neutral-900 rounded-[44px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] border-[4px] border-neutral-800 relative transition-transform ${
          isVibrating ? 'animate-bounce translate-y-1' : ''
        }`}
        style={{
          boxShadow: '0 0 0 10px #262626, 0 25px 60px -15px rgba(0,0,0,0.5)',
        }}
      >
        {/* Hardware details: Side volume buttons and power buttons visual indicators */}
        <div className="absolute -left-1.5 top-28 w-1 h-12 bg-neutral-800 rounded-l-lg border-l border-neutral-700" />
        <div className="absolute -left-1.5 top-44 w-1 h-12 bg-neutral-800 rounded-l-lg border-l border-neutral-700" />
        <div className="absolute -right-1.5 top-36 w-1 h-16 bg-neutral-800 rounded-r-lg border-r border-neutral-700" />

        {/* Outer Phone Screen Display Container */}
        <div
          id="android_screen"
          className="w-full h-full bg-slate-50 rounded-[34px] overflow-hidden flex flex-col justify-between relative border border-black/40"
        >
          {/* Top Status Bar Grid */}
          <div id="android_status_bar" className="bg-emerald-950 text-white h-8 px-4 flex items-center justify-between text-[11px] font-bold z-40 select-none relative">
            
            {/* Left status bar indicators */}
            <div className="flex items-center space-x-1">
              <span className="font-mono">{systemTime}</span>
              <Bell className="w-2.5 h-2.5 text-emerald-400" />
            </div>

            {/* Central camera punch-hole lens */}
            <div className="w-4.5 h-4.5 bg-black rounded-full absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full border border-neutral-800" />
            </div>

            {/* Right status bar indicators */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[9px] font-mono">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono">98%</span>
            </div>
          </div>

          {/* SIMULATED HEADS-UP NOTIFICATION DRAWER DROPDOWN */}
          {headsUpNotif && (
            <div
              id="heads_up_notification_banner"
              onClick={() => {
                setActiveTab('notifications');
                setHeadsUpNotif(null);
              }}
              className="absolute left-3 right-3 top-10 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-3 shadow-xl z-50 flex items-start space-x-2.5 animate-bounce cursor-pointer select-none ring-2 ring-emerald-600/10"
            >
              <div className="bg-emerald-700 text-white p-2 rounded-xl flex-shrink-0">
                <Bell className="w-4 h-4 text-emerald-100" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-800">
                    {headsUpNotif.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHeadsUpNotif(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xs font-bold px-1.5 bg-gray-100 rounded"
                  >
                    ×
                  </button>
                </div>
                <p className="text-[11px] font-bold text-gray-800 leading-snug mt-1">
                  {headsUpNotif.message}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button className="bg-emerald-700 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg">
                    Open Timetable
                  </button>
                  <button className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2.5 py-1 rounded-lg">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CENTER APP BODY VIEW AREA */}
          <div id="android_app_content" className="flex-1 bg-slate-50 relative overflow-hidden">
            {activeTab === 'home' && (
              <HomeTab
                profile={profile}
                lectures={lectures}
                onNavigate={(tab) => setActiveTab(tab)}
                onSimulateReminder={handleTriggerNotification}
              />
            )}
            
            {activeTab === 'timetable' && (
              <TimetableTab
                lectures={lectures}
                onDeleteLecture={handleDeleteLecture}
                onEditLecture={handleEditLectureRequest}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'add_lecture' && (
              <AddLectureTab
                editingLecture={editingLecture}
                lectures={lectures}
                onSaveLecture={handleSaveLecture}
                onCancelEdit={handleCancelEdit}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsTab
                settings={settings}
                notifications={notifications}
                onUpdateSettings={setSettings}
                onClearNotifications={() => setNotifications([])}
                onSimulateReboot={handleSimulateReboot}
                onSimulateInstantAlarm={handleSimulateInstantAlarm}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab
                profile={profile}
                onUpdateProfile={setProfile}
              />
            )}
          </div>

          {/* BOTTOM NAVIGATION TABS AND BUTTON BAR */}
          <div id="android_app_navigation_and_system" className="bg-white border-t border-gray-150 z-40 select-none">
            
            {/* Bottom App Navigation Tabs */}
            <div id="bottom_navigation_bar" className="grid grid-cols-5 py-2.5 text-center bg-white border-b border-gray-50">
              
              {/* Home Tab */}
              <button
                onClick={() => {
                  setActiveTab('home');
                  setEditingLecture(null);
                }}
                className={`flex flex-col items-center justify-center cursor-pointer transition ${
                  activeTab === 'home' ? 'text-emerald-800 scale-105' : 'text-gray-400 hover:text-emerald-700'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[8px] font-bold mt-0.5">Home</span>
              </button>

              {/* Timetable Tab */}
              <button
                onClick={() => {
                  setActiveTab('timetable');
                  setEditingLecture(null);
                }}
                className={`flex flex-col items-center justify-center cursor-pointer transition ${
                  activeTab === 'timetable' ? 'text-emerald-800 scale-105' : 'text-gray-400 hover:text-emerald-700'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-[8px] font-bold mt-0.5">Timetable</span>
              </button>

              {/* Add Lecture Tab */}
              <button
                onClick={() => {
                  setActiveTab('add_lecture');
                  setEditingLecture(null);
                }}
                className={`flex flex-col items-center justify-center cursor-pointer transition ${
                  activeTab === 'add_lecture' ? 'text-emerald-800 scale-105' : 'text-gray-400 hover:text-emerald-700'
                }`}
              >
                <PlusCircle className="w-5.5 h-5.5 text-emerald-700 bg-emerald-50 rounded-full p-0.5" />
                <span className="text-[8px] font-bold mt-0.5">Add</span>
              </button>

              {/* Settings / Notifications Tab */}
              <button
                onClick={() => {
                  setActiveTab('notifications');
                  setEditingLecture(null);
                }}
                className={`flex flex-col items-center justify-center cursor-pointer transition ${
                  activeTab === 'notifications' ? 'text-emerald-800 scale-105' : 'text-gray-400 hover:text-emerald-700'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="text-[8px] font-bold mt-0.5">Alerts</span>
              </button>

              {/* Profile Tab */}
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setEditingLecture(null);
                }}
                className={`flex flex-col items-center justify-center cursor-pointer transition ${
                  activeTab === 'profile' ? 'text-emerald-800 scale-105' : 'text-gray-400 hover:text-emerald-700'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[8px] font-bold mt-0.5">ID Card</span>
              </button>
            </div>

            {/* Android OS System Navigation Gestures Bar (Back, Home, Recents) */}
            <div id="android_system_navigation_bar" className="bg-white h-7.5 px-12 flex items-center justify-between text-neutral-400 pb-1">
              <button
                onClick={() => {
                  if (activeTab !== 'home') setActiveTab('home');
                }}
                className="hover:text-neutral-600 transition cursor-pointer"
                title="Android Back Button"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => {
                  setActiveTab('home');
                  setEditingLecture(null);
                }}
                className="hover:text-neutral-600 transition cursor-pointer"
                title="Android Home Button"
              >
                <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-400" />
              </button>
              <button
                className="hover:text-neutral-600 transition cursor-pointer"
                title="Android Recents Button"
              >
                <Square className="w-3 h-3 text-neutral-400" />
              </button>
            </div>

          </div>

        </div>
      </div>
      
    </div>
  );
};
