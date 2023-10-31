/* 自定义全局store注册脚本
 *    a. 自动检测当前目录下的注册脚本文件
 *    b. 注册脚本文件，约定必须符合pinia写法， 约定必须export导出注册方法
 * */
import type { App } from 'vue'

const install = (app: App): void => {
  // 查找文件
  const modules = import.meta.glob('../modules/*.ts', { eager: true })

  // 注册脚本
  const appStore: Record<string, any> = {}

  for (const fileName in modules) {
    const config = modules[fileName] as Record<string, any>

    Object.keys(config).forEach((key) => {
      const module = config[key]()
      const moduleName = module.$id

      if (!moduleName) {
        console.warn(`${key}注册失败，模块未包含id，请检查!`)
        return
      }

      if (appStore[moduleName]) {
        console.warn(`${moduleName}注册重复，已忽略，请检查!`)
        return
      }

      appStore[moduleName] = module
    })
  }

  // 挂载属性到全局
  app.config.globalProperties.$store = appStore as any
}

export default install
