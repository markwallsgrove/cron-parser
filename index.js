

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

const showHelp = () => {
    process.stderr.write(`Usage: cronParser "[minute] [hour] [day of month] [month] [day of week] [command]"`);
}

const args = parseCmdArgument(process.argv[2] || '');
if (args.length !== 6) {
  showHelp();
  process.exit(1);
}

module.exports.parseCmdArgument = parseCmdArgument;