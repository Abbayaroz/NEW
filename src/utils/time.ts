import { DayOfWeek, Lecture } from '../types';

const DAYS_ORDER: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function format12Hour(time24: string): string {
  if (!time24) return '';
  const [hourStr, minStr] = time24.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minStr} ${ampm}`;
}

export function getCurrentDateString(): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Date().toLocaleDateString('en-US', options);
}

export function getTodayDayName(): DayOfWeek {
  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  return days[todayIndex];
}

export interface NextLectureInfo {
  lecture: Lecture;
  countdownText: string;
  minutesRemaining: number;
}

export function getNextUpcomingLecture(lectures: Lecture[], refDate: Date = new Date()): NextLectureInfo | null {
  if (lectures.length === 0) return null;

  const currentDayIndex = refDate.getDay(); // 0 is Sunday, 1 is Monday...
  // Convert Sunday=0, Monday=1 to our DAYS_ORDER indexes:
  // Sunday is 6, Monday is 0, Tuesday is 1...
  const currentDayOrderIdx = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

  const currentHour = refDate.getHours();
  const currentMinute = refDate.getMinutes();
  const currentMinutesOffset = currentHour * 60 + currentMinute;

  let bestNextLecture: Lecture | null = null;
  let minDaysDiff = 8;
  let minMinutesDiff = 999999;

  lectures.forEach((lecture) => {
    const lectureDayIdx = DAYS_ORDER.indexOf(lecture.day);
    if (lectureDayIdx === -1) return;

    // Calculate days difference
    let daysDiff = lectureDayIdx - currentDayOrderIdx;
    
    const [lHourStr, lMinStr] = lecture.startTime.split(':');
    const lectureMinutesOffset = parseInt(lHourStr, 10) * 60 + parseInt(lMinStr, 10);

    // If lecture is today but already started/passed, it belongs to next week
    if (daysDiff < 0 || (daysDiff === 0 && lectureMinutesOffset <= currentMinutesOffset)) {
      daysDiff += 7;
    }

    const minutesDiff = daysDiff * 24 * 60 + (lectureMinutesOffset - currentMinutesOffset);

    if (minutesDiff < minMinutesDiff) {
      minMinutesDiff = minutesDiff;
      minDaysDiff = daysDiff;
      bestNextLecture = lecture;
    }
  });

  if (!bestNextLecture) return null;

  // Format countdown text
  let countdownText = '';
  const totalMin = minMinutesDiff;
  const days = Math.floor(totalMin / (24 * 60));
  const hours = Math.floor((totalMin % (24 * 60)) / 60);
  const mins = totalMin % 60;

  if (days > 0) {
    countdownText = `${days}d ${hours}h`;
  } else if (hours > 0) {
    countdownText = `${hours}h ${mins}m`;
  } else {
    countdownText = `${mins}m`;
  }

  return {
    lecture: bestNextLecture,
    countdownText,
    minutesRemaining: totalMin,
  };
}

export function getLecturesScheduledToday(lectures: Lecture[]): Lecture[] {
  const today = getTodayDayName();
  return lectures
    .filter((l) => l.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function sortLecturesByTime(lectures: Lecture[]): Lecture[] {
  return [...lectures].sort((a, b) => {
    const dayDiff = DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return a.startTime.localeCompare(b.startTime);
  });
}
