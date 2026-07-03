export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Lecture {
  id: string;
  courseCode: string;
  courseTitle: string;
  lecturer: string;
  day: DayOfWeek;
  startTime: string; // "HH:MM" 24h format
  endTime: string; // "HH:MM" 24h format
  venue: string;
  reminderMinutes: number; // 5, 15, 30, 60
}

export interface StudentProfile {
  fullName: string;
  matricNo: string;
  department: string;
  faculty: string;
  level: string; // "100 Level", "200 Level", etc.
}

export interface NotificationSettings {
  remindersEnabled: boolean;
  defaultReminderMinutes: number;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  priority: 'Low' | 'Default' | 'High';
}

export interface SimulatedNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string; // ISO string
  isRead: boolean;
}
