import { Snackbar } from '@varlet/ui'
import { useAuthStore } from '@/service/store/modules/auth'
import type { AxiosResponse, AxiosError } from 'axios'

// 接口码白名单 - fawkes部分接口返回无接口码，这部分地址不进行拦截判断
export const fawkesNoCodeUrlWhite = [
  '/sys-auth/oauth/token'
]

// 请求配置
export const REQUEST_CONFIG = {
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  withCredentials: true,
  timeout: 20 * 1000
}

// 请求状态码表
export const STATUS_CORRECT_CODE = 300
export const STATUS_ERROR_MESSAGE: Record<number, string> = {
  400: '错误请求',
  401: '用户无权限',
  403: '访问被禁止。',
  404: '页面未找到',
  405: '请求方法不被允许',
  406: '请求的格式不可得',
  410: '请求的资源不可用',
  500: '服务器发生错误',
  502: '网关错误',
  503: '服务不可用，服务器暂时无法响应请求',
  504: '网关超时'
}

// 接口响应码表
export const INTERFACE_CORRECT_CODE = [8000000, '0']
export const INTERFACE_ERROR_MESSAGE: Record<string, string> = {}

// 异常响应码表
export const EXCEPTION_ERROR_MESSAGE: Record<string, string> = {
  ECONNABORTED: '请求超时!',
  ERR_NETWORK: '请检查网络连接!'
}

// 状态错误提示
export const handleStatusCodeMessage = (response: AxiosResponse) => {
  const { status, statusText, config } = response
  const errorMsg = STATUS_ERROR_MESSAGE[status] || '服务器响应错误!'

  if (import.meta.env.DEV) {
    Snackbar({
      type: 'error',
      content: `status - ${status}\n url - ${config.url?.slice(config.url.lastIndexOf('/'))}\n msg - ${statusText}`
    })
  } else {
    Snackbar({
      type: 'error',
      content: errorMsg
    })
  }
}

// 状态错误处理
export const handleStatusCodeError = (response: AxiosResponse) => {
  switch (response.status) {
    // 无访问权限 - 401页面
    case 401:
    case 402:
    case 403:
      console.log('ssss')
      // uni.navigateTo({
      //   url: '/pages/exception/401/index'
      // })
      break
    case 404:
      // uni.navigateTo({
      //   url: '/pages/exception/404/index'
      // })
      break
    default:
      break
  }
}

// 接口错误提示
export const handleInterfaceCodeMessage = (response: AxiosResponse) => {
  const { config } = response
  const { code, message } = response.data
  const errorMsg = INTERFACE_ERROR_MESSAGE[code] || message || '发生未知错误!'

  if (import.meta.env.DEV) {
    Snackbar({
      type: 'error',
      content: `code - ${code}\n url - ${config.url?.slice(config.url.lastIndexOf('/'))}\n msg - ${errorMsg}`
    })
  } else {
    Snackbar({
      type: 'error',
      content: errorMsg
    })
  }
}

// 接口错误处理
export const handleInterfaceCodeError = (response: AxiosResponse) => {
  const { code } = response.data

  switch (code) {
    default:
      break
  }
}

// 异常错误提示
export const handleExceptionCodeMessage = (error: AxiosError) => {
  const { code, config, message } = error
  const errorMsg = EXCEPTION_ERROR_MESSAGE[code!] || '发生未知错误'

  // 错误提示
  if (import.meta.env.DEV) {
    Snackbar({
      type: 'error',
      content: `code - ${code}\n url - ${config!.url?.slice(config!.url.lastIndexOf('/'))}\n msg - ${message}`
    })
  } else {
    Snackbar({
      type: 'error',
      content: errorMsg
    })
  }
}

// 异常错误处理
export const handleExceptionCodeError = (error: AxiosError) => {
  const { code, response } = error

  // 处理401无权限问题，账号已登出
  if (response?.status === 401 && (response?.data as any)?.code === -8000230) {
    const authStore = useAuthStore()
    authStore.logout()
  }

  switch (code) {
    default:
      break
  }
}
