import React, { useState } from 'react';
import { 
  Building2, BookOpen, Users, Calendar, AlertTriangle, Download, 
  Plus, Check, X, ShieldAlert, Sparkles, RefreshCw, BarChart3, Clock, 
  MapPin, Send, Trash2, Key, CheckSquare, Search, Filter, HelpCircle, LogOut
} from 'lucide-react';
import { 
  User, Faculty, Department, Programme, Course, Venue, 
  TimetableSlot, AuditLog, Announcement, Assignment, LectureNote
} from '../types';

interface WebPortalProps {
  users: User[];
  faculties: Faculty[];
  departments: Department[];
  programmes: Programme[];
  courses: Course[];
  venues: Venue[];
  timetable: TimetableSlot[];
  announcements: Announcement[];
  assignments: Assignment[];
  notes: LectureNote[];
  auditLogs: AuditLog[];
  onAddFaculty: (name: string, code: string) => void;
  onAddDepartment: (facId: string, name: string, code: string) => void;
  onAddCourse: (code: string, title: string, credits: number, deptId: string) => void;
  onAddVenue: (name: string, capacity: number, block: string) => void;
  onAddTimetable: (slot: Omit<TimetableSlot, 'id'>) => { success: boolean; error?: string; conflicts?: string[] };
  onDeleteTimetable: (id: string) => void;
  onApproveUser: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onAddAnnouncement: (title: string, content: string) => void;
  onAddAssignment: (courseId: string, title: string, dueDate: string, desc: string) => void;
  onAddNote: (courseId: string, title: string, fileName: string) => void;
  onBackupDb: () => void;
  onRestoreDb: () => void;
  onResetUserPassword: (id: string) => void;
  activeUser: User | null;
  onLogout?: () => void;
}

export const WebPortal: React.FC<WebPortalProps> = ({
  users, faculties, departments, programmes, courses, venues, timetable,
  announcements, assignments, notes, auditLogs,
  onAddFaculty, onAddDepartment, onAddCourse, onAddVenue, onAddTimetable, onDeleteTimetable,
  onApproveUser, onDeleteUser, onAddAnnouncement, onAddAssignment, onAddNote,
  onBackupDb, onRestoreDb, onResetUserPassword, activeUser, onLogout
}) => {
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'academic' | 'resources' | 'users' | 'timetable' | 'lecturer' | 'reports'>('dashboard');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterDay, setFilterDay] = useState('All');

  // Input States
  const [newFacName, setNewFacName] = useState('');
  const [newFacCode, setNewFacCode] = useState('');
  const [newDeptFac, setNewDeptFac] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');

  const [newCrsCode, setNewCrsCode] = useState('');
  const [newCrsTitle, setNewCrsTitle] = useState('');
  const [newCrsCredits, setNewCrsCredits] = useState('3');
  const [newCrsDept, setNewCrsDept] = useState('');

  const [newVenName, setNewVenName] = useState('');
  const [newVenCapacity, setNewVenCapacity] = useState('50');
  const [newVenBlock, setNewVenBlock] = useState('Main Complex');

  // Timetable Input
  const [newTtCrs, setNewTtCrs] = useState('');
  const [newTtLec, setNewTtLec] = useState('');
  const [newTtVen, setNewTtVen] = useState('');
  const [newTtDay, setNewTtDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [newTtStart, setNewTtStart] = useState('08:00');
  const [newTtEnd, setNewTtEnd] = useState('10:00');
  const [newTtLevel, setNewTtLevel] = useState('300 Level');
  const [scheduleFeedback, setScheduleFeedback] = useState<{ success: boolean; message: string; conflicts?: string[] } | null>(null);

  // Announcement Input
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [annFeedback, setAnnFeedback] = useState('');

  // Note Upload Input
  const [newNoteCrs, setNewNoteCrs] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteFile, setNewNoteFile] = useState('');
  const [noteFeedback, setNoteFeedback] = useState('');

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacName || !newFacCode) return;
    onAddFaculty(newFacName, newFacCode);
    setNewFacName(''); setNewFacCode('');
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    const fId = newDeptFac || (faculties[0]?.id);
    if (!fId || !newDeptName || !newDeptCode) return;
    onAddDepartment(fId, newDeptName, newDeptCode);
    setNewDeptName(''); setNewDeptCode('');
  };

  const handleAddCrs = (e: React.FormEvent) => {
    e.preventDefault();
    const dId = newCrsDept || (departments[0]?.id);
    if (!newCrsCode || !newCrsTitle || !dId) return;
    onAddCourse(newCrsCode, newCrsTitle, Number(newCrsCredits), dId);
    setNewCrsCode(''); setNewCrsTitle('');
  };

  const handleAddVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenName || !newVenCapacity) return;
    onAddVenue(newVenName, Number(newVenCapacity), newVenBlock);
    setNewVenName(''); setNewVenCapacity('50');
  };

  const handleAddTimetable = (e: React.FormEvent) => {
    e.preventDefault();
    const crsId = newTtCrs || (courses[0]?.id);
    const lecId = newTtLec || (users.filter(u => u.role === 'Lecturer')[0]?.id);
    const venId = newTtVen || (venues[0]?.id);

    if (!crsId || !lecId || !venId) {
      setScheduleFeedback({ success: false, message: 'Please ensure courses, venues, and approved lecturers are available.' });
      return;
    }

    const res = onAddTimetable({
      courseId: crsId,
      lecturerId: lecId,
      venueId: venId,
      day: newTtDay,
      startTime: newTtStart,
      endTime: newTtEnd,
      level: newTtLevel
    });

    if (res.success) {
      setScheduleFeedback({ success: true, message: 'Lecture slot allocated successfully with zero conflicts!' });
      setTimeout(() => setScheduleFeedback(null), 4000);
    } else {
      setScheduleFeedback({ success: false, message: res.error || 'Scheduling clash detected.', conflicts: res.conflicts });
    }
  };

  const handleAddAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;
    onAddAnnouncement(newAnnTitle, newAnnContent);
    setNewAnnTitle(''); setNewAnnContent('');
    setAnnFeedback('Announcement broadcasted to students and archived.');
    setTimeout(() => setAnnFeedback(''), 4000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    const crs = newNoteCrs || (courses[0]?.id);
    if (!crs || !newNoteTitle || !newNoteFile) return;
    onAddNote(crs, newNoteTitle, newNoteFile);
    setNewNoteTitle(''); setNewNoteFile('');
    setNoteFeedback('Note file successfully uploaded and assigned to the course.');
    setTimeout(() => setNoteFeedback(''), 4000);
  };

  // Filtered lists
  const filteredTimetable = timetable.filter(slot => {
    const course = courses.find(c => c.id === slot.courseId);
    const lecturer = users.find(u => u.id === slot.lecturerId);
    const venue = venues.find(v => v.id === slot.venueId);

    const matchesSearch = 
      (course?.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lecturer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (venue?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = filterLevel === 'All' || slot.level === filterLevel;
    const matchesDay = filterDay === 'All' || slot.day === filterDay;

    return matchesSearch && matchesLevel && matchesDay;
  });

  // Export functions
  const handleExportPDF = () => {
    const printContent = document.getElementById('printable_timetable');
    if (!printContent) return;
    const win = window.open('', '', 'height=700,width=900');
    if (win) {
      win.document.write('<html><head><title>IKCOE Lecture Timetable</title>');
      win.document.write('<style>body{font-family:sans-serif;padding:20px;} table{width:100%;border-collapse:collapse;margin-top:20px;} th,td{border:1px solid #ccc;padding:10px;text-align:left;} th{background:#047857;color:white;}</style>');
      win.document.write('</head><body>');
      win.document.write('<h2>Isaac Jasper Boro College of Education (IKCOE)</h2>');
      win.document.write('<h3>Department of Computer Science Education - Timetable Report</h3>');
      win.document.write(printContent.innerHTML);
      win.document.write('</body></html>');
      win.document.close();
      win.print();
    }
  };

  const handleExportExcel = () => {
    let csv = "Day,Time,Course,Level,Lecturer,Venue\n";
    timetable.forEach(slot => {
      const course = courses.find(c => c.id === slot.courseId);
      const lecturer = users.find(u => u.id === slot.lecturerId);
      const venue = venues.find(v => v.id === slot.venueId);
      csv += `"${slot.day}","${slot.startTime}-${slot.endTime}","${course?.code || ''} - ${course?.title || ''}","${slot.level}","${lecturer?.name || ''}","${venue?.name || ''}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "IKCOE_Lecture_Timetable.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <nav className="md:col-span-3 bg-slate-900 text-slate-300 p-5 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              IK
            </div>
            <div>
              <span className="font-extrabold text-white text-xs block leading-none tracking-wider uppercase">IKCOE PORTAL</span>
              <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">ADMINISTRATION HUB</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <button 
              onClick={() => setActiveMenu('dashboard')} 
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'dashboard' ? 'bg-emerald-700 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard Analytics</span>
            </button>

            {activeUser?.role === 'Administrator' && (
              <>
                <button 
                  onClick={() => setActiveMenu('academic')} 
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'academic' ? 'bg-emerald-700 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Academic Structure</span>
                </button>

                <button 
                  onClick={() => setActiveMenu('resources')} 
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'resources' ? 'bg-emerald-700 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Courses & Venues</span>
                </button>

                <button 
                  onClick={() => setActiveMenu('users')} 
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'users' ? 'bg-emerald-700 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <Users className="w-4 h-4" />
                  <span>User Accounts</span>
                </button>
              </>
            )}

            {(activeUser?.role === 'Administrator' || activeUser?.role === 'Timetable Officer') && (
              <button 
                onClick={() => setActiveMenu('timetable')} 
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'timetable' ? 'bg-emerald-700 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <Calendar className="w-4 h-4" />
                <span>Timetable & Conflicts</span>
              </button>
            )}

            {(activeUser?.role === 'Lecturer' || activeUser?.role === 'Administrator') && (
              <button 
                onClick={() => setActiveMenu('lecturer')} 
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'lecturer' ? 'bg-emerald-700 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <Send className="w-4 h-4" />
                <span>Lecturer Module</span>
              </button>
            )}

            <button 
              onClick={() => setActiveMenu('reports')} 
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'reports' ? 'bg-emerald-700 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Download className="w-4 h-4" />
              <span>Reports & Export</span>
            </button>
          </div>
        </div>

        {/* Database Control Center / Quick Backup */}
        {activeUser?.role === 'Administrator' && (
          <div className="pt-4 border-t border-slate-800 text-[10px] space-y-2 select-none">
            <span className="font-bold text-slate-500 uppercase block tracking-wider">Database Maintenance</span>
            <div className="flex space-x-2">
              <button 
                onClick={onBackupDb}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-2 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1"
                title="Saves a snapshot of active relational state"
              >
                <RefreshCw className="w-3 h-3 text-emerald-400" />
                <span>Backup</span>
              </button>
              <button 
                onClick={onRestoreDb}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-2 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1"
              >
                <X className="w-3 h-3 text-rose-400" />
                <span>Restore</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Logout Button */}
        {onLogout && (
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-rose-950/45 hover:bg-rose-900/60 text-rose-200 hover:text-white border border-rose-900/40 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Portal</span>
            </button>
          </div>
        )}
      </nav>

      {/* RIGHT CONTENT STAGE AREA */}
      <main className="md:col-span-9 p-6 bg-slate-50 overflow-y-auto max-h-[700px]">
        
        {/* VIEW 1: DASHBOARD ANALYTICS */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight uppercase">Dashboard Overview</h2>
                <p className="text-xs text-slate-500">Real-time status metrics and academic statistics for Isaac Jasper Boro College</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                System Active
              </span>
            </div>

            {/* Metrics cards row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Students</span>
                </div>
                <div className="mt-2 flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black text-slate-800">{users.filter(u => u.role === 'Student').length}</span>
                  <span className="text-[9px] text-emerald-600 font-semibold">Active</span>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Lecturers</span>
                </div>
                <div className="mt-2 flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black text-slate-800">{users.filter(u => u.role === 'Lecturer').length}</span>
                  <span className="text-[9px] text-emerald-600 font-semibold">Approved</span>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Courses</span>
                </div>
                <div className="mt-2 flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black text-slate-800">{courses.length}</span>
                  <span className="text-[9px] text-slate-500 font-medium">Undergrad</span>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Reminders</span>
                </div>
                <div className="mt-2 flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black text-slate-800">{timetable.length * 5}</span>
                  <span className="text-[9px] text-emerald-600 font-semibold">Scheduled</span>
                </div>
              </div>
            </div>

            {/* Custom SVG Attendance Chart & Recent Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Custom SVG Chart (7 Columns) */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-800 text-xs uppercase tracking-wider">Attendance Rate Progress</span>
                  <span className="text-[10px] font-bold text-slate-500">Weekly average: 88.4%</span>
                </div>

                {/* SVG Visual Chart */}
                <div className="h-40 w-full bg-slate-50 rounded-xl relative flex items-end justify-between p-4 pt-8">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-1/4 border-t border-slate-200/50" />
                  <div className="absolute inset-x-0 top-2/4 border-t border-slate-200/50" />
                  <div className="absolute inset-x-0 top-3/4 border-t border-slate-200/50" />

                  {/* Columns */}
                  {[
                    { day: 'Mon', rate: 92, height: 'h-[92%]', color: 'bg-emerald-500' },
                    { day: 'Tue', rate: 85, height: 'h-[85%]', color: 'bg-emerald-500' },
                    { day: 'Wed', rate: 89, height: 'h-[89%]', color: 'bg-emerald-500' },
                    { day: 'Thu', rate: 74, height: 'h-[74%]', color: 'bg-amber-500' },
                    { day: 'Fri', rate: 94, height: 'h-[94%]', color: 'bg-emerald-600' }
                  ].map((col, i) => (
                    <div key={i} className="flex flex-col items-center space-y-1 h-full justify-end w-12 z-10">
                      <span className="text-[9px] font-mono font-bold text-slate-600">{col.rate}%</span>
                      <div className={`w-6 ${col.height} ${col.color} rounded-t-sm transition-all duration-500`} />
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{col.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Audit logs (5 Columns) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-black text-slate-800 text-xs uppercase tracking-wider">Live System Logs</span>
                  <ShieldAlert className="w-4 h-4 text-slate-400" />
                </div>
                <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-emerald-800 uppercase">{log.action}</span>
                        <span className="text-slate-400 font-mono text-[8px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-600 font-medium leading-snug">{log.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scheduled Timetable list quick view */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <span className="font-black text-slate-800 text-xs uppercase tracking-wider block">Today's Active Lectures</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {timetable.slice(0, 3).map(slot => {
                  const course = courses.find(c => c.id === slot.courseId);
                  const venue = venues.find(v => v.id === slot.venueId);
                  return (
                    <div key={slot.id} className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="bg-emerald-700 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md font-mono">{course?.code}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold flex items-center space-x-1">
                          <Clock className="w-3 h-3 mr-0.5 text-slate-400" />
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{course?.title}</h4>
                      <div className="flex items-center text-[10px] text-slate-500 space-x-2">
                        <span className="flex items-center font-bold">
                          <MapPin className="w-3 h-3 text-slate-400 mr-0.5" />
                          {venue?.name}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="font-bold text-emerald-700">{slot.level}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ACADEMIC STRUCTURE */}
        {activeMenu === 'academic' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 uppercase">Academic Structure</h2>
              <p className="text-xs text-slate-500">Manage institutional entities, faculties, and departments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Faculties management card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <span className="font-black text-slate-800 text-xs uppercase tracking-wider block">Register New Faculty/School</span>
                <form onSubmit={handleAddFaculty} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Faculty/School Name</label>
                    <input 
                      type="text" value={newFacName} onChange={e => setNewFacName(e.target.value)}
                      placeholder="School of Sciences" className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Abbreviation / Code</label>
                    <input 
                      type="text" value={newFacCode} onChange={e => setNewFacCode(e.target.value)}
                      placeholder="SOS" className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Add Faculty / School</span>
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Registered Schools ({faculties.length})</span>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {faculties.map(fac => (
                      <div key={fac.id} className="flex justify-between items-center bg-slate-50 p-2.5 border border-slate-150 rounded-xl">
                        <span className="text-xs font-bold text-slate-700">{fac.name}</span>
                        <span className="bg-slate-200 text-slate-700 text-[9px] font-black font-mono px-2 py-0.5 rounded-md">{fac.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Departments management card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <span className="font-black text-slate-800 text-xs uppercase tracking-wider block">Register New Department</span>
                <form onSubmit={handleAddDept} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Parent Faculty/School</label>
                    <select 
                      value={newDeptFac} onChange={e => setNewDeptFac(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    >
                      {faculties.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Department Name</label>
                    <input 
                      type="text" value={newDeptName} onChange={e => setNewDeptName(e.target.value)}
                      placeholder="Computer Science Education" className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Department Code</label>
                    <input 
                      type="text" value={newDeptCode} onChange={e => setNewDeptCode(e.target.value)}
                      placeholder="CSC" className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Add Department</span>
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Registered Departments ({departments.length})</span>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {departments.map(dept => {
                      const fac = faculties.find(f => f.id === dept.facultyId);
                      return (
                        <div key={dept.id} className="flex justify-between items-center bg-slate-50 p-2.5 border border-slate-150 rounded-xl">
                          <div>
                            <span className="text-xs font-bold text-slate-700 block">{dept.name}</span>
                            <span className="text-[9px] text-slate-400 font-semibold">{fac?.name}</span>
                          </div>
                          <span className="bg-slate-200 text-slate-700 text-[9px] font-black font-mono px-2 py-0.5 rounded-md">{dept.code}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 3: COURSES & VENUES */}
        {activeMenu === 'resources' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 uppercase">Courses & Venues</h2>
              <p className="text-xs text-slate-500">Allocate resource objects and classrooms</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Courses registration */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <span className="font-black text-slate-800 text-xs uppercase tracking-wider block">Add New Course Syllabus</span>
                <form onSubmit={handleAddCrs} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Host Department</label>
                    <select 
                      value={newCrsDept} onChange={e => setNewCrsDept(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Course Code</label>
                      <input 
                        type="text" value={newCrsCode} onChange={e => setNewCrsCode(e.target.value)}
                        placeholder="CSC 205" className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Course Title</label>
                      <input 
                        type="text" value={newCrsTitle} onChange={e => setNewCrsTitle(e.target.value)}
                        placeholder="Operations Research" className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Credit Units</label>
                    <select 
                      value={newCrsCredits} onChange={e => setNewCrsCredits(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    >
                      <option value="1">1 Unit</option>
                      <option value="2">2 Units</option>
                      <option value="3">3 Units</option>
                      <option value="4">4 Units</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Add Course</span>
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Course Catalogue ({courses.length})</span>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {courses.map(c => (
                      <div key={c.id} className="flex justify-between items-center bg-slate-50 p-2.5 border border-slate-150 rounded-xl">
                        <div>
                          <span className="text-xs font-black text-slate-700">{c.code}</span>
                          <span className="text-[10px] text-slate-500 block leading-tight font-medium">{c.title}</span>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-md">{c.credits} CR</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Venues registration */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <span className="font-black text-slate-800 text-xs uppercase tracking-wider block">Add New Venue / Lecture Room</span>
                <form onSubmit={handleAddVenue} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Venue Name / Location</label>
                    <input 
                      type="text" value={newVenName} onChange={e => setNewVenName(e.target.value)}
                      placeholder="Smart Lab Room 2" className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Sitting Capacity</label>
                      <input 
                        type="number" value={newVenCapacity} onChange={e => setNewVenCapacity(e.target.value)}
                        placeholder="60" className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Building Block</label>
                      <input 
                        type="text" value={newVenBlock} onChange={e => setNewVenBlock(e.target.value)}
                        placeholder="Science Block A" className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Register Venue</span>
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Registered Lecture Halls ({venues.length})</span>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {venues.map(v => (
                      <div key={v.id} className="flex justify-between items-center bg-slate-50 p-2.5 border border-slate-150 rounded-xl">
                        <div>
                          <span className="text-xs font-black text-slate-700 block">{v.name}</span>
                          <span className="text-[9px] text-slate-400 font-bold">{v.block}</span>
                        </div>
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-md">{v.capacity} Seats</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 4: USER MANAGER & APPROVALS */}
        {activeMenu === 'users' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 uppercase">User Account Manager</h2>
              <p className="text-xs text-slate-500">Approve accounts, manage roles, reset student and lecturer passwords</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <span className="font-black text-slate-800 text-xs uppercase tracking-wider block">Registered Members & Approval Queue</span>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] uppercase font-black text-slate-400">
                      <th className="py-2.5">Name / Email</th>
                      <th>Role</th>
                      <th>Detail</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="py-3">
                          <span className="font-bold text-slate-700 block">{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                            u.role === 'Administrator' ? 'bg-purple-100 text-purple-800' :
                            u.role === 'Lecturer' ? 'bg-blue-100 text-blue-800' :
                            u.role === 'Timetable Officer' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>{u.role}</span>
                        </td>
                        <td className="font-mono text-[10px] text-slate-500">
                          {u.matricNo || "Staff"}
                        </td>
                        <td>
                          {u.role === 'Student' || u.role === 'Administrator' || u.isApproved ? (
                            <span className="text-emerald-600 font-bold flex items-center space-x-1 text-[10px]">
                              <Check className="w-3.5 h-3.5" />
                              <span>Approved</span>
                            </span>
                          ) : (
                            <span className="text-amber-500 font-black flex items-center space-x-1 text-[10px] animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Pending Admin</span>
                            </span>
                          )}
                        </td>
                        <td className="text-right py-3 space-x-1.5">
                          {!(u.role === 'Student' || u.role === 'Administrator' || u.isApproved) && (
                            <button 
                              onClick={() => onApproveUser(u.id)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-lg cursor-pointer inline-flex items-center space-x-0.5"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}
                          <button 
                            onClick={() => onResetUserPassword(u.id)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[9px] px-2.5 py-1 rounded-lg cursor-pointer inline-flex items-center space-x-0.5"
                            title="Emulates secure direct hashing overwrite"
                          >
                            <Key className="w-3 h-3" />
                            <span>Reset Pwd</span>
                          </button>
                          {u.role !== 'Administrator' && (
                            <button 
                              onClick={() => onDeleteUser(u.id)}
                              className="text-rose-500 hover:bg-rose-50 p-1 rounded-lg cursor-pointer inline-flex"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: TIMETABLE EDITOR & CONFLICT DETECTOR */}
        {activeMenu === 'timetable' && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 uppercase">Timetable Builder & Conflict Solver</h2>
                <p className="text-xs text-slate-500">Create entries, allocate classrooms, and resolve double-bookings in real-time</p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Conflict Shield Active</span>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Form Entry Column (5 Columns) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <span className="font-black text-slate-800 text-xs uppercase tracking-wider block">Allocate New Session</span>
                <form onSubmit={handleAddTimetable} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Target Course</label>
                    <select 
                      value={newTtCrs} onChange={e => setNewTtCrs(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.code} – {c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Assign Lecturer</label>
                    <select 
                      value={newTtLec} onChange={e => setNewTtLec(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    >
                      {users.filter(u => u.role === 'Lecturer').map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Target Venue</label>
                    <select 
                      value={newTtVen} onChange={e => setNewTtVen(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    >
                      {venues.map(v => (
                        <option key={v.id} value={v.id}>{v.name} (Cap: {v.capacity})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Day of Week</label>
                      <select 
                        value={newTtDay} onChange={e => setNewTtDay(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Target Student Level</label>
                      <select 
                        value={newTtLevel} onChange={e => setNewTtLevel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                      >
                        <option value="100 Level">100 Level</option>
                        <option value="200 Level">200 Level</option>
                        <option value="300 Level">300 Level</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Start Time (24H)</label>
                      <input 
                        type="time" value={newTtStart} onChange={e => setNewTtStart(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl focus:outline-emerald-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">End Time (24H)</label>
                      <input 
                        type="time" value={newTtEnd} onChange={e => setNewTtEnd(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl focus:outline-emerald-600 font-mono"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Validate & Allocate Slot</span>
                  </button>
                </form>

                {/* Real-time feedback alerts */}
                {scheduleFeedback && (
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                    scheduleFeedback.success 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    <div className="flex items-center space-x-1.5 font-bold">
                      {scheduleFeedback.success ? <CheckSquare className="w-4.5 h-4.5 text-emerald-600" /> : <ShieldAlert className="w-4.5 h-4.5 text-rose-600 animate-bounce" />}
                      <span>{scheduleFeedback.success ? 'Success' : 'Scheduling Conflict Warning'}</span>
                    </div>
                    <p className="font-semibold text-[11px]">{scheduleFeedback.message}</p>
                    {scheduleFeedback.conflicts && (
                      <ul className="list-disc pl-4 space-y-1 text-[10px] font-bold text-rose-700 font-mono">
                        {scheduleFeedback.conflicts.map((conf, index) => (
                          <li key={index}>{conf}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Timetable Interactive Grid / List (7 Columns) */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-black text-slate-800 text-xs uppercase tracking-wider">Active Calendar Slots</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search code/hall..." className="bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold px-2 py-1 max-w-[130px] focus:outline-emerald-600"
                    />
                  </div>
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {filteredTimetable.length > 0 ? (
                    filteredTimetable.map(slot => {
                      const course = courses.find(c => c.id === slot.courseId);
                      const lecturer = users.find(u => u.id === slot.lecturerId);
                      const venue = venues.find(v => v.id === slot.venueId);

                      return (
                        <div key={slot.id} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-center justify-between hover:border-emerald-500 transition">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="bg-slate-200 text-slate-800 text-[9px] font-black px-1.5 py-0.5 rounded-md font-mono">{course?.code}</span>
                              <span className="text-[10px] text-slate-400 font-bold font-mono">{slot.day} • {slot.startTime} - {slot.endTime}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-700 leading-tight">{course?.title}</h4>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold">
                              <span className="flex items-center"><Users className="w-3 h-3 text-slate-300 mr-0.5" />{lecturer?.name}</span>
                              <span>•</span>
                              <span className="flex items-center"><MapPin className="w-3 h-3 text-slate-300 mr-0.5" />{venue?.name}</span>
                              <span>•</span>
                              <span className="text-emerald-700 font-bold">{slot.level}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => onDeleteTimetable(slot.id)}
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-slate-400 space-y-1 select-none">
                      <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs font-bold">No active timetable slots matching criteria.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 6: LECTURER MODULE SECTION */}
        {activeMenu === 'lecturer' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 uppercase">Lecturer Resource Panel</h2>
              <p className="text-xs text-slate-500">Upload slides/notes, draft assignments, and broadcast departmental announcements</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Note uploads form */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <span className="font-black text-slate-800 text-xs uppercase tracking-wider block">Upload Handouts / Slides</span>
                <form onSubmit={handleAddNote} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Target Course</label>
                    <select 
                      value={newNoteCrs} onChange={e => setNewNoteCrs(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.code} – {c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Handout Title</label>
                    <input 
                      type="text" value={newNoteTitle} onChange={e => setNewNoteTitle(e.target.value)}
                      placeholder="e.g. Chapter 1: Introduction slides" className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Mock File Name</label>
                    <input 
                      type="text" value={newNoteFile} onChange={e => setNewNoteFile(e.target.value)}
                      placeholder="introduction_notes.pdf" className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Upload Slide Handout</span>
                  </button>
                </form>

                {noteFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-1">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <span>{noteFeedback}</span>
                  </div>
                )}
              </div>

              {/* Announcements creator */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <span className="font-black text-slate-800 text-xs uppercase tracking-wider block">Draft Announcement Broadcast</span>
                <form onSubmit={handleAddAnn} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Heading / Subject</label>
                    <input 
                      type="text" value={newAnnTitle} onChange={e => setNewAnnTitle(e.target.value)}
                      placeholder="Continuous Assessment next week" className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Announcement Body Message</label>
                    <textarea 
                      value={newAnnContent} onChange={e => setNewAnnContent(e.target.value)}
                      placeholder="Write your announcement details to the student body here..." rows={3}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-emerald-600 resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer">
                    <Send className="w-4 h-4" />
                    <span>Broadcast announcement</span>
                  </button>
                </form>

                {annFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-1">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <span>{annFeedback}</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* VIEW 7: REPORTS & EXPORT CENTER */}
        {activeMenu === 'reports' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 uppercase">Reports & Export Center</h2>
              <p className="text-xs text-slate-500">Generate printable PDF reports, export timetables to Excel, and download institutional sheets</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* PDF Print preview block */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-black text-slate-800 text-xs uppercase tracking-wider">Print Preview Panel</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleExportPDF} 
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Print PDF</span>
                    </button>
                    <button 
                      onClick={handleExportExcel}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Excel CSV</span>
                    </button>
                  </div>
                </div>

                {/* Printable element container */}
                <div id="printable_timetable" className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[11px] space-y-3 max-h-[360px] overflow-y-auto">
                  <div className="text-center font-bold text-slate-800 uppercase pb-2 border-b border-slate-200">
                    <span>Department of Computer Science Education</span>
                  </div>
                  {timetable.map((slot, i) => {
                    const c = courses.find(cr => cr.id === slot.courseId);
                    const v = venues.find(vn => vn.id === slot.venueId);
                    return (
                      <div key={i} className="py-1 border-b border-slate-100 flex justify-between">
                        <span>{slot.day} {slot.startTime}-{slot.endTime}</span>
                        <span className="font-bold">{c?.code} ({v?.name}) - {slot.level}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statistics lists */}
              <div className="space-y-5">
                <span className="font-black text-slate-800 text-xs uppercase tracking-wider block pb-2 border-b border-slate-100">Institutional Statistics Reports</span>
                
                <div className="space-y-3 text-xs font-bold">
                  <div className="flex justify-between bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <span className="text-slate-500">Academic Semester</span>
                    <span className="text-slate-800">2025/2026 - First Semester</span>
                  </div>

                  <div className="flex justify-between bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <span className="text-slate-500">Timetable Conflict Guard Integrity</span>
                    <span className="text-emerald-700">100% Secured Clashes Cleared</span>
                  </div>

                  <div className="flex justify-between bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <span className="text-slate-500">Total System Action Audits Captured</span>
                    <span className="text-slate-800 font-mono">{auditLogs.length} Records</span>
                  </div>

                  <div className="flex justify-between bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <span className="text-slate-500">Department Registered Lecturers</span>
                    <span className="text-slate-800">{users.filter(u => u.role === 'Lecturer').length} Active</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
};
