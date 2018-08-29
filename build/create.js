const path = require('path')
const fs = require('fs')
const c = require('colors/safe')
const { parseArgument, copyFile } = require('./utils')

const ROOT = path.dirname(__dirname)
const SRC = path.resolve(ROOT, 'src')
const TEMPLATES = path.resolve(ROOT, 'templates')

async function createPage (page) {
  const page_path = path.resolve(SRC, page)
  fs.mkdirSync(page_path);

  ['index.html', 'main.js'].map(filename =>
    copyFile(path.join(TEMPLATES, filename), path.join(page_path, filename)))
}

try {
  const arg = parseArgument(process.argv[2], { command: 'create' })
  if (arg.exists) {
    throw c.red(`page ${c.bold(arg.name)} already exists, please use another name`)
  }
  createPage(arg.name).then(() => {
    console.log(c.green(
      'create page done, you could run ' +
      c.bold.underline(`npm run serve -- ${arg.name}`)))
  })
} catch (e) {
  console.log(e)
  process.exit()
}
