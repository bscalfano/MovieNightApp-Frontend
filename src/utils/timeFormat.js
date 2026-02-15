/**
 * Converts 24-hour time format (HH:MM:SS or HH:MM) to 12-hour AM/PM format
 * @param {string} time24 - Time in 24-hour format (e.g., "14:30:00" or "14:30")
 * @returns {string} Time in 12-hour format (e.g., "2:30 PM")
 */
export function format12Hour(time24) {
  if (!time24) return '';
  
  // Split the time string and get hours and minutes
  const parts = time24.split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  
  // Determine AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  return `${hours}:${minutes} ${ampm}`;
}