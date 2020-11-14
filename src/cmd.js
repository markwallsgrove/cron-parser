/**
 * Parse the command line argument into an array. The first five entries will be the time patterns,
 * which will be followed by the command. These values are not validated.
 * @param {string} arg Argument from the terminal
 * @return string[] array containing the time patterns followed by the command. There might be missing entries.
 */
const parseCmdArgument = (arg) => {
  const chunks = arg.split(" ");
  const timePatterns = chunks.slice(0, 5);
  const command = chunks.slice(5).join(" ");
  return [...timePatterns, command].filter((value) => !!value);
};

const simplePattern = new RegExp("^[0-9]+$");
const stepPattern = new RegExp("^\\*\\/([0-9]+)$");
const rangePattern = new RegExp("^([0-9]+)-([0-9]+)");
const listPattern = new RegExp("^[0-9]+(,[0-9]+)*$");
const allPattern = new RegExp("^\\*$");

/**
 * Return a simple number within an array. The number must be within
 * the min and max range else a error will be thrown.
 * @param {number} value number to return
 * @param {number} min minimum value the number can be
 * @param {number} max maximum value the number can be (inclusive)
 * @return array array containing value
 * @throws number not within range
 */
const generateSimpleValues = (value, min, max) => {
  if (value < min || value > max) {
    throw new Error("Number not within range");
  }
  return [value];
};

/**
 * Generate a set of numbers that represents a step pattern. The
 * steps will start from the minimum value and end below the maximum
 * value.
 * @param {number} step value to step by until maximum value is reached
 * @param {number} min minimum step value
 * @param {number} max maximum step value
 * @return array steps within min and max
 * @throw invalid step value if not within range
 */
const generateStepValues = (step, min, max) => {
  if (step < min || step > max) {
    throw new Error("invalid step value");
  }

  const steps = [];
  for (let index = min; step * index < max; index++) {
    steps.push(step * index);
  }
  return steps;
};

/**
 * Generate a range of values from the start to the end value (inclusive).
 * @param {number} startValue start value of range
 * @param {number} endValue end value of range
 * @return array of values that represents the value
 */
const generateRangeValues = (startValue, endValue) => {
  const values = [];
  for (let index = startValue; index < endValue + 1; index++) {
    values.push(index);
  }
  return values;
};

/**
 * Generate a list of values from a string that is comma delimited.
 * @param {string} values comma delimited set of numbers
 * @param {number} min minimum value a listed value can be
 * @param {number} max maximum value a listed value can be
 * @return array list of numbers
 * @throw invalid number within list
 */
const generateListValues = (values, min, max) => {
  return values.split(",").map((val) => {
    const numb = Number.parseInt(val);

    if (numb < min || numb > max) {
      throw new Error("invalid number within list");
    }

    return numb;
  });
};

/**
 * Convert a string pattern into a list of values that represents the pattern.
 *
 * If the pattern is simple (10) it must be within the minimum and maximum values.
 *
 * When the stepped pattern (\*\/10) is converted the values returned will be within the minimum and maximum values.
 *
 * The values within the range pattern (1-10) must be within the minimum and maximum values.
 *
 * @param {string} pattern simple, stepped, or range pattern
 * @param {int} min minimum value the pattern must represent
 * @param {int} max maximum value the pattern
 * @return array list of values that represents the pattern
 * @throws error unknown pattern
 */
const convertPatternToValue = (pattern, min, max) => {
  if (pattern.match(simplePattern)) {
    const value = Number.parseInt(pattern);
    return generateSimpleValues(value, min, max);
  } else if ((stepMatch = pattern.match(stepPattern))) {
    const step = Number.parseInt(stepMatch[1]);
    return generateStepValues(step, min, max);
  } else if ((rangeMatch = pattern.match(rangePattern))) {
    const startValue = Number.parseInt(rangeMatch[1]);
    const endValue = Number.parseInt(rangeMatch[2]);
    return generateRangeValues(startValue, endValue);
  } else if (pattern.match(listPattern)) {
    return generateListValues(pattern, min, max);
  } else if (pattern.match(allPattern)) {
    return generateRangeValues(min, max);
  } else {
    throw new Error(`Unknown pattern type '${pattern}'`);
  }
};

/**
 * Convert all patterns into a list of values which represents the pattern.
 * @param {string} minutePattern pattern for generating the minute values
 * @param {string} hourPattern  pattern for generating the hour values
 * @param {string} dayOfMonthPattern pattern for generating the day of month values.
 * @param {string} monthPattern pattern for generating the month values
 * @param {string} dayOfWeekPattern pattern for generating the day of week values
 * @return object keys to array of integer that represent the pattern
 * @throws error if patterns are unknown or not within range
 */
const convertPatternsToValues = (
  minutePattern,
  hourPattern,
  dayOfMonthPattern,
  monthPattern,
  dayOfWeekPattern
) => ({
  minute: convertPatternToValue(minutePattern, 0, 59),
  hour: convertPatternToValue(hourPattern, 0, 23),
  dayOfMonth: convertPatternToValue(dayOfMonthPattern, 1, 31),
  month: convertPatternToValue(monthPattern, 1, 12),
  day: convertPatternToValue(dayOfWeekPattern, 0, 6),
});

const display = (values, command, stdout) => {
  stdout.write(`minute        ${values.minute.join(" ")}\n`);
  stdout.write(`hour          ${values.hour.join(" ")}\n`);
  stdout.write(`day of month  ${values.dayOfMonth.join(" ")}\n`);
  stdout.write(`month         ${values.month.join(" ")}\n`);
  stdout.write(`day of week   ${values.day.join(" ")}\n`);
  stdout.write(`command       ${command}\n`);
};

const showHelp = (stderr) => {
  stderr.write(
    `Usage: cronParser "[minute] [hour] [day of month] [month] [day of week] [command]"`
  );
};

const main = (argv, stderr, stdout) => {
  const args = parseCmdArgument(argv[2] || "");
  if (args.length !== 6) {
    showHelp(stderr);
    return 1;
  }

  const command = args[args.length - 1];

  try {
    const values = convertPatternsToValues(...args);
    display(values, command, stdout);
  } catch (err) {
    stderr.write(`${err.message}\n`);
    return 1;
  }

  return 0;
};

module.exports = {
  parseCmdArgument,
  convertPatternToValue,
  convertPatternsToValues,
  main,
};
