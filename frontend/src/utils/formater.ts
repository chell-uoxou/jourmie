export default function formatDuration(duration: number) {
  const hour = Math.floor(duration / 60);
  const minute = duration % 60;
  return (hour > 0 ? hour + "時間" : "") + (minute > 0 ? minute + "分" : "");
}
