import React, { useState } from 'react';
import { Lecture, DayOfWeek } from '../types';
import { format12Hour } from '../utils/time';
import { Trash2, Edit3, Calendar, Clock, MapPin, User, ChevronRight, Layers, Eye, X } from 'lucide-react';

interface TimetableTabProps {
  lectures: Lecture[];
  onDeleteLecture: (id: string) => void;
  onEditLecture: (lecture: Lecture) => void;
  onNavigate: (tab: string) => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const TimetableTab: React.FC<TimetableTabProps> = ({
  lectures,
  onDeleteLecture,
  onEditLecture,
  onNavigate,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [showWeeklyGridView, setShowWeeklyGridView] = useState(false);

  // Filter lectures for selected day
  const dailyLectures = lectures
    .filter((l) => l.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Count total lectures per day for horizontal tabs indicator
  const getCountForDay = (day: DayOfWeek) => {
    return lectures.filter((l) => l.day === day).length;
  };

  return (
    <div id="timetable_tab_container" className="flex flex-col h-full max-h-[580px] p-4 space-y-4 select-none relative">
      
      {/* Tab Header and Weekly Grid Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800 flex items-center space-x-1">
            <Calendar className="w-4.5 h-4.5 text-emerald-700" />
            <span>Weekly Schedule</span>
          </h2>
          <p className="text-[10px] text-gray-400 font-medium">Select a day or view full timetable</p>
        </div>
        
        <button
          onClick={() => setShowWeeklyGridView(true)}
          className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer active:scale-95"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Full Grid View</span>
        </button>
      </div>

      {/* Horizontal Scroll Days List */}
      <div id="days_scroll_container" className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none snap-x select-none">
        {DAYS.map((day) => {
          const count = getCountForDay(day);
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-none snap-center px-4 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center min-w-[76px] border cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-gray-500 border-gray-150 hover:bg-gray-50'
              }`}
            >
              <span>{day.substring(0, 3)}</span>
              <span className={`text-[9px] mt-0.5 px-1.5 py-0.2 rounded-full font-extrabold ${
                isSelected ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Daily Lectures Content */}
      <div id="daily_lectures_list" className="flex-1 overflow-y-auto space-y-3 pb-6 scrollbar-none">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-800">{selectedDay} Lectures</span>
          <span className="text-[10px] text-gray-400 font-medium">Sorted by start time</span>
        </div>

        {dailyLectures.length > 0 ? (
          dailyLectures.map((lec) => (
            <div
              key={lec.id}
              className="bg-white border border-gray-150/70 rounded-2xl p-4 shadow-xs relative group overflow-hidden hover:border-emerald-200 transition"
            >
              {/* Reminder minutes tag */}
              <div className="absolute right-0 top-0 bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2.5 py-1 rounded-bl-xl border-l border-b border-emerald-100/40">
                Alarm: {lec.reminderMinutes}m before
              </div>

              {/* Main Course Details */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {lec.courseCode}
                  </span>
                  <h3 className="text-xs font-bold text-gray-800 truncate max-w-[140px]" title={lec.courseTitle}>
                    {lec.courseTitle}
                  </h3>
                </div>

                {/* Grid info */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-gray-500 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium">{format12Hour(lec.startTime)} - {format12Hour(lec.endTime)}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-gray-700 truncate">{lec.venue}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 col-span-2">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">Lec: <span className="font-medium text-gray-700">{lec.lecturer}</span></span>
                  </div>
                </div>
              </div>

              {/* Edit / Delete footer */}
              <div className="flex justify-end items-center space-x-2 border-t border-gray-50 mt-3 pt-2.5">
                <button
                  onClick={() => onEditLecture(lec)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-emerald-700 bg-gray-50 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${lec.courseCode}? This cannot be undone.`)) {
                      onDeleteLecture(lec.id);
                    }
                  }}
                  className="flex items-center space-x-1 text-gray-400 hover:text-rose-600 bg-gray-50 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center text-xs text-gray-400 font-medium">
            <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p>No lectures scheduled for {selectedDay}.</p>
            <button
              onClick={() => onNavigate('add_lecture')}
              className="mt-3 text-emerald-700 hover:underline font-bold"
            >
              + Add a lecture for {selectedDay}
            </button>
          </div>
        )}
      </div>

      {/* WEEKLY FULL TIMETABLE GRID MODAL OVERLAY */}
      {showWeeklyGridView && (
        <div id="weekly_grid_modal" className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs flex flex-col z-50 p-3 select-none">
          <div className="bg-white rounded-2xl shadow-xl flex-1 flex flex-col overflow-hidden max-h-full border border-gray-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-gray-100 bg-emerald-50/50">
              <div className="flex items-center space-x-2">
                <Layers className="w-4.5 h-4.5 text-emerald-800" />
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-emerald-900">Weekly Timetable Grid</h3>
              </div>
              <button
                onClick={() => setShowWeeklyGridView(false)}
                className="text-gray-400 hover:text-gray-700 p-1 bg-white hover:bg-gray-100 rounded-lg border border-gray-150 transition cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-none">
              {DAYS.map((day) => {
                const dayLectures = lectures
                  .filter((l) => l.day === day)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime));

                return (
                  <div key={day} className="space-y-1">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-1">
                      <span className="text-xs font-bold text-emerald-800">{day}</span>
                      <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.2 rounded-full">
                        {dayLectures.length} Classes
                      </span>
                    </div>

                    {dayLectures.length > 0 ? (
                      <div className="grid grid-cols-1 gap-1.5 pt-1">
                        {dayLectures.map((lec) => (
                          <div
                            key={lec.id}
                            className="bg-gray-50 border border-gray-150 rounded-xl p-2.5 flex items-center justify-between text-left text-[11px]"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <span className="font-extrabold text-emerald-700 block text-xs">{lec.courseCode}</span>
                              <span className="text-gray-400 block truncate text-[10px]">{lec.courseTitle}</span>
                              <span className="text-gray-500 block text-[9px] mt-0.5">Venue: <span className="font-bold text-gray-700">{lec.venue}</span></span>
                            </div>
                            <div className="text-right flex-none">
                              <span className="font-bold text-gray-700 block">{format12Hour(lec.startTime).split(' ')[0]}</span>
                              <span className="text-[9px] text-gray-400 block">{format12Hour(lec.endTime)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-400 font-medium italic py-1 pl-1">No lectures</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowWeeklyGridView(false)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
