import { Lecture, StudentProfile, NotificationSettings } from './types';

export const SAMPLE_LECTURES: Lecture[] = [
  {
    id: 'sample-1',
    courseCode: 'CSC 205',
    courseTitle: 'Operations Research and Optimisation',
    lecturer: 'Mr. Sulaiman Muhammad Garba',
    day: 'Monday',
    startTime: '10:00',
    endTime: '12:00',
    venue: 'Smart Lab',
    reminderMinutes: 15,
  },
  {
    id: 'sample-2',
    courseCode: 'CMP 431',
    courseTitle: 'Artificial Intelligence and Expert Systems',
    lecturer: 'Mr. Sulaiman Muhammad Garba',
    day: 'Wednesday',
    startTime: '08:00',
    endTime: '10:00',
    venue: 'Computer Laboratory',
    reminderMinutes: 30,
  },
  {
    id: 'sample-3',
    courseCode: 'CYB 102',
    courseTitle: 'Social Media and Security',
    lecturer: 'Department Lecturer',
    day: 'Friday',
    startTime: '14:00',
    endTime: '16:00',
    venue: 'Lecture Hall B',
    reminderMinutes: 15,
  }
];

export const DEFAULT_PROFILE: StudentProfile = {
  fullName: 'Bashir Abba Yaroz',
  matricNo: 'FUDMA/CSC/22/0142',
  department: 'Computer Science',
  faculty: 'Physical Sciences',
  level: '300 Level',
};

export const DEFAULT_SETTINGS: NotificationSettings = {
  remindersEnabled: true,
  defaultReminderMinutes: 15,
  vibrationEnabled: true,
  soundEnabled: true,
  priority: 'High',
};
