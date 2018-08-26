const path = require('path')
const fs = require('fs')
const c = require('colors/safe')

const NODE_ENV = process.env.NODE_ENV || 'development'
const ROOT = path.dirname(__dirname)
const SRC = path.resolve(ROOT, 'src')

function getCurrentPageList () {
  return fs.readdirSync(SRC).filter(f => {
    return fs.statSync(path.join(SRC, f)).isDirectory()
  })
}

function validatePageExists (page) {
  const list = getCurrentPageList()
  return !!list.filter(l => l === page).length
}

function parseArgument (arg, { command } = {}) {
  const cmd = command || (NODE_ENV === 'production' ? 'build' : 'serve')
  if (!arg) {
    throw c.red(
      'missing parameter, please run ' +
      c.bold.underline(`npm run ${cmd} -- {page name}`))
  }
  const exists = validatePageExists(arg)
  return {
    name: arg,
    exists,
  }
}

module.exports = {
  getCurrentPageList,
  validatePageExists,
  parseArgument,
}
