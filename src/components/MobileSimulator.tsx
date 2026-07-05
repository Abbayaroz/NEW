import React, { useState, useEffect } from 'react';
import { 
  Wifi, Battery, Bell, Calendar, User, ChevronLeft, Square, Home, BookOpen, 
  MapPin, Clock, CheckSquare, RefreshCw, AlertTriangle, Play, Volume2, 
  PlusCircle, Sparkles, LogIn, UserCheck, QrCode, FileText, Camera, ShieldCheck, 
  Compass, Barcode, X
} from 'lucide-react';
import { 
  User as UserType, TimetableSlot, AttendanceLog, Announcement, LectureNote, 
  NotificationSettings, SimulatedNotification 
} from '../types';

interface MobileSimulatorProps {
  users: UserType[];
  timetable: TimetableSlot[];
  attendanceLogs: AttendanceLog[];
  announcements: Announcement[];
  notes: LectureNote[];
  notifications: SimulatedNotification[];
  settings: NotificationSettings;
  activeUser: UserType | null;
  onLogin: (user: UserType) => void;
  onLogout: () => void;
  onRegister: (name: string, email: string, role: 'Student' | 'Lecturer', matricNo?: string) => { success: boolean; error?: string };
  onUpdateSettings: (settings: NotificationSettings) => void;
  onCheckinAttendance: (qrCode: string) => { success: boolean; message: string };
  onAddAttendance: (log: Omit<AttendanceLog, 'id'>) => void;
  onAddNotification: (title: string, message: string) => void;
  onCancelLecture: (timetableId: string) => void;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  users, timetable, attendanceLogs, announcements, notes, notifications, settings,
  activeUser, onLogin, onLogout, onRegister, onUpdateSettings,
  onCheckinAttendance, onAddAttendance, onAddNotification, onCancelLecture
}) => {
  
  // Mobile device system states
  const [mobileTab, setMobileTab] = useState<'home' | 'timetable' | 'tools' | 'alerts' | 'id_card'>('home');
  const [deviceTime, setDeviceTime] = useState('12:00');
  const [isVibrating, setIsVibrating] = useState(false);
  const [headsUp, setHeadsUp] = useState<SimulatedNotification | null>(null);

  // Authentication Flow inside mobile
  const [isRegistering, setIsRegistering] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'Student' | 'Lecturer'>('Student');
  const [regMatric, setRegMatric] = useState('');
  const [authError, setAuthError] = useState('');

  // Scanning simulation
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Active Lecture tools for lecturer
  const [viewingQrSlotId, setViewingQrSlotId] = useState<string | null>(null);

  // Tick clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDeviceTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter lectures for active user
  const userTimetable = timetable.filter(slot => {
    if (!activeUser) return false;
    if (activeUser.role === 'Student') {
      // Students see classes corresponding to their level (prepopulated is 300 level)
      return slot.level === '300 Level' || slot.level === '100 Level';
    }
    if (activeUser.role === 'Lecturer') {
      return slot.lecturerId === activeUser.id;
    }
    return true;
  });

  // Handle Login Inside Mobile Frame
  const handleMobileLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const matched = users.find(u => u.email === authEmail.trim());
    if (!matched) {
      setAuthError('No user account matches this email.');
      return;
    }
    if (matched.role === 'Lecturer' && !matched.isApproved) {
      setAuthError('Your staff account is pending administrator verification.');
      return;
    }
    onLogin(matched);
    setAuthEmail(''); setAuthPassword('');
  };

  // Handle Registration Inside Mobile Frame
  const handleMobileRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!regName || !regEmail) {
      setAuthError('All fields are required.');
      return;
    }
    const res = onRegister(regName, regEmail, regRole, regRole === 'Student' ? regMatric : undefined);
    if (res.success) {
      setIsRegistering(false);
      setAuthEmail(regEmail);
      setAuthError('Account registered! Staff pending approval. Students can login immediately.');
      setRegName(''); setRegEmail(''); setRegMatric('');
    } else {
      setAuthError(res.error || 'Registration failed.');
    }
  };

  // Sound Beep Simulation using browser Web Audio API
  const triggerAudioBeep = (freq = 880, dur = 0.2) => {
    if (!settings.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (e) {
      console.warn('Audio feedback blocked by browser settings.', e);
    }
  };

  // Device vibration simulation (shakes UI frame)
  const triggerHapticVibration = () => {
    if (!settings.vibrationEnabled) return;
    setIsVibrating(true);
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    setTimeout(() => setIsVibrating(false), 500);
  };

  // Simulation: Triggering an upcoming lecture warning
  const simulateActiveReminder = (slot: TimetableSlot) => {
    triggerAudioBeep(640, 0.35);
    triggerHapticVibration();

    const title = 'Upcoming Class Alert!';
    const message = `${slot.courseCode} lecture starts in ${settings.defaultReminderMinutes}m at ${slot.venueName || 'Lecture Hall'}. Lecturer: ${slot.lecturerName}.`;

    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    onAddNotification(title, message);
    setHeadsUp(newNotif);
    setTimeout(() => setHeadsUp(null), 5000);
  };

  // Simulation: Scanning QR Attendance Code
  const handleScanSimulation = (code: string) => {
    setIsScanning(true);
    setScanResult(null);
    triggerAudioBeep(520, 0.1);

    setTimeout(() => {
      setIsScanning(false);
      const res = onCheckinAttendance(code);
      if (res.success) {
        setScanResult('Success! Checked-in present.');
        triggerAudioBeep(980, 0.3);
      } else {
        setScanResult(`Error: ${res.message}`);
        triggerAudioBeep(220, 0.4);
      }
      setTimeout(() => setScanResult(null), 5000);
    }, 2000);
  };

  // Reschedule alert trigger
  const handleCancelAndNotify = (slotId: string, code: string) => {
    onCancelLecture(slotId);
    triggerAudioBeep(400, 0.4);
    triggerHapticVibration();

    const title = 'Lecture Cancelled / Rescheduled';
    const message = `NOTICE: ${code} lecture session has been cancelled or moved. Check updated bulletin sheets.`;
    onAddNotification(title, message);
    
    setHeadsUp({
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      isRead: false
    });
    setTimeout(() => setHeadsUp(null), 5000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      
      {/* Simulation info */}
      <div className="flex items-center space-x-1 mb-2.5 bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-extrabold shadow-2xs">
        <Sparkles className="w-3.5 h-3.5 text-slate-500 animate-spin" />
        <span>Dual Role Native Android Client Simulation</span>
      </div>

      {/* Main simulated android frame wrapper */}
      <div
        id="simulated_device"
        className={`w-[325px] h-[640px] bg-neutral-900 rounded-[44px] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[4px] border-neutral-800 relative transition-transform ${
          isVibrating ? 'animate-bounce translate-y-1' : ''
        }`}
        style={{
          boxShadow: '0 0 0 8px #262626, 0 20px 50px rgba(0,0,0,0.55)'
        }}
      >
        {/* Hardware volume slider visual indicators */}
        <div className="absolute -left-1 top-24 w-1 h-10 bg-neutral-800 rounded-l" />
        <div className="absolute -left-1 top-36 w-1 h-10 bg-neutral-800 rounded-l" />
        <div className="absolute -right-1 top-30 w-1 h-14 bg-neutral-800 rounded-r" />

        {/* Outer Frame Screen display */}
        <div className="w-full h-full bg-slate-50 rounded-[34px] overflow-hidden flex flex-col justify-between relative border border-black/45 select-none">
          
          {/* 1. Android Status Bar */}
          <div className="bg-slate-900 text-white h-7 px-4.5 flex items-center justify-between text-[10px] font-bold z-40 relative">
            <div className="flex items-center space-x-1">
              <span className="font-mono">{deviceTime}</span>
            </div>
            {/* Center black camera punchhole lens */}
            <div className="w-4 h-4 bg-black rounded-full absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-neutral-950 rounded-full border border-neutral-900" />
            </div>
            <div className="flex items-center space-x-1 font-mono text-[9px]">
              <span>5G</span>
              <Wifi className="w-3 h-3" />
              <Battery className="w-3 h-3" />
            </div>
          </div>

          {/* 2. Simulated Drops HeadsUp Warning Banner */}
          {headsUp && (
            <div
              onClick={() => { setMobileTab('alerts'); setHeadsUp(null); }}
              className="absolute left-2.5 right-2.5 top-8 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-xl z-50 flex items-start space-x-2 animate-bounce cursor-pointer ring-2 ring-emerald-500/10"
            >
              <div className="bg-emerald-700 text-white p-1.5 rounded-xl flex-shrink-0">
                <Bell className="w-3.5 h-3.5 text-emerald-100" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="text-[9px] uppercase font-black tracking-wider text-emerald-800">{headsUp.title}</span>
                <p className="text-[10px] font-bold text-slate-800 leading-tight">{headsUp.message}</p>
              </div>
            </div>
          )}

          {/* 3. Screen View Stage */}
          <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
            
            {/* IF USER IS NOT LOGGED IN: SHOW MOBILE AUTH */}
            {!activeUser ? (
              <div className="flex-1 p-5 flex flex-col justify-center bg-emerald-950 text-white">
                <div className="text-center space-y-2 mb-6">
                  <div className="w-12 h-12 bg-white text-emerald-900 rounded-2xl flex items-center justify-center font-black text-xl mx-auto shadow-md">
                    IK
                  </div>
                  <h3 className="font-black text-sm tracking-tight uppercase">IKCOE Reminder</h3>
                  <p className="text-[10px] text-emerald-300">Enterprise Timetable Portal</p>
                </div>

                {isRegistering ? (
                  // Registration Form
                  <form onSubmit={handleMobileRegister} className="space-y-3">
                    <span className="text-[11px] font-black uppercase text-emerald-400 block pb-1 border-b border-emerald-800">Register Staff / Student</span>
                    
                    <input 
                      type="text" value={regName} onChange={e => setRegName(e.target.value)}
                      placeholder="Full Name (e.g. Bashir Yaroz)" required
                      className="w-full bg-white/10 border border-white/20 text-xs font-bold px-3 py-2 rounded-xl text-white placeholder-emerald-300 focus:outline-none"
                    />

                    <input 
                      type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                      placeholder="Email (e.g. bashir@ikcoe.edu.ng)" required
                      className="w-full bg-white/10 border border-white/20 text-xs font-bold px-3 py-2 rounded-xl text-white placeholder-emerald-300 focus:outline-none"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        value={regRole} onChange={e => setRegRole(e.target.value as any)}
                        className="w-full bg-emerald-900 border border-white/20 text-xs font-bold px-3 py-2 rounded-xl text-white focus:outline-none"
                      >
                        <option value="Student">Student</option>
                        <option value="Lecturer">Lecturer</option>
                      </select>
                      
                      {regRole === 'Student' ? (
                        <input 
                          type="text" value={regMatric} onChange={e => setRegMatric(e.target.value)}
                          placeholder="IKCOE/CSC/22..." required
                          className="w-full bg-white/10 border border-white/20 text-xs font-bold px-2 py-2 rounded-xl text-white placeholder-emerald-300 focus:outline-none"
                        />
                      ) : (
                        <div className="text-[9px] text-emerald-300 font-bold flex items-center justify-center border border-white/10 rounded-xl bg-emerald-900/50">
                          Staff verification required
                        </div>
                      )}
                    </div>

                    {authError && <p className="text-[9px] text-red-300 font-bold text-center bg-red-950/40 p-1.5 rounded-lg border border-red-900/50">{authError}</p>}

                    <button type="submit" className="w-full bg-white hover:bg-emerald-100 text-emerald-950 font-extrabold text-xs py-2.5 rounded-xl cursor-pointer shadow-md">
                      Register My Account
                    </button>
                    <button type="button" onClick={() => { setIsRegistering(false); setAuthError(''); }} className="w-full text-white/75 hover:text-white text-[10px] font-bold py-1">
                      Return to Sign In
                    </button>
                  </form>
                ) : (
                  // Login Form
                  <form onSubmit={handleMobileLogin} className="space-y-3">
                    <span className="text-[11px] font-black uppercase text-emerald-400 block pb-1 border-b border-emerald-800">Secure Student/Staff Portal</span>
                    
                    <input 
                      type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                      placeholder="Registered Email Account" required
                      className="w-full bg-white/10 border border-white/20 text-xs font-bold px-3 py-2.5 rounded-xl text-white placeholder-emerald-300 focus:outline-none"
                    />

                    <input 
                      type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                      placeholder="Password credentials" required
                      className="w-full bg-white/10 border border-white/20 text-xs font-bold px-3 py-2.5 rounded-xl text-white placeholder-emerald-300 focus:outline-none font-sans"
                    />

                    {authError && <p className="text-[9px] text-red-300 font-bold text-center bg-red-950/40 p-1.5 rounded-lg border border-red-900/50">{authError}</p>}

                    <button type="submit" className="w-full bg-white hover:bg-emerald-100 text-emerald-950 font-extrabold text-xs py-2.5 rounded-xl cursor-pointer shadow-md">
                      Log In to System
                    </button>
                    <button type="button" onClick={() => { setIsRegistering(true); setAuthError(''); }} className="w-full text-white/75 hover:text-white text-[10px] font-bold py-1">
                      Create a staff/student account
                    </button>
                  </form>
                )}
              </div>
            ) : (
              
              // IF USER IS LOGGED IN: SHOW RESPECTIVE CLIENT INTERFACE (Student / Lecturer)
              <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                
                {/* Mobile Client Views */}
                <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto">
                  
                  {/* TAB A: HOME */}
                  {mobileTab === 'home' && (
                    <div className="space-y-4">
                      
                      {/* Greeting Header & Status Bar */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Welcome student</span>
                          <span className="text-xs font-extrabold text-slate-800 block line-clamp-1">{activeUser.name}</span>
                        </div>
                        <button onClick={onLogout} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[8px] px-2 py-1 rounded-lg">
                          Logout
                        </button>
                      </div>

                      {/* Announcement Highlight Banner */}
                      {announcements.length > 0 && (
                        <div className="bg-emerald-100 border border-emerald-200 p-2.5 rounded-xl space-y-1 relative overflow-hidden">
                          <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider flex items-center space-x-1">
                            <Bell className="w-3 h-3 text-emerald-600 animate-pulse" />
                            <span>Academic Bulletin</span>
                          </span>
                          <p className="text-[10px] font-bold text-slate-700 leading-tight">{announcements[0].title}</p>
                          <p className="text-[9px] text-slate-500 font-medium line-clamp-1">{announcements[0].content}</p>
                        </div>
                      )}

                      {/* Lectures timeline today */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Lectures Timeline Today</span>
                        {userTimetable.length > 0 ? (
                          <div className="space-y-2">
                            {userTimetable.map(slot => (
                              <div key={slot.id} className="bg-white border border-slate-150 p-3 rounded-xl shadow-2xs space-y-1.5 relative hover:border-emerald-500 transition">
                                <div className="flex justify-between items-center">
                                  <span className="bg-emerald-700 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-md font-mono">{slot.courseCode}</span>
                                  <button 
                                    onClick={() => simulateActiveReminder(slot)}
                                    className="text-slate-400 hover:text-emerald-700 p-1 rounded-md"
                                    title="Manually simulate upcoming alert"
                                  >
                                    <Clock className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <h4 className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-1">{slot.courseTitle}</h4>
                                <div className="flex items-center text-[9px] text-slate-400 font-semibold space-x-2">
                                  <span className="flex items-center"><MapPin className="w-3 h-3 text-slate-300 mr-0.5" />{slot.venueName}</span>
                                  <span>•</span>
                                  <span>{slot.startTime} - {slot.endTime}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-400 space-y-1">
                            <Calendar className="w-7 h-7 mx-auto text-slate-300 animate-bounce" />
                            <p className="text-[10px] font-bold">No lectures scheduled today.</p>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* TAB B: TIMETABLE WEEK VIEW */}
                  {mobileTab === 'timetable' && (
                    <div className="space-y-3">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-200 pb-1">Weekly Course Timetable</span>
                      <div className="space-y-2">
                        {userTimetable.map(slot => (
                          <div key={slot.id} className="bg-white border border-slate-150 p-2.5 rounded-xl flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="bg-slate-200 text-slate-700 font-extrabold text-[8px] px-1.5 py-0.2 rounded font-mono">{slot.courseCode}</span>
                              <h4 className="text-[10px] font-black text-slate-700 line-clamp-1">{slot.courseTitle}</h4>
                              <p className="text-[9px] text-slate-400 font-bold font-mono">{slot.day} • {slot.startTime} - {slot.endTime}</p>
                            </div>
                            <span className="bg-emerald-50 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded-md font-mono">{slot.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB C: INTERACTIVE TOOLS / QR ATTENDANCE SCANNER */}
                  {mobileTab === 'tools' && (
                    <div className="space-y-4">
                      
                      {activeUser.role === 'Student' ? (
                        <>
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-200 pb-1">QR Attendance Check-in</span>
                          
                          {/* Simulated Camera Viewfinder */}
                          <div className="aspect-square w-full bg-neutral-900 rounded-2xl relative overflow-hidden border border-neutral-700 flex flex-col items-center justify-center p-4">
                            
                            {isScanning ? (
                              <div className="space-y-2 text-center text-white">
                                <Compass className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                                <span className="text-[10px] font-bold uppercase tracking-wider block animate-pulse">Scanning QR Viewfinder...</span>
                              </div>
                            ) : scanResult ? (
                              <div className="p-4 bg-emerald-950/80 backdrop-blur-xs border border-emerald-500 rounded-xl text-center space-y-1 text-white">
                                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                                <span className="text-[11px] font-extrabold block">{scanResult}</span>
                              </div>
                            ) : (
                              <>
                                {/* Guide lines */}
                                <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-emerald-500" />
                                <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-emerald-500" />
                                <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-emerald-500" />
                                <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-emerald-500" />
                                
                                <Camera className="w-8 h-8 text-slate-500 animate-pulse mb-2" />
                                <span className="text-[10px] text-slate-400 font-semibold block text-center">Simulate camera scan of lecturer lecture slide QR code below</span>
                              </>
                            )}
                          </div>

                          {/* Quick test buttons */}
                          <div className="space-y-2 select-none">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Available Active Lecture QR codes</span>
                            <div className="grid grid-cols-2 gap-2">
                              {userTimetable.map(slot => (
                                <button
                                  key={slot.id}
                                  onClick={() => handleScanSimulation(`qr-${slot.id}`)}
                                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[9px] p-2 rounded-xl text-center cursor-pointer block line-clamp-1"
                                >
                                  Scan {slot.courseCode} QR
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        
                        // LECTURER MODULE PANEL TOOLS
                        <>
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-200 pb-1">Lecturer Tools Console</span>
                          <div className="space-y-3">
                            
                            {userTimetable.map(slot => (
                              <div key={slot.id} className="bg-white border border-slate-150 p-3 rounded-xl space-y-2.5">
                                <div className="flex justify-between items-center">
                                  <span className="bg-slate-200 text-slate-800 text-[8px] font-black px-1.5 py-0.5 rounded font-mono">{slot.courseCode}</span>
                                  <span className="text-[9px] text-slate-400 font-bold">{slot.day} • {slot.startTime}</span>
                                </div>
                                <h4 className="text-[10px] font-black text-slate-700 line-clamp-1">{slot.courseTitle}</h4>

                                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-100">
                                  <button 
                                    onClick={() => setViewingQrSlotId(viewingQrSlotId === slot.id ? null : slot.id)}
                                    className="bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-extrabold py-1.5 rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
                                  >
                                    <QrCode className="w-3.5 h-3.5" />
                                    <span>{viewingQrSlotId === slot.id ? 'Hide QR' : 'Show Attendance QR'}</span>
                                  </button>
                                  <button 
                                    onClick={() => handleCancelAndNotify(slot.id, slot.courseCode || '')}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[9px] font-black py-1.5 rounded-lg flex items-center justify-center space-x-0.5 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Cancel/Move</span>
                                  </button>
                                </div>

                                {viewingQrSlotId === slot.id && (
                                  <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200 text-center space-y-2 animate-bounce">
                                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider block">Class Check-In Barcode</span>
                                    {/* Simulated visual QR box */}
                                    <div className="w-24 h-24 bg-white p-1 rounded-lg border border-slate-300 mx-auto flex items-center justify-center">
                                      <QrCode className="w-20 h-20 text-slate-800" />
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-400 block font-bold">Code ID: qr-{slot.id}</span>
                                  </div>
                                )}
                              </div>
                            ))}

                          </div>
                        </>
                      )}

                    </div>
                  )}

                  {/* TAB D: ALERTS / NOTIFICATION BULLETINS */}
                  {mobileTab === 'alerts' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Alert Center ({notifications.length})</span>
                      </div>

                      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                        {notifications.length > 0 ? (
                          notifications.map(notif => (
                            <div key={notif.id} className="bg-white border border-slate-150 p-2.5 rounded-xl space-y-1 relative">
                              <span className="text-[9px] uppercase font-black text-emerald-800 block tracking-wider">{notif.title}</span>
                              <p className="text-[10px] font-semibold text-slate-700 leading-snug">{notif.message}</p>
                              <span className="text-[8px] text-slate-400 font-mono block font-medium">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-slate-400 space-y-1">
                            <Bell className="w-8 h-8 mx-auto text-slate-300" />
                            <p className="text-[10px] font-black">Notification center empty.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB E: DIGITAL STUDENT ID CARD */}
                  {mobileTab === 'id_card' && (
                    <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-200 pb-1">Digital Identity Card</span>
                      
                      <div className="bg-emerald-900 text-white rounded-2xl p-4.5 border border-emerald-800 shadow-md space-y-4 relative overflow-hidden">
                        
                        {/* watermark decoration */}
                        <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-emerald-800 rounded-full opacity-20" />

                        <div className="flex items-center space-x-2 pb-2.5 border-b border-emerald-800">
                          <div className="w-6 h-6 bg-white text-emerald-950 rounded-lg flex items-center justify-center font-black text-xs">
                            IK
                          </div>
                          <div>
                            <span className="font-black text-[9px] block uppercase leading-none tracking-wider">IKCOE BAYELSA</span>
                            <span className="text-[7px] text-emerald-300 block leading-none font-bold mt-0.5">COLLEGE OF EDUCATION</span>
                          </div>
                        </div>

                        <div className="flex space-x-3 text-left">
                          {/* Avatar */}
                          <div className="w-12 h-14 bg-slate-200 rounded-lg flex-shrink-0 flex items-center justify-center border border-emerald-800 overflow-hidden text-emerald-950 font-black text-sm">
                            PIC
                          </div>
                          <div className="space-y-1 min-w-0">
                            <span className="text-[11px] font-extrabold block leading-tight line-clamp-1">{activeUser.name}</span>
                            <span className="text-[9px] text-emerald-200 font-mono block leading-tight">{activeUser.matricNo || 'FACULTY STAFF'}</span>
                            <span className="bg-emerald-800 text-emerald-100 text-[8px] font-black px-1.5 py-0.5 rounded inline-block uppercase">
                              {activeUser.role}
                            </span>
                          </div>
                        </div>

                        {/* Barcode representation */}
                        <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col items-center">
                          <Barcode className="w-full h-8 text-neutral-800" />
                          <span className="text-[8px] font-mono text-slate-400 font-bold tracking-widest mt-0.5">IKCOE-{activeUser.id}</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* 4. Bottom Tab Bar Inside Mobile App Frame */}
                <div className="bg-white border-t border-slate-200 h-14 grid grid-cols-5 py-2 text-center select-none">
                  <button 
                    onClick={() => setMobileTab('home')}
                    className={`flex flex-col items-center justify-center cursor-pointer ${mobileTab === 'home' ? 'text-emerald-800' : 'text-slate-400'}`}
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-[8px] font-extrabold mt-0.5">Home</span>
                  </button>

                  <button 
                    onClick={() => setMobileTab('timetable')}
                    className={`flex flex-col items-center justify-center cursor-pointer ${mobileTab === 'timetable' ? 'text-emerald-800' : 'text-slate-400'}`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-[8px] font-extrabold mt-0.5">Calendar</span>
                  </button>

                  <button 
                    onClick={() => setMobileTab('tools')}
                    className={`flex flex-col items-center justify-center cursor-pointer ${mobileTab === 'tools' ? 'text-emerald-800' : 'text-slate-400'}`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-700 bg-emerald-50 rounded-full p-0.5" />
                    <span className="text-[8px] font-extrabold mt-0.5">Checkin</span>
                  </button>

                  <button 
                    onClick={() => setMobileTab('alerts')}
                    className={`flex flex-col items-center justify-center cursor-pointer ${mobileTab === 'alerts' ? 'text-emerald-800' : 'text-slate-400'}`}
                  >
                    <Bell className="w-4 h-4" />
                    <span className="text-[8px] font-extrabold mt-0.5">Alerts</span>
                  </button>

                  <button 
                    onClick={() => setMobileTab('id_card')}
                    className={`flex flex-col items-center justify-center cursor-pointer ${mobileTab === 'id_card' ? 'text-emerald-800' : 'text-slate-400'}`}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-[8px] font-extrabold mt-0.5">Identity</span>
                  </button>
                </div>

                {/* 5. Android OS Gestures Area */}
                <div className="bg-white h-7 px-10 flex items-center justify-between text-slate-400 pb-0.5 border-t border-slate-100">
                  <button onClick={() => setMobileTab('home')} className="hover:text-slate-600 cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setMobileTab('home')} className="hover:text-slate-600 cursor-pointer">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400" />
                  </button>
                  <button className="hover:text-slate-600 cursor-pointer">
                    <Square className="w-2.5 h-2.5 text-slate-400" />
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
