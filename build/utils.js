const path = require('path')
const fs = require('fs')
const c = require('colors/safe')

const NODE_ENV = process.env.NODE_ENV || 'development'
const ROOT = path.dirname(__dirname)
const SRC = path.resolve(ROOT, 'src')

/**
 * 获取当前src中子目录名字
 * @returns {string[]}
 */
function getCurrentPageList () {
  return fs.readdirSync(SRC).filter(f => {
    return fs.statSync(path.join(SRC, f)).isDirectory()
  })
}

/**
 * 校验指定名称的src子目录是否存在
 * @param {string} page
 * @returns {boolean}
 */
function validatePageExists (page) {
  const list = getCurrentPageList()
  return !!list.filter(l => l === page).length
}

/**
 * 解析命令行输入参数，并返回是否存在相同名字的src子目录
 * @param {string} arg
 * @param {string} command
 * @returns {{name: string, exists: boolean}}
 */
function parseArgument (arg, { command } = {}) {
  const cmd = command || (NODE_ENV === 'production' ? 'build' : 'serve')
  if (!arg) {
    throw c.red(
      '缺少参数，请参照格式执行 ' +
      c.bold.underline(`npm run ${cmd} -- {page name}`))
  }
  const exists = validatePageExists(arg)
  return {
    name: arg,
    exists,
  }
}

/**
 * 将指定路径的文件复制另一个指定的路径
 * @param {string} from
 * @param {string} to
 * @returns {string}
 */
function copyFile (from, to) {
  const content = fs.readFileSync(from, { encoding: 'utf8' })
  fs.writeFileSync(to, content, { encoding: 'utf8' })
  return content
}

module.exports = {
  getCurrentPageList,
  validatePageExists,
  parseArgument,
  copyFile,
}
