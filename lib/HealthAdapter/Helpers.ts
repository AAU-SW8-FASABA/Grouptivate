export function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];

  // Create a new date object so we don't mutate the original
  let currentDate = new Date(startDate);

  // Loop until currentDate > endDate
  while (currentDate <= endDate) {
    // Push a new Date instance to avoid reference issues
    dates.push(new Date(currentDate));

    // Increment currentDate by one day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
