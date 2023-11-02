/* 插件功能主流程 */
import path from 'path'
import { parseDeclare, writeCompileContents } from './parse'
import { removeDir, execTscCommand, vconsole } from './helper'
import { PluginOptions, PluginOutPath, PluginScriptPathsConfig } from '../types/index'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import chalk from 'chalk'
const __dirname = dirname(fileURLToPath(import.meta.url))

// 全局属性 - 标记当前是否在编译进程中，目的时防止频繁触发
let isCompiling = false

// compile目录 - tsc编译后声明存放的地方
const COMPILE_DIR = path.join(__dirname, './compile')
// const COMPILE_DIR = path.join(__dirname, '../compile')  // 本地开发环境

// prettierrc路径 - 样式格式化文件
const PRETTIERRC_PATH = path.join(__dirname, './.prettierrc')
// const PRETTIERRC_PATH = path.join(__dirname, '../.prettierrc')  // 本地开发环境

// 记录声明文件中引入的三方包(切记不用用相对路径引入，相对路径未处理)
let importLibs: Array<string> = []

// 记录声明文件中自定义的接口
let importDeclare: Array<string> = []

// 记录声明文件内容
let compileContents: Array<string> = []


// 方法 - 主流程
// 1. 使用tsc编译项目得到声明文件 -> 2. 自定义解析对声明文件进行过滤、替换最终合并成一个文件 -> 3. 将文件输出到目标路径
export const generateMain = async (gScriptPathConfigs: PluginScriptPathsConfig, gOutPath: PluginOutPath, gPluginOptions: PluginOptions) => {
  // 是否打开log日志
  vconsole.setKeepLog(gPluginOptions.keepLog as boolean)

  // 表示正在编译中 - 直接返回
  if (isCompiling) return
  isCompiling = true

  /* 进行一些数据初始化操作，主要时保持数据是最新的，防止上一次编译数据保留 */
  removeDir(COMPILE_DIR)
  compileContents = []
  importLibs = []
  importDeclare = []

  // 1. 执行tsc编译，将编译后的声明文件放到compile目录下
  try {
    await execTscCommand(gScriptPathConfigs, COMPILE_DIR)
  } catch (e) {
    console.error('[vite-plugin-globEager-auto-declare] 使用tsc编译失败, error:', e)
    return
  }

  // 2. 自定义解析对声明文件进行过滤、替换最终合并成一个文件
  parseDeclare(COMPILE_DIR, gOutPath, gScriptPathConfigs, compileContents, importLibs, importDeclare)

  // 3. 将声明文件写入目标地址
  writeCompileContents(gOutPath, gScriptPathConfigs, compileContents, importLibs, importDeclare)

  // 4. 使用eslint格式化文件
  try {
    console.log(PRETTIERRC_PATH)
    console.log(gOutPath)
    execSync(`prettier --config ${PRETTIERRC_PATH} --write ${gOutPath}`);
  } catch (e) {
    console.log('sssssss')
    console.log(e)
    console.log('[vite-plugin-globEager-auto-declare] prettier格式化命令出错');
  }

  // 5. 删除中间目录
  if (!gPluginOptions.keepCompile) {
    try {
      removeDir(COMPILE_DIR)
    } catch (e) {
      console.error(
        '[vite-plugin-globEager-auto-declare] 清空编译目录失败, error:',
        JSON.stringify(e)
      )
      return
    }
  }

  console.log(chalk.green('[vite-plugin-globEager-auto-declare] 自动生成声明文件执行成功'));

  isCompiling = false
}
