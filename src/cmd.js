
/**
 * Parse the command line argument into an array. The first five entries will be the time patterns,
 * which will be followed by the command. These values are not validated.
 * @param {string} arg Argument from the terminal
 * @return string[] array containing the time patterns followed by the command
 */
const parseCmdArgument = (arg) => {
    const chunks = arg.split(' ');
    const timePatterns = chunks.slice(0, 5);
    const command = chunks.slice(5).join(' ');
    return [...timePatterns, command];
};



const simplePattern = new RegExp('^[0-9]+$');
const stepPattern = new RegExp('^\\*\\/([0-9]+)$');
const rangePattern = new RegExp('^([0-9]+)\-([0-9]+)');
const convertPatternToValue = (pattern, min, max) => {
    if (pattern.match(simplePattern)) {
        const value = Number.parseInt(pattern);
        if (value < min || value > max) {
            throw new Error('Number not within range');
        }
        return [value];
    } else if (stepMatch = pattern.match(stepPattern)) {
        const step = Number.parseInt(stepMatch[1]);
        const steps = [];
        for (let index = 0; step * index < max; index++) {
          steps.push(step * index);
        }
        return steps;
    } else if (rangeMatch = pattern.match(rangePattern)) {
        const startValue = Number.parseInt(rangeMatch[1]);
        const endValue = Number.parseInt(rangeMatch[2]);
        const values = [];
        for (let index = startValue; index < endValue + 1; index++) {
          values.push(index);
        }
        return values;
    } else {
        throw new Error(`Unknown pattern type ${pattern}`);
    }
};

const convertPatternsToValues = (minutePattern, hourPattern, dayOfMonthPattern, monthPattern, dayOfWeekPattern) => [
    convertPatternToValue(minutePattern, 0, 59),
    convertPatternToValue(hourPattern, 0, 59),
    convertPatternToValue(dayOfMonthPattern, 1, 31),
    convertPatternToValue(monthPattern, 1, 12),
    convertPatternToValue(dayOfWeekPattern, 0, 6),
];

const display = (args) => {

}

const showHelp = () => {
    process.stderr.write(`Usage: cronParser "[minute] [hour] [day of month] [month] [day of week] [command]"`);
}

const main = (argv) => {
    const args = parseCmdArgument(argv[2] || '');
    if (args.length !== 6) {
        showHelp();
        return 1;
    }

    const command = args[args.length - 1];
    const values = convertPatternToValues(...args);
    display(...values, command);

    return 0;
}; 

module.exports = {
    parseCmdArgument,
    convertPatternToValue,
    main,
  };