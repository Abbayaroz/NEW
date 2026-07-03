import React from 'react';
import { Lecture, StudentProfile } from '../types';
import { format12Hour, getCurrentDateString, getNextUpcomingLecture, getLecturesScheduledToday } from '../utils/time';
import { Calendar, Clock, BookOpen, AlertCircle, PlusCircle, Award, Compass } from 'lucide-react';

interface HomeTabProps {
  profile: StudentProfile;
  lectures: Lecture[];
  onNavigate: (tab: string) => void;
  onSimulateReminder: (lecture: Lecture) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  profile,
  lectures,
  onNavigate,
  onSimulateReminder,
}) => {
  const todayLectures = getLecturesScheduledToday(lectures);
  const nextInfo = getNextUpcomingLecture(lectures);

  // Determine greeting based on current local time
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div id="home_tab_container" className="flex flex-col space-y-4 p-4 pb-8 overflow-y-auto h-full max-h-[580px] scrollbar-none select-none">
      {/* Top Welcome Panel */}
      <div id="welcome_panel" className="flex items-center justify-between">
        <div>
          <h1 id="welcome_greeting" className="text-xl font-bold text-emerald-900 tracking-tight leading-none">
            {getGreeting()}, {profile.fullName.split(' ')[0]}
          </h1>
          <p id="welcome_sub" className="text-xs text-emerald-700/80 font-medium mt-1">
            Never miss a class again.
          </p>
        </div>
        <div id="university_badge" className="flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>FUDMA Student</span>
        </div>
      </div>

      {/* Profile Card Summary */}
      <div id="home_profile_summary" className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-emerald-950 text-white rounded-2xl p-4.5 shadow-md border border-emerald-800/60 relative overflow-hidden">
        {/* Card watermark logo */}
        <div className="absolute -right-4 -bottom-4 opacity-[0.06] transform translate-x-2 translate-y-2">
          <BookOpen className="w-28 h-28 text-white" />
        </div>

        {/* User Top Row Info */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border-2 border-emerald-400/55 flex items-center justify-center font-bold text-sm text-emerald-300">
            {profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight">{profile.fullName}</p>
            <p className="text-[10px] font-mono text-emerald-300 font-semibold opacity-90">{profile.matricNo || 'No Matric No'}</p>
          </div>
        </div>

        {/* Department / Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-emerald-800/40 text-[11px] text-emerald-100/90">
          <div className="space-y-0.5">
            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Department</p>
            <p className="font-semibold truncate max-w-[130px]" title={profile.department}>{profile.department}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Level Standing</p>
            <p className="font-semibold">{profile.level}</p>
          </div>
        </div>

        {/* Today status row */}
        <div className="mt-3 pt-2.5 border-t border-emerald-800/40 flex items-center justify-between text-[11px]">
          <div>
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block">Today's Schedule</span>
            <span className="font-extrabold text-white">{todayLectures.length} Classes Scheduled</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block">Local Clock</span>
            <span className="font-mono font-bold text-emerald-300">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </span>
          </div>
        </div>
      </div>

      {/* Date banner */}
      <div id="date_banner" className="bg-white border border-gray-100 shadow-xs rounded-xl p-3 flex items-center space-x-3">
        <div className="bg-emerald-50 p-2 rounded-lg">
          <Calendar className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Today's Date</span>
          <span className="text-xs font-semibold text-gray-700">{getCurrentDateString()}</span>
        </div>
      </div>

      {/* Next Upcoming Lecture Section */}
      <div id="next_lecture_section" className="space-y-2">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">Next Upcoming Lecture</h2>
        
        {nextInfo ? (
          <div id="next_lecture_card" className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 rounded-3xl p-5 text-white relative overflow-hidden shadow-xl border border-emerald-500/20">
            
            {/* Absolute background bubbles */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-400 rounded-full opacity-15"></div>
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white rounded-full opacity-5"></div>

            {/* Card Content Header info */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-emerald-500/40 rounded-full text-[9px] font-bold uppercase tracking-wider border border-emerald-400/20">
                  Next Lecture • {nextInfo.lecture.day}
                </span>
                <h3 className="text-3xl font-black tracking-tight mt-1">{nextInfo.lecture.courseCode}</h3>
                <p className="text-emerald-100 text-xs font-medium opacity-90 truncate max-w-[170px]">
                  {nextInfo.lecture.courseTitle}
                </p>
              </div>

              {/* Countdown box */}
              <div className="text-center bg-white/12 backdrop-blur-md rounded-2xl p-2.5 px-3.5 border border-white/25 shadow-inner flex flex-col justify-center min-w-[76px]">
                <p className="text-[8px] uppercase font-bold text-emerald-200">Starting In</p>
                <p className="text-lg font-black tracking-tight tabular-nums">{nextInfo.countdownText}</p>
                <p className="text-[7px] text-emerald-100 font-medium">Minutes Left</p>
              </div>
            </div>

            {/* Venue and Time detail rows */}
            <div className="relative z-10 grid grid-cols-2 gap-3.5 pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📍</span>
                <div>
                  <span className="text-[8px] uppercase font-bold text-emerald-200 block leading-none">Venue</span>
                  <span className="font-bold text-white text-xs">{nextInfo.lecture.venue}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🕒</span>
                <div>
                  <span className="text-[8px] uppercase font-bold text-emerald-200 block leading-none">Time Slot</span>
                  <span className="font-bold text-white text-xs">
                    {format12Hour(nextInfo.lecture.startTime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulator action inside card */}
            <button
              onClick={() => onSimulateReminder(nextInfo.lecture)}
              className="relative z-10 mt-4.5 w-full bg-white/15 hover:bg-white/25 active:scale-[0.98] border border-white/20 transition text-white rounded-xl py-2 text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>Simulate Pre-Lecture Notification</span>
            </button>
          </div>
        ) : (
          <div id="no_upcoming_lecture" className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 text-center">
            <Compass className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-500">No upcoming lectures scheduled.</p>
            <button
              onClick={() => onNavigate('add_lecture')}
              className="mt-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Schedule Your First Lecture
            </button>
          </div>
        )}
      </div>

      {/* Today's Classes List */}
      <div id="todays_classes_section" className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">Today's Classes</h2>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
            {todayLectures.length} Total
          </span>
        </div>

        {todayLectures.length > 0 ? (
          <div id="todays_list" className="space-y-2.5">
            {todayLectures.map((lec) => (
              <div
                key={lec.id}
                className="bg-white border border-gray-150/60 rounded-xl p-3 shadow-xs hover:border-emerald-200 transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="bg-emerald-50 text-emerald-700 font-extrabold text-xs px-2.5 py-1.5 rounded-lg flex flex-col items-center justify-center min-w-[56px]">
                    <span className="text-[9px] font-semibold text-emerald-600/80 uppercase">Starts</span>
                    <span>{format12Hour(lec.startTime).split(' ')[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 truncate">{lec.courseCode}: {lec.courseTitle}</h4>
                    <p className="text-[10px] text-gray-400 font-medium truncate">
                      {lec.venue} • {lec.lecturer}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onSimulateReminder(lec)}
                  title="Simulate Reminder Alert"
                  className="bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-emerald-700 p-2 rounded-lg transition active:scale-95 cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center text-xs text-gray-400 font-medium">
            🎉 No lectures scheduled for today! Enjoy your free time!
          </div>
        )}
      </div>

      {/* Quick Navigation Panel */}
      <div id="quick_navigation" className="grid grid-cols-2 gap-3.5 pt-2">
        <button
          onClick={() => onNavigate('timetable')}
          className="bg-white hover:bg-emerald-50 border border-gray-150/75 rounded-2xl p-3.5 text-left transition hover:border-emerald-200 active:scale-[0.98] cursor-pointer"
        >
          <BookOpen className="w-5 h-5 text-emerald-700 mb-2" />
          <h4 className="text-xs font-bold text-gray-800">Weekly Timetable</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">View & manage week timetable</p>
        </button>

        <button
          onClick={() => onNavigate('add_lecture')}
          className="bg-white hover:bg-emerald-50 border border-gray-150/75 rounded-2xl p-3.5 text-left transition hover:border-emerald-200 active:scale-[0.98] cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 text-emerald-700 mb-2" />
          <h4 className="text-xs font-bold text-gray-800">Add New Lecture</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">Register a course lecture slot</p>
        </button>
      </div>
    </div>
  );
};
