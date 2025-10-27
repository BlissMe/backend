// helpers/sleepConverter.js
function sleepHoursToString(hours) {
  if (hours <= 2) return "0-2 hours";
  if (hours <= 4) return "3-4 hours";
  if (hours <= 6) return "5-6 hours";
  if (hours <= 8) return "7-8 hours";
  return "9+ hours";
}

module.exports = { sleepHoursToString };
