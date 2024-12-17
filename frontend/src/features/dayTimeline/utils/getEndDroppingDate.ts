export const getEndDroppingDate = (
  currentDate: Date,
  startMinute: number,
  duration: number
) => {
  const endMinutes = startMinute + duration;
  const endTime = new Date(currentDate);
  endTime.setHours(Math.floor(endMinutes / 60), endMinutes % 60);
  return endTime;
};
