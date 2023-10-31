/* 事件总线插件 */
import type { App } from 'vue'
import mitt from 'mitt'

// 实例
export const mittBus = mitt<Record<string, any>>()

// 注册插件 - 将mittBus实例挂载到全局属性
const install = (app: App): void => {
  app.config.globalProperties.$mittBus = mittBus
}

export default install
