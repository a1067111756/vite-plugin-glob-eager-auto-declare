/* store: 全局存储入口文件 */
import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState }from 'pinia-plugin-persistedstate'
import registerPlugin from './plugin/registerPlugin'

// store实例
export const store = createPinia();

// 设置pinia持久化
store.use(createPersistedState())

const install = (app: App) => {
  // 注册store
  app.use(store)

  // 自动注册modules到全局属性$store
  app.use(registerPlugin)
}

export default install
