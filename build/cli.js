const Bundler = require('parcel-bundler')
const path = require('path')
const c = require('colors/safe')
const { parseArgument } = require('./utils')

const ROOT = path.dirname(__dirname)
const NODE_ENV = process.env.NODE_ENV || 'development'

async function bundle (page) {
  const file = path.resolve(ROOT, 'src', page, '*.html')
  const options = {
    outDir: path.resolve(ROOT, 'dist', page),
    publicUrl: './',
    watch: NODE_ENV !== 'production',
    minify: NODE_ENV === 'production',
    target: 'browser',
    cache: false,
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
      `页面 ${c.bold(arg.name)} 不存在，` +
      `可执行 ${c.bold.underline(`npm run create -- ${arg.name}`)} 进行创建新页面`)
  }
  bundle(arg.name).then()
} catch (e) {
  console.log(e)
  process.exit()
}
