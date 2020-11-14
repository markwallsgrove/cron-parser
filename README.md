# CRON Parser
Standard CRON format parser that summarises the pattern. The parser accepts a standard five field format (minute, hour, day of month, month, and day of week) and the command to execute.

Special cases such as `@yearly` are currently not supported.

## Execution
```
# ./your-program "*/15 0 1,15 * 1-5 /usr/bin/find"
minute 0 15 30 45
hour 0
day of month 1 15
month 1 2 3 4 5 6 7 8 9 10 11 12
day of week 1 2 3 4 5
command /usr/bin/find
```

## Testing
Execute `npm run test`