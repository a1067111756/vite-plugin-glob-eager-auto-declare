/* api接口集中管理自动注册
 *    规则: a. 自动检测当前目录下的脚本文件
 *         b. 脚本文件必须export导出(因为一个模块可能会有多个导出接口)
 *         c. 脚本会自动注册一个以 $api.[fileName] 的全局属性提供外部调用
 *              eg：$api.auth.xxx
*/
import type {App} from 'vue'

const install = (app: App) => {
  // api集合
  const apiList: Record<string, any> = {}

  // 查找文件
  const modules = import.meta.glob('./modules/**/*.ts', { eager: true })

  // api接口分模块注入
  for (const fileName in modules) {
    const splitFileName = fileName.split('/')
    const apiKey: string = splitFileName[splitFileName.length - 1].slice(0, -3)
    apiList[apiKey] = modules[fileName]
  }

  // 将api集合挂载到$api属性
  app.config.globalProperties.$api = apiList as any
}

export default install
