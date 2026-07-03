import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { User, Award, Edit2, Check, CreditCard, BookOpen, GraduationCap } from 'lucide-react';

interface ProfileTabProps {
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
}

const LEVELS = ['100 Level', '200 Level', '300 Level', '400 Level'];

export const ProfileTab: React.FC<ProfileTabProps> = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [matricNo, setMatricNo] = useState(profile.matricNo);
  const [department, setDepartment] = useState(profile.department);
  const [faculty, setFaculty] = useState(profile.faculty);
  const [level, setLevel] = useState(profile.level);

  const [message, setMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!fullName.trim()) return setMessage('Please enter your full name.');
    if (!matricNo.trim()) return setMessage('Please enter your matriculation number.');
    if (!department.trim()) return setMessage('Please enter your department name.');
    if (!faculty.trim()) return setMessage('Please enter your faculty name.');

    const updatedProfile: StudentProfile = {
      fullName: fullName.trim(),
      matricNo: matricNo.trim().toUpperCase(),
      department: department.trim(),
      faculty: faculty.trim(),
      level,
    };

    onUpdateProfile(updatedProfile);
    setIsEditing(false);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div id="profile_tab_container" className="flex flex-col h-full max-h-[580px] p-4 space-y-4 select-none overflow-y-auto scrollbar-none pb-8">
      
      {/* Header */}
      <div className="pb-1 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-gray-800 flex items-center space-x-1">
            <GraduationCap className="w-4.5 h-4.5 text-emerald-700" />
            <span>Student Profile ID</span>
          </h2>
          <p className="text-[10px] text-gray-400 font-medium">Manage your university student credential details</p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center space-x-1 hover:bg-emerald-100 transition cursor-pointer"
        >
          <Edit2 className="w-3 h-3" />
          <span>{isEditing ? 'View ID Card' : 'Edit Info'}</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-2.5 rounded-xl font-bold flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Profile Visual Section */}
      {!isEditing ? (
        /* DIGITAL STUDENT ID CARD CARD DESIGN */
        <div id="digital_student_id_card" className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white rounded-2xl p-4 shadow-lg border border-emerald-800/30 relative overflow-hidden flex flex-col justify-between aspect-[1.58/1] min-h-[220px]">
          
          {/* Card watermark logos */}
          <div className="absolute right-0 bottom-0 opacity-[0.04] transform translate-x-4 translate-y-4 select-none">
            <Award className="w-48 h-48" />
          </div>

          {/* FUDMA Crest / Title Header */}
          <div className="flex items-start justify-between border-b border-emerald-700/60 pb-2">
            <div>
              <h3 className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-300 leading-tight">Federal University Dutsin-Ma</h3>
              <p className="text-[7px] font-bold text-emerald-100/70 tracking-widest uppercase">Katsina State, Nigeria • Official ID Card</p>
            </div>
            <div className="bg-emerald-800 p-1.5 rounded-lg border border-emerald-600/40">
              <Award className="w-4 h-4 text-emerald-300" />
            </div>
          </div>

          {/* Body with Student Avatar and Credentials */}
          <div className="flex items-center space-x-4 my-2.5">
            {/* Avatar container */}
            <div className="w-14 h-14 rounded-xl border-2 border-emerald-400 bg-emerald-800/80 flex items-center justify-center flex-shrink-0 relative">
              <User className="w-8 h-8 text-emerald-100" />
              <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 bg-emerald-400 text-emerald-950 text-[6px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                Active
              </div>
            </div>

            {/* Student metadata list */}
            <div className="min-w-0 flex-1 space-y-0.5">
              <h4 className="text-sm font-extrabold text-emerald-50 truncate uppercase leading-tight" title={profile.fullName}>
                {profile.fullName}
              </h4>
              <p className="text-[9px] font-mono font-bold text-emerald-300">{profile.matricNo}</p>
              
              <div className="pt-1 flex flex-col text-[8px] text-emerald-100/80">
                <span className="truncate">Dept: <span className="font-bold text-white">{profile.department}</span></span>
                <span className="truncate">Faculty: <span className="font-bold text-white">{profile.faculty}</span></span>
              </div>
            </div>
          </div>

          {/* ID Footer Bar with Barcode */}
          <div className="flex items-end justify-between border-t border-emerald-700/50 pt-2 text-[8px]">
            <div>
              <span className="text-emerald-300/80 block text-[6px] uppercase tracking-wider font-extrabold">Academic Standing</span>
              <span className="font-bold text-emerald-50 text-[9px]">{profile.level}</span>
            </div>
            
            {/* Simulated Barcode */}
            <div className="flex flex-col items-center">
              <div className="flex space-x-[1px] h-4 items-end bg-emerald-100/90 px-1.5 rounded-xs">
                <span className="w-[1px] h-3.5 bg-black" />
                <span className="w-[2px] h-3.5 bg-black" />
                <span className="w-[1px] h-3.5 bg-black" />
                <span className="w-[1px] h-3.5 bg-black" />
                <span className="w-[3px] h-3.5 bg-black" />
                <span className="w-[1px] h-3.5 bg-black" />
                <span className="w-[2px] h-3.5 bg-black" />
                <span className="w-[1px] h-3.5 bg-black" />
                <span className="w-[1px] h-3.5 bg-black" />
                <span className="w-[2px] h-3.5 bg-black" />
                <span className="w-[1px] h-3.5 bg-black" />
              </div>
              <span className="text-[6px] text-emerald-300/80 mt-0.5 font-mono">FUDMA-{profile.matricNo.split('/').pop()}</span>
            </div>
          </div>

        </div>
      ) : (
        /* EDITABLE PROFILE FORM SECTION */
        <form onSubmit={handleSave} className="bg-white border border-gray-150 rounded-2xl p-4 space-y-3.5 shadow-xs">
          <div className="flex items-center space-x-2 pb-2 border-b border-gray-50">
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-gray-800">Edit Credentials Form</span>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">Full Student Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none"
              placeholder="e.g. Bashir Abba Yaroz"
            />
          </div>

          {/* Matriculation Number */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">Matriculation Number</label>
            <input
              type="text"
              value={matricNo}
              onChange={(e) => setMatricNo(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase focus:ring-1 focus:ring-emerald-700 focus:outline-none"
              placeholder="e.g. FUDMA/CSC/22/0142"
            />
          </div>

          {/* Department */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none"
              placeholder="e.g. Computer Science"
            />
          </div>

          {/* Faculty */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">Faculty</label>
            <input
              type="text"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none"
              placeholder="e.g. Physical Sciences"
            />
          </div>

          {/* Academic Level */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">Academic Level Standing</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:ring-1 focus:ring-emerald-700 focus:outline-none appearance-none cursor-pointer"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Updated Credentials</span>
          </button>
        </form>
      )}

      {/* Academic Guidelines Box */}
      <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-2">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-700 flex items-center space-x-1">
          <BookOpen className="w-3.5 h-3.5 text-gray-400" />
          <span>FUDMA Attendance Policy</span>
        </h3>
        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
          Federal University Dutsin-Ma requires all students to attain a minimum of <strong>75% lecture attendance</strong> to be eligible to sit for departmental and faculty final examinations. Keep your timetable updated to maintain consistency!
        </p>
      </div>

    </div>
  );
};
