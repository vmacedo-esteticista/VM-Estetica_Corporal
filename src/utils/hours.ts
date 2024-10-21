import { setHours, setMinutes, format, addMinutes } from "date-fns";

export function generateDayTimeListI(date: Date, serviceTime: number): string[] {
  const startTimeI = setMinutes(setHours(date, 8), 0); // Set start time to 08:00
  const endTimeI = setMinutes(setHours(date, 11), 0); // Set end time to 11:00

  
  const startTimeII = setMinutes(setHours(date, 16), 0); // Set start time to 08:00
  const endTimeII = setMinutes(setHours(date, 19), 0); // Set end time to 11:00

  const interval = serviceTime + 90; // interval in minutes 1:30min

  const timeList: string[] = [];

  let currentTimeI = startTimeI;
  while (currentTimeI <= endTimeI) {
    timeList.push(format(currentTimeI, "HH:mm"));
    currentTimeI = addMinutes(currentTimeI, interval);
  }

  let currentTimeII = startTimeII;
  while (currentTimeII <= endTimeII) {
    timeList.push(format(currentTimeII, "HH:mm"));
    currentTimeII = addMinutes(currentTimeII, interval);
  }

  return timeList;
}

export function generateDayTimeListII(date: Date, serviceTime: number): string[] {
  const startTime = setMinutes(setHours(date, 8), 0); // Set start time to 09:00
  const endTime = setMinutes(setHours(date, 12), 0); // Set end time to 11:00
  const interval = serviceTime + 90; // Interval in minutes 1:30min
  
  const timeList: string[] = [];

  let currentTime = startTime;

  while (currentTime <= endTime) {
    timeList.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, interval);
  }

  return timeList;
}