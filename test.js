const test = require('tape')
const tfg = require('.')

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('get log from this repo', t => {
  const log = tfg()
  t.ok(Array.isArray(log), 'an array was produced')

  const entry = log.pop()
  t.ok(typeof entry === 'object', 'the last item is an object')
  t.ok(new Date(entry.date), 'entry.date is a parsable date')
  t.ok(entry.author, 'there is an author field')
  t.ok(typeof entry.impact === 'object', 'there is an impact object')
  t.ok(typeof entry.impact.files === 'number', 'changes to files are counted')
  t.ok(typeof entry.impact.deletions === 'number', 'deletions are counted')
  t.ok(typeof entry.impact.insertions === 'number', 'insertions are counted')
  t.end()
})

test('get log from this repo with limit parameter', t => {
  const log = tfg({ limit: 1 })
  t.equal(log.length, 1, 'only one item listed')
  t.end()
})

test('get log from this repo with dateOnly parameter', t => {
  const log = tfg({ dateOnly: true })
  t.equal(log[0].date, '2018-06-07', 'the time was omitted from the date')
  t.end()
})

test('get log from this repo, skip 1', t => {
  const log = tfg({ skip: 1 })
  t.equal(log[0].date, '2018-06-07T17:46:09+02:00', 'the timestamp was correct')
  t.end()
})
