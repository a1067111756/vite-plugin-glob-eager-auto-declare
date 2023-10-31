/* store: 全局存储入口文件 */
import type { App } from 'vue'
import { createPinia } from 'pinia'
import registerPlugin from './plugin/registerPlugin'

// store实例
export const store = createPinia();

const install = (app: App) => {
  // 注册store
  app.use(store)

  // 自动注册modules到全局属性$store
  app.use(registerPlugin)
}

export default install
