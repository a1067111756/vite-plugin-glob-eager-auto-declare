/* 工具类方法 */
import fs from 'fs'
import path from 'path'
import originTsConfig from '../tsconfigOrigin.json'
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

// 工具方法 - 遍历编译文件夹，获取嵌套文件夹中所有文件夹地址
export const getCompileDirAllDirPaths = (compileDirPath: string) => {
  const dirPaths: Array<string> = []

  const traverseDir = (dirPath: string) => {
    fs
      .readdirSync(dirPath)
      .forEach((file) => {
        let fullPath = path.join(dirPath, file)
        if (fs.lstatSync(fullPath).isDirectory()) {
          dirPaths.push(path.relative(compileDirPath, fullPath))
          traverseDir(fullPath)
        }
    })
  }

  traverseDir(compileDirPath)

  return dirPaths
}

// 方法 - 解析插件可选项参数
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

// 方法 - 更新tsconfig文件
const updateTsConfig = (updateRecord: Record<string, any>) => {
  try {
    const { outDir, include } = updateRecord

    // 修改配置文件
    originTsConfig.compilerOptions.outDir = outDir
    originTsConfig.include = include

    fs.writeFileSync(path.join(__dirname, './tsconfig.json'), JSON.stringify(originTsConfig, null, 2))
    // fs.writeFileSync(path.join(__dirname, '../tsconfig.json'), JSON.stringify(originTsConfig, null, 2)) 本地开发环境
  } catch (e: any) {
    console.error('[vite-plugin-globEager-auto-declare] 使用tsc编译失败, error: 读取tsconfig配置文件失败')
    throw new Error(e)
  }
}

// 方法 - 使用tsc命令对项目进行编译进而得到声明文件
export const execTscCommand = (gScriptOptions: PluginScriptPathsConfig, COMPILE_DIR: string) => {
  // 编译文件路径
  const includeFiles = gScriptOptions
    .map(item => item.path)
    .map(item => {
      return [
        `${item.replace(/\\/g, '/')}/**/*.ts`,
        `${item.replace(/\\/g, '/')}/**/*.d.ts`
      ]
    })
    .flat()

  // 更新tsconfig文件
  updateTsConfig({
    outDir: COMPILE_DIR.replace(/\\/g, '/'),
    include: includeFiles
  })

  return new Promise((resolve, reject) => {
    exec(
      `tsc -p ${path.join(__dirname, './tsconfig.json')}`,
      // `tsc -p ${path.join(__dirname, '../tsconfig.json')}`, // 本地开发环境
      {},
      (err, stdout, stderr) => {
        if (stderr) {
          console.log(stderr)
          return reject(stderr)
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
