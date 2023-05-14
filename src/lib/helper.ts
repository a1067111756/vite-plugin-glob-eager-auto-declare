/* 工具类方法 */
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import type { PluginScriptPaths, PluginScriptPathsConfig } from '#/index'

interface VConsole {
  keepLog: boolean
  log: (...args: any[]) => void
  dir: (...args: any[]) => void
  setKeepLog: (keepLog: boolean) => void
}

// 工具方法 - 清空指定目录
export const removeDir = (dirPath: string) => {
  // 目录不存在 - 直接返回
  if (!fs.existsSync(dirPath)) {
    return
  }

  // 读取目录中文件
  const files = fs.readdirSync(dirPath)

  // 递归遍历目录文件进行删除操作
  files.forEach((file) => {
    const filePath = path.resolve(dirPath, file)
    const stat = fs.lstatSync(filePath)

    // 如果是目录，继续递归
    if (stat.isDirectory()) {
      removeDir(filePath)
    }

    // 如果是文件，直接删除
    if (stat.isFile()) {
      fs.unlinkSync(filePath)
    }
  })

  // 删除空目录
  fs.rmdirSync(dirPath)
}

// 工具方法 - 匹配获取源路径相对目标路径除了公共部分外的剩余路径
// eg: E://testProject//demo//src//api/dir、E://testProject//demo//build/compile -> //api/dir
export const getExtraRelativePath = (sourcePath: string, destPath: string) => {
  const declareFiles = fs.readdirSync(destPath)
  const matchFileName = declareFiles.find(fileName => sourcePath.includes(fileName))
  if (!matchFileName) return

  return `${destPath}\\${sourcePath.slice(sourcePath.lastIndexOf(matchFileName))}`

  // console.log('sourcePath:', sourcePath)
  // console.log('destPath:', destPath)
  //
  // // 获取sourcePath相对于destPath的相对路径
  // const relativePath = path.normalize(path.relative(destPath, sourcePath))
  // console.log('relativePath:', relativePath)
  //
  // // 对相对路径进行拆分，去除前面的上级、上上级路径
  // const pathArr = relativePath.split('\\').filter(item => item !== '..' && item !== '.')
  // console.log('pathArr:', relativePath)
  // pathArr.shift()
  //
  // // 重新组合返回目标路径
  // return pathArr.join('/')
}

// 方法 - 解析编译脚本的配置
export const parseScriptPathsConfig = (scriptPaths: PluginScriptPaths): PluginScriptPathsConfig => {
  return scriptPaths.map(scriptPath => {
    // 单字符串形式
    if (typeof scriptPath === 'string') {
      return {
        path: scriptPath,
        exclude: ['index.ts'],
        mountedName: (scriptPath as string).slice((scriptPath as string).lastIndexOf('\\') + 1)
      }
    }

    // 对象形式
    if (!scriptPath.path) {
      throw new Error('[vite-plugin-globEager-auto-declare] error: 编译文件中缺失path目标路径')
    }

    return {
      // 编译文件地址
      path: scriptPath.path,
      // 是否跳过index文件解析, 默认true
      exclude: scriptPath.exclude || ['index.ts'],
      // 编译后挂载到全局属性上的名称，默认是和文件名保持一致
      mountedName: scriptPath.mountedName || scriptPath.path.slice(scriptPath.path.lastIndexOf('\\') + 1)
    }
  })
}

// 方法 - 使用tsc命令对项目进行编译进而得到声明文件
export const execTscCommand = (compilePath: string) => {
  return new Promise((resolve, reject) => {
    exec(
      `tsc --declaration --emitDeclarationOnly --outDir ${compilePath}`,
      {},
      (err, stdout, stderr) => {
        if (stderr) {
          console.error(
            '[vite-plugin-globEager-auto-declare] 编译文件失败, error:',
            JSON.stringify(stderr)
          );
          reject(stderr)
        }
        resolve(stdout)
      }
    )
  })
}

// 方法 - 自定义打印
export const vconsole: VConsole = {
  keepLog: false,

  log: function () {
    if (!this.keepLog) return
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params,prefer-spread
    console.log.apply(console, arguments)
  },

  dir: function () {
    if (!this.keepLog) return
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params,prefer-spread
    console.dir.apply(console, arguments)
  },

  setKeepLog: function (keepLog) {
    this.keepLog = keepLog
  }
}
