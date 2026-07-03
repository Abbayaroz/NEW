export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Lecturer' | 'Student' | 'Timetable Officer';
  matricNo?: string;
  isApproved?: boolean;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
}

export interface Department {
  id: string;
  facultyId: string;
  name: string;
  code: string;
}

export interface Programme {
  id: string;
  departmentId: string;
  name: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  departmentId: string;
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  block: string;
}

export interface CourseAllocation {
  id: string;
  courseId: string;
  lecturerId: string;
}

export interface TimetableSlot {
  id: string;
  courseId: string;
  lecturerId: string;
  venueId: string;
  day: DayOfWeek;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  level: string;
  courseCode?: string;
  courseTitle?: string;
  lecturerName?: string;
  venueName?: string;
}

export interface AttendanceLog {
  id: string;
  timetableId: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  status: 'Present' | 'Absent' | 'Excused';
  checkedInAt?: string;
  studentName?: string;
  matricNo?: string;
  courseCode?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  lecturerId: string;
  timestamp: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  description: string;
  lecturerId: string;
}

export interface LectureNote {
  id: string;
  courseId: string;
  title: string;
  fileName: string;
  fileSize: string;
  courseCode?: string;
}

export interface AcademicSession {
  id: string;
  year: string;
  semester: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  detail: string;
  userId: string;
  timestamp: string;
}

export interface NotificationSettings {
  remindersEnabled: boolean;
  defaultReminderMinutes: number;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  priority: 'Low' | 'Default' | 'High';
  smsNotifications: boolean;
  emailNotifications: boolean;
}

export interface SimulatedNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
