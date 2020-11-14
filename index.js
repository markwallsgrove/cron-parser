#!env node
const { main } = require("./src/cmd");

process.exit(main(process.argv, process.stderr, process.stdout));
