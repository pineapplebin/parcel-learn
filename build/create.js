const path = require('path')
const fs = require('fs')
const term = require('terminal-kit').terminal
const c = require('colors/safe')
const templates = require('../templates')
const { copyFile, validatePageExists } = require('./utils')

/**
 * 入口函数，控制台交互
 * @returns {Promise<void>}
 */
async function create () {
  term.cyan('请输入新建页面的名字：')
  const name = await term.inputField({}).promise;
  if (!name.match(/^[\d\w-_]+$/)) {
    term.red.bold('\n页面名字只能使用数字、英文、-和_，请使用其他名字\n')
    return
  }

  const now = new Date()
  const page_name = `${now.getFullYear()}${padZero(now.getMonth() + 1)}${
    padZero(now.getDate())}_${name}`
  if (validatePageExists(page_name)) {
    term.red.bold('\n该页面名字已存在，请使用其他名字\n')
  }

  const template_list = Object.keys(templates).map(key => ({ key, title: templates[key] }))
  term.cyan('\n请选择使用的模版：')
  const response = await term.singleColumnMenu(
    template_list.map(item => item.title)).promise

  const template_name = template_list[response.selectedIndex].key
  await useTemplate(page_name, template_name)
  console.log(c.green(`\n创建成功，可执行 ${
    c.bold(`npm run serve -- ${page_name}`)} 进行开发\n`))
}

/**
 * 根据选择模板复制到目录
 * @param {string} page_name
 * @param {string} template_name
 * @returns {Promise<void>}
 */
async function useTemplate (page_name, template_name) {
  term.green(`\n正在创建 ${page_name} 目录...\n`)
  const ROOT = path.dirname(__dirname)
  const SRC = path.resolve(ROOT, 'src')
  const template_folder = path.resolve(ROOT, 'templates', template_name)
  const page_folder = path.join(SRC, page_name)

  fs.mkdirSync(page_folder)
  // 将模板内文件复制到目标目录
  copy(template_folder, page_folder)
}

function copy (source_folder, target_folder) {
  fs.readdirSync(source_folder).forEach(f => {
    const source = path.join(source_folder, f)
    const target = path.join(target_folder, f)
    const stat = fs.statSync(source)
    if (stat.isDirectory()) {
      fs.mkdirSync(target)
      copy(source, target)
    } else {
      copyFile(source, target)
    }
  })
}

/**
 * 填充0
 * @param {string|number} n
 * @returns {string}
 */
function padZero (n) {
  return +n < 10 ? `0${n}` : '' + n
}

create()
  .then(() => {
    process.exit()
  })
  .catch(err => {
    term.red.bold('\n发生错误：' + err)
    process.exit()
  })
