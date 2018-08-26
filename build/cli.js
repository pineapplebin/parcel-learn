const Bundler = require('parcel-bundler')
const path = require('path')
const c = require('colors/safe')
const { parseArgument } = require('./utils')

const ROOT = path.dirname(__dirname)
const NODE_ENV = process.env.NODE_ENV || 'development'

async function bundle (page) {
  const file = path.resolve(ROOT, 'src', page, 'index.html')
  const options = {
    outDir: path.resolve(ROOT, 'dist', page),
    watch: NODE_ENV !== 'production',
    minify: NODE_ENV === 'production',
    target: 'browser',
    // https: false,
  }

  const bundler = new Bundler(file, options)

  if (NODE_ENV === 'development') {
    bundler.serve(process.env.DEV_PORT || 1234)
  } else {
    bundler.bundle()
  }
}

try {
  const arg = parseArgument(process.argv[2])
  if (!arg.exists) {
    throw c.red(
      `page name ${c.bold(arg.name)} not found, ` +
      `please run ${c.bold.underline(`npm run create -- ${arg.name}`)} before`)
  }
  bundle(arg.name).then()
} catch (e) {
  console.log(e)
  process.exit()
}
