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

const parseLines = (a, dateOnly) => {
  return a.map(group => {
    const impact = parseImpact(group.pop())

    const data = {
      date: group.shift(),
      author: group.shift(),
      subject: group.join('\n'),
      impact
    }

    if (dateOnly) data.date = data.date.split('T')[0]

    return data
  })
}

const SEP = '#####'

module.exports = (args = {}) => {
  const {
    cwd,
    limit,
    mine,
    reverse,
    skip,
    dateOnly,
    since
  } = args

  const params = [
    'log',
    `--format=${SEP}%cI%n%ae%n%s`,
    '--shortstat',
    '--no-merges'
  ]

  if (limit) {
    params.push(`--max-count=${limit}`)
  }

  if (since) {
    params.push(`--since="${since}"`)
  }

  if (reverse) {
    params.push('--reverse')
  }

  if (mine) {
    const _params = ['config', '--get', 'user.name']
    const { stdout, stderr } = spawn('git', _params, { cwd })

    if (stderr && stderr.toString().length) {
      throw new Error(stderr.toString())
    }

    params.push(`--author=${stdout.toString().trim()}`)
  }

  if (skip) {
    params.push(`--skip=${skip}`)
  }

  const { stdout, stderr } = spawn('git', params, { cwd })

  if (stderr.length) {
    throw new Error(stderr.toString())
  }

  let lines = stdout
    .toString() // stringify the stdout
    .split(SEP) // split on new line
    .filter(Boolean) // remove blank lines
    .map(s => s.trim().split('\n'))

  return parseLines(lines, dateOnly)
}
