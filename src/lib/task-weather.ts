type WeatherTask = { date: string; done: boolean };

export function shouldShowStormOnDayChange(tasks: WeatherTask[], previous: string, next: string, currentDay: string): boolean {
  if (previous === next) return false;
  const hasUnfinished = (day: string) => tasks.some((task) => task.date === day && !task.done);
  return (next > previous && hasUnfinished(previous)) || (next < currentDay && hasUnfinished(next));
}