import React, { useState, useEffect } from 'react';
import { Lecture, DayOfWeek } from '../types';
import { PlusCircle, Save, XCircle, Clock, MapPin, BookOpen, User, Calendar } from 'lucide-react';

interface AddLectureTabProps {
  editingLecture: Lecture | null;
  lectures: Lecture[];
  onSaveLecture: (lecture: Lecture) => void;
  onCancelEdit: () => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const REMINDERS = [
  { label: '5 minutes before', value: 5 },
  { label: '15 minutes before', value: 15 },
  { label: '30 minutes before', value: 30 },
  { label: '60 minutes before', value: 60 },
];

export const AddLectureTab: React.FC<AddLectureTabProps> = ({
  editingLecture,
  lectures,
  onSaveLecture,
  onCancelEdit,
}) => {
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [venue, setVenue] = useState('');
  const [reminderMinutes, setReminderMinutes] = useState(15);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load editing lecture if provided
  useEffect(() => {
    if (editingLecture) {
      setCourseCode(editingLecture.courseCode);
      setCourseTitle(editingLecture.courseTitle);
      setLecturer(editingLecture.lecturer);
      setDay(editingLecture.day);
      setStartTime(editingLecture.startTime);
      setEndTime(editingLecture.endTime);
      setVenue(editingLecture.venue);
      setReminderMinutes(editingLecture.reminderMinutes);
      setErrorMessage(null);
    } else {
      // Set some defaults
      setCourseCode('');
      setCourseTitle('');
      setLecturer('');
      setDay('Monday');
      setStartTime('10:00');
      setEndTime('12:00');
      setVenue('');
      setReminderMinutes(15);
      setErrorMessage(null);
    }
  }, [editingLecture]);

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Validation: Empty fields
    if (!courseCode.trim()) return setErrorMessage('Course code is required (e.g. CSC 205).');
    if (!courseTitle.trim()) return setErrorMessage('Course title is required.');
    if (!lecturer.trim()) return setErrorMessage('Lecturer name is required.');
    if (!venue.trim()) return setErrorMessage('Lecture venue is required (e.g. Smart Lab).');
    if (!startTime || !endTime) return setErrorMessage('Both start and end times must be set.');

    // 2. Validation: End time after Start time
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMinutesTotal = startH * 60 + startM;
    const endMinutesTotal = endH * 60 + endM;

    if (endMinutesTotal <= startMinutesTotal) {
      return setErrorMessage('End time must be after the start time.');
    }

    // 3. Validation: Prevent duplicate entries
    // A duplicate is another lecture on the same day starting at the exact same time
    const isDuplicate = lectures.some((lec) => {
      // If editing, skip checking the item being edited
      if (editingLecture && lec.id === editingLecture.id) return false;
      return lec.day === day && lec.startTime === startTime;
    });

    if (isDuplicate) {
      return setErrorMessage(`Conflict: Another class is already scheduled on ${day} at ${startTime}. Please select a different time.`);
    }

    // All checks passed! Construct the lecture object
    const savedLecture: Lecture = {
      id: editingLecture ? editingLecture.id : `lec-${Date.now()}`,
      courseCode: courseCode.trim().toUpperCase(),
      courseTitle: courseTitle.trim(),
      lecturer: lecturer.trim(),
      day,
      startTime,
      endTime,
      venue: venue.trim(),
      reminderMinutes,
    };

    onSaveLecture(savedLecture);
  };

  return (
    <div id="add_lecture_tab_container" className="flex flex-col h-full max-h-[580px] p-4 space-y-4 select-none overflow-y-auto scrollbar-none">
      
      {/* Tab Header */}
      <div className="flex items-center justify-between pb-1 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-800 flex items-center space-x-1">
            <PlusCircle className="w-4.5 h-4.5 text-emerald-700" />
            <span>{editingLecture ? 'Edit Lecture' : 'Add New Lecture'}</span>
          </h2>
          <p className="text-[10px] text-gray-400 font-medium">
            {editingLecture ? 'Modify existing course schedule' : 'Register a class in your weekly schedule'}
          </p>
        </div>
        {editingLecture && (
          <button
            onClick={onCancelEdit}
            className="flex items-center space-x-1 text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-100 transition hover:bg-rose-100 cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        )}
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-[11px] p-3 rounded-xl flex items-start space-x-2 animate-pulse">
          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4 pb-8">
        
        {/* Course Code & Title */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">Course Code</label>
            <div className="relative">
              <input
                type="text"
                placeholder="CSC 205"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold uppercase focus:ring-1 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">Course Title</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Operations Research and Optimisation"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Lecturer Name */}
        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">Lecturer's Name</label>
          <div className="relative flex items-center">
            <User className="absolute left-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Mr. Sulaiman Muhammad Garba"
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Day of Week Dropdown */}
        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">Day of the Week</label>
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 w-4 h-4 text-gray-400" />
            <select
              value={day}
              onChange={(e) => setDay(e.target.value as DayOfWeek)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-gray-700 focus:ring-1 focus:ring-emerald-700 focus:outline-none appearance-none cursor-pointer"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Inputs (Start and End) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">Start Time</label>
            <div className="relative flex items-center">
              <Clock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">End Time</label>
            <div className="relative flex items-center">
              <Clock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Venue / Classroom */}
        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">Venue / Classroom</label>
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Smart Lab, Computer Science Dept"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Reminder Offset Dropdown */}
        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">Reminder Alarm Time</label>
          <div className="relative flex items-center">
            <Clock className="absolute left-3 w-4 h-4 text-gray-400" />
            <select
              value={reminderMinutes}
              onChange={(e) => setReminderMinutes(Number(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-gray-700 focus:ring-1 focus:ring-emerald-700 focus:outline-none appearance-none cursor-pointer"
            >
              {REMINDERS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-3 text-xs font-bold flex items-center justify-center space-x-2 transition shadow-md active:scale-[0.98] cursor-pointer mt-4"
        >
          <Save className="w-4 h-4" />
          <span>{editingLecture ? 'Update Lecture Entry' : 'Save Lecture Schedule'}</span>
        </button>

      </form>
    </div>
  );
};
