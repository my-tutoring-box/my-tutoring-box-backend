import { addDays, startOfWeek, startOfDay } from 'date-fns';
import { StudentDocument } from 'src/libs/shared/src/schemas/student.schema';

export function getStudentCycle(student: StudentDocument) {
  const totalLessons = student.frequency * 4;
  const cycle = Math.floor(student.count / totalLessons) + 1;
  return cycle;
}

export function createSchedule(student: StudentDocument) {
  const lessonDays = student.time.map((t) => getDayNumber(t.day));
  const totalLessons = student.frequency * 4;
  const cycle = getStudentCycle(student);

  const schedule: any[] = [];
  let count = 1;

  let weekStart = startOfWeek(student.startDate, { weekStartsOn: 0 });

  while (count <= totalLessons) {
    for (let day of lessonDays) {
      let lessonDate = addDays(weekStart, day);

      if (lessonDate < startOfDay(student.startDate)) continue;

      schedule.push({
        studentId: student.id,
        date: lessonDate,
        count,
        cycle,
      });
      count++;
      if (count > totalLessons) break;
    }

    weekStart = addDays(weekStart, 7);
  }

  return schedule;
}

export function getDayNumber(day: string): number {
  const days = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 };
  return days[day];
}

export function getNextLessonDate(from: Date, targetDay: number): Date {
  const currentDay = from.getDay();
  const daysToAdd = (targetDay - currentDay + 7) % 7 || 7;

  const nextDate = addDays(from, daysToAdd);

  return nextDate;
}
