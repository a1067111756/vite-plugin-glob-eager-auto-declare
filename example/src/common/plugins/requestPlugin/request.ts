import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import '@varlet/ui/es/snackbar/style/index'
import { getSign } from './sign'
import { Snackbar } from '@varlet/ui'
import { STORAGE_KEY_AUTH_TOKEN } from '@/service/constant/const'
import {
  REQUEST_CONFIG,
  STATUS_CORRECT_CODE,
  INTERFACE_CORRECT_CODE,
  handleStatusCodeMessage,
  handleStatusCodeError,
  handleInterfaceCodeMessage,
  handleInterfaceCodeError,
  handleExceptionCodeMessage,
  handleExceptionCodeError,
  fawkesNoCodeUrlWhite
} from './config'

// 创建axios实例
const service: AxiosInstance = axios.create(REQUEST_CONFIG)

// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    // fawkes部分接口携带校验参数
    if (fawkesNoCodeUrlWhite.includes(config.url as string)) {
      config.params = getSign(config.params)
    }

    // 携带token
    const token = localTango.getItemString(STORAGE_KEY_AUTH_TOKEN)
    if (token) {
      config.headers!['Fawkes-Auth'] = token
    }

    return config
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)

// response拦截器
service.interceptors.response.use(
  (response) => {
    // 响应状态报错统一处理
    if (response.status >= STATUS_CORRECT_CODE) {
      handleStatusCodeMessage(response)
      handleStatusCodeError(response)

      return Promise.reject(response.statusText)
    }

    // 接口错误码统一处理
    if (fawkesNoCodeUrlWhite.includes(response.config.url as string)) {
      return response.data
    } else {
      const { code, data, message } = response.data
      if (!INTERFACE_CORRECT_CODE.includes(code)) {
        handleInterfaceCodeMessage(response)
        handleInterfaceCodeError(response)
        return Promise.reject(message)
      }

      return data
    }
  },
  // 异常报错统一处理
  (error) => {
    // 跳过该接口错误校验
    if (error.config.url?.includes('/sys-auth/oauth/token')) {
      Snackbar({
        type: 'error',
        content: error.response.data
      })

      return Promise.reject(error)
    }

    handleExceptionCodeMessage(error)
    handleExceptionCodeError(error)
    return Promise.reject(error)
  }
)

export default service
