const { parseCmdArgument, convertPatternToValue } = require('../src/cmd');

test('should parse command argument', () => {
  const chunks = parseCmdArgument('*/15 0 1,15 * 1-5 /usr/bin/find');
  expect(chunks).toStrictEqual(['*/15', '0', '1,15', '*', '1-5', '/usr/bin/find']);
});

test('should parse command argument when command has arguments', () => {
  const chunks = parseCmdArgument('*/15 0 1,15 * 1-5 /usr/bin/find . -type f');
  expect(chunks).toStrictEqual(['*/15', '0', '1,15', '*', '1-5', '/usr/bin/find . -type f']);
});

test('should parse command argument when command is missing', () => {
  const chunks = parseCmdArgument('*/15 0 1,15 * 1-5');
  expect(chunks).toStrictEqual(['*/15', '0', '1,15', '*', '1-5']);
});

test('should parse command argument when command is empty', () => {
  const chunks = parseCmdArgument('');
  expect(chunks).toStrictEqual([]);
});

test('should convert simple pattern into array of values', () => {
  expect(convertPatternToValue('10', 0, 59)).toStrictEqual([10]);
});

test('should convert step pattern into array of values', () => {
  expect(convertPatternToValue('*/10', 0, 59)).toStrictEqual([0, 10, 20, 30, 40, 50]);
});

test('should convert range pattern into array of values', () => {
  expect(convertPatternToValue('5-10', 0, 59)).toStrictEqual([5, 6, 7, 8, 9, 10]);
});

test('should convert list pattern into array of values', () => {
  expect(convertPatternToValue('5,10', 0, 59)).toStrictEqual([5, 10]);
});

test('should throw error if list pattern is invalid', () => {
  expect(() => { convertPatternToValue('99,10', 0, 59) }).toThrow('invalid number within list');
});

test('should convert all pattern into array of values', () => {
  expect(convertPatternToValue('*', 1, 5)).toStrictEqual([1,2,3,4,5]);
});

test('should throw error if pattern is not known', () => {
  expect(() => { convertPatternToValue('unknown', 0, 59) }).toThrow("Unknown pattern type 'unknown'");
});