/* 自定义全局属性注册脚本
*    规则: a. 自动检测当前目录下的脚本文件
*         b. 脚本文件通过export导出多个函数时，脚本会自动注册一个以 $properties.[fileName]
*            的全局属性提供外部调用eg：$properties.helper.xxx
*         c. 脚本文件通过export default导出一个函数时，脚本会自动注册一个以 $properties.[fileName]
*            的全局属性提供外部调用eg：$properties.xxx
*
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

    properties[registerName] = config.default || config
  }

  // 注册全局属性
  app.config.globalProperties['$properties'] = properties
}

export default install
