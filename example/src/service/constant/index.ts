/* 自定义全局常量、枚举、字典注册脚本
*    规则: a. 自动检测当前目录下的脚本文件
*         b. 脚本文件必须export导出(因为一个模块可能会有多个导出方法)
*         c. 脚本会自动注册一个以 $constant.[fileName] 的全局属性提供外部调用
*              eg：$constant.const.xxx、$constant.enum.xxx、$constant.dict.xxx
* */
import type { App } from 'vue'

const getFileNameFromPath = (filePath: string) => {
  const splitName = filePath.split('/')
  return splitName[splitName.length - 1].slice(0, -3)
}

const install = (app: App): void => {
  // 查找文件
  const modules = import.meta.glob('./*.ts', { eager: true })

  // 遍历脚本文件
  const properties = {} as any
  for (const fileName in modules) {
    const config = modules[fileName] as Record<string, any>
    const registerName = getFileNameFromPath(fileName)
    config && (properties[registerName] = config)
  }

  // 注册全局属性
  app.config.globalProperties['$constant'] = properties
}

export default install
