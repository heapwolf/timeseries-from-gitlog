const { spawnSync: spawn } = require('child_process')

const parseImpact = s => {
  if (!s) return ''

  let files = 0
  let insertions = 0
  let deletions = 0

  const parts = s.split(', ')

  parts.forEach((p, index) => {
    const n = parseInt(p, 10)

    if (p.includes('insertion')) {
      insertions = n
    } else if (p.includes('deletion')) {
      deletions = n
    } else {
      files = n
    }
  })

  return {
    files,
    insertions,
    deletions
  }
}

const parseLines = a => {
  return a.map(group => {
    const impact = parseImpact(group.pop())

    return {
      date: group.shift(),
      author: group.shift(),
      subject: group.join('\n'),
      impact
    }
  })
}

const SEP = '#####'

module.exports = (cwd, limit) => {
  const args = [
    'log',
    `--format=${SEP}%cI%n%ae%n%s`,
    '--shortstat',
    '--no-merges'
  ]

  if (limit) args.push(`--max-count=${limit}`)

  const { stdout, stderr } = spawn('git', args, { cwd })

  if (stderr.length) {
    throw new Error(stderr.toString())
  }

  const lines = stdout
    .toString() // stringify the stdout
    .split(SEP) // split on new line
    .filter(v => !!v) // remove blank lines
    .map(s => s.trim().split('\n'))

  return parseLines(lines)
}
