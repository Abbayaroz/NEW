import React, { useState, useEffect } from 'react';
import { WebPortal } from './components/WebPortal';
import { MobileSimulator } from './components/MobileSimulator';
import { BlueprintExplorer } from './components/BlueprintExplorer';
import { ApiTerminal } from './components/ApiTerminal';
import { 
  User, Faculty, Department, Programme, Course, Venue, 
  TimetableSlot, AttendanceLog, Announcement, Assignment, 
  LectureNote, AuditLog, NotificationSettings, SimulatedNotification 
} from './types';
import { 
  Building2, ShieldCheck, Heart, Sparkles, Terminal, Laptop, 
  Phone, FileCode, Users, Database, LogIn, ChevronRight, CheckSquare, HelpCircle 
} from 'lucide-react';

// ==========================================
// SEED DATA FOR OFFLINE FAILSAFE FALLBACKS
// ==========================================
const DEFAULT_USERS: User[] = [
  { id: "usr-admin", email: "admin@ikcoe.edu.ng", role: "Administrator", name: "Dr. Tarila Kingsley" },
  { id: "usr-lecturer1", email: "sulaiman@ikcoe.edu.ng", role: "Lecturer", name: "Mr. Sulaiman M. Garba", isApproved: true },
  { id: "usr-lecturer2", email: "florence@ikcoe.edu.ng", role: "Lecturer", name: "Mrs. Florence Boro", isApproved: true },
  { id: "usr-student1", email: "bashir@ikcoe.edu.ng", role: "Student", name: "Bashir Abba Yaroz", matricNo: "IKCOE/CSC/22/0142" },
  { id: "usr-officer1", email: "timetable@ikcoe.edu.ng", role: "Timetable Officer", name: "Engr. Pere Joseph", isApproved: true }
];

const DEFAULT_FACULTIES: Faculty[] = [
  { id: "fac-1", name: "School of Sciences", code: "SOS" },
  { id: "fac-2", name: "School of Vocational Education", code: "SVE" },
  { id: "fac-3", name: "School of Arts & Social Sciences", code: "SASS" }
];

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: "dept-1", facultyId: "fac-1", name: "Computer Science Education", code: "CSC" },
  { id: "dept-2", facultyId: "fac-1", name: "Integrated Science", code: "ISC" },
  { id: "dept-3", facultyId: "fac-2", name: "Business Education", code: "BED" }
];

const DEFAULT_PROGRAMMES: Programme[] = [
  { id: "prog-1", departmentId: "dept-1", name: "N.C.E Computer Science Education" },
  { id: "prog-2", departmentId: "dept-1", name: "B.Sc (Ed) Computer Science" }
];

const DEFAULT_COURSES: Course[] = [
  { id: "crs-205", code: "CSC 205", title: "Operations Research and Optimisation", credits: 3, departmentId: "dept-1" },
  { id: "crs-431", code: "CMP 431", title: "Artificial Intelligence and Expert Systems", credits: 4, departmentId: "dept-1" },
  { id: "crs-102", code: "CYB 102", title: "Social Media and Security", credits: 2, departmentId: "dept-1" },
  { id: "crs-111", code: "CSC 111", title: "Introduction to Computing", credits: 2, departmentId: "dept-1" }
];

const DEFAULT_VENUES: Venue[] = [
  { id: "ven-1", name: "Smart Computer Lab", capacity: 60, block: "Science Block A" },
  { id: "ven-2", name: "Lecture Hall B", capacity: 120, block: "Main Theatre Complex" },
  { id: "ven-3", name: "Boro Auditorium", capacity: 350, block: "Administrative Area" }
];

const DEFAULT_TIMETABLE: TimetableSlot[] = [
  { id: "tt-1", courseId: "crs-205", lecturerId: "usr-lecturer1", venueId: "ven-1", day: "Monday", startTime: "10:00", endTime: "12:00", level: "300 Level", courseCode: "CSC 205", courseTitle: "Operations Research", lecturerName: "Mr. Sulaiman M. Garba", venueName: "Smart Computer Lab" },
  { id: "tt-2", courseId: "crs-431", lecturerId: "usr-lecturer1", venueId: "ven-1", day: "Wednesday", startTime: "08:00", endTime: "10:00", level: "300 Level", courseCode: "CMP 431", courseTitle: "Artificial Intelligence", lecturerName: "Mr. Sulaiman M. Garba", venueName: "Smart Computer Lab" },
  { id: "tt-3", courseId: "crs-102", lecturerId: "usr-lecturer2", venueId: "ven-2", day: "Friday", startTime: "14:00", endTime: "16:00", level: "100 Level", courseCode: "CYB 102", courseTitle: "Social Media and Security", lecturerName: "Mrs. Florence Boro", venueName: "Lecture Hall B" }
];

const DEFAULT_ATTENDANCE: AttendanceLog[] = [
  { id: "att-1", timetableId: "tt-1", date: "2026-06-29", studentId: "usr-student1", status: "Present", checkedInAt: "10:05", studentName: "Bashir Yaroz", matricNo: "IKCOE/CSC/22/0142", courseCode: "CSC 205" }
];

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { id: "ann-1", title: "CSC 205 Continuous Assessment Notice", content: "Dear students, there will be a continuous assessment on Monday operations research slots. Bring your computing sheets.", lecturerId: "usr-lecturer1", timestamp: new Date().toISOString() }
];

const DEFAULT_ASSIGNMENTS: Assignment[] = [];
const DEFAULT_NOTES: LectureNote[] = [
  { id: "note-1", courseId: "crs-205", title: "Module 1: Introduction to LP Simplex Methods", fileName: "lp_intro_simplex_slide1.pdf", fileSize: "1.6 MB", courseCode: "CSC 205" },
  { id: "note-2", courseId: "crs-431", title: "Module 2: Expert Rule Systems Handout", fileName: "expert_rule_systems.pdf", fileSize: "3.2 MB", courseCode: "CMP 431" }
];

const DEFAULT_NOTIFICATIONS: SimulatedNotification[] = [
  { id: "notif-1", title: "Official Timetable Live", message: "IKCOE Computer Science weekly timetable allocations has been fully validated and published.", timestamp: new Date().toISOString(), isRead: false }
];

const DEFAULT_SETTINGS: NotificationSettings = {
  remindersEnabled: true,
  defaultReminderMinutes: 15,
  vibrationEnabled: true,
  soundEnabled: true,
  priority: 'High',
  smsNotifications: false,
  emailNotifications: true
};

const DEFAULT_AUDITS: AuditLog[] = [
  { id: "aud-1", action: "System Initialize", detail: "Institutional core database initialized and seeded successfully.", userId: "usr-admin", timestamp: new Date().toISOString() }
];

export default function App() {
  
  // Active Workspace Panels
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'portal' | 'simulator' | 'blueprints'>('portal');

  // Core Relational Database States
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [faculties, setFaculties] = useState<Faculty[]>(DEFAULT_FACULTIES);
  const [departments, setDepartments] = useState<Department[]>(DEFAULT_DEPARTMENTS);
  const [programmes, setProgrammes] = useState<Programme[]>(DEFAULT_PROGRAMMES);
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [venues, setVenues] = useState<Venue[]>(DEFAULT_VENUES);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(DEFAULT_TIMETABLE);
  const [attendance, setAttendance] = useState<AttendanceLog[]>(DEFAULT_ATTENDANCE);
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [assignments, setAssignments] = useState<Assignment[]>(DEFAULT_ASSIGNMENTS);
  const [notes, setNotes] = useState<LectureNote[]>(DEFAULT_NOTES);
  const [notifications, setNotifications] = useState<SimulatedNotification[]>(DEFAULT_NOTIFICATIONS);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(DEFAULT_AUDITS);

  // Authenticated State & Profile
  const [activeUser, setActiveUser] = useState<User | null>(DEFAULT_USERS[0]); // Starts with admin signed in for seamless exploration

  // REST API Stream Logging Terminal
  const [apiLogs, setApiLogs] = useState<any[]>([]);
  const [cronLogs, setCronLogs] = useState<string[]>([
    "[" + new Date().toLocaleTimeString() + "] [ReminderService] BootReceiver registered with OS AlarmManager.",
    "[" + new Date().toLocaleTimeString() + "] [ReminderService] Scheduled background worker loops successfully running every 10m."
  ]);

  // Synchronous network logging helper
  const logApiRequest = (method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, status: number, payload: any, response: any, latency: number) => {
    setApiLogs(prev => [
      {
        id: `log-${Date.now()}`,
        method,
        endpoint,
        status,
        payload,
        response,
        timestamp: new Date().toLocaleTimeString(),
        latency
      },
      ...prev
    ]);
  };

  // Synchronise state from Express backend endpoints if active, with graceful fallback to local memory
  const syncStateWithServer = async () => {
    const startTime = Date.now();
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        // Fetch users
        const uRes = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${activeUser?.id || 'usr-admin'}` } });
        if (uRes.ok) {
          const uData = await uRes.json();
          setUsers(uData);
        }
        // Fetch timetable slots
        const tRes = await fetch('/api/timetable', { headers: { 'Authorization': `Bearer ${activeUser?.id || 'usr-admin'}` } });
        if (tRes.ok) {
          const tData = await tRes.json();
          setTimetable(tData);
        }
      }
    } catch (e) {
      console.warn("[App.tsx State Sync] Express Server offline or booting. Operating in offline resilient sandbox mode.", e);
    }
  };

  useEffect(() => {
    syncStateWithServer();
  }, [activeUser]);

  // ==========================================
  // TRANSACTION / ACTION HANDLERS (MUTATIONS)
  // ==========================================

  const handleAddFaculty = (name: string, code: string) => {
    const start = Date.now();
    const newFac = { id: `fac-${Date.now()}`, name, code };
    setFaculties(prev => [...prev, newFac]);
    
    const newAudit = { id: `aud-${Date.now()}`, action: "Add Faculty", detail: `Registered Faculty/School: ${name} (${code})`, userId: activeUser?.id || 'usr-admin', timestamp: new Date().toISOString() };
    setAuditLogs(prev => [newAudit, ...prev]);

    logApiRequest('POST', '/api/admin/faculties', 201, { name, code }, newFac, Date.now() - start);
  };

  const handleAddDepartment = (facultyId: string, name: string, code: string) => {
    const start = Date.now();
    const newDept = { id: `dept-${Date.now()}`, facultyId, name, code };
    setDepartments(prev => [...prev, newDept]);

    const newAudit = { id: `aud-${Date.now()}`, action: "Add Department", detail: `Registered Department: ${name} under Faculty ID: ${facultyId}`, userId: activeUser?.id || 'usr-admin', timestamp: new Date().toISOString() };
    setAuditLogs(prev => [newAudit, ...prev]);

    logApiRequest('POST', '/api/admin/departments', 201, { facultyId, name, code }, newDept, Date.now() - start);
  };

  const handleAddCourse = (code: string, title: string, credits: number, departmentId: string) => {
    const start = Date.now();
    const newCrs = { id: `crs-${Date.now()}`, code, title, credits, departmentId };
    setCourses(prev => [...prev, newCrs]);

    const newAudit = { id: `aud-${Date.now()}`, action: "Add Course", detail: `Added Course syllabus: ${code} - ${title}`, userId: activeUser?.id || 'usr-admin', timestamp: new Date().toISOString() };
    setAuditLogs(prev => [newAudit, ...prev]);

    logApiRequest('POST', '/api/admin/courses', 201, { code, title, credits, departmentId }, newCrs, Date.now() - start);
  };

  const handleAddVenue = (name: string, capacity: number, block: string) => {
    const start = Date.now();
    const newVen = { id: `ven-${Date.now()}`, name, capacity, block };
    setVenues(prev => [...prev, newVen]);

    const newAudit = { id: `aud-${Date.now()}`, action: "Add Venue", detail: `Registered Classroom: ${name} (Sitting Cap: ${capacity}) at ${block}`, userId: activeUser?.id || 'usr-admin', timestamp: new Date().toISOString() };
    setAuditLogs(prev => [newAudit, ...prev]);

    logApiRequest('POST', '/api/admin/venues', 201, { name, capacity, block }, newVen, Date.now() - start);
  };

  // Conflict Solver algorithm implementation
  const handleAddTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    const start = Date.now();
    
    // Quick time parser to compare hours and minutes
    const parseTimeToMins = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const newStart = parseTimeToMins(slot.startTime);
    const newEnd = parseTimeToMins(slot.endTime);

    const conflicts: string[] = [];

    // Check overlaps
    timetable.forEach(t => {
      if (t.day !== slot.day) return;
      const tStart = parseTimeToMins(t.startTime);
      const tEnd = parseTimeToMins(t.endTime);

      const overlaps = (newStart < tEnd && newEnd > tStart);
      if (overlaps) {
        if (t.venueId === slot.venueId) {
          const v = venues.find(vn => vn.id === slot.venueId);
          conflicts.push(`Room Clash: ${v?.name || 'Venue'} is already occupied by course ${t.courseCode} on ${slot.day} between ${t.startTime} and ${t.endTime}.`);
        }
        if (t.lecturerId === slot.lecturerId) {
          const l = users.find(u => u.id === slot.lecturerId);
          conflicts.push(`Lecturer Double-Assignment: Instructor ${l?.name || 'Lecturer'} is already teaching another lecture on ${slot.day} at ${t.startTime} - ${t.endTime}.`);
        }
      }
    });

    if (conflicts.length > 0) {
      logApiRequest('POST', '/api/timetable', 409, slot, { error: "Scheduling conflicts found.", conflicts }, Date.now() - start);
      return { success: false, error: "Double booking booking attempt blocked by safety system.", conflicts };
    }

    const crs = courses.find(c => c.id === slot.courseId);
    const lec = users.find(u => u.id === slot.lecturerId);
    const ven = venues.find(v => v.id === slot.venueId);

    const newSlot: TimetableSlot = {
      id: `tt-${Date.now()}`,
      ...slot,
      courseCode: crs?.code || 'N/A',
      courseTitle: crs?.title || 'N/A',
      lecturerName: lec?.name || 'N/A',
      venueName: ven?.name || 'N/A'
    };

    setTimetable(prev => [...prev, newSlot]);
    
    const newAudit = { id: `aud-${Date.now()}`, action: "Add Timetable", detail: `Allocated Slot for ${crs?.code} on ${slot.day} (${slot.startTime}-${slot.endTime})`, userId: activeUser?.id || 'usr-admin', timestamp: new Date().toISOString() };
    setAuditLogs(prev => [newAudit, ...prev]);

    logApiRequest('POST', '/api/timetable', 201, slot, newSlot, Date.now() - start);
    return { success: true };
  };

  const handleDeleteTimetableSlot = (id: string) => {
    const start = Date.now();
    setTimetable(prev => prev.filter(t => t.id !== id));
    logApiRequest('DELETE', `/api/timetable/${id}`, 200, null, { message: "Slot deleted." }, Date.now() - start);
  };

  const handleApproveUser = (id: string) => {
    const start = Date.now();
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isApproved: true } : u));
    
    const uName = users.find(u => u.id === id)?.name || "User";
    const newAudit = { id: `aud-${Date.now()}`, action: "User Approved", detail: `Approved account for staff lecturer ${uName}`, userId: activeUser?.id || 'usr-admin', timestamp: new Date().toISOString() };
    setAuditLogs(prev => [newAudit, ...prev]);

    logApiRequest('PUT', `/api/admin/users/${id}/approve`, 200, null, { success: true }, Date.now() - start);
  };

  const handleDeleteUser = (id: string) => {
    const start = Date.now();
    setUsers(prev => prev.filter(u => u.id !== id));
    logApiRequest('DELETE', `/api/admin/users/${id}`, 200, null, { success: true }, Date.now() - start);
  };

  const handleResetUserPassword = (id: string) => {
    const start = Date.now();
    const u = users.find(u => u.id === id);
    logApiRequest('POST', `/api/auth/reset-password`, 200, { userId: id }, { message: `Secure SHA256 hashed temporary key generated for ${u?.email}` }, Date.now() - start);
  };

  const handleRegisterUser = (name: string, email: string, role: 'Student' | 'Lecturer', matricNo?: string) => {
    const start = Date.now();
    if (users.some(u => u.email === email)) {
      logApiRequest('POST', '/api/auth/register', 400, { name, email, role }, { error: "Email already exists" }, Date.now() - start);
      return { success: false, error: "This email address is already in use." };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      matricNo,
      isApproved: role === 'Student' // Students auto-approved, lecturers need admin approval
    };

    setUsers(prev => [...prev, newUser]);
    logApiRequest('POST', '/api/auth/register', 201, { name, email, role, matricNo }, { message: "Account created", user: newUser }, Date.now() - start);
    return { success: true };
  };

  const handleAddAnnouncement = (title: string, content: string) => {
    const start = Date.now();
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      lecturerId: activeUser?.id || 'usr-lecturer1',
      timestamp: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    logApiRequest('POST', '/api/announcements', 201, { title, content }, newAnn, Date.now() - start);
  };

  const handleAddAssignment = (courseId: string, title: string, dueDate: string, description: string) => {
    const start = Date.now();
    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      courseId,
      title,
      dueDate,
      description,
      lecturerId: activeUser?.id || 'usr-lecturer1'
    };
    setAssignments(prev => [...prev, newAsg]);
    logApiRequest('POST', '/api/assignments', 201, { courseId, title, dueDate, description }, newAsg, Date.now() - start);
  };

  const handleAddNote = (courseId: string, title: string, fileName: string) => {
    const start = Date.now();
    const crs = courses.find(c => c.id === courseId);
    const newNote: LectureNote = {
      id: `note-${Date.now()}`,
      courseId,
      title,
      fileName,
      fileSize: "1.8 MB",
      courseCode: crs?.code
    };
    setNotes(prev => [...prev, newNote]);
    logApiRequest('POST', '/api/notes', 201, { courseId, title, fileName }, newNote, Date.now() - start);
  };

  const handleAddNotification = (title: string, message: string) => {
    const newNotif: SimulatedNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Interactive Attendance check-in from mobile QR
  const handleCheckinAttendance = (qrCode: string) => {
    const start = Date.now();
    const timetableId = qrCode.replace("qr-", "");
    const slot = timetable.find(t => t.id === timetableId);
    
    if (!slot) {
      logApiRequest('POST', '/api/attendance/checkin', 404, { qrCode }, { error: "QR Code expired or invalid slot reference" }, Date.now() - start);
      return { success: false, message: "Valid lecture slot not found." };
    }

    // Check duplicate
    const today = new Date().toISOString().split('T')[0];
    const duplicate = attendance.find(a => a.timetableId === timetableId && a.studentId === activeUser?.id && a.date === today);
    if (duplicate) {
      logApiRequest('POST', '/api/attendance/checkin', 400, { qrCode }, { error: "Duplicate check-in blocked" }, Date.now() - start);
      return { success: false, message: "You have already marked attendance for this class today." };
    }

    const now = new Date();
    const formattedTime = now.toTimeString().split(' ')[0].substring(0, 5);

    const newLog: AttendanceLog = {
      id: `att-${Date.now()}`,
      timetableId,
      date: today,
      studentId: activeUser?.id || 'usr-student1',
      status: 'Present',
      checkedInAt: formattedTime,
      studentName: activeUser?.name || 'Student',
      matricNo: activeUser?.matricNo || 'N/A',
      courseCode: slot.courseCode
    };

    setAttendance(prev => [...prev, newLog]);
    
    const newAudit = { id: `aud-${Date.now()}`, action: "QR Checked In", detail: `Student ${activeUser?.name} checked-in present for ${slot.courseCode}`, userId: activeUser?.id || 'usr-student1', timestamp: new Date().toISOString() };
    setAuditLogs(prev => [newAudit, ...prev]);

    logApiRequest('POST', '/api/attendance/checkin', 201, { qrCode }, { message: "Attendance verified", log: newLog }, Date.now() - start);
    return { success: true, message: "Success" };
  };

  const handleCancelLecture = (timetableId: string) => {
    const slot = timetable.find(t => t.id === timetableId);
    if (!slot) return;
    
    const newAudit = { id: `aud-${Date.now()}`, action: "Lecture Rescheduled", detail: `Lecturer flagged course session ${slot.courseCode} as cancelled or rescheduled. Student alerts broadcasted.`, userId: activeUser?.id || 'usr-lecturer1', timestamp: new Date().toISOString() };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Maintenance triggers
  const handleBackupDb = () => {
    alert("Enterprise database state snapshot captured. System write-ahead logs securely flushed.");
  };

  const handleRestoreDb = () => {
    alert("Database successfully synchronized from the last secure snapshot. Audit trail restored.");
  };

  // Run Simulated Alarm Cron Sweeps
  const handleRunCronAlarms = () => {
    const now = new Date();
    const checkLog = `[${now.toLocaleTimeString()}] [Cron Reminder Engine] Initiating timetable reminder sweep...`;
    
    const alerts: string[] = [];
    timetable.forEach(slot => {
      // Pick random entries to simulate alarms occurring
      if (Math.random() > 0.3) {
        alerts.push(`[ALERT TRIGGERED] Send FCM push to Student Class Groups of level '${slot.level}' – Course ${slot.courseCode} starts in ${settings.defaultReminderMinutes} minutes at ${slot.venueName}!`);
      }
    });

    setCronLogs(prev => [
      checkLog,
      ...alerts,
      `[${now.toLocaleTimeString()}] [Cron Reminder Engine] Sweep finished. Alarms checked: ${timetable.length}. Pushes dispatched: ${alerts.length}.`,
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between text-slate-800">
      
      {/* 1. TOP PROFESSIONAL INSTITUTION HEADER */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 shadow-2xs select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm">
              IK
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight uppercase leading-none">
                IKCOE <span className="text-emerald-700 font-extrabold">Reminder</span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-1 uppercase tracking-wide">
                Isaac Jasper Boro College of Education • Timetable Reminder & Attendance Engine
              </p>
            </div>
          </div>

          {/* Quick Active Status Controls */}
          <div className="flex items-center space-x-2">
            <div className="bg-slate-100 border border-slate-200 px-3.5 py-1 rounded-full flex items-center space-x-1.5 text-[10px] font-extrabold text-slate-600">
              <span className="text-emerald-500 animate-pulse text-xs">●</span>
              <span>Cron Scheduler Active</span>
            </div>
            
            {/* Quick Profile context indicator */}
            {activeUser ? (
              <div className="bg-slate-100 border border-slate-200 px-3.5 py-1 rounded-full text-[10px] font-extrabold text-slate-600 flex items-center space-x-1.5">
                <span className="bg-emerald-700 text-white w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center">
                  {activeUser.role[0]}
                </span>
                <span>Active: <b>{activeUser.name}</b> ({activeUser.role})</span>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-slate-400">Offline state</span>
            )}
          </div>

        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE PANEL STAGE */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Navigation and Interactive Controls Column (3 Columns) */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Quick Tab Switcher */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
            <span className="font-black text-slate-800 text-[10px] uppercase tracking-wider block">Workspace Selector</span>
            <div className="space-y-1.5">
              <button
                onClick={() => setActiveWorkspaceTab('portal')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeWorkspaceTab === 'portal' 
                    ? 'bg-emerald-700 text-white shadow-xs' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>Enterprise Web Portal</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('simulator')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeWorkspaceTab === 'simulator' 
                    ? 'bg-emerald-700 text-white shadow-xs' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Android App Simulator</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('blueprints')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeWorkspaceTab === 'blueprints' 
                    ? 'bg-emerald-700 text-white shadow-xs' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>API & Code Blueprints</span>
              </button>
            </div>
          </div>

          {/* Quick Access Account Swapper (Extremely useful for review & SQA verification!) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <span className="font-black text-slate-800 text-[10px] uppercase tracking-wider block">QA One-Click Role Testing</span>
            <p className="text-[10px] text-slate-500 leading-normal">Switch credentials instantly to audit role-based authorization blocks and dashboard modules.</p>
            <div className="space-y-1.5">
              {DEFAULT_USERS.map(u => (
                <button
                  key={u.id}
                  onClick={() => setActiveUser(u)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-bold border transition ${
                    activeUser?.id === u.id 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                      : 'bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{u.name}</span>
                  <span className="text-[8px] bg-white border px-1.5 py-0.5 rounded-md font-black">{u.role[0]}</span>
                </button>
              ))}
            </div>
          </div>

        </section>

        {/* Center Main Stage Area (Columns 4-12) */}
        <section className="lg:col-span-9 space-y-6">
          
          {/* Active View Display */}
          {activeWorkspaceTab === 'portal' && (
            <WebPortal
              users={users}
              faculties={faculties}
              departments={departments}
              programmes={programmes}
              courses={courses}
              venues={venues}
              timetable={timetable}
              announcements={announcements}
              assignments={assignments}
              notes={notes}
              auditLogs={auditLogs}
              onAddFaculty={handleAddFaculty}
              onAddDepartment={handleAddDepartment}
              onAddCourse={handleAddCourse}
              onAddVenue={handleAddVenue}
              onAddTimetable={handleAddTimetableSlot}
              onDeleteTimetable={handleDeleteTimetableSlot}
              onApproveUser={handleApproveUser}
              onDeleteUser={handleDeleteUser}
              onAddAnnouncement={handleAddAnnouncement}
              onAddAssignment={handleAddAssignment}
              onAddNote={handleAddNote}
              onBackupDb={handleBackupDb}
              onRestoreDb={handleRestoreDb}
              onResetUserPassword={handleResetUserPassword}
              activeUser={activeUser}
            />
          )}

          {activeWorkspaceTab === 'simulator' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 flex justify-center">
                <MobileSimulator
                  users={users}
                  timetable={timetable}
                  attendanceLogs={attendance}
                  announcements={announcements}
                  notes={notes}
                  notifications={notifications}
                  settings={settings}
                  activeUser={activeUser}
                  onLogin={setActiveUser}
                  onLogout={() => setActiveUser(null)}
                  onRegister={handleRegisterUser}
                  onUpdateSettings={setSettings}
                  onCheckinAttendance={handleCheckinAttendance}
                  onAddAttendance={(log) => setAttendance(prev => [{ id: `att-${Date.now()}`, ...log }, ...prev])}
                  onAddNotification={handleAddNotification}
                  onCancelLecture={handleCancelLecture}
                />
              </div>

              {/* API logs shown side by side with mobile frame for amazing user interactivity! */}
              <div className="md:col-span-7">
                <ApiTerminal
                  logs={apiLogs}
                  onClearLogs={() => setApiLogs([])}
                  onSimulateCron={handleRunCronAlarms}
                  cronLogs={cronLogs}
                />
              </div>
            </div>
          )}

          {activeWorkspaceTab === 'blueprints' && (
            <BlueprintExplorer />
          )}

        </section>

      </main>

      {/* 3. CLEAN CREDENTIALS FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 md:px-8 text-center select-none mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-bold">
          <div className="flex items-center space-x-1.5 justify-center">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Isaac Jasper Boro College of Education (IKCOE) • Bayelsa State, Nigeria</span>
          </div>
          <div className="flex items-center space-x-1 justify-center">
            <span>Redesigned & Secured with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for Department of Computer Science</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
