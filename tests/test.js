const { parseCmdArgument } = require('../index');

test('should parse command argument', () => {
  const chunks = parseCmdArgument('*/15 0 1,15 * 1-5 /usr/bin/find');
  expect(chunks).toStrictEqual(['*/15', '0', '1,15', '*', '1-5', '/usr/bin/find']);
});

test('should parse command argument when command has arguments', () => {
  const chunks = parseCmdArgument('*/15 0 1,15 * 1-5 /usr/bin/find . -type f');
  expect(chunks).toStrictEqual(['*/15', '0', '1,15', '*', '1-5', '/usr/bin/find . -type f']);
});

test('should parse command argument when command is empty', () => {
    const chunks = parseCmdArgument('');
    expect(chunks).toStrictEqual(['', '']);
  });