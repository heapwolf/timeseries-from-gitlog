# SYNOPSIS
Represent the git log as time-series data (JSON).

## EXAMPLE
Git log can be formatted, we can also add some stats about each commit,
for example, running `git log --format=%cI%n%s --shortstat` will give you...

```
2018-06-07T16:44:26+02:00
add readme

 2 files changed, 93 insertions(+), 5 deletions(-)
2018-06-04T19:18:13+02:00
parse

 1 file changed, 8 insertions(+), 1 deletion(-)
2018-06-04T19:13:48+02:00
first

 1 file changed, 3 insertions(+)
```

This is pretty easy to parse, and we end up with something like this...

```js
[ { date: '2018-06-07T16:44:26+02:00',
    subject: 'add readme',
    impact: { files: 2, insertions: 93, deletions: 5 } },
  { date: '2018-06-04T19:18:13+02:00',
    subject: 'parse',
    impact: { files: 1, insertions: 8, deletions: 1 } },
  { date: '2018-06-04T19:13:48+02:00',
    subject: 'first',
    impact: { files: 1, insertions: 3, deletions: 0 } } ]
```
