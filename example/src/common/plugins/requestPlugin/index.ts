/* ajax网络请求插件 */
import type { App } from 'vue'
import requestInstance from './request';

// 实例
export const request = requestInstance

// 注册插件 - 将request实例挂载到全局属性
const install = (app: App): void => {
  app.config.globalProperties.$request = requestInstance
}

export default install